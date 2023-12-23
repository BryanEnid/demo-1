# observe-pwa

[![License](https://img.shields.io/badge/license-Not%20Licensed-red.svg)](https://opensource.org/licenses/)

## Overview

`observe-pwa` is a Progressive Web App (PWA) built with modern web technologies, including React, Vite, and other popular libraries. It provides a foundation for building powerful and responsive web applications with a focus on performance and developer experience.

## Features

- **React Components**: Utilizes a modular component-based architecture for building scalable and maintainable UI.
- **Vite**: Harnesses the power of Vite for fast development and efficient bundling.
- **Tailwind CSS**: Integrates Tailwind CSS for a utility-first approach to styling.
- **Firebase Integration**: Includes Firebase for backend services, authentication, and more.
- **React Query**: Leverages React Query for efficient and reactive data fetching.

## Requirements

- Yarn versions `>= v1.22.19 <= v1.22.21`
- Node versions `>= v18.0.0 <= v18.19.0`

## Getting Started

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/bryanenid/observe-pwa.git
   ```

2. **Install Dependencies:**

   ```bash
   yarn install
   yarn prepare
   ```

3. **Run the Development Server:**

   ```bash
   yarn dev
   ```

   Open [https://localhost:5173](https://localhost:5173/) in your browser.

4. **Install Server locally**
   - Follow instruction on this repo: https://github.com/BryanEnid/Observe-Services

## Scripts

- `yarn dev`: Run the development server.
- `yarn build`: Build the project for production.
- `yarn preview`: Preview the production build locally.
- `yarn lint`: Lint the project using ESLint.
- `yarn format`: Format code using Prettier.
- `yarn style:all`: Run linting and code formatting.

## Folder Structure

The project follows a structured organization to enhance maintainability and clarity. Key directories include:

- `src`: Contains the application source code.
- `public`: Houses static assets and files.
- `dist`: Contains the output of the production build.

## Dependencies

This project relies on various dependencies for functionality. Some notable ones include:

1. **React** - JavaScript library for building UIs.
2. **Vite** - Fast build tool with HMR and bundling.
3. **Tailwind CSS** - Utility-first CSS framework for rapid UI development.
4. **Firebase** - Platform for web and mobile app development.
5. **React Query** - Data fetching and state management for React.
6. **Eslint** - Pluggable linting utility for JavaScript and JSX.
7. **Prettier** - Opinionated code formatter for consistent styles.
8. **Husky** - Enables Git hooks for enforcing code quality.
9. **Lint-Staged** - Runs linters on pre-committed files.
10. **Vite Plugin PWA** - Generates Progressive Web App (PWA) features.
11. **React Router Dom** - Library for dynamic routing in React.
12. **Firebaseui** - Library for authentication flows using Firebase.
13. **Recharts** - Composable charting library for React.
14. **Lodash** - Utility library for common programming tasks.
15. **Aframe** - Web framework for building virtual reality experiences.
16. **Webrtc-Adapter** - Normalizes WebRTC implementation across browsers.
17. **Postcss** - Tool for transforming styles with JavaScript plugins.

For a complete list, refer to the `package.json` file.

## License

This project is currently not licensed. A license is required for usage. Please check back for updates on licensing information.

## Folder Structure

```terminal
├── bun.lockb // Placeholder folder for an unknown purpose.
├── components.json // JSON file containing component-related information.
├── dist
│ ├── sw.js // Service Worker script responsible for Progressive Web App functionality.
│ └── workbox-fa446783.js // Workbox script for service worker caching.
├── index.html // The main HTML entry point for the application.
├── jsconfig.json // Configuration file for JavaScript projects.
├── localhost.crt / localhost.key // SSL certificate and key for the local development server.
├── manifest.json // Manifest file for Progressive Web App configuration.
├── package.json // Configuration file for Node.js projects, specifying dependencies and scripts.
├── postcss.config.cjs // Configuration file for PostCSS, a tool for transforming styles.
├── public
│ ├── capture-worker.js // Worker script for capturing images or handling related tasks.
│ └── vite.svg // SVG file representing the Vite logo.
├── service-worker.js // Service Worker script responsible for offline functionality.
│
├── src
│ ├── assets // Directory for storing static assets like images.
│ ├── chadcn // Potentially a custom module or directory with application-specific content.
│ ├── components // Directory for Reusable React components.
│ ├── config // Configuration files or constants.
│ ├── Global.css // Global CSS file for styling.
│ ├── hooks // Directory for React hooks.
│ ├── lib // Library or utility functions.
│ ├── main.jsx // Main entry point for the React application.
│ ├── providers // React context providers.
│ ├── Routes.jsx // File defining application routes.
│ └── screens // Directory for React screen components.
│
├── tailwind.config.js // Configuration file for Tailwind CSS.
├── vercel.json // Configuration file for Vercel deployment.
├── vite.config.js // Configuration file for the Vite build tool.
└── yarn.lock // Yarn lock file for dependency versioning.
```
