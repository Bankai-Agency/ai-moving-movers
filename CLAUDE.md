# AI Moving — Mover App

## Проект
Mover App — приложение для перевозчиков в маркетплейсе AI Moving. React Native + Expo Web, TypeScript. Веб-превью через `Platform.OS === 'web'` с inline-стилями (`<div>`, `<span>`). Навигация — useState в App.tsx.

## Репозитории
- **movers**: `Bankai-Agency/ai-moving-movers` → Vercel: `mover-app.vercel.app`
- **client**: `Bankai-Agency/ai-moving-client` → Vercel: `ai-moving-mobile.vercel.app`
- Deploy: auto на push в main. Build: `npx expo export -p web`, output: `dist/`

## Деплой
Claude делает git add → commit → push origin main. Пользователь не работает с терминалом. Vercel подхватывает автоматически.

---

## Дизайн-система

### Цвета
```
Фон экрана:           #FAFAFA
Карточки:             #FFFFFF, borderRadius: 16
Интерактивные:        #EFF2F7 (secondary кнопки, чипы, неактивные табы)
Выбранное/завершённое: #DBEAFE

Primary:   #2E90FA (500), #1570EF (600), #D1E9FF (100), #EFF8FF (50)
Gray:      #101828 (900), #344054 (700), #475467 (600), #667085 (500),
           #98A2B3 (400), #D0D5DD (300), #F2F4F7 (100)
Error:     #F04438
Warning:   #F79009
Success:   #12B76A
```

### Типографика
- Шрифт: `Inter` (fallback: system-ui, sans-serif)
- Моно: `Chivo Mono` (для буллетов)

### Spacing
Base unit: 4px. Сетка: 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 64, 80, 96, 128.

### Скругления
- Кнопки/инпуты: `borderRadius: 12`
- Карточки: `borderRadius: 16`
- Модалки: `borderRadius: 24` (верхние углы)

---

## ЖЁСТКИЕ ПРАВИЛА (никогда не нарушать)

### Запрещено
- **boxShadow / shadow** — НИГДЕ. Ни на карточках, ни на модалках, ни на кнопках.
- **border на карточках/кнопках** — никаких borderWidth, borderColor. Разделение только через фон и отступы.
- **Разные размеры однотипных элементов** — если кнопка 50px, то ВСЕ кнопки на странице 50px. Если инпут 50px, то все инпуты 50px.
- **Таблицы на мобильном** — никаких 5-колоночных таблиц. Использовать карточные строки (list rows).
- **Белые подложки под иконки в хедерах** — иконки стоят напрямую, без белых кружков/квадратов.

### Обязательно
- Фон экранов: `#FAFAFA`
- Карточки: `#FFFFFF`, `borderRadius: 16`, никаких теней
- Разделители в списках: `1px solid #F2F4F7` (только внутри списков, не на карточках)
- Все кнопки и инпуты — через единые константы размера (см. ниже)

---

## Принципы проектирования (выведены из фидбэка)

### 1. Единообразие размеров — «одно место задаёт стандарт»
Если пользователь видит кнопку определённого размера в одном месте — он ожидает её везде. Определяй константы в начале файла и используй ТОЛЬКО их:

```typescript
const INPUT_STYLE = { minHeight: 50, borderRadius: 12, backgroundColor: '#EFF2F7', ... };
const BTN_PRIMARY = { minHeight: 50, borderRadius: 12, backgroundColor: colors.primary[500], ... };
const BTN_SECONDARY = { ...BTN_PRIMARY, backgroundColor: colors.primary[50] };
```

**Никогда** не вводи третий/четвёртый размер. Максимум две вариации: основная (50px) и малая (36px для delete/close).

### 2. Мобильный контент — карточки, не таблицы
На мобильном 5 колонок сжимаются и текст переносится. Вместо таблицы — список карточек, где каждая запись показывает данные в 2-3 строки с правильной иерархией:
- **Заголовок** (имя, дата) — 15px, fontWeight 600
- **Подробности** (маршрут, детали) — 13px, color gray[500]
- **Значение** (цена, рейтинг) — 15px, fontWeight 700, справа

### 3. Фильтры/чипы — горизонтальный скролл
Если чипов больше 3, они могут не влезть. Всегда:
- `whiteSpace: 'nowrap'`, `flexShrink: 0` на каждом чипе
- `overflowX: 'auto'` на контейнере
- Фиксированная высота (36px), ширина по контенту

### 4. Неактивные элементы должны быть видны
Если фон экрана `#F5F5F7` или `#FAFAFA`, неактивные чипы `#EFF2F7` сливаются. В таких случаях неактивные элементы делать `#FFFFFF`.

### 5. Фон должен быть единый от статус-бара до низа
При переходе на подэкран (drill-down) — менять фон SafeAreaView и контейнера чтобы не было «полосы» другого цвета за статус-баром.

### 6. Анимации — CSS Grid для коллапсов
Не использовать `max-height` с `scrollHeight` (ненадёжно, контент обрезается). Использовать:
```typescript
<div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows 0.3s ease' }}>
  <div style={{ overflow: 'hidden' }}>{children}</div>
</div>
```

### 7. Custom-функционал должен работать
Если добавляешь кнопку «Custom» — она должна реально что-то делать (date picker, модалка и т.д.), а не быть заглушкой.

### 8. Navigation Bar — iOS HIG
Все навбары (кнопка «назад» + заголовок) должны следовать iOS-стилю:
- Шеврон «назад» — голая SVG-иконка цвета `colors.primary[500]` (синяя), БЕЗ обёртки с фоном
- Заголовок — по центру экрана (`position: absolute, textAlign: center`), 17px, fontWeight 600
- Никаких декоративных контейнеров (36×36 div с `#EFF2F7`) вокруг шеврона
- minHeight навбара: 44
- Если экран использует общий `<Navbar />` из `design-system/components/Navbar.tsx` — уже правильно. Inline навбары должны повторять этот паттерн.

### 9. Кнопки с иконками — одна высота с остальными
Если кнопка содержит иконку + текст, она должна быть РОВНО такой же высоты как соседние кнопки. Использовать фиксированную `height` вместо `padding`.

---

## Структура проекта
```
src/
├── design-system/
│   ├── tokens/ (colors, typography, spacing, borders)
│   ├── components/ (Button, Text, StatusBarMock)
│   └── index.ts
├── screens/
│   ├── auth/ (Login, GetStarted, Phone, OTP, RoleSelection)
│   ├── home/ (Dashboard, CeoDashboard, TabBar)
│   ├── orders/ (OrdersList, RequestDetail, ApplicationSent)
│   ├── contract/ (ContractsList, ContractSigning)
│   ├── schedule/ (Schedule)
│   ├── chat/ (ChatList, Chat)
│   ├── profile/ (Profile, PersonalInfo, Notifications, ...)
│   └── move/ (MoveDetail, MyMoves)
App.tsx — главный файл с навигацией через useState
```
