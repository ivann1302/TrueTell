# Публикация TrueTell на SprintHost

После однократной настройки хостинга и GitHub push в `main` публикует **сайт и PHP CRM одним релизом**. Другие ветки и pull requests только проверяются. Ручной запуск: Actions → CI and SprintHost deploy → Run workflow (main). Node работает только при сборке, на хостинге нужен PHP; Passenger и VPS не нужны.

## Что делает workflow

1. ESLint, production-сборка Astro, Node-тесты и проверка IndexNow/SEO.
2. PHP-тесты на SQLite и отдельном MySQL 8, PHPStan level 9, Pint.
3. Установка production Composer-зависимостей и упаковка `dist`, PHP-кода и `vendor`. В архиве нет `.env`, тестовой базы, логов, runtime-кэша и dev-зависимостей.
4. Передача по SSH с проверкой ключа сервера. На сервере: блокировка параллельной выкладки, проверка SHA-256 и архива, проверка production-настроек и MySQL, зашифрованная копия базы, миграции, кэши.
5. Переключение ссылки `current` на готовый релиз. Проверка публичного `release.json` и `/api/lead-session`. При ошибке проверки возвращается предыдущий код. **Миграции назад автоматически не откатываются**: изменения схемы должны быть совместимы с предыдущей версией.
6. После успешной выкладки — проверка опубликованного sitemap/ключа и уведомление IndexNow. Ошибка IndexNow не отменяет публикацию.

## Структура хостинга

```text
/home/a1256071/domains/truetell-retail.ru/
  public_html -> .deploy/current/public_html
  .deploy/
    current -> releases/<commit>-<run>-<attempt>
    releases/
      <release>/public_html/      # статика и crm/index.php
      <release>/backend/          # PHP-код и vendor, вне веб-корня
    shared/.env                  # постоянный APP_KEY и доступ к MySQL
    shared/storage/              # приватные логи и runtime-файлы
    shared/backups/               # зашифрованные копии и backup.key
    incoming/                    # архивы
```

