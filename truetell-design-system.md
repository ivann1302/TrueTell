# TrueTell Design System (archive)

> This document is retained for historical reference only. The authoritative TrueTell design system is now [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md).

Версия: 4.1  
Назначение: рабочая дизайн-система для сайта и цифровых продуктов TrueTell  
Использование: Figma, Codex, Claude Code, Cursor, фронтенд-разработка

## 1. Роль этой дизайн-системы

TrueTell должен выглядеть как зрелая технологическая компания, которая разрабатывает софт, автоматизирует процессы, строит интеграции и связывает существующие системы бизнеса.

Визуальный образ:

- технологичный
- точный
- спокойный
- системный
- современный
- дорогой без демонстративной премиальности
- ориентированный на B2B и enterprise
- инженерный, а не рекламный

Ключевой принцип:

> Интерфейс должен внушать доверие к технологии, а не пытаться впечатлить количеством эффектов.

Не копировать типичный SaaS, AI startup или digital agency стиль.

## 2. Что должен сообщать визуальный язык

Через 5-10 секунд пользователь должен чувствовать:

1. TrueTell работает со сложными системами.
2. Здесь умеют проектировать и разрабатывать ПО.
3. Компания понимает API, данные, CRM, ERP, AI и автоматизацию.
4. Дизайн собранный и взрослый.
5. Визуальная сложность всегда имеет функциональный смысл.

Основные темы бренда:

- software engineering
- automation
- integrations
- AI as infrastructure
- data
- control
- reliability
- connected systems

## 3. Главные визуальные принципы

### 3.1 Структура важнее декора

Красота строится через:

- сетку
- пропорции
- расстояния
- типографику
- данные
- реальные интерфейсы
- схемы
- системные состояния
- качественный motion

Не строить стиль вокруг:

- декоративных иконок
- абстрактных фигур
- случайных линий
- ярких градиентов
- свечения
- больших теней
- одинаковых карточек

### 3.2 Минимум визуального шума

На одном экране должен быть один главный смысл.

Если элемент не помогает:

- понять продукт
- увидеть связь
- прочитать данные
- выполнить действие
- создать иерархию

его лучше убрать.

### 3.3 Инженерная эстетика

Использовать визуальные мотивы реальных цифровых систем:

- потоки данных
- статусы
- таблицы
- логи
- графики
- параметры
- API endpoints
- системные метки
- timestamps
- связи между сервисами
- реальные UI-фрагменты

Не использовать псевдотехнологический декор.

## 4. Цветовая система

Основная палитра холодная, нейтральная и тёмно-синяя.

Яркий голубой и cyan не являются частью базового визуального языка.

### 4.1 Core colors

```css
:root {
  --tt-navy-950: #121A36;
  --tt-navy-900: #172451;
  --tt-navy-800: #1F347A;
  --tt-navy-700: #2B438B;
  --tt-navy-600: #3C559A;

  --tt-ink: #11151C;
  --tt-graphite: #181D26;
  --tt-graphite-soft: #232A35;

  --tt-bg: #F2F3F5;
  --tt-surface: #F7F8FA;
  --tt-surface-high: #FBFBFC;
  --tt-surface-dark: #151A23;

  --tt-text: #141820;
  --tt-text-secondary: #626A77;
  --tt-text-muted: #8A919D;

  --tt-border: #D8DCE3;
  --tt-border-soft: rgba(20, 28, 42, 0.08);
  --tt-border-dark: rgba(255, 255, 255, 0.10);

  --tt-metal: #A98A5B;
  --tt-success: #2F7A5C;
  --tt-warning: #9A6A27;
  --tt-danger: #A24949;
}
```

`--tt-navy-800` является основным фирменным синим.

Если в исходном SVG-логотипе TrueTell используется другой точный оттенок, заменить `--tt-navy-800` на цвет, снятый непосредственно с логотипа. Остальную синюю шкалу перестроить вокруг него.

### 4.2 Пропорция цветов

Для светлого экрана:

- 65-75% серо-белые поверхности
- 15-20% графит и текст
- 5-10% TrueTell Navy
- до 3% функциональные акценты
- до 2% Warm Metal

Не использовать синий как фон каждого второго блока.

### 4.3 Фоны

Базовый фон сайта:

```css
background: var(--tt-bg);
```

Не использовать чистый `#FFFFFF` как основной фон всей страницы.

Белый допустим только локально для:

- внутренних поверхностей
- таблиц
- модальных окон
- форм
- контрастных UI-слоёв

### 4.4 Тёмные поверхности

Тёмные секции не должны быть чёрными.

Использовать:

```css
background: #151A23;
color: #F5F6F8;
```

Допускается одна сильная тёмная зона на длинной странице или несколько функциональных тёмных интерфейсных фрагментов.

### 4.5 Акценты

Основной акцент:

```css
color: var(--tt-navy-800);
```

Тёплый металлический акцент:

```css
color: var(--tt-metal);
```

Warm Metal использовать очень редко:

- одна ключевая метрика
- выбранная точка данных
- короткий статус
- микроакцент

Не использовать его как цвет больших CTA.

## 5. Градиенты

Градиенты не являются фирменным приёмом.

По умолчанию использовать плоские поверхности.

Допустим только слабый тональный переход внутри большой поверхности:

```css
background:
  linear-gradient(
    135deg,
    rgba(31, 52, 122, 0.08),
    rgba(31, 52, 122, 0.00) 55%
  );
```

Запрещены:

- blue-purple
- cyan-purple
- neon gradients
- aurora backgrounds
- rainbow data gradients
- glow gradient blobs

## 6. Типографика

Не использовать Inter, Geist или Manrope как фирменный основной шрифт.

Рекомендуемая связка:

- основной: Instrument Sans
- технический: IBM Plex Mono

```css
--font-sans: "Instrument Sans", "Helvetica Neue", Arial, sans-serif;
--font-mono: "IBM Plex Mono", "SFMono-Regular", Consolas, monospace;
```

Если Instrument Sans недоступен, допустима замена на качественный нейтральный grotesk с похожим характером.

### 6.1 Принцип

Крупная типографика должна быть:

- плотной
- спокойной
- короткой
- без рекламной гиперболы
- без чрезмерно жирного начертания

Не использовать Black / 800 / 900 для крупных заголовков.

Оптимально:

- headings: 500-600
- body: 400
- UI: 500
- mono labels: 400-500

### 6.2 Шкала

```css
--text-display: clamp(3.2rem, 6.2vw, 6.8rem);
--text-h1: clamp(2.8rem, 5vw, 5.6rem);
--text-h2: clamp(2.1rem, 3.5vw, 4rem);
--text-h3: clamp(1.55rem, 2.2vw, 2.3rem);
--text-lead: clamp(1.15rem, 1.5vw, 1.4rem);
--text-body: 1rem;
--text-small: 0.875rem;
--text-micro: 0.75rem;
```

### 6.3 Заголовки

```css
.heading {
  font-family: var(--font-sans);
  font-weight: 560;
  letter-spacing: -0.035em;
  line-height: 0.96;
}
```

Заголовок не обязан быть огромным.

Если композиция работает на 48 px, не увеличивать его до 80 px только ради эффекта.

Не использовать типовые рекламные конструкции:

- "Будущее вашего бизнеса уже здесь"
- "Автоматизация нового поколения"
- "Раскройте потенциал AI"
- "Инновации, которые меняют всё"
- "Мы превращаем идеи в реальность"

### 6.4 Техническая типографика

IBM Plex Mono использовать для:

- API
- timestamps
- ID
- статусов
- небольших системных подписей
- code-like fragments
- коротких технических параметров

Не использовать mono для длинных абзацев.

## 7. Композиция

TrueTell не должен выглядеть как набор готовых SaaS-компонентов.

### 7.1 Сетка

Desktop:

```css
--page-max: 1440px;
--content-max: 1280px;
--page-padding: clamp(24px, 4vw, 64px);
--grid-columns: 12;
```

Рабочая зона:

```css
.site-container {
  width: min(100% - (var(--page-padding) * 2), var(--content-max));
  margin-inline: auto;
}
```

### 7.2 Ритм

Базовая единица:

```css
--space-unit: 4px;
```

Использовать значения:

```text
4
8
12
16
24
32
40
48
64
80
96
120
160
```

Не создавать случайные значения вроде 37 px или 73 px без конкретной причины.

### 7.3 Секции

Большие секции:

```css
padding-block: clamp(88px, 10vw, 160px);
```

Не отделять каждую секцию:

- линией
- серой плашкой
- точками
- декоративным номером
- большим пустым label сверху

Разделение строится через расстояние, фон и композицию.

## 8. Не использовать кикеры

По умолчанию запрещены маленькие uppercase labels над каждым заголовком:

```text
SOLUTIONS
AUTOMATION
OUR SERVICES
WHY TRUETELL
```

Это типичный SaaS-паттерн.

Короткая служебная метка допустима только если она действительно несёт данные, например:

```text
API STATUS
LIVE
12:42:08
BITRIX24
```

То есть метка должна быть частью системы, а не декоративным "кикером".

## 9. Поверхности и контейнеры

### 9.1 Не делать карточку из всего

Не каждый смысловой блок должен иметь:

- фон
- рамку
- border-radius
- icon
- title
- description

Предпочитать открытую композицию.

Карточка используется только если элемент действительно является самостоятельной сущностью.

Примеры:

- интеграция
- отдельный продукт
- тариф
- процесс
- кейс
- объект данных

### 9.2 Радиусы

```css
--radius-xs: 6px;
--radius-sm: 10px;
--radius-md: 14px;
--radius-lg: 18px;
--radius-xl: 24px;
```

Не использовать 32-48 px везде.

Pill radius допустим только для:

- chip
- status
- compact filter
- avatar

### 9.3 Тени

По умолчанию:

```css
box-shadow: none;
```

Если глубина нужна функционально:

```css
box-shadow: 0 14px 40px rgba(16, 22, 32, 0.06);
```

Не использовать:

- большие мягкие SaaS-тени под каждой карточкой
- цветные тени
- glow
- multiple shadows без необходимости

## 10. Liquid Glass

Liquid glass является дополнительным слоем, а не стилем всего сайта.

Целевая доля: примерно 5-10% интерфейса.

### 10.1 Где допустимо

- sticky navigation
- floating toolbar
- filters over data
- status overlay
- context menu
- compact control panel
- element over image/interface
- mobile bottom control

### 10.2 Где не использовать

- все карточки услуг
- каждый блок страницы
- прайс
- обычный текстовый контейнер
- footer
- длинные статьи
- фон целой секции

### 10.3 Светлое стекло

```css
.glass {
  background: rgba(247, 248, 250, 0.72);
  border: 1px solid rgba(18, 28, 48, 0.10);
  backdrop-filter: blur(18px) saturate(112%);
  -webkit-backdrop-filter: blur(18px) saturate(112%);
}
```

### 10.4 Тёмное стекло

```css
.glass-dark {
  background: rgba(19, 24, 34, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(18px) saturate(108%);
  -webkit-backdrop-filter: blur(18px) saturate(108%);
}
```

### 10.5 Правило стекла

Glass должен ощущаться как физический слой над реальным содержимым.

Если под элементом нет визуального контента, над которым он находится, стекло чаще всего не нужно.

Не использовать яркий голубой tint.

## 11. Кнопки

### 11.1 Primary

```css
.button-primary {
  min-height: 48px;
  padding: 0 20px;
  border-radius: 10px;
  background: var(--tt-navy-800);
  color: #FFFFFF;
  border: 1px solid var(--tt-navy-800);
  font-weight: 550;
}
```

Hover:

```css
.button-primary:hover {
  background: var(--tt-navy-900);
  border-color: var(--tt-navy-900);
}
```

### 11.2 Secondary

```css
.button-secondary {
  min-height: 48px;
  padding: 0 20px;
  border-radius: 10px;
  background: transparent;
  color: var(--tt-text);
  border: 1px solid var(--tt-border);
}
```

### 11.3 Запреты

Не использовать:

- gradient button
- glow button
- giant pill button
- icon in colored circle inside button
- несколько конкурирующих primary CTA на одном экране

## 12. Иконография

Иконки не являются главным визуальным инструментом бренда.

Приоритет:

1. реальные интерфейсные состояния
2. данные
3. схемы
4. типографика
5. системные маркеры
6. иконки

### 12.1 Если иконка нужна

Использовать:

- монохром
- простой stroke
- 16-20 px
- без цветной подложки
- без декоративного круга

