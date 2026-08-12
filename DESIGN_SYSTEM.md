# DESIGN SYSTEM

> Этот файл — источник истины для визуального стиля проекта. Используй его при создании новых страниц, секций и компонентов. Если локальный макет или отдельный промпт не говорит обратного, правила ниже имеют приоритет.

---

## 1. Концепция

Стиль: **современный enterprise-tech / B2B**, спокойный, технологичный и внушающий доверие.

Главное ощущение интерфейса:

- зрелый цифровой продукт, а не шаблонный AI-стартап;
- технологичность через структуру, типографику, сетку и данные;
- минимум декоративного шума;
- много воздуха;
- аккуратный контраст светлых и тёмных секций;
- синий используется как функциональный акцент, а не как постоянная заливка;
- визуал должен хорошо выглядеть даже без фоновых эффектов и сложных иллюстраций.

### Визуальная формула

- 70% строгий корпоративный интерфейс;
- 20% технологическая эстетика;
- 10% эффектность.

---

## 2. Главные правила для AI / Codex

При генерации интерфейса:

1. Не копировать типичные SaaS-шаблоны.
2. Не превращать каждую сущность в карточку.
3. Не делать все секции одинаковыми по композиции.
4. Не центрировать весь контент подряд.
5. Использовать асимметрию, свободное пространство и разные пропорции колонок.
6. Не добавлять декоративные элементы без функциональной или композиционной причины.
7. Не использовать яркие glow-эффекты как основной способ сделать интерфейс «технологичным».
8. Не использовать 3D-объекты, абстрактные сферы и blobs по умолчанию.
9. Не использовать градиентный текст.
10. Не использовать огромные pill-кнопки.
11. Не использовать тени на каждом контейнере.
12. Не делать карточки с одинаковым радиусом, одинаковой высотой и одинаковым внутренним устройством без необходимости.
13. Не делать декоративные псевдодашборды, если они ничего не объясняют.
14. Не добавлять бейдж над каждым заголовком.
15. Не использовать стандартные Lucide-иконки как главный визуальный язык продукта.
16. Любой UI должен оставаться качественным после отключения gradients, glow, background grid и иллюстраций.

Если есть выбор между «эффектнее» и «чище», по умолчанию выбирай **чище**.

---

## 3. Цветовая система

### Основные токены

```css
:root {
  /* Surfaces */
  --bg: #F6F7F9;
  --surface: #FFFFFF;
  --surface-subtle: #F0F2F5;
  --surface-dark: #101621;
  --surface-dark-soft: #182131;

  /* Text */
  --text: #10131A;
  --text-secondary: #616875;
  --text-muted: #9298A3;
  --text-inverse: #F7F8FA;
  --text-inverse-secondary: rgba(247, 248, 250, 0.64);

  /* Brand */
  --brand: #1765DA;
  --brand-hover: #1455C0;
  --brand-active: #104BA8;
  --brand-soft: #EEF5FF;
  --brand-soft-strong: #DCEAFF;

  /* Borders */
  --border: #E3E6EB;
  --border-strong: #D3D7DE;
  --border-dark: rgba(255,255,255,.10);
  --border-dark-strong: rgba(255,255,255,.16);

  /* Feedback */
  --success: #16845B;
  --warning: #A66A16;
  --danger: #C74242;
}
```

### Использование цвета

Синий использовать для:

- основных CTA;
- ссылок;
- активных состояний;
- selected/focus;
- ключевых цифр;
- небольших пиктограмм;
- точечных акцентных поверхностей.

Не заливать ярко-синим большие части страницы без смысловой необходимости.

Основной светлый фон — **не чисто белый**:

```css
background: var(--bg);
```

Белый использовать как поверхность:

```css
background: var(--surface);
```

Тёмные секции:

```css
background: var(--surface-dark);
color: var(--text-inverse);
```

---

## 4. Баланс светлого и тёмного

Ориентир для длинной страницы:

- 65–75% светлых секций;
- 25–35% тёмных.