На сервере нужны PHP 8.3+ (используем `/usr/local/bin/php84`), PDO MySQL, mbstring, OpenSSL, Sodium и остальные расширения Laravel; MySQL 8+, bash, flock, tar, curl, gzip и mysqldump. Версию **веб-PHP** проверить в панели отдельно от CLI. [Документация SprintHost о PHP](https://help.sprinthost.ru/faq/php), [символические ссылки для Laravel](https://help.sprinthost.ru/framework/laravel).

## Однократная настройка

Сначала заполнить приватный `.deploy/shared/.env` по `backend/.env.example`, дать ему права 600. Параметры БД: `DB_HOST=localhost`, `DB_DATABASE=a1256071_truetell`, `DB_USERNAME=a1256071_truetell`. Пароль вводится отдельно; не включать его в Git, workflow или команды с открытыми аргументами. `APP_KEY` создать **один раз** и сохранить отдельно; последующие релизы его не меняют. Telegram пока выключен.

Проверить текущий каталог сайта и отсутствие посторонних серверных файлов, которые нужны в новом релизе. Новый релиз содержит только файлы из репозитория; произвольные файлы старого сайта не копируются в него. Затем:

```sh
bash scripts/deploy/prepare-host.sh \
  /home/a1256071/domains/truetell-retail.ru/.deploy \
  /home/a1256071/domains/truetell-retail.ru/public_html
```

Команда сохраняет исходный сайт как legacy-релиз и оставляет исходный каталог `public_html.before-crm-*`. Повторный запуск безопасен. Доступ к публичным файлам должен сохраняться для nginx; backend и shared остаются закрытыми.

Создать отдельный SSH-ключ для GitHub Actions, добавить публичную часть в `~/.ssh/authorized_keys` аккаунта. Рекомендуемые ограничения строки ключа: `no-agent-forwarding,no-port-forwarding,no-X11-forwarding,no-pty`. Приватную часть хранить только в Secrets, не в репозитории. Ключ сервера брать из проверенного `known_hosts` и сверять при смене.

В GitHub repository или environment `production` настроить:

| Variables | Значение |
| --- | --- |
| `SSH_HOST` | `141.8.192.31` |
| `SSH_USER` | `a1256071` |
| `DEPLOY_ROOT` | `/home/a1256071/domains/truetell-retail.ru/.deploy` |
| `PUBLIC_ROOT` | `/home/a1256071/domains/truetell-retail.ru/public_html` |
| `PHP_BIN` | `/usr/local/bin/php84` |

| Secrets | Содержимое |
| --- | --- |
| `SSH_PRIVATE_KEY` | Приватный ключ отдельного deploy-пользования |
| `SSH_KNOWN_HOSTS` | Проверенные строки host key для `141.8.192.31` |

Старые `FTP_*` больше не используются. Если в environment включены обязательные reviewers, GitHub будет ожидать их подтверждения. Production-пароль MySQL хранится только на хостинге, не требуется в Actions.

После первого успешного релиза создать администратора интерактивно:

```sh
cd /home/a1256071/domains/truetell-retail.ru/.deploy/current/backend
/usr/local/bin/php84 artisan crm:admin YOUR_EMAIL 'Иван'
```

Пароль вводится скрыто; при первом входе в `/workspace` подключается обязательный TOTP. Настройка сотрудников и Telegram — в [crm-deployment.md](./crm-deployment.md).

## Cron и резервные копии

Добавить к существующему crontab (не заменять чужие задания):

```cron
* * * * * /usr/bin/flock -n /home/a1256071/domains/truetell-retail.ru/.deploy/deploy.lock /usr/local/bin/php84 /home/a1256071/domains/truetell-retail.ru/.deploy/current/backend/artisan schedule:run >> /home/a1256071/domains/truetell-retail.ru/.deploy/shared/storage/logs/cron.log 2>&1
17 3 * * * /usr/bin/flock -n /home/a1256071/domains/truetell-retail.ru/.deploy/deploy.lock /usr/local/bin/php84 /home/a1256071/domains/truetell-retail.ru/.deploy/current/backend/artisan crm:backup /home/a1256071/domains/truetell-retail.ru/.deploy/shared/backups >> /home/a1256071/domains/truetell-retail.ru/.deploy/shared/storage/logs/backup.log 2>&1
```

Копии шифруются потоково через PHP Sodium (XChaCha20-Poly1305); проверяется целостность и завершение архива. Консольный OpenSSL не требуется. Права каталогов 700, файлов 600. Сохранять копию `backup.key` и APP_KEY отдельно от сервера; ключ рядом с архивами защищает не от захвата всего аккаунта. Расшифрование в приватный каталог:

```sh
umask 077
php artisan crm:decrypt-backup /PRIVATE/backup.sql.gz.enc /PRIVATE/restore.sql.gz /PRIVATE/backup.key
gzip -d /PRIVATE/restore.sql.gz
```

Проверить восстановление в отдельную базу. Автоматического удаления бэкапов, архивов и старых релизов нет: контролировать объём, срок хранения и удалять только после проверки новой версии. Не удалять `current`, shared, последний рабочий релиз и ключи. `cron.log`/`backup.log` требуют ротации.

## Локальная проверка и ограничения

```sh
npm run lint
npm run build
node --test scripts/*.test.mjs
node scripts/indexnow.mjs --check
cd backend
php artisan test
vendor/bin/phpstan analyse --memory-limit=512M
vendor/bin/pint --test
```

Тесты выкладки проверяют ошибки бэкапа/миграции, checksum, защиту архивов и откат кода. Реальное окружение SprintHost, права веб-процесса, MySQL и работа GitHub Actions проверяются отдельно при первом запуске. Пока однократная настройка не завершена, успешный локальный тест не означает работающий автодеплой.

IndexNow использует публичный ключ из `scripts/deployment.json`. Google Search Console требует однократно добавить `https://truetell-retail.ru/sitemap.xml`; IndexNow не гарантирует индексацию.

## Состояние настройки на 28 сентября 2026

GitHub Secrets/Variables установлены и проверены; environment production не требует ручного review. Приватный `.env` сохранён на хостинге, отдельный deploy-ключ проверен. Старый сайт и исходный public_html сохранены для восстановления.

Релиз `2cfda050deb118a6b7002ee0297d981147089f21-1790605972-2` опубликован. MySQL, миграции, администратор, зашифрованные копии и два задания cron настроены. Веб-PHP фактически 8.5, cron/CLI используют 8.4. На Apache хостинга CRM rewrite должен использовать `[L]`: `[END]` приводил к HTTP 403; исправление входит в public/.htaccess.

Проверено на живом сайте: API сессии, приём синтетической заявки, повтор с тем же ключом без дубля, шифрование контакта в MySQL, отсутствие отправки Telegram, принятие пароля администратора с переходом к обязательному TOTP. Тестовая заявка удалена. Кабинет без входа перенаправляет на авторизацию; приватные пути возвращают 403. Расшифрование резервной копии и gzip-проверка пройдены; восстановление в отдельную MySQL-базу ещё не проверялось.

Локально пройдены 39 Node-тестов, 36 PHP-тестов (176 assertions), PHPStan9, Pint, сборка и IndexNow-проверка; ESLint имеет 3 прежних предупреждения. Первое размещение выполнено по SSH из локального снимка. Реальный MySQL-прогон GitHub CI ещё не выполнялся. Изменения workflow пока локальные: для дальнейших автоматических релизов их нужно отправить в main вместе с backend и scripts/deploy. Telegram остаётся выключенным.
