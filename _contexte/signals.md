# Signals — projet_de_reve   (MAJ 2026-07-24)

## Actions ouvertes
- [P1|ouvert] Diagnostiquer le son absent sur la production Netlify
  fait quand: la cause est reproduite ou écartée sur `https://peppy-travesseiro-7ac258.netlify.app/` et une correction locale précise est identifiée
  réf: `validation.md` (VAL-2026-07-24-PROD-007), js/audio.js, README.md
- [P1|ouvert] Réaliser le test humain audio de Rêverie après le diagnostic de production
  fait quand: l'utilisateur a entendu les notes et la nappe sur la version corrigée, puis donné son retour
  réf: README.md, js/audio.js
- [P2|ouvert] Proposer la prochaine feature à partir des usages et des idées rejetées
  fait quand: une hypothèse de feature, ses critères garder/améliorer/pause et son incompatibilité éventuelle avec les rejets sont documentés avant implémentation
  réf: _docs/analyse_technique.md (sections 7 et 8), _docs/features_non_retenues.md

## Dernière session (2026-07-24)

# Session du 2026-07-24

## Décisions prises
- Les commandes visibles sont regroupées dans un unique bouton-fleur placé dans l'herbe.
- L'Observatoire est retiré du menu ; son module et ses données locales sont conservés.

## Livrables produits ou modifiés
- `index.html`, `style.css`, `js/main.js` : menu-fleur compact, états Son/Mode calme, fermeture accessible et position de l'invite corrigée.
- `dist/` : copie de déploiement synchronisée avec la version principale.
- `README.md`, `CHANGELOG.md`, `_contexte/` : documentation et suivi alignés.

## Hypothèses validées / invalidées
- VALIDE : la syntaxe JavaScript et la synchronisation racine / `dist/` sont vérifiées après la refonte du menu.
- EN ATTENTE : diagnostic du son sur Netlify ; validation réseau PROD-007 non accordée à la clôture.
- EN ATTENTE : évaluation humaine du rendu audio après ce diagnostic.

## Prochaine étape exacte
Obtenir l'accord PROD-007, examiner la production Netlify en lecture seule, puis corriger et tester le son selon la cause identifiée.

## Question bloquante pour la session suivante
Accord PROD-007 pour examiner la production ?
