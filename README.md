# PokéHub (React + Vite)

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

- Lista: `GET /pokemon?limit=100000&offset=0` (una vez).
- Cada card: `GET /pokemon/{name}/` (con caché en memoria).
- Animaciones con framer-motion (stagger de cards, hover, transición entre páginas).
- Búsqueda por nombre o número, 24 cards por página.