Пример ритма:

```text
Hero                 light
Product / Intro      light
How it works         dark
Features             light
Integrations         light
Cases / Metrics      dark
Testimonials         light
CTA                   dark
Footer                dark
```

Тёмная секция должна восприниматься как смысловая пауза, а не как случайное чередование цветов.

---

## 5. Типографика

### Основной шрифт

Предпочтительно:

```css
font-family: "Onest", system-ui, sans-serif;
```

Допустимые альтернативы, если Onest не используется:

- Manrope;
- Geist;
- Inter только как fallback, а не как осознанный визуальный выбор.

Для редких технических подписей или данных:

```css
font-family: "IBM Plex Mono", monospace;
```

Monospace нельзя использовать массово.

### Начертания

Основной интерфейс:

- 400 — body;
- 500 — большинство заголовков и кнопок;
- 600 — редкие акценты;
- 700+ — избегать без необходимости.

Заголовки не должны выглядеть чрезмерно жирными.

---

## 6. Типографическая шкала

```css
:root {
  --fs-display: clamp(3.25rem, 5vw, 4.75rem);
  --fs-h1: clamp(2.75rem, 4.3vw, 4rem);
  --fs-h2: clamp(2.25rem, 3.3vw, 3rem);
  --fs-h3: clamp(1.5rem, 2vw, 1.875rem);
  --fs-h4: 1.25rem;
  --fs-body-lg: 1.125rem;
  --fs-body: 1rem;
  --fs-small: .875rem;
  --fs-caption: .8125rem;
}
```

### Display

```css
font-size: var(--fs-display);
line-height: .98;
font-weight: 500;
letter-spacing: -0.045em;
```

### H1

```css
font-size: var(--fs-h1);
line-height: 1.02;
font-weight: 500;
letter-spacing: -0.035em;
```

### H2

```css
font-size: var(--fs-h2);
line-height: 1.08;
font-weight: 500;
letter-spacing: -0.03em;
```

### H3

```css
font-size: var(--fs-h3);
line-height: 1.15;
font-weight: 500;
letter-spacing: -0.02em;
```

### Body Large

```css
font-size: var(--fs-body-lg);
line-height: 1.55;
font-weight: 400;
```

### Body

```css
font-size: var(--fs-body);
line-height: 1.55;
font-weight: 400;
```

### Caption

```css
font-size: var(--fs-caption);
line-height: 1.4;
font-weight: 500;
```

---

## 7. Заголовки

Предпочтительный стиль заголовка:

```text
Technology that works
with your existing processes.
```

Не использовать маркетинговую гиперболу и визуальный стиль вида:

```text
REVOLUTIONIZE YOUR BUSINESS
WITH NEXT-GENERATION AI
```

Принципы:

- короткие строки;
- естественный sentence case;
- без постоянного CAPS LOCK;
- без градиента по тексту;
- без обязательного выделения одного слова синим;
- допускается muted-часть заголовка серым, но редко.

### Ограничения ширины

Большой заголовок:

```css
max-width: 760px;
```

Текст:

```css
max-width: 620px;
```

Не растягивать читаемый текст на всю ширину контейнера.

---

## 8. Контейнер и сетка

### Container

```css
.container {
  width: min(100% - 64px, 1240px);
  margin-inline: auto;
}
```

На широких экранах допустимо до `1320px`, если этого требует контент.

### Mobile

```css
@media (max-width: 768px) {
  .container {
    width: min(100% - 32px, 1240px);
  }
}
```

### Grid

Базовая desktop-сетка: 12 колонок.

Предпочтительные композиции:

- 5 / 7;
- 6 / 6;
- 4 / 8;
- 7 / 5;
- асимметричные мозаики.

Не использовать `4 / 4 / 4` как автоматическое решение для каждой секции.

---

## 9. Вертикальный ритм

```css
:root {
  --section-sm: 96px;
  --section-md: 128px;
  --section-lg: 160px;
}
```

Desktop:

- компактная секция: `96px 0`;
- обычная: `128px 0`;
- ключевая: `160px 0`.

Mobile:

- `72–88px 0`.

Не уменьшать расстояния только ради того, чтобы «больше помещалось на экран».

---

## 10. Spacing scale

Использовать ограниченную шкалу:

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
  --space-32: 128px;
  --space-40: 160px;
}
```

По возможности не использовать случайные значения вроде `37px`, `53px`, `71px`.

---

## 11. Радиусы

```css
:root {
  --radius-xs: 6px;
  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 28px;
}
```

Рекомендации:

- button: `10px`;
- input: `10–12px`;
- обычная card: `14–16px`;
- крупный visual container: `20–24px`;
- modal / большой panel: до `28px`.

Не ставить одинаковый радиус `24px` на всё.

---

## 12. Borders

Borders важнее shadows.

Светлая поверхность:

```css
border: 1px solid var(--border);
```

Тёмная поверхность:

```css
border: 1px solid var(--border-dark);
```

Разделитель:

```css
border-top: 1px solid var(--border);
```

Тонкие линии активно использовать для:

- accordion;
- feature list;
- metrics;
- таблиц;
- навигации;
- разделения смысловых зон.

---

## 13. Тени

Тени должны быть почти незаметными.

```css
--shadow-soft:
  0 1px 2px rgba(10,20,40,.03),
  0 8px 30px rgba(10,20,40,.04);
```

Допустимы для:

- dropdown;
- floating panel;
- modal;
- активной интерактивной поверхности.

Не использовать большую тень для каждой карточки.

---

## 14. Карточки

### Базовая карточка

```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}
```

Карточка нужна только тогда, когда внутри находится самостоятельная сущность.

Не оборачивать в card:

- каждый текст;
- каждую метрику;
- каждый заголовок;
- любой кусок контента только для визуального отделения.

Часто лучше использовать свободный layout + border/divider.

---

## 15. Кнопки

### Primary

```css
.button-primary {
  min-height: 48px;
  padding: 0 20px;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background: var(--brand);
  color: #fff;
  font-weight: 500;
  transition:
    background-color 180ms ease,
    transform 180ms ease,
    border-color 180ms ease;
}

.button-primary:hover {
  background: var(--brand-hover);
  transform: translateY(-1px);
}
```

### Secondary

```css
.button-secondary {
  min-height: 48px;
  padding: 0 20px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text);
}
```

### Text link

Во многих секциях предпочитать:

```text
Подробнее →
Посмотреть возможности →
Изучить интеграцию →
```

вместо полноценной кнопки.

### Не делать

- огромные pills;
- несколько одинаково ярких primary CTA рядом;
- excessive glow;
- иконку стрелки в круге внутри каждой кнопки без причины.

---

## 16. CTA-тексты

Использовать короткие и конкретные формулировки:

- Обсудить проект
- Связаться
- Посмотреть возможности
- Запросить демо
- Получить консультацию
- Начать работу

Избегать:

- «Начните цифровую трансформацию уже сегодня»;
- «Откройте будущее вашего бизнеса»;
- «Раскройте потенциал инноваций».

---

## 17. Section label / kicker

Разрешён, но не обязателен.

Примеры:

```text
Интеграции
Возможности
Как это работает
```

или:

```text
01 / Возможности
02 / Интеграции
03 / Процесс
```

Стиль:

```css
.section-label {
  font-size: 13px;
  line-height: 1.4;
  font-weight: 500;
  color: var(--brand);
}
```

Не использовать:

- capsule/pill вокруг каждого kicker;
- uppercase в каждой секции;
- kicker только потому, что «так принято в SaaS».

---

## 18. Hero

Не использовать по умолчанию шаблон:

```text
badge
огромный centered H1
подзаголовок
2 кнопки
dashboard mockup
```

Предпочтительнее editorial-композиция.

Пример структуры:

```text
                                 PRODUCT / 2026

Система, которая
соединяет коммуникации
с вашим бизнесом.

                                 Автоматизация диалогов,
                                 маршрутизации и CRM.

