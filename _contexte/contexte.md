# Contexte — projet_de_reve

## Objectif (immuable sauf décision explicite)
Créer le projet de rêve à partir de toutes les données de développeur (2 dossiers et le GitHub).

## Stack / contraintes techniques (stable, rarement modifié)
HTML + CSS + JavaScript vanilla, Web Audio API, canvas 2D. Zéro dépendance, zéro réseau,
fonctionne en file:// (pas de modules ES). Données uniquement en localStorage.

## État actuel (réécrit intégralement à chaque /close)
Rêverie v1.1 fonctionnelle : jardin sonore génératif, Observatoire d'usage local et première
expérience réversible, le Sanctuaire nocturne. Le journal mesure sessions, durées et catégories
d'actions sans contenu saisi ni coordonnées précises. Le parcours visuel, la persistance et
l'absence de réseau sont validés par Playwright ; l'audio et l'impact émotionnel restent à tester
humainement. Référence pour la suite : `_docs/analyse_technique.md`.

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
- 2026-07-21 : Le Sanctuaire nocturne devient la première expérience v1.1 et ouvre l'évolution de
  Rêverie vers des mondes plus mystérieux, profonds et explorables.
