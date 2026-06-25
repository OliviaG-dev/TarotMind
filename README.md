<div align="center">

# TarotMind

**Application web de tirage et d'interpretation de tarot** — experience elegante, profil personnalisable, historique local et generation IA via API.

<br />

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=000)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=fff)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=fff)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=for-the-badge&logo=react-router&logoColor=fff)](https://reactrouter.com/)

[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=for-the-badge&logo=nodedotjs&logoColor=fff)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=fff)](https://expressjs.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?style=for-the-badge&logo=openai&logoColor=fff)](https://platform.openai.com/)
[![npm workspaces](https://img.shields.io/badge/npm-workspaces-CB3837?style=for-the-badge&logo=npm&logoColor=fff)](https://docs.npmjs.com/cli/using-npm/workspaces)
[![Husky](https://img.shields.io/badge/Husky-9-000000?style=for-the-badge&logo=husky&logoColor=fff)](https://typicode.github.io/husky/)

[![CI](https://github.com/OliviaG-dev/TarotMind/actions/workflows/ci.yml/badge.svg)](https://github.com/OliviaG-dev/TarotMind/actions/workflows/ci.yml)

</div>

---

## Presentation

TarotMind propose une experience de **consultation guidee** : tu tires tes cartes physiquement (ou comme tu en as l'habitude), tu les saisis dans le **schema visuel** du tirage, puis l'**IA** interprete la combinaison selon ton profil et le ton choisi (spirituel, psychologique, direct).

Le **profil** et l'**historique** sont stockes localement dans le navigateur pour une utilisation immediate. L'API Express expose des endpoints d'interpretation (`POST /interpret`, `POST /question`, `POST /history-insights`) et reste simple a faire evoluer.

> Journal detaille des evolutions : voir [`CHANGELOG.md`](CHANGELOG.md).

## Fonctionnalites

### Parcours utilisateur

- Interface **responsive** (accueil, tirage, profil, question, historique, stats, encyclopedie).
- **En-tetes de page unifies** (`PageIntro`) : titre, texte d'introduction et animations sur chaque section principale.
- **Carte du jour** deterministe avec message quotidien et animation de revelation.
- **7 types de tirage** avec icones dediees et schema interactif (saisie manuelle des arcanes).
- **Question orientee** : meme logique de tirage, avec une question explicite transmise a l'IA.
- **Profil** : preferences utilisateur (statut, objectifs, jeu de cartes) + rappels navigateur optionnels.
- **Historique local** : timeline, detail depliable, notes personnelles, favoris et copie partageable.
- **Analyse de l'historique** via `POST /history-insights` (synthese IA de ton parcours).
- **Statistiques personnelles** : KPIs, cartes frequentes, repartition par type de tirage.
- **Encyclopedie du tarot** : 78 cartes, filtres, recherche, significations des arcanes majeurs.

### Experience & technique

- **Mode sombre/clair** (toggle header, persistance localStorage, preference systeme).
- **Transitions de page** et animations de revelation (interpretations, detail historique, carte du jour).
- **Lecture vocale** des interpretations (Web Speech API, `fr-FR`).
- **Lazy loading** des pages (`React.lazy` + `Suspense`) et **ErrorBoundary** global.
- **Interpretation IA** via OpenAI avec fallback local si l'API est indisponible ou desactivee.
- **Observabilite IA** via `GET /ai-usage` (volume, fallback rate, estimation cout USD, tokens).
- **Quota journalier IA** par utilisateur (header `X-User-Id`, fallback IP) et **rate limiting** (30 req/min/IP).

## Types de tirage

| Tirage | Positions | Usage |
|--------|-----------|-------|
| **1 carte** | Message du moment | Reponse rapide |
| **3 cartes** | Passe / Present / Futur | Ligne du temps |
| **Croix** | 5 positions (situation, obstacle, fondations, objectif, conseil) | Vue d'ensemble |
| **Amour** | Coeur, dynamique, conseil | Relations |
| **Carriere** | Contexte, tension, opportunite | Vie professionnelle |
| **Decision** | Question, piste A, piste B | Choix a eclairer |
| **Compatibilite** | Toi, l'autre, lien, defi, conseil | Dynamique a deux |

Les schemas sont definis dans `client/src/data/spreads.ts` et rendus par `SpreadSchema`.

## Architecture

| Dossier | Role |
|--------|------|
| `client/` | SPA **React** + **React Router**, build **Vite**, typage **TypeScript**. |
| `server/` | **Express**, `GET /health`, endpoints IA, rate limiting, quota journalier et flags d'execution IA. |
| `packages/shared/` | Types et modules **TypeScript** partages entre client et serveur. |

### Structure client (extrait)

```
client/src/
  pages/          # Une page par route (Draw, Question, History, …)
  components/     # Composants reutilisables (Nav, PageIntro, …)
  context/        # Profil, historique, theme
  data/           # Jeu de cartes, tirages, layouts
  lib/            # Appels API, stats, helpers
  hooks/          # Hooks UI (ex. tilt pointeur)
```

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
| `npm test` | Tests unitaires client + integration serveur |
| `npm run test:coverage` | Couverture Vitest (seuil 40 % sur `src/lib/`) |
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

| Lien | Route |
|------|-------|
| Accueil | `/` |
| Carte du jour | `/carte-du-jour` |
| Profil | `/profil` |
| Tirage | `/tirage` |
| Question | `/question` |
| Historique | `/historique` |
| Encyclopedie | `/encyclopedie` |
| Stats | `/statistiques` |
| Toggle theme | bouton lune/soleil (header) |

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

Fichiers couverts notamment : `tarotDeck`, `dailyCard`, `historyInsights`, `stats`, `encyclopediaSearch`, services API.

Tests integration API serveur (Vitest + Supertest) :

```bash
npm run test:server
```

Tests E2E (Playwright) :

```bash
npm run test:e2e
```

Les E2E demarrent un client dedie (`5174`) et une API Express (`4010`, `AI_DISABLED=1`) pour eviter les conflits avec le dev local.

| Fichier | Scenarios |
|---------|-----------|
| `core-user-flows.spec.ts` | Tirage complet, carte du jour stable, profil persistant, analyse historique |
| `real-api-flow.spec.ts` | Flux client ↔ serveur sans mock reseau Playwright |

Au premier lancement E2E, installer le navigateur Playwright :

```bash
cd client
npx playwright install chromium
```

## CI/CD

Pipeline **GitHub Actions** (`.github/workflows/ci.yml`) declenche sur chaque push vers `master` et chaque pull request :

1. `npm ci`
2. `npm run lint`
3. `npm run build`
4. `npm test` (Vitest client + serveur)
5. `npm run test:e2e` (Playwright + Chromium, client proxy vers API Express en `AI_DISABLED=1`)

Badge CI en haut de page : statut du dernier run sur `master`.

Sur `master`, le check **CI** doit etre vert avant merge (regle de protection de branche).

**Pre-commit local (Husky)** : a chaque commit, ESLint corrige les fichiers stages (`lint-staged`) puis lance `npm test`. Les E2E restent executes uniquement en CI.

**Dependabot** : mises a jour npm hebdomadaires (PRs groupees prod / dev) via `.github/dependabot.yml`.

Aucun secret GitHub requis pour la CI actuelle (tests en mode mock, E2E avec interception API ou stub serveur).

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