Обсудить проект →

──────────────────────────────────────────────────────
24/7              <2 сек              CRM
обработка         реакция             синхронизация
```

Hero может быть двухколоночным, асимметричным или текстовым. Большая иллюстрация не обязательна.

---

## 19. Feature sections

Основной паттерн:

```text
┌──────────────────────────────────────────────────────┐
│                                                      │
│  visual / UI              label                      │
│                           Large heading              │
│                           Description                │
│                           ─────────────────          │
│                           Feature                    │
│                           ─────────────────          │
│                           Feature                    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

Следующую секцию можно переворачивать:

```text
TEXT                  VISUAL
```

Не повторять одну композицию 5 раз подряд.

---

## 20. Метрики

Метрики по умолчанию показывать максимально чисто:

```text
+24%
конверсия

3×
скорость обработки

99.9%
доступность
```

Лучше без отдельных карточек.

Пример:

```css
.metric-value {
  font-size: clamp(2rem, 3vw, 3rem);
  line-height: 1;
  letter-spacing: -.035em;
  font-weight: 500;
}

.metric-label {
  margin-top: 10px;
  color: var(--text-secondary);
}
```

---

## 21. Интеграции

Смысл визуала:

> центральный продукт связан с существующей инфраструктурой клиента.

Допустимые формы:

- логотипы + тонкие линии;
- схема;
- table/list;
- ticker;
- компактный graph;
- центральный hub;
- реальные названия сервисов.

Не обязательно повторять дугу или орбиту из референсов.

Не использовать 15 glowing icons без структуры.

---

## 22. Testimonials / кейсы

Не делать стандартную сетку из трёх одинаковых отзывов.

Предпочтительно:

- асимметричная мозаика;
- крупный отзыв + логотипы;
- отзыв + метрика;
- цитата как самостоятельный typographic block;
- смешение больших и маленьких элементов.

Пример композиции:

```text
┌───────────────────────┬────────────┐
│                       │   logo     │
│       review          ├────────────┤
│                       │            │
├────────────┬──────────┤   review   │
│    logo    │   logo   │            │
└────────────┴──────────┴────────────┘
```

---

## 23. Логотипы клиентов

По умолчанию:

```css
.client-logo {
  opacity: .45;
  filter: grayscale(1);
  transition: opacity 180ms ease, filter 180ms ease;
}

.client-logo:hover {
  opacity: 1;
  filter: grayscale(0);
}
```

Не создавать разноцветную стену логотипов без необходимости.

---

## 24. Иконки

### Допустимо

Lucide / похожие системные иконки использовать для:

- menu;
- close;
- chevron;
- external link;
- arrow;
- search;
- basic controls.

### Для продуктовых возможностей

Предпочтительнее:

- собственные SVG;
- простая геометрия;
- числа;
- знаки;
- минимальные пиктограммы;
- реальные UI-элементы.

Не строить визуальную айдентику целиком на стандартном icon pack.

---

## 25. Glass

Glass разрешён только как локальный акцент.

```css
.glass-surface {
  background:
    linear-gradient(145deg, rgba(255,255,255,.16), rgba(255,255,255,.055) 34%, rgba(75,156,255,.03) 68%, rgba(16,22,33,.08)),
    rgba(16,22,33,.38);
  backdrop-filter: blur(20px) saturate(1.38);
  -webkit-backdrop-filter: blur(20px) saturate(1.38);
  border: 1px solid rgba(247,248,250,.18);
  box-shadow:
    0 14px 36px rgba(16,22,33,.20),
    inset 0 1px 0 rgba(255,255,255,.28),
    inset 0 -1px 0 rgba(255,255,255,.055);
}
```

Стеклянная поверхность должна состоять из четырёх спокойных слоёв:

- полупрозрачный тёмный tint;
- blur с умеренной насыщенностью;
- тонкий светлый контур и верхний блик;
- компактная внешняя тень, отделяющая floating-элемент от фона.

