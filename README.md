<div align="center">

# TarotMind

**Application web de tirage et d’interprétation de tarot** — interface fluide, profil personnalisable et historique des tirages, avec une architecture prête pour l’évolution (API, données partagées).

<br />

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=000)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=fff)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=for-the-badge&logo=react-router&logoColor=fff)](https://reactrouter.com/)

[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=for-the-badge&logo=nodedotjs&logoColor=fff)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=fff)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-003B57?style=for-the-badge&logo=sqlite&logoColor=fff)](https://www.sqlite.org/)
[![npm workspaces](https://img.shields.io/badge/npm-workspaces-CB3837?style=for-the-badge&logo=npm&logoColor=fff)](https://docs.npmjs.com/cli/using-npm/workspaces)

</div>

---

## Présentation

TarotMind propose une expérience de **consultation guidée** : choix du tirage, cartes tirées selon les préférences, et suivi dans le temps. Le **profil** et l’**historique** peuvent être conservés **localement** dans le navigateur pour une utilisation immédiate, sans friction. Un **backend Express** et un paquet **TypeScript partagé** posent les bases d’évolutions futures (synchronisation, IA, comptes utilisateurs).

## Fonctionnalités

- Interface **responsive** (accueil, tirage, profil, historique).
- **Profil** : préférences (jeu de cartes, objectifs, contexte) pour contextualiser les interprétations.
- **Historique** des tirages conservé côté client selon la configuration actuelle.
- **API REST** avec point de santé et socle d’**authentification** (JWT / Google) côté serveur pour extensions produit.

## Architecture

| Dossier | Rôle |
|--------|------|
| `client/` | SPA **React** + **React Router**, build **Vite**, typage **TypeScript**. |
| `server/` | **Express**, **SQLite** (`better-sqlite3`), auth JWT, prêt pour la production. |
| `packages/shared/` | Types et modules **TypeScript** partagés entre client et serveur. |

En développement, le client Vite **proxy** le préfixe `/api` vers `http://localhost:4000` (voir `client/vite.config.ts`).

## Prérequis

- **Node.js** (LTS recommandé)
- **npm** (gestionnaire du monorepo)

## Installation

```bash
git clone <url-du-depot>
cd tarotmind
npm install
```

## Développement

Démarrage conjoint du front (port Vite habituel **5173**) et de l’API (**4000** par défaut) :

```bash
npm run dev
```

| Script | Description |
|--------|-------------|
| `npm run dev:client` | Client uniquement |
| `npm run dev:server` | Serveur uniquement |
| `npm run build` | Build client + compilation TypeScript du serveur |
| `npm run preview` | Prévisualisation du build statique du client |
| `npm run lint` | Analyse ESLint |

Variables optionnelles côté client : `client/.env.example` (`VITE_API_BASE`).

## Build et exécution

```bash
npm run build
```

Ensuite : servir les fichiers de `client/dist` et lancer l’API (par ex. `npm run start` dans `server/` après compilation), selon votre hébergement (VPS, PaaS, conteneurs).

## Licence

Projet **privé** — usage réservé aux contributeurs autorisés.
