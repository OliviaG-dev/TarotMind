# TarotMind - Nouvelles fonctionnalites

## 1. Carte du jour

**Page** : `/carte-du-jour`
**Nav** : "Carte du jour"

Chaque jour, une carte des arcanes majeurs est tiree automatiquement avec un message d'inspiration personnalise. La carte est deterministe : si tu reviens dans la journee, tu retrouves la meme. Le lendemain, une nouvelle carte apparait.

- 22 messages differents a l'endroit et 22 renverses (44 au total)
- Animation de revelation au chargement
- Affichage des mots-cles de la carte
- Badge "Renversee" si la carte est tiree a l'envers
- Date du jour en francais
- Persistance dans le localStorage pour garantir la stabilite intra-journee

---

## 2. Detail d'un tirage dans l'historique

**Page** : `/historique` (section Timeline)

Chaque tirage de la timeline est maintenant cliquable. Un clic deroule le detail complet :

- **Cartes** : chaque carte avec sa position, son nom et ses mots-cles
- **Note personnelle** : le texte que tu as ecrit apres le tirage (voir section Journal)
- **Interpretation complete** : l'integralite du texte genere par l'IA
- **Bouton Copier** : copie l'ensemble du tirage (date, type, cartes, interpretation) dans le presse-papier
- **Bouton Favoris** : ajouter ou retirer le tirage des favoris

Un second clic referme le detail. L'animation de deroulement est fluide (slide + fade).

---

## 3. Mots-cles enrichis pour les arcanes mineurs

**Fichier** : `client/src/data/tarotDeck.ts`

Les 56 arcanes mineurs avaient des mots-cles generiques (`mineur`, `quotidien`). Chaque carte a maintenant 3 mots-cles specifiques et uniques. Par exemple :

- As de Coupes : amour naissant, intuition, offrande
- 5 d'Epees : defaite, humiliation, lecon
- Roi de Deniers : reussite materielle, influence, stabilite
- Cavalier de Batons : passion, energie, leadership

Cela ameliore significativement la qualite des interpretations IA, qui peut maintenant s'appuyer sur des mots-cles pertinents pour chaque carte mineure.

---

## 4. Export / partage d'un tirage

**Acces** : bouton "Copier" dans le detail d'un tirage (historique)

En cliquant sur "Copier", l'ensemble du tirage est formate en texte lisible et copie dans le presse-papier :

```
TarotMind - Tirage
Date : 8 avr. 2026 a 14:30
Type : 3 cartes - passe / present / futur
Ton : spirituel

Cartes :
  Passe : Le Mat
  Present : La Force (renversee)
  Futur : L'Etoile

Interpretation :
[texte complet]
```

Tu peux ensuite le coller dans un message, un document ou une note.

---

## 5. Mode sombre

**Acces** : bouton lune/soleil dans le header (a droite de la navigation)

Un toggle dans le header permet de basculer entre le theme clair et le theme sombre. Le choix est persiste dans le localStorage et respecte aussi la preference systeme (`prefers-color-scheme`) au premier chargement.

Le mode sombre utilise une palette violette/noire avec :
- Fond : `#1a1225`
- Texte : `#c5bfcf` / `#eee8f4`
- Accent : `#c98de6` / `#b06fd4`
- Bordures : `#3a2d4a`

Tous les composants, pages, header et body s'adaptent automatiquement grace aux variables CSS.

---

## 6. Animations et transitions

**Portee** : toutes les pages

- **Fade-in de page** : chaque page apparait avec une animation douce (opacite + leger glissement vers le haut, 350ms)
- **Revelation des interpretations** : les blocs d'interpretation (tirage, question, detail historique) apparaissent avec un effet de revelation (opacite + slide, 400ms)
- **Detail historique** : le panneau de detail se deroule avec un slide-down anime (250ms)
- **Carte du jour** : animation speciale de revelation (800ms, avec un leger scale)

---

## 7. Journal personnel / notes

**Acces** : dans le detail de chaque tirage (historique)

Quand tu ouvres le detail d'un tirage dans l'historique, tu trouves un champ "Note personnelle" avec un textarea. Tu peux y ecrire tes reflexions, tes ressentis ou ce que la lecture t'a inspire.

