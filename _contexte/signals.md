# Signals — projet_de_reve   (MAJ 2026-07-21)

## Actions ouvertes
- [P1|ouvert] Réaliser le test humain audio de Rêverie
  fait quand: l'utilisateur a ouvert `index.html`, entendu les notes et la nappe, et donné son retour
  réf: README.md, js/audio.js
- [P2|ouvert] Recueillir une première base d'usage dans l'Observatoire
  fait quand: plusieurs sessions ont été réalisées, le journal local est exporté et ses signaux sont relus avec l'utilisateur
  réf: js/observatoire.js, README.md
- [P2|ouvert] Proposer la prochaine feature à partir des usages et des idées rejetées
  fait quand: une hypothèse de feature, ses critères garder/améliorer/pause et son incompatibilité éventuelle avec les rejets sont documentés avant implémentation
  réf: _docs/analyse_technique.md (sections 7 et 8), _docs/features_non_retenues.md

## Dernière session (2026-07-21)

# Session du 2026-07-21

## Décisions prises
- Les évolutions restent des expériences réversibles : identifiant, exposition, activation, durée, verdict humain et interrupteur.
- L'Observatoire reste entièrement local et ne conserve ni contenu saisi ni coordonnées précises ; aucune suppression n'est automatique.
- Le Sanctuaire nocturne est retiré du jeu à la demande de l'utilisateur. Son rejet est documenté afin d'orienter les prochaines roadmaps.
- L'interface mobile privilégie les cibles tactiles, les zones sûres et la lisibilité plutôt qu'une simple réduction du bureau.

## Livrables produits ou modifiés
- `js/observatoire.js` : journal local borné, panneau, export, effacement, évaluation et feature flags.
- `index.html`, `style.css`, `js/main.js` : jardin rétabli sans le Sanctuaire.
- `style.css`, `js/main.js` : interface responsive mobile/tablette et canvas haute densité.
- `_docs/features_non_retenues.md` : mémoire structurée du concept rejeté et règle pour les prochaines propositions.
- `README.md`, `_docs/analyse_technique.md`, `CHANGELOG.md` : documentation alignée.
- `_artifacts/reverie-mobile-portrait.png`, `_artifacts/reverie-mobile-paysage.png`, `_artifacts/reverie-tablette-portrait.png` : captures de contrôle responsive.

## Hypothèses validées / invalidées
- VALIDE : le jardin et l'Observatoire sont vérifiés localement sans erreur console ni requête réseau.
- VALIDE : l'Observatoire affiche explicitement qu'aucune expérience n'est en cours après retrait.
- VALIDE : les interactions tactiles, les commandes et l'Observatoire fonctionnent en téléphone portrait/paysage et tablette portrait.
- EN ATTENTE : qualité du rendu audio évaluée par une personne ; premier journal d'usage réel.

## Prochaine étape exacte
Ouvrir `index.html` sur téléphone, écouter le jardin et utiliser l'Observatoire sur plusieurs sessions ; avant toute proposition, lire `features_non_retenues.md`.

## Question bloquante pour la session suivante
Aucune.
