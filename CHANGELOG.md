# Changelog — projet_de_reve

## v1.4 — 2026-07-24

### Modifié
- Les quatre commandes permanentes sont regroupées dans un unique bouton-fleur intégré à l'herbe, avec un panneau d'actions compact.
- L'Observatoire est retiré du menu visible, sans suppression de son module ni des données locales.

### Corrigé
- L'invite de plantation est repositionnée pour ne plus chevaucher le bouton Menu.

## v1.3 — 2026-07-21

### Modifié
- Interface responsive tactile : commandes de 44 px, grille mobile en portrait, barre compacte en paysage et prise en compte des zones sûres.
- Observatoire adapté en feuille défilable sur téléphone et carte centrée sur tablette.
- Canvas haute densité, limité à un ratio de 2 pour rester net sans surcharger le rendu.

### Vérifié
- Interactions tactiles, plantation, Observatoire, console et absence de réseau validés en téléphone portrait `390×844`, paysage `844×390` et tablette `768×1024`.
- Captures de contrôle ajoutées dans `_artifacts/`.

## v1.2 — 2026-07-21

### Retiré
- Sanctuaire nocturne : script, interface, rendu, métriques spécifiques et capture de contrôle, à la demande de l'utilisateur.

### Ajouté
- `_docs/features_non_retenues.md` : registre des idées rejetées pour guider les prochaines analyses et roadmaps.

### Modifié
- Observatoire conservé comme socle d'évaluation, avec un état explicite lorsqu'aucune expérience n'est en cours.

## v1.1 — 2026-07-21

### Ajouté
- Observatoire local : sessions, temps visible/actif/audio, événements catégoriels, export JSON et effacement contrôlé.
- Registre d'expériences réversibles avec interrupteur, mesures d'exposition/activation/durée, verdict humain et recommandation.
- Sanctuaire nocturne : passage débloqué après cinq plantes adultes, scène secrète en parallaxe et interactions musicales.
- Captures de contrôle du Sanctuaire et de l'Observatoire dans `_artifacts/`.

### Modifié
- Navigation, mode calme et gestion clavier adaptés aux scènes et au panneau d'Observatoire.
- Documentation technique enrichie du protocole d'évaluation des fonctionnalités.

### Vérifié
- Syntaxe JavaScript et espaces Git validés.
- Parcours Playwright complet : plantation, déblocage, entrée/sortie, lueurs, métriques, pause/réactivation et verdict.
- Zéro erreur console et zéro requête réseau pendant le parcours automatisé.

## v1.0 — 2026-07-21

### Ajouté
- Rêverie v1.0 : jardin sonore génératif complet (index.html, style.css, js/audio.js, js/garden.js, js/main.js) — plantes fractales déterministes, chant pentatonique Web Audio, cycle jour/nuit, lucioles, étoiles filantes, mode calme, sauvegarde localStorage, accessibilité clavier.
- README.md : documentation utilisateur et technique.
- _docs/prompt_initial.md : prompt d'origine consigné.
- _docs/genese.md : analyse des données ServOMorph et justification du choix du projet.
- _docs/analyse_technique.md : référence architecture, invariants et 10 pistes de features.
- Vérification : node --check OK, rendu validé par capture Playwright sans erreur console.