Предпочитать собственные простые SVG для ключевых действий.

Не использовать массово наборы типичных иконок для:

- automation
- AI
- security
- analytics
- integration
- speed

Если смысл можно выразить текстом или реальным UI-фрагментом, иконка не нужна.

## 13. Интеграции

Интеграции являются важной частью визуального языка TrueTell.

Примеры сервисов:

- Bitrix24
- amoCRM
- МойСклад
- retailCRM
- 1С
- OpenAI
- Telegram
- Google
- Яндекс
- marketplace APIs
- internal services

### 13.1 Как показывать

Не делать стандартную сетку из 12 одинаковых rounded карточек с логотипами.

Лучше:

- маршрут данных
- connection map
- scrolling system rail
- orbit без 3D
- network graph
- последовательность событий
- одна большая схема с настоящими логотипами
- таблица интеграций
- live status board

### 13.2 Схема связи

Пример визуальной логики:

```text
BITRIX24           МОЙСКЛАД
    \                 /
     \               /
       TRUETELL CORE
       /      |      \
      /       |       \
   AI      ANALYTICS   TELEGRAM
```

В production вместо ASCII использовать аккуратную 2D-схему.

Линии должны иметь смысл:

- направление
- состояние
- событие
- тип соединения

Не добавлять соединительные линии только ради декора.

## 14. Схемы и архитектурная графика

Архитектурные схемы являются фирменным носителем.

Стиль:

- 2D
- плоский
- минимум цветов
- тонкие связи
- компактная типографика
- реальные названия систем
- много воздуха
- системные состояния

Пример компонентов:

```text
[ CRM ]
   |
   | webhook
   v
[ TrueTell API ] -> [ AI Worker ]
   |
   | sync
   v
[ ERP / Stock ]
```

### 14.1 Линии

```css
stroke: rgba(20, 28, 44, 0.24);
stroke-width: 1;
```

Активная связь:

```css
stroke: var(--tt-navy-800);
stroke-width: 1.5;
```

Не использовать светящиеся провода.

## 15. Data visualization

Графики должны выглядеть как рабочий инструмент.

Основные цвета:

```css
--chart-primary: #1F347A;
--chart-secondary: #697386;
--chart-neutral: #B8BEC8;
--chart-highlight: #A98A5B;
--chart-positive: #2F7A5C;
--chart-negative: #A24949;
```

Не использовать 6-10 ярких цветов одновременно.

### 15.1 Правила

- подписи важнее декоративности
- axis grid очень слабая
- минимум legend, если series можно подписать напрямую
- цифры должны хорошо читаться
- не добавлять gradient fill без необходимости
- tooltips могут использовать glass
- selected point может использовать Warm Metal

## 16. Реальные интерфейсы

Показывать реальные или правдоподобные интерфейсы:

- CRM workflow
- integration monitor
- webhook events
- dashboard
- internal admin
- AI workflow
- document processing
- logs
- user roles
- automation builder
- inventory sync

Не показывать абстрактный dashboard только ради красивого hero.

Интерфейс должен объяснять конкретную функцию.

## 17. Motion

Motion должен показывать работу системы.

### 17.1 Допустимо

- данные проходят между узлами
- обновляется status
- плавно меняется selected integration
- появляется новая строка события
- график обновляет значение
- панель реагирует на scroll
- connection line активируется
- логотипы сервисов медленно перемещаются по 2D-маршруту

### 17.2 Не использовать

- bounce
- excessive parallax
- mouse-follow blobs
- floating random icons
- endless text marquee без причины
- aggressive scroll hijacking
- constant glow pulse
- декоративный particle field

### 17.3 Тайминги

```css
--motion-fast: 160ms;
--motion-ui: 240ms;
--motion-medium: 420ms;
--motion-slow: 700ms;
```

Основной easing:

```css
cubic-bezier(0.22, 1, 0.36, 1)
```

Для `prefers-reduced-motion` все необязательные анимации отключать.

## 18. Навигация

Навигация должна быть компактной.

Допустим sticky navbar с liquid glass.

Пример:

```css
.site-nav {
  position: sticky;
  top: 12px;
  z-index: 100;
  background: rgba(247, 248, 250, 0.76);
  border: 1px solid rgba(20, 28, 42, 0.09);
  backdrop-filter: blur(18px);
  border-radius: 14px;
}
```

