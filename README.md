<div align="center">

# TarotMind

**Application web de tirage et d’interpretation de tarot** — experience sombre elegante, profil personnalisable, historique local et generation IA via API.

<br />

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=000)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=fff)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=for-the-badge&logo=react-router&logoColor=fff)](https://reactrouter.com/)

[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=for-the-badge&logo=nodedotjs&logoColor=fff)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=fff)](https://expressjs.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?style=for-the-badge&logo=openai&logoColor=fff)](https://platform.openai.com/)
[![npm workspaces](https://img.shields.io/badge/npm-workspaces-CB3837?style=for-the-badge&logo=npm&logoColor=fff)](https://docs.npmjs.com/cli/using-npm/workspaces)

</div>

---

## Présentation

TarotMind propose une experience de **consultation guidee** : choix du tirage, saisie des cartes tirees, interpretation personnalisee par ton (spirituel, psychologique, direct) et suivi dans le temps.

Le **profil** et l’**historique** sont stockes localement dans le navigateur pour une utilisation immediate. L’API Express fournit le point d’entree IA (`POST /interpret`) et reste simple a faire evoluer.

## Fonctionnalités

- Interface **responsive** (accueil, tirage, profil, historique), theme sombre elegant.
- **Icones dediees** (plus d’emojis) pour les modules et types de tirages.
- **Profil** : preferences utilisateur (objectifs, contexte relationnel/pro, jeu de cartes).
- **Interpretation IA** via OpenAI sur `POST /interpret`, avec fallback local en cas d’erreur.
- **Historique local** des tirages + comparaison.
- **Aucune authentification obligatoire** dans la version actuelle.

## Architecture

| Dossier | Rôle |
|--------|------|
| `client/` | SPA **React** + **React Router**, build **Vite**, typage **TypeScript**. |
| `server/` | **Express**, `GET /health`, `POST /interpret` (OpenAI), gestion des flags d’execution IA. |
| `packages/shared/` | Types et modules **TypeScript** partagés entre client et serveur. |

En developpement, le client Vite **proxy** le prefixe `/api` vers `http://localhost:4000` (voir `client/vite.config.ts`).

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

Demarrage conjoint du front (port Vite habituel **5173**) et de l’API (**4000** par defaut) :

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

Variables cote client : `client/.env.example` (`VITE_API_BASE`).

## Configuration IA (OpenAI)

Creer `server/.env` (non committe) avec au minimum :

```env
PORT=4000
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

Options utiles pour maitriser cout/volume pendant les tests :

```env
# 1 = aucun appel OpenAI, retour d'un texte stub local
AI_DISABLED=1

# Retries max en cas d'erreurs 5xx
AI_MAX_RETRIES=1

# 1 = pas de second appel "reponse trop courte"
AI_NO_EXPAND=1
```

Reference complete : `server/.env.example`.

## Build et exécution

```bash
npm run build
```

Ensuite : servir `client/dist` en statique et lancer l’API (`npm run start` dans `server/` apres compilation), selon votre hebergement (VPS, PaaS, conteneurs).

## Licence

Projet **prive** — usage reserve aux contributeurs autorises.
