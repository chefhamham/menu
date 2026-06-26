# RESTAURANT CHEF HAM&HAM — Menu Digital

## Architecture

```
├── index.html            # Structure HTML (sémantique, pas de style ni JS inline)
├── css/
│   ├── main.css          # Point d'entrée CSS — importe tous les fichiers
│   ├── variables.css     # Custom properties (couleurs, ombres, keyframes)
│   ├── base.css          # Reset, body, scrollbar, typographie
│   ├── layout.css        # Système de pages, sections, grilles
│   ├── components.css    # Tous les composants (nav, cartes, panier, toast…)
│   └── responsive.css    # Media queries (desktop)
├── js/
│   ├── main.js           # Point d'entrée JS — initialise les modules
│   ├── navigation.js     # Routage, navigation, thème, panier (ouverture/fermeture)
│   └── menu.js           # Données, état, panier, favoris, recherche, filtres, WhatsApp
├── api/
│   └── ping.js           # KeepAlive Supabase
├── images/               # Images (logo, etc.)
└── *.md                  # Documentation
```

## Conventions

- **Fichiers** : `kebab-case` (ex. `main.css`, `navigation.js`)
- **Classes CSS** : `kebab-case` (ex. `.dish-card`, `.nav-item`)
- **Variables JS** : `camelCase` (ex. `activeFilter`, `showPage`)
- **IDs** : `camelCase` (ex. `#searchInput`, `#cartBadge`)
- **Data attributes** : `kebab-case` (ex. `data-page`, `data-action`, `data-category`)

## Fonctionnalités

- Navigation multi-pages (Home, Menu, Favorites, About, Contact)
- Panier d'achat avec quantités
- Favoris (sauvegardés dans localStorage)
- Recherche et filtres par catégorie
- Commande directe via WhatsApp
- Thème clair/sombre (sauvegardé dans localStorage)
- Animations au scroll (Intersection Observer)
- Design responsive (mobile-first)

## Lancement

Les modules ES6 (`type="module"`) nécessitent un serveur HTTP local.
Ouvrir `index.html` directement (via `file://`) **ne fonctionnera pas**.

### Option 1 : Node.js (préféré)
```bash
npx serve --listen 3000
```

### Option 2 : Python
```bash
python -m http.server 8000
# → http://localhost:8000
```

### Option 3 : PHP
```bash
php -S localhost:8000
```

### Option 4 : VS Code
Utiliser l'extension **Live Server**.

## Compatibilité

- Chrome / Firefox / Safari / Edge (versions récentes)
- ES6 modules supportés
- CSS custom properties (CSS Variables)

## Crédits

Design original restructuré en architecture modulaire.
Polices : Playfair Display, Inter, Cormorant Garamond (via Google Fonts).
