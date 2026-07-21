# Analyse technique — Rêverie (jardin sonore génératif)

Document de référence pour ajouter des features sans casser l'existant.
État au 2026-07-21 (v1.0).

## 1. Vue d'ensemble

Application 100 % statique, vanilla JS, aucune dépendance, fonctionne en `file://`.

```
index.html          Structure : canvas plein écran + titre + 3 boutons + invite
style.css           Habillage UI (le canvas est dessiné entièrement en JS)
js/audio.js         Module Son (IIFE, global `Son`) — Web Audio
js/garden.js        Globals : mulberry32, hexVersRgb, melange, rgbCss,
                    Ciel (IIFE), classe Plante, classe Luciole, TEINTES
js/observatoire.js  Module Observatoire — métriques locales, expériences, export
js/main.js          IIFE privée : boucle rAF, entrées, sauvegarde, rendu ciel/sol
```

Chargement par balises `<script>` classiques (pas de modules ES : ils sont
bloqués en `file://`). Ordre de chargement obligatoire : observatoire → audio →
garden → main.
Contrainte à préserver pour toute nouvelle feature : **zéro CDN, zéro réseau,
zéro build**.

## 2. Boucle principale (js/main.js)

`boucle(maintenant)` via `requestAnimationFrame` :

1. `dt` borné à 50 ms (évite les sauts après un onglet en arrière-plan) ;
2. `phase` (0..1) avance : un cycle jour/nuit = `DUREE_CYCLE` (180 s, ×1.6 en mode calme) ;
3. `Ciel.etat(phase)` → `{haut, bas, lum}` (couleurs RGB + lumière 0..1) ;
4. rendu dans l'ordre : ciel (dégradé, étoiles, soleil, lune, étoile filante) →
   sol + herbe → plantes (croissance, chant, dessin) → lucioles → `Son.accorderDrone`.