Не превращать navbar в большую floating pill.

## 19. Формы

Формы выглядят как часть продукта, а не как маркетинговый виджет.

```css
.input {
  min-height: 48px;
  padding-inline: 14px;
  border: 1px solid var(--tt-border);
  border-radius: 10px;
  background: rgba(255,255,255,0.55);
  color: var(--tt-text);
}
```

Focus:

```css
.input:focus {
  border-color: var(--tt-navy-700);
  outline: 3px solid rgba(31, 52, 122, 0.10);
}
```

Не использовать glow.

## 20. Изображения

Визуальный приоритет:

1. интерфейсы
2. схемы
3. данные
4. реальные рабочие процессы
5. фотографии команды или продукта

Не использовать:

- AI robots
- humanoid robots
- glowing brains
- holographic interfaces
- generic businessmen
- handshake
- server room stock photos
- hacker code
- floating cubes
- 3D spheres

## 21. Компоненты

Компонентная библиотека должна быть небольшой.

Базовый набор:

- Button
- TextLink
- Input
- Select
- Modal
- Navigation
- Status
- Badge
- Tooltip
- Tabs
- DataTable
- DataMetric
- DiagramNode
- ConnectionLine
- IntegrationItem
- CodeSnippet
- GlassPanel

Не создавать отдельный card-компонент для каждого смысла.

## 22. Status system

Статусы подходят бренду лучше, чем декоративные иконки.

Примеры:

```text
CONNECTED
SYNCING
LIVE
WAITING
FAILED
READY
UPDATED 12:42
```

Оформление:

```css
.status {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
```

Цвет использовать только если он несёт смысл.

## 23. Текстовые правила

Текст короткий и конкретный.

Писать:

> Связываем CRM, склад и внутренние сервисы через API.

Не писать:

> Создаём инновационную цифровую экосистему, открывающую новые возможности для масштабирования бизнеса.

Писать:

> AI проверяет документы до того, как они попадут менеджеру.

Не писать:

> Интеллектуальная автоматизация нового поколения выводит бизнес-процессы на новый уровень.

Не злоупотреблять английскими словами, если русский термин понятнее.

## 24. Пунктуация и визуальный текст

Не использовать длинное тире как декоративный ритм.

Предпочитать:

- точку
- двоеточие
- короткие предложения
- перенос строки

Не ставить декоративные точки между словами:

```text
AI • SOFTWARE • AUTOMATION
```

если это не настоящая навигационная или системная конструкция.

Не использовать slash и pipe как украшение:

```text
AI / SOFTWARE / DATA
SOFTWARE | AUTOMATION | AI
```

Такие конструкции допустимы только в технических данных.

## 25. Hero и первый экран

Не использовать шаблон:

```text
маленький kicker
огромный H1
подзаголовок
две кнопки
3D справа
логотипы снизу
```

Первый экран должен проектироваться под конкретную идею.

Допустимые подходы:

- крупная типографика + реальная системная схема
- текст встроен в интерфейсный фрагмент
- экран начинается с product surface
- асимметричная композиция
- одна сильная фраза + интерактивная 2D-система
- data-driven composition

Нельзя создавать декоративный "hero object", не связанный с продуктом.

## 26. Мобильная версия

Mobile не является уменьшенной desktop-версией.

На мобильном:

- схемы упрощаются
- второстепенные связи скрываются
- таблицы получают горизонтальный scroll или mobile representation
- glass используется ещё реже
- hover логика заменяется tap/focus
- typography уменьшается без потери иерархии
- сложные motion-эффекты отключаются

Минимальный page padding:

```css
padding-inline: 20px;
```

## 27. Accessibility

Минимум:

- WCAG AA contrast
- visible focus
- keyboard navigation
- semantic HTML
- reduced motion
- alt text
- labels for inputs
- touch target минимум 44x44 px

Не снижать контраст ради эстетики.

## 28. CSS token preset

Использовать этот блок как начальную точку проекта:

