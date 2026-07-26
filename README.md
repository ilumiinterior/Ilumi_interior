# ILUMI INTERIOR — scroll video prototype

Landing page ILUMI INTERIOR s dvoma širokouhlými a jedným portrétnym scrollom ovládaným HTML5 videom, prehľadom služieb a responzívnym cenníkom. Čas videí ovláda GSAP ScrollTrigger a wheel/trackpad scroll vyhladzuje Lenis.

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
