# Signals — projet_de_reve   (MAJ 2026-07-21)

## Actions ouvertes
- [P1|ouvert] Réaliser le test humain audio et émotionnel de Rêverie v1.1
  fait quand: l'utilisateur a entendu les notes et la nappe, débloqué le Sanctuaire après cinq plantes adultes, exploré ses lueurs et donné son ressenti
  réf: README.md, js/audio.js, js/sanctuaire.js
- [P2|ouvert] Atteindre un premier seuil d'évaluation du Sanctuaire
  fait quand: l'Observatoire compte au moins 5 expositions sur plusieurs sessions et un verdict humain, puis son export JSON est examiné
  réf: js/observatoire.js, _docs/analyse_technique.md (protocole d'expérience v1.1)
- [P2|ouvert] Choisir la prochaine évolution à partir des usages réels
  fait quand: une nouvelle hypothèse de feature est formulée à partir du journal exporté et de l'avis humain, avec ses critères garder/améliorer/pause avant implémentation
  réf: _docs/analyse_technique.md (sections 7 et 8)

## Dernière session (2026-07-21)

# Session du 2026-07-21

## Décisions prises
- Les évolutions sont désormais traitées comme des expériences réversibles : identifiant, exposition, activation, durée, verdict humain et interrupteur.
- L'Observatoire reste entièrement local et ne conserve ni contenu saisi ni coordonnées précises ; aucune suppression n'est automatique.
- Le Sanctuaire nocturne est la première feature choisie à partir des goûts déclarés : mystère, exploration, profondeur et beaux univers.

## Livrables produits ou modifiés
- `js/observatoire.js` : journal local borné, panneau, export, effacement, évaluation et feature flags.
- `js/sanctuaire.js` : passage après cinq plantes adultes, scène nocturne en parallaxe, lueurs musicales et retour au jardin.
- `index.html`, `style.css`, `js/main.js` : interface, intégration et instrumentation.
- `README.md`, `_docs/analyse_technique.md`, `CHANGELOG.md` : protocole et fonctionnement documentés.
- `_artifacts/reverie-sanctuaire.png`, `_artifacts/reverie-observatoire.png` : captures de contrôle.

## Hypothèses validées / invalidées
- VALIDE : parcours automatisé complet sans erreur console ni requête réseau ; métriques, pause/réactivation et verdict persistent localement.
- VALIDE : le Sanctuaire se débloque après cinq plantes adultes, accepte clics/clavier et rend le contrôle au jardin.
- EN ATTENTE : qualité du rendu audio et impact émotionnel évalués par une personne.

## Prochaine étape exacte
Ouvrir `index.html`, planter au moins cinq graines, attendre leur éclosion, entrer dans le Sanctuaire, écouter et explorer, puis donner son verdict dans l'Observatoire.

## Question bloquante pour la session suivante
Aucune.