- Le texte est sauvegarde dans le localStorage avec le tirage
- Un bouton "Enregistrer" confirme la sauvegarde avec un feedback visuel ("Enregistre !")
- La note est affichee en italique dans le detail si elle existe
- Chaque tirage peut avoir sa propre note

---

## 8. Tirages favoris / epingles

**Acces** : bouton etoile dans le detail d'un tirage (historique)

Tu peux marquer un tirage comme favori en cliquant sur le bouton etoile. Les tirages favoris sont signales dans la timeline par une etoile doree a cote du type de tirage.

- Toggle : un clic ajoute aux favoris, un second clic retire
- L'etat est persiste avec le tirage dans le localStorage
- Le compteur de favoris est affiche dans la page Statistiques
- Dans les selects de comparaison, les favoris sont aussi visibles

---

## 9. Statistiques personnelles

**Page** : `/statistiques`
**Nav** : "Stats"

Une page dediee avec des statistiques visuelles sur ton parcours :

### KPIs (chiffres cles)
- Nombre total de tirages
- Nombre de questions posees
- Nombre de favoris
- Nombre de semaines actives

### Cartes les plus frequentes
Un graphique en barres horizontales montrant les 10 cartes les plus souvent tirees, avec un rendu proportionnel et un degrade accent.

### Repartition par type de tirage
Une grille de cartes montrant combien de fois chaque type de tirage a ete utilise (1 carte, 3 cartes, croix, amour, etc.).

Si aucun tirage n'existe, un message invite a faire le premier tirage.

---

## 10. Tirage a deux / compatibilite

**Type de tirage** : "Compatibilite"

Un nouveau type de tirage a 5 positions, disponible dans les pages Tirage et Question :

| Position | Label |
|----------|-------|
| 1 | Toi |
| 2 | L'autre |
| 3 | Ce qui vous relie |
| 4 | Le defi |
| 5 | Conseil |

Le layout utilise le schema en croix (cross5). L'IA interprete les cartes dans le contexte d'une dynamique relationnelle entre deux personnes.

---

## 11. Notifications / rappels

**Acces** : toggle dans la page Profil (section "Rappels")

Tu peux activer un rappel quotidien via les notifications du navigateur. Quand active :

- Une demande de permission de notification est envoyee au navigateur
- Un rappel est envoye une fois par jour (si la page est ouverte mais en arriere-plan)
- Le message invite a consulter la carte du jour
- Le toggle est persiste dans le localStorage
- Tu peux desactiver a tout moment en decochant

Note : les notifications ne fonctionnent que si le navigateur les supporte et si tu as donne la permission.

---

## 12. Encyclopedie du Tarot

**Page** : `/encyclopedie`
**Nav** : "Encyclopedie"

Une page de reference pour explorer les 78 cartes du tarot :

### Filtres
6 onglets pour filtrer : Toutes, Arcanes majeurs, Coupes, Batons, Epees, Deniers.

### Recherche
Un champ de recherche pour trouver une carte par nom ou mot-cle.

### Cartes
Chaque carte est affichee dans une grille responsive avec :
- Son nom
- Un badge "Majeur" ou "Mineur"
- Ses mots-cles en capsules

### Detail (clic)
Un clic sur une carte majeure revele sa signification :
- **A l'endroit** : interpretation positive
- **Renversee** : interpretation inversee

Les 22 arcanes majeurs ont des significations detaillees. Les mineurs affichent un texte explicatif general.

---

## 13. Systeme de compte utilisateur (preparation)

**Fichiers** : `server/src/db/schema.sql`, `server/src/routes/auth.ts`

La structure pour un systeme de comptes utilisateurs est preparee :

### Schema SQL (PostgreSQL)
- Table `users` : id, email, password_hash, created_at
- Table `profiles` : user_id, relationship_status, gender, work_situation, goals, deck_preference
- Table `draws` : user_id, spread_id, cards (JSONB), interpretation, question, note, favorite
- Index sur user_id et created_at

### Routes auth (placeholder)
- `POST /auth/register` : creation de compte
- `POST /auth/login` : connexion
- `GET /auth/me` : profil connecte

