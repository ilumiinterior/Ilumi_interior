# ILUMI INTERIOR — scroll video prototype

Prvý funkčný prototyp landing page, v ktorom scroll ovláda čas HTML5 videa cez GSAP ScrollTrigger.

## Lokálne spustenie

```bash
npm install
npm run dev
```

## Produkčný build

```bash
npm run build
```

Build v priečinku `dist` je pripravený pre Vercel. Projekt vyberá mobilné alebo 1440p all-intra video podľa zariadenia a nastavenia šetrenia dát. Každá snímka videa je samostatne dekódovateľná a wheel/trackpad scroll je vyhladený cez Lenis.
