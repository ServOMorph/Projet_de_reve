# Contexte — projet_de_reve

## Objectif (immuable sauf décision explicite)
Créer le projet de rêve à partir de toutes les données de développeur (2 dossiers et le GitHub).

## Stack / contraintes techniques (stable, rarement modifié)
HTML + CSS + JavaScript vanilla, Web Audio API, canvas 2D. Zéro dépendance, zéro réseau,
fonctionne en file:// (pas de modules ES). Données uniquement en localStorage.

## État actuel (réécrit intégralement à chaque /close)
Rêverie v1.3 fonctionnelle : jardin sonore génératif et Observatoire d'usage local, prêt à
évaluer une future expérience, avec interface tactile responsive et canvas haute densité. Le
Sanctuaire nocturne a été retiré et son rejet est mémorisé dans `_docs/features_non_retenues.md`.
Le jardin, la persistance, l'Observatoire et l'absence de réseau sont validés localement sur
téléphone portrait/paysage et tablette ; l'audio et l'impact émotionnel restent à tester humainement.

## Décisions structurantes (append only — 10 entrées max, 5 lignes max/entrée, archiver au-delà)
- 2026-07-21 : Initialisation du protocole vibecoding.
- 2026-07-21 : Projet choisi par Claude (analyse dossiers + GitHub) : Rêverie, jardin sonore
  génératif — intersection des fils rouges IA locale, neuroinclusion, musique, sobriété.
- 2026-07-21 : Invariants gravés (analyse_technique.md §8) : file:// hors-ligne, zéro dépendance,
  aucune interaction fausse, mode calme = moins de stimuli, déterminisme graine→plante.
- 2026-07-21 : Squelette des plantes précalculé au constructeur ; ordre des tirages mulberry32
  figé (nouveaux tirages en fin de constructeur uniquement, sinon jardins sauvegardés invalidés).
- 2026-07-21 : Les usages sont mesurés localement et de façon transparente ; aucune donnée brute
  de saisie ou de position, aucun réseau, export et effacement contrôlés par l'utilisateur.
- 2026-07-21 : Toute nouvelle expérience doit être isolable, mesurable et réversible ; les données
  peuvent recommander garder/améliorer/pause mais aucune feature n'est supprimée automatiquement.
- 2026-07-21 : Le Sanctuaire nocturne est retiré à la demande de l'utilisateur. Son concept est
  consigné comme rejeté et ne doit pas être reproposé tel quel dans une roadmap.
- 2026-07-21 : Rêverie est tactile et responsive : cibles de 44 px, zones sûres, grille portrait,
  barre paysage et Observatoire adapté à chaque format ; le canvas est net jusqu'à un ratio 2.