Ces routes retournent actuellement un 501 (Not Implemented). Pour activer : installer `pg`, `bcrypt` et `jsonwebtoken`, configurer la connexion PostgreSQL, et implementer la logique.

---

## 14. Interpretation vocale

**Acces** : bouton "Ecouter" en haut de chaque interpretation

Un bouton apparait au-dessus de chaque texte d'interpretation (tirage, question, historique). En cliquant :

- Le texte est lu a voix haute via la Web Speech API (`speechSynthesis`)
- La langue est configuree en francais (`fr-FR`)
- La vitesse de lecture est legerement ralentie (0.95x) pour une experience plus meditative
- Un second clic sur "Arreter" stoppe la lecture
- Le bouton change d'icone et de texte selon l'etat (play/stop)

Si le navigateur ne supporte pas la synthese vocale, le bouton ne s'affiche pas.

---

## 15. Lazy loading des pages

**Fichier** : `client/src/App.tsx`

Toutes les pages sont maintenant chargees en lazy loading via `React.lazy` + `Suspense` :

- Le bundle initial est passe de ~276kB a ~232kB (gzip: ~74kB)
- Chaque page est un chunk separe charge a la demande
- Un indicateur "Chargement..." s'affiche pendant le chargement d'une page
- Les chunks sont nommes automatiquement par Vite

---

## 16. Gestion d'erreurs globale (ErrorBoundary)

**Fichier** : `client/src/components/ErrorBoundary.tsx`

Un composant `ErrorBoundary` enveloppe toute l'application. Si une erreur de rendu React survient :

- L'ecran blanc est remplace par un ecran de secours
- Le titre "Oups, quelque chose s'est mal passe" s'affiche
- Le message d'erreur est affiche
- Un bouton "Recharger la page" permet de relancer l'app
- L'erreur est loguee dans la console pour le debug

---

## 17. Tests unitaires (Vitest)

**Framework** : Vitest
**Fichiers** : `*.test.ts` dans `client/src/`

12 tests unitaires couvrent les fonctions critiques :

### tarotDeck.test.ts (8 tests)
- Verification des 22 arcanes majeurs et 56 mineurs
- Verification que chaque carte a un id, un nom et des mots-cles non generiques
- Verification de `getDeckCards` (majors_only, minors_only, majors_and_minors)
- Verification de `getCardById`
- Verification de `isMajorArcanum`

### dailyCard.test.ts (3 tests)
- La carte du jour retourne une carte valide avec mots-cles
- La meme carte est retournee pour les appels du meme jour
- Le message quotidien est un texte non vide

### historyInsights.test.ts (1 test + 1 avec donnees)
- Message par defaut quand l'historique est vide
- Generation d'insights avec des tirages reels

Commande : `npm test` dans le dossier `client/`.

---

## 18. Rate limiting serveur

**Fichier** : `server/src/lib/rateLimit.ts`

Un middleware de rate limiting protege les endpoints IA :

- **Limite** : 30 requetes par minute par adresse IP
- **Endpoints proteges** : `/interpret`, `/question`, `/history-insights`
- **Headers HTTP** : `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- **Reponse 429** : "Trop de requetes. Reessaie dans quelques minutes."
- **Nettoyage automatique** : les entrees expirees sont supprimees toutes les 60 secondes
- **Zero dependance** : implementation en memoire, sans package externe

---

## Navigation mise a jour

La barre de navigation comprend maintenant :

| Lien | Page |
|------|------|
| Accueil | `/` |
| Carte du jour | `/carte-du-jour` |
| Profil | `/profil` |
| Tirage | `/tirage` |
| Question | `/question` |
| Historique | `/historique` |
| Encyclopedie | `/encyclopedie` |
| Stats | `/statistiques` |
| Toggle theme | (bouton lune/soleil) |

## Page d'accueil mise a jour

La section "Comment ca marche" affiche maintenant 6 fonctionnalites en grille 3x2 :

1. Carte du jour
2. Tire tes cartes
3. Pose ta question
4. Ton espace perso
5. Ton parcours
6. Encyclopedie
