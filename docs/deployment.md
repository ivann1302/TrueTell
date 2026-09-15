# Публикация TrueTell на SprintHost

Workflow `.github/workflows/deploy.yml` заменяет GitHub Pages. Каждый push и pull request запускает ESLint, тесты IndexNow, production-сборку Astro и проверку sitemap, canonical, robots и файла ключа. Только `main` публикуется на SprintHost. Ручной запуск доступен через Actions → CI and SprintHost deploy → Run workflow (main).

## Однократная настройка

В https://github.com/ivann1302/TrueTell/settings/secrets/actions добавьте repository secrets:

| Secret | Значение |
| --- | --- |
| `FTP_HOST` | FTP-сервер из панели SprintHost, без `ftp://` |
| `FTP_USER` | Логин FTP для TrueTell |
| `FTP_PASSWORD` | Пароль FTP |
| `FTP_REMOTE_PATH` | Каталог именно truetell-retail.ru относительно FTP-корня, с `/` в конце, например `domains/truetell-retail.ru/public_html/` |

Путь-пример нужно проверить в FTP-клиенте: FTP-корень может отличаться от SSH-корня. Не копируйте каталог sk-rosa.ru. Используется обычный FTP на стандартном порту 21, как в рабочем workflow `sk-rosa`: SprintHost отклоняет explicit FTPS ошибкой `500 This security scheme is not implemented`. FTP не шифрует логин, пароль и файлы при передаче; доступ ограничен отдельными GitHub Secrets и каталогом сайта из `FTP_REMOTE_PATH`.

Убедитесь, что truetell-retail.ru направлен на нужный сайт SprintHost и HTTPS работает. Сделайте резервную копию текущего сайта перед первым запуском. Загрузка инкрементальная, не атомарная: при обрыве передачи сайт может временно содержать файлы разных сборок. Повторный запуск deploy завершит синхронизацию. FTP Action отслеживает собственные файлы; старые файлы прежнего сайта при первом деплое автоматически не очищаются. Серверные файлы `.htaccess`, проверки владения доменом и прочие неотслеживаемые файлы сохраняются. Устаревший `index.php` или правила прежнего сайта могут требовать отдельной миграции.

GitHub environment `production` используется для деплоя. Если настроены обязательные reviewers, GitHub будет ждать их подтверждения. Для автоматической публикации эти правила не должны требовать ручного подтверждения.

## Поисковики

После загрузки отдельная job проверяет опубликованный ключ и соответствие sitemap сборке. Затем отправляет все URL sitemap пакетами до 10 000 в `https://api.indexnow.org/indexnow`. Участники протокола автоматически обмениваются URL: https://www.indexnow.org/documentation. Повторная отправка в каждый поисковик не нужна. Новые страницы необходимо добавлять в sitemap.

Ключ находится в `scripts/deployment.json` и соответствующем `public/<key>.txt`. Это публичный ключ подтверждения сайта, хранить его в Secrets не требуется. Статус 200 означает успешный приём, 202 — ожидание проверки ключа; ни один не гарантирует индексацию. Ошибки 429/5xx и сетевые сбои повторяются ограниченное число раз. Ошибка уведомления делает job красной, но сайт уже опубликован; можно повторить только упавшую job.

Google sitemap ping отменён: https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping. Для Google добавьте `https://truetell-retail.ru/sitemap.xml` в Search Console один раз; ссылка также есть в robots.txt. Универсального уведомления всех поисковиков не существует.

## Локальная проверка без публикации

```sh
npm ci
npm run lint
node --test scripts/indexnow.test.mjs
npm run build
node scripts/indexnow.mjs --check
```

`node scripts/indexnow.mjs` без `--check` обращается к опубликованному сайту и отправляет URL поисковикам. Используйте только после деплоя соответствующей сборки.
