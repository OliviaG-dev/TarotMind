<div align="center">

# TarotMind

**Application web de tirage et d'interpretation de tarot** - experience elegante, profil personnalisable, historique local et generation IA via API.

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

Le **profil** et l'**historique** sont stockes localement dans le navigateur pour une utilisation immediate. L'API Express expose des endpoints d'interpretation (`POST /interpret`, `POST /question`, `POST /history-insights`) et reste simple a faire evoluer.

## Fonctionnalités

- Interface **responsive** (accueil, tirage, profil, question, historique, stats, encyclopedie).
- **Carte du jour** deterministe avec message quotidien et animation.
- **Profil** : preferences utilisateur + rappels navigateur (notifications optionnelles).
- **Interpretation IA** via OpenAI (`/interpret`, `/question`, `/history-insights`) avec fallback local.
- **Observabilite IA** via `GET /ai-usage` (volume, fallback rate, estimation cout USD, tokens).
- **Quota journalier IA** par utilisateur (header `X-User-Id`, fallback IP) pour limiter les abus.
- **Historique local** des tirages avec detail complet, favoris, notes personnelles et copie partageable.
- **Statistiques personnelles** (KPIs, cartes frequentes, repartition par type de tirage).
- **Encyclopedie du tarot** (filtres, recherche, details des arcanes majeurs).
- **Mode sombre/clair**, transitions de page et lecture vocale (Web Speech API).

## Architecture

| Dossier | Rôle |
|--------|------|
| `client/` | SPA **React** + **React Router**, build **Vite**, typage **TypeScript**. |
| `server/` | **Express**, `GET /health`, endpoints IA (`POST /interpret`, `POST /question`, `POST /history-insights`), `GET /ai-usage`, rate limiting, quota journalier et flags d'execution IA. |
| `packages/shared/` | Types et modules **TypeScript** partagés entre client et serveur. |

En developpement, le client Vite **proxy** le prefixe `/api` vers `http://localhost:4000` (voir `client/vite.config.ts`).

## Prerequis

- **Node.js** (LTS recommande)
- **npm** (gestionnaire du monorepo)

## Installation

```bash
git clone <url-du-depot>
cd tarotmind
npm install
```

## Developpement

Demarrage conjoint du front (port Vite habituel **5173**) et de l'API (**4000** par defaut) :

```bash
npm run dev
```

| Script | Description |
|--------|-------------|
| `npm run dev:client` | Client uniquement |
| `npm run dev:server` | Serveur uniquement |
| `npm run build` | Build client + compilation TypeScript du serveur |
| `npm run preview` | Previsualisation du build statique du client |
| `npm run lint` | Analyse ESLint |
| `npm run test:server` | Tests d'integration API serveur (Vitest + Supertest) |
| `npm run test:e2e` | Tests E2E client (Playwright) |

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

# quota journalier par utilisateur (header X-User-Id, fallback IP)
AI_DAILY_QUOTA_PER_USER=40

# estimation cout (USD) basee sur les tokens OpenAI
AI_COST_INPUT_PER_1K_USD=0.00015
AI_COST_OUTPUT_PER_1K_USD=0.0006
```

Variables serveur utilisees par le code :

- `PORT` (port HTTP de l'API, defaut `4000`)
- `OPENAI_API_KEY` (obligatoire si IA active)
- `OPENAI_MODEL` (optionnel, defaut `gpt-4o-mini`)
- `AI_DISABLED` / `GEMINI_DISABLED` (desactive les appels IA et renvoie un texte mock)
- `AI_MAX_RETRIES` (nombre max de retries sur erreurs 5xx, defaut `2`)
- `AI_NO_EXPAND` (desactive la 2e passe d'expansion de reponse)
- `AI_DAILY_QUOTA_PER_USER` (quota journalier IA par utilisateur, defaut `40`)
- `AI_COST_INPUT_PER_1K_USD` (cout d'entree par 1000 tokens, defaut `0.00015`)
- `AI_COST_OUTPUT_PER_1K_USD` (cout de sortie par 1000 tokens, defaut `0.0006`)

## Endpoints API

Les routes principales exposees par le serveur :

- `GET /health` : etat de sante de l'API.
- `POST /interpret` : interpretation d'un tirage.
- `POST /question` : interpretation orientee question utilisateur.
- `POST /history-insights` : synthese/insights a partir de l'historique.
- `GET /ai-usage` : metriques IA (requests, tokens, fallback rate, estimation cout).
- `POST /auth/register`, `POST /auth/login`, `GET /auth/me` : endpoints placeholder, non implementes (retour `501`).

## Navigation

La barre de navigation inclut :

- `Accueil` (`/`)
- `Carte du jour` (`/carte-du-jour`)
- `Profil` (`/profil`)
- `Tirage` (`/tirage`)
- `Question` (`/question`)
- `Historique` (`/historique`)
- `Encyclopedie` (`/encyclopedie`)
- `Stats` (`/statistiques`)

## Build et execution

```bash
npm run build
```

Ensuite : servir `client/dist` en statique et lancer l'API (depuis `server/`, `npm run start` apres compilation), selon votre hebergement (VPS, PaaS, conteneurs).

## Tests

Tests client unitaires (Vitest) :

```bash
cd client
npm test
```

Tests integration API serveur (Vitest + Supertest) :

```bash
npm run test:server
```

Tests E2E (Playwright) :

```bash
npm run test:e2e
```

Au premier lancement E2E, installer le navigateur Playwright :

```bash
cd client
npx playwright install chromium
```

## Quota et cout IA

- Chaque appel IA envoie un `X-User-Id` (genere et stocke cote client) pour appliquer un quota par utilisateur.
- Si `X-User-Id` est absent, le serveur applique le quota par IP.
- Les headers de quota exposes par le serveur :
  - `X-AI-Daily-Quota-Limit`
  - `X-AI-Daily-Quota-Remaining`
  - `X-AI-Daily-Quota-Reset`
- En depassement : HTTP `429` avec message `Quota journalier IA atteint. Reessaie demain.`
- Le endpoint `GET /ai-usage` expose un tableau de bord JSON in-memory :
  - volume total et par endpoint
  - repartition `openai` vs `mock` (`fallbackRate`)
  - tokens `input/output`
  - estimation du cout USD

## Licence

Projet **prive** — usage reserve aux contributeurs autorises.