Для небольших glass-кнопок допустим полный радиус, если он отличает их от основных CTA. Соседние обычные кнопки не нужно автоматически превращать в pills.

Исключение: в компактной CTA-паре hero можно использовать единый полный радиус для primary и glass-secondary, если их роли по-прежнему ясно различаются цветом и материалом. В этом случае primary может иметь одну локальную направленную тень до `0 9px 22px rgba(23,101,218,.24)`; этот приём не переносится автоматически на остальные кнопки и контейнеры.

Подходит для:

- navbar при scroll;
- floating UI;
- small overlay;
- modal;
- contextual panel.

Не применять ко всем карточкам и секциям.

---

## 26. Градиенты

Использовать редко.

Допустимый brand-gradient:

```css
background: linear-gradient(135deg, #1455C0 0%, #2789EA 100%);
```

Не использовать:

- градиентный текст;
- сложные multi-color gradients;
- rainbow gradients;
- огромные фоновые gradient clouds на каждой секции.

Если gradient не улучшает иерархию или состояние элемента — убрать.

---

## 27. Фоновые эффекты

Фоновые эффекты не являются частью базовой композиции.

Разрешены как дополнительный слой:

- едва заметная grid;
- radial glow;
- noise 1–2%;
- технические линии;
- мягкий локальный gradient.

Правило:

> После полного удаления фоновых эффектов секция должна оставаться визуально законченной.

---

## 28. Dark section

```css
.section-dark {
  background: var(--surface-dark);
  color: var(--text-inverse);
}

.section-dark .secondary {
  color: var(--text-inverse-secondary);
}

.section-dark .panel {
  background: rgba(255,255,255,.055);
  border: 1px solid var(--border-dark);
}
```

Акцентный синий на тёмном фоне можно сделать немного светлее:

```css
color: #4B9CFF;
```

---

## 29. Light section

```css
.section-light {
  background: var(--bg);
  color: var(--text);
}
```

Внутренние поверхности:

```css
background: var(--surface);
```

Но секция не обязана состоять из белых карточек. Часто лучше разместить контент непосредственно на фоне.

---

## 30. Navigation

Desktop-пример:

```text
LOGO        Продукт   Возможности   Интеграции   Кейсы        CTA
```

Рекомендации:

- высота `72–80px`;
- много свободного пространства;
- без массивного floating pill-container;
- glass допускается после scroll;
- активное состояние сдержанное;
- CTA компактный.

---

## 31. Формы

Inputs:

```css
.input {
  min-height: 48px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid var(--border-strong);
  background: var(--surface);
  color: var(--text);
}

.input:focus {
  outline: none;
  border-color: var(--brand);
  box-shadow: 0 0 0 3px rgba(23,101,218,.10);
}
```

Не делать inputs чрезмерно крупными или декоративными.

Label должен быть видимым, а placeholder не должен заменять label.

---

## 32. Таблицы и списки

Для B2B-интерфейса часто предпочитать структурированную таблицу или список вместо набора карточек.

Использовать:

- тонкие horizontal dividers;
- аккуратный hover row;
- muted secondary text;
- ясное выравнивание данных.

Не помещать каждую строку таблицы в отдельную карточку.

---

## 33. Accordion

Рекомендуемый вид:

```text
01   Заголовок                                    +
────────────────────────────────────────────────────
02   Заголовок                                    +
────────────────────────────────────────────────────
03   Заголовок                                    +
```

Без обязательных rounded cards вокруг каждого пункта.

---

## 34. Motion

```css
:root {
  --ease-ui: cubic-bezier(.22,.61,.36,1);
  --duration-fast: 180ms;
  --duration-base: 260ms;
  --duration-reveal: 500ms;
}
```

### Hover

`160–220ms`.

### Reveal

`400–600ms`.

Разрешено:

- opacity;
- translateY `8–16px`;
- небольшое изменение border-color;
- scale до `1.015`;
- clip/mask reveal в ключевых блоках.

Не использовать:

- постоянное floating;
- бесконечное покачивание;
- excessive parallax;
- движение каждого элемента при скролле.

### Reduced motion

Всегда учитывать:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 35. Hover карточек

Не делать «взлёт на 15px + огромная синяя тень».

Использовать:

```css
.card-interactive {
  transition:
    transform var(--duration-fast) var(--ease-ui),
    border-color var(--duration-fast) var(--ease-ui);
}

.card-interactive:hover {
  transform: translateY(-2px);
  border-color: rgba(23,101,218,.28);
}
```

---

## 36. Изображения и визуальные блоки

Дизайн-система не диктует конкретный стиль иллюстраций.

Допустимо использовать:

- реальные screenshots продукта;
- интерфейсные фрагменты;
- фотографии;
- технические схемы;
- диаграммы;
- абстрактные визуалы, если они помогают смыслу.

Главное правило:

> Изображение поддерживает смысл блока, а не существует только как украшение.

Не добавлять stock-like AI images только чтобы заполнить свободное место.

---

## 37. Responsive

### Desktop

- свободные широкие композиции;
- асимметрия;
- 12-column grid;
- большие вертикальные отступы.

### Tablet

- сложные `5/7`, `4/8` переходят в `6/6` или stacked layout;
- уменьшать визуальные блоки, а не просто масштабировать весь desktop.

### Mobile

- одна основная колонка;
- horizontal padding `16px`;
- section spacing `72–88px`;
- buttons могут становиться `width: 100%`, если это улучшает UX;
- крупные метрики допускаются в 2 колонки;
- сложные мозаики становятся линейной последовательностью;
- visual order должен соответствовать смыслу, а не desktop DOM-позиции любой ценой.

### Mobile typography

Не делать display меньше настолько, чтобы потерялся характер. Использовать `clamp()`.

---

## 38. Accessibility

Обязательно:

- достаточный контраст текста;
- видимый keyboard focus;
- `aria-label` для icon-only buttons;
- semantic HTML;
- `button` для действий, `a` для переходов;
- alt у смысловых изображений;
- декоративные изображения `alt=""`;
- не передавать информацию только цветом;
- clickable-area не меньше ~44×44px для touch controls.

---

## 39. Anti-AI-slop blacklist

По умолчанию запрещено использовать одновременно несколько элементов из списка:

- gradient text;
- glowing orb;
- 3D blob;
- glass card everywhere;
- blue glow behind every object;
- floating mini-icons;
- 3 одинаковые feature cards под каждым H2;
- pill label над каждым заголовком;
- огромные border-radius;
- полностью centered layout;
- decorative grid на каждом фоне;
- бессмысленные mock dashboards;
- excessive shadows;
- repeated bento grid на каждой странице;
- generic rocket / lightning / brain / magic-wand icons;
- одинаковый layout каждой секции;
- надписи типа “NEXT-GEN”, “REVOLUTIONARY”, “POWERED BY AI” без реальной необходимости;
- псевдофутуристические линии и частицы;
- бесконечные animated gradients;
- marquee только ради движения.

---

## 40. Чем заменять AI-slop

Использовать:

- сильную типографику;
- реальные данные;
- асимметрию;
- whitespace;
- grid;
- borders;
- контраст размеров;
- настоящие интерфейсы;
- диаграммы;
- продуктовые сценарии;
- крупные цифры;
- продуманные states;
- качественную иерархию;
- необычный, но логичный layout.

Технологичность должна исходить из **структуры**, а не из спецэффектов.

---

## 41. Предпочтительные композиционные паттерны

Использовать разные паттерны на одной странице.

### Pattern A — Editorial split

```text
LABEL

LARGE HEADING                supporting text
LARGE HEADING                CTA →
```

### Pattern B — Visual + feature list

```text
VISUAL                        H2
                              description
                              ───────────────
                              feature
                              ───────────────
                              feature
```

### Pattern C — Metrics strip

```text
VALUE          VALUE          VALUE          VALUE
label          label          label          label
```

### Pattern D — Asymmetric mosaic

