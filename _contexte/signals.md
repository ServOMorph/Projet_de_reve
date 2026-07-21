# Signals — projet_de_reve   (MAJ 2026-07-21)

## Actions ouvertes
- [P2|ouvert] Choisir et implémenter une première feature parmi les 10 pistes de l'analyse technique
  fait quand: une piste de la section 7 est implémentée, vérifiée via Playwright et committée
  réf: _docs/analyse_technique.md (sections 7 et 8)
- [P2|ouvert] Test humain du rendu sonore réel (le test Playwright ne valide pas l'audio à l'oreille)
  fait quand: l'utilisateur a ouvert index.html, entendu les notes et la nappe, et donné son retour
  réf: js/audio.js, README.md

## Dernière session (2026-07-21)

# Session du 2026-07-21

## Décisions prises
- Projet choisi par Claude après analyse des dossiers ServOMorph et des dépôts GitHub : Rêverie, jardin sonore génératif (vanilla JS, Web Audio, file://, zéro dépendance).
- Squelette des plantes précalculé à la création (déterminisme graine → forme, y compris pendant la croissance).
- Gamme Do majeur pentatonique unique (= La min pent) : aucune note ne peut être fausse.

## Livrables produits ou modifiés
- index.html, style.css, js/audio.js, js/garden.js, js/main.js : application complète, fonctionnelle
- README.md : documentation utilisateur et technique
- _docs/prompt_initial.md : prompt d'origine consigné
- _docs/genese.md : analyse des données et justification du choix
- _docs/analyse_technique.md : référence pour ajouter des features (architecture, invariants, 10 pistes)

## Hypothèses validées / invalidées
- VALIDE : rendu visuel conforme (capture Playwright, jour : 6 plantes fleuries, soleil, herbe) ; zéro erreur console ; syntaxe OK (node --check).
- EN ATTENTE : rendu audio non vérifié à l'oreille (Playwright headless muet).

## Prochaine étape exacte
Test humain (visuel + audio) en ouvrant index.html, puis choix d'une première feature dans _docs/analyse_technique.md section 7.

## Question bloquante pour la session suivante
Aucune.