```css
:root {
  --tt-navy-950: #121A36;
  --tt-navy-900: #172451;
  --tt-navy-800: #1F347A;
  --tt-navy-700: #2B438B;
  --tt-navy-600: #3C559A;

  --tt-ink: #11151C;
  --tt-graphite: #181D26;
  --tt-graphite-soft: #232A35;

  --tt-bg: #F2F3F5;
  --tt-surface: #F7F8FA;
  --tt-surface-high: #FBFBFC;
  --tt-surface-dark: #151A23;

  --tt-text: #141820;
  --tt-text-secondary: #626A77;
  --tt-text-muted: #8A919D;

  --tt-border: #D8DCE3;
  --tt-border-soft: rgba(20, 28, 42, 0.08);
  --tt-border-dark: rgba(255, 255, 255, 0.10);

  --tt-metal: #A98A5B;
  --tt-success: #2F7A5C;
  --tt-warning: #9A6A27;
  --tt-danger: #A24949;

  --font-sans: "Instrument Sans", "Helvetica Neue", Arial, sans-serif;
  --font-mono: "IBM Plex Mono", "SFMono-Regular", Consolas, monospace;

  --radius-xs: 6px;
  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 18px;
  --radius-xl: 24px;

  --motion-fast: 160ms;
  --motion-ui: 240ms;
  --motion-medium: 420ms;
  --motion-slow: 700ms;

  --content-max: 1280px;
  --page-padding: clamp(20px, 4vw, 64px);
}
```

## 29. Правила для coding agent

При генерации интерфейса TrueTell следовать этим правилам автоматически.

### Делать

- использовать дизайн-токены
- использовать semantic HTML
- строить композицию через grid и whitespace
- показывать реальные интерфейсные паттерны
- использовать 2D-схемы для интеграций
- применять dark navy только как сильный акцент
- держать фон серо-белым
- использовать liquid glass локально
- минимизировать количество иконок
- создавать сильную типографическую иерархию
- делать responsive layout отдельно для mobile
- сохранять доступность

### Не делать

- не использовать 3D
- не использовать glow
- не использовать cyan как основной акцент
- не использовать blue-purple gradient
- не использовать gradient text
- не использовать floating blobs
- не использовать particles
- не использовать excessive glassmorphism
- не использовать тень у каждой карточки
- не использовать одинаковые rounded cards для всего
- не использовать icon-in-circle паттерн
- не использовать kicker над каждым заголовком
- не использовать generic SaaS hero
- не использовать бессмысленные декоративные линии
- не использовать AI robots или glowing brain
- не использовать Inter, Geist, Manrope как фирменный font stack
- не делать все элементы с pill radius
- не использовать огромные marketing headings без композиционной причины

## 30. Промпт для Codex / Claude Code

Можно вставлять этот блок перед задачей на разработку страницы:

```text
Use the TrueTell design system from this file as a hard visual constraint.

The result must feel like a mature software engineering and automation company, not a generic SaaS or AI startup.

Prioritize:
1. precise typography
2. strong grid
3. cool gray surfaces
4. deep TrueTell navy
5. real interface fragments
6. data and architecture diagrams
7. restrained motion
8. minimal functional liquid glass

Avoid:
3D objects, cyan, neon, generic SaaS cards, icon circles, excessive rounded corners, large shadows, gradient text, AI glow, decorative particles, generic hero layouts, eyebrow labels and visual filler.

Do not invent decorative UI. Every visual element must communicate structure, data, integration, system status or user action.

Use the CSS tokens defined in this design system. Do not introduce additional brand colors without a functional reason.
```

## 31. Проверка готового экрана

Перед завершением любого экрана проверить:

- Он выглядит как software engineering company?
- Здесь меньше визуального шума, чем у типичного SaaS?
- Синий достаточно глубокий и не выглядит cyan?
- Фон серо-белый, а не стерильно белый?
- Иконки действительно нужны?
- Карточки используются только для реальных сущностей?
- Тени почти отсутствуют?
- Glass имеет функциональную причину?
- Схемы объясняют реальные связи?
- Есть реальный продуктовый контент?
- Заголовки конкретны?
- Нет AI-slop?
- Mobile версия продумана отдельно?
- Contrast и focus states доступны?

Если хотя бы несколько ответов отрицательные, экран нужно упростить.

## 32. Короткая формула TrueTell

**Не яркость, а точность.**  
**Не декор, а структура.**  
**Не футуризм, а работающая технология.**  
**Не AI-стиль, а доверие к инженерии.**