```text
┌─────────────────┬────────┐
│                 │        │
│     large       ├────────┤
│                 │        │
├────────┬────────┴────────┤
│        │                 │
└────────┴─────────────────┘
```

### Pattern E — Structured list

```text
01    Heading                    Description
────────────────────────────────────────────
02    Heading                    Description
────────────────────────────────────────────
03    Heading                    Description
```

### Pattern F — Dark technical section

```text
small label

Large statement

          [ product flow / schema / UI ]

01                    02                    03
step                  step                  step
```

Не использовать один и тот же pattern для всей страницы.

---

## 42. Принцип иерархии

Перед добавлением карточки, иконки, градиента или анимации сначала попытаться решить задачу через:

1. размер;
2. положение;
3. whitespace;
4. цвет текста;
5. border;
6. фон;
7. только после этого — effect.

---

## 43. Component primitives

Минимальный набор компонентов проекта:

```text
Container
Section
Stack
Grid
Button
TextLink
Badge (использовать редко)
Divider
Card
Metric
LogoCloud
FeatureList
Accordion
Tabs
Input
Textarea
Select
Modal
Navbar
Footer
```

Не создавать отдельный визуальный компонент для каждой секции, если она может быть собрана из этих primitives.

---

## 44. Рекомендуемая структура CSS tokens

```text
styles/
├── tokens.css
├── reset.css
├── typography.css
├── layout.css
├── components.css
└── utilities.css
```

или эквивалент в текущей архитектуре проекта.

---

## 45. Пример глобальных токенов

```css
:root {
  --bg: #F6F7F9;
  --surface: #FFFFFF;
  --surface-subtle: #F0F2F5;
  --surface-dark: #101621;
  --surface-dark-soft: #182131;

  --text: #10131A;
  --text-secondary: #616875;
  --text-muted: #9298A3;
  --text-inverse: #F7F8FA;

  --brand: #1765DA;
  --brand-hover: #1455C0;
  --brand-active: #104BA8;
  --brand-soft: #EEF5FF;

  --border: #E3E6EB;
  --border-strong: #D3D7DE;
  --border-dark: rgba(255,255,255,.10);

  --radius-xs: 6px;
  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 28px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
  --space-32: 128px;
  --space-40: 160px;

  --container: 1240px;

  --ease-ui: cubic-bezier(.22,.61,.36,1);
  --duration-fast: 180ms;
  --duration-base: 260ms;
  --duration-reveal: 500ms;
}
```

---

## 46. Definition of Done для нового блока

Перед завершением любой новой секции проверить:

- [ ] Есть ли ясная визуальная иерархия без эффектов?
- [ ] Нужна ли здесь вообще карточка?
- [ ] Не повторяет ли композиция предыдущую секцию?
- [ ] Нет ли лишних pills/badges?
- [ ] Нет ли generic AI-icons?
- [ ] Тень действительно нужна?
- [ ] Можно ли заменить эффект whitespace или border?
- [ ] Синий используется как акцент, а не как костыль?
- [ ] Заголовок не слишком жирный?
- [ ] Строки текста имеют комфортную ширину?
- [ ] На mobile сохранена иерархия?
- [ ] Есть keyboard focus?
- [ ] Учитывается prefers-reduced-motion?
- [ ] Блок выглядит завершённым без фоновой графики?
- [ ] Визуал ощущается как зрелый B2B-продукт, а не шаблон AI SaaS?

Если хотя бы 3 пункта вызывают сомнение — упростить дизайн и пересобрать композицию.

---

## 47. Итоговый критерий

Интерфейс должен выглядеть так, будто его проектировала зрелая продуктовая команда:

**спокойно, точно, технологично, дорого, без показной футуристичности.**

Приоритеты в порядке важности:

```text
1. Иерархия
2. Читаемость
3. Сетка
4. Воздух
5. Контраст
6. Согласованность
7. Интерактивность
8. Декоративные эффекты
```

Декор никогда не должен компенсировать слабую композицию.
