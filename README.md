# Modern Landing Page Development Kit

A sophisticated development environment for creating high-performance landing pages using Pug templating, SCSS, and modern JavaScript.

## Tech Stack

- **Template Engine:** Pug
- **Styling:** SCSS/Sass
- **JavaScript:** ES6+
- **Build System:** Webpack
- **Package Management:** npm/yarn

## Features

- 🚀 Modern build pipeline with Webpack
- 📱 Mobile-first responsive design approach
- 🎨 Advanced SCSS architecture with mixins and variables
- 🧩 Component-based structure using Pug
- 🔄 Hot Module Replacement (HMR) for rapid development
- 📦 Asset optimization and bundling
- 🎭 Layout system with extensible templates

## Project Structure

```
├── src/
│ ├── assets/
│ │ └── ... (images, fonts, etc.)
│ ├── js/
│ │ └── main.js
│ ├── styles/
│ │ └── main.scss
│ └── views/
│ ├── components/
│ ├── layouts/
│ └── pages/
├── package.json
└── webpack.config.js
```

## Getting Started

1. Clone the repository
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server
4. Run `npm build` to build the production version

## Build Commands

- `npm run build:dev` - Builds the development version
- `npm run build` - Builds the production version

## Build Docker image

- docker build -t my-static-site .

## Run container

- docker run -p 8080:80 my-static-site

## Notes

- This project uses Webpack for bundling and optimization.
- SCSS is compiled with PostCSS and autoprefixer for cross-browser compatibility.
- Pug templates are compiled to HTML with the help of Pug-Loader.
- JavaScript is bundled with Babel for ES6+ compatibility.