État module (fermé dans l'IIFE) : `temps`, `phase`, `plantes[]`, `lucioles[]`,
`etoiles[]`, `modeCalme`, `sonCoupe`, `interactionFaite`.
**Point d'attention** : cet état n'est pas exposé. Pour une feature qui doit y
accéder de l'extérieur (debug, tests, extension), exposer un objet `Reverie`
volontairement minimal plutôt que de sortir les variables une à une.

Constantes clés : `DUREE_CYCLE = 180`, `PLANTES_MAX = 40`,
`CLE_STOCKAGE = "reverie.jardin.v1"` (versionnée : toute rupture de format de
sauvegarde ⇒ bump v2 + migration ou abandon silencieux des vieilles données).

`solY(x)` définit la ligne d'horizon (deux sinus superposés, ~82 % de la hauteur).
Toute entité posée « au sol » doit appeler `solY`.

## 3. Plantes (js/garden.js)

### Génération déterministe
`new Plante(graine, xFrac, adulte)` : la graine (uint32) alimente `mulberry32`.
Ordre des tirages du constructeur (à ne pas réordonner, sinon toutes les
plantes sauvegardées changent d'apparence) :
hauteur → profMax → teinte → petales → noteBase → souplesse → phaseVent →
squelette (`_construire`, récursif).

Le squelette est **précalculé une fois** (`this.racine` : arbre de nœuds
`{decalage, facteur, noeud}` ; feuilles `{fleur: rand, enfants: []}`).
Le dessin (`_branche`) ne consomme plus d'aléa : croissance et vent sont les
seuls paramètres variables. C'est ce qui garantit qu'une plante ne change pas
de forme en poussant.

### Cycle de vie
- `pousser(dt)` : croissance 0→1 en ~6 s ; renvoie les seuils franchis
  (0.35/0.6/0.8/1.0) → main.js déclenche notes puis arpège d'éclosion à 1.0 ;
- `mourante = true` → fondu `opacite` (0.4/s) → filtrée de `plantes[]` → resauvegarde ;
- la nuit, les fleurs gagnent un halo (gradient radial) proportionnel à `1-lum`.

### Sauvegarde
`localStorage[CLE_STOCKAGE]` = `[{g: graine, x: xFrac}]` (plantes non mourantes
uniquement). Restauration : plantes recréées adultes. Toute nouvelle propriété
persistante s'ajoute dans ces objets (garder des clés courtes).

## 4. Audio (js/audio.js)

Graphe : voix → `master` → (`delay` 0.46 s, réinjection 0.32 → `filtre`) +
`master` → `filtre` (lowpass 2600 Hz) → destination. Drones jour/nuit branchés
directement sur `filtre`.

- Gamme : Do majeur pentatonique, 13 degrés sur ~2,5 octaves depuis Do3
  (`GAMME`). Do pent = La min pent : la nappe glisse Do+Sol (jour) ↔ La+Mi
  (nuit) sans jamais frotter avec les notes des plantes.
- `note(indice, {duree, volume, dans})` : 2 oscillateurs (sine + triangle
  désaccordé de 6 cents), enveloppe attaque 30 ms / release exponentielle.
  Plafond `VOIX_MAX = 10` voix simultanées — à respecter pour toute nouvelle
  source sonore (ou augmenter consciemment).
- `eclosion(indiceBase)` : arpège 0-2-4 (tierce/quinte pentatoniques).
- L'AudioContext n'existe qu'après le premier geste utilisateur
  (`premiereInteraction` → `Son.demarrer`) — contrainte navigateur (autoplay).
  Toute nouvelle feature sonore doit tolérer `ctx === null` (les méthodes
  publiques le font déjà en sortie silencieuse).

## 5. UI et accessibilité

- Toute touche clavier plante une graine (sauf Tab/Alt/Ctrl/Meta et
  Entrée/Espace sur un bouton) — principe cause→effet hérité d'IA-TSA,
  à préserver : aucune touche ne doit devenir « une erreur ».
- `prefers-reduced-motion` ⇒ mode calme activé par défaut.
- Mode calme : vent réduit (0.25), pas de lucioles ni d'étoiles filantes,
  cycle ×1.6, volume ×0.45, chants espacés (+8 s). Toute feature nouvelle doit
  définir son comportement en mode calme (règle : moins de stimuli, jamais plus).
- Boutons : état via `aria-pressed` ; le titre s'estompe 6 s après la première
  interaction.

## 6. Vérification

- Syntaxe : `node --check js/*.js`.
- Rendu réel : script Playwright Python (voir scratchpad de session ou à
  recréer) : ouvrir `file:///D:/ServOMorph/Projet_de_reve/index.html`, planter
  par clics + clavier, attendre ~7 s, capturer, vérifier zéro erreur console.
  À rejouer après toute feature (c'est le seul filet : pas de tests unitaires).

### Protocole d'expérience v1.1

`Observatoire` stocke sous `reverie.observatoire.v1` des durées et événements
catégoriels bornés. Il ne stocke ni touche saisie ni coordonnées. Une expérience
doit être enregistrée dans `EXPERIENCES`, encapsulée dans son propre module et
interroger `Observatoire.estActive(id)` avant tout effet.

Cycle de décision : exposition → activation → durée → verdict humain. Après au
moins 5 expositions et 3 sessions, une recommandation est calculée. Elle ne
supprime jamais le code : « mettre en pause » désactive immédiatement l'expérience,
puis une suppression du code reste une décision explicite et documentée.

Les idées déjà écartées sont consignées dans `_docs/features_non_retenues.md` et doivent
être prises en compte avant de proposer une nouvelle expérience.

### Responsive et tactile v1.3

Le canvas garde ses coordonnées en pixels CSS, mais son buffer est multiplié par
`min(devicePixelRatio, 2)` pour rester net sur les écrans mobiles. Toute nouvelle interface
doit respecter une cible tactile d'au moins 40 px, les zones sûres du téléphone et ces trois
formats de contrôle : téléphone portrait `390×844`, téléphone paysage `844×390`, tablette
portrait `768×1024`. En portrait mobile, les commandes forment une grille de deux colonnes et
l'Observatoire une feuille basse défilable ; sur tablette, l'Observatoire redevient une carte
centrée ; en paysage, les commandes retrouvent une ligne compacte.

## 7. Pistes de features (par coût croissant)

Chaque piste indique ses points d'insertion.

1. **Saisons** : un compteur de cycles dans main.js module les `TEINTES`
   disponibles, la couleur du sol et la densité d'herbe. Insertion : constante
   dans garden.js + interpolation dans `dessinerSol`.
2. **Pluie / météo** : nouvel effet dans `dessinerCiel` + bruit filtré dans
   audio.js (buffer de bruit blanc → lowpass) ; la pluie accélère la croissance
   (`pousser`). Désactivée ou très douce en mode calme.
3. **Papillons de jour** : symétrique des `Luciole` (classe sœur, actifs quand
   `lum > 0.5`, attirés par `plante.fleurs`).
4. **Nouvelles familles de plantes** : aujourd'hui un seul archétype fractal.
   Ajouter `this.famille` (tiré de la graine) et des variantes de
   `_construire`/`_dessinerFleurs` (saule, graminée, fleur unique haute).
   Attention à l'ordre des tirages : ajouter les nouveaux tirages **en fin**
   de constructeur pour ne pas invalider les jardins sauvegardés.
5. **Gammes au choix** : `DEMI_TONS` alternatifs dans audio.js (min pent
   japonaise hirajoshi, majeur…) + bouton cyclique. Garder des gammes sans
   dissonance possible.
6. **Export d'image** : `canvas.toBlob` + lien de téléchargement (« garder un
   souvenir du jardin »). Aucun impact sur le reste.
7. **Mode borne / kiosque** (usage tiers-lieu type Robert-IA) : plein écran,
   retour au jardin vierge après N minutes d'inactivité, UI masquée.
8. **Enregistrement audio** : `MediaStreamAudioDestinationNode` + `MediaRecorder`
   pour exporter quelques minutes du chant du jardin en webm/ogg.
9. **Jardin partageable sans serveur** : sérialiser `[{g,x}]` en base64 dans
   l'ancre d'URL (`#…`) — le lien recrée le jardin, toujours zéro réseau.
10. **Constellations mémorielles** : chaque plante morte laisse une étoile à sa
    teinte dans le ciel (persistée en localStorage) — le jardin se souvient.

## 8. Invariants à ne jamais casser

1. Fonctionne en double-cliquant `index.html` (file://, hors-ligne).
2. Zéro dépendance, zéro réseau, zéro tracking, données uniquement en localStorage.
3. Aucune interaction ne peut être « fausse » (ni visuellement ni musicalement).
4. Le mode calme réduit toujours les stimuli, il n'en ajoute jamais.
5. Déterminisme : même graine ⇒ même plante, y compris après rechargement.
6. Pas d'emojis dans le code ; UI et code commentés en français.
7. Toute mesure d'usage reste locale, lisible, exportable et effaçable ; aucun
   contenu saisi ni coordonnée précise n'est conservé.
8. Toute expérience peut être mise en pause sans casser le jardin ni perdre son
   historique ; aucune suppression automatique de code ou de données.
