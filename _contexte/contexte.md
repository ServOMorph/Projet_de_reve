# Contexte — projet_de_reve

## Objectif (immuable sauf décision explicite)
Créer le projet de rêve à partir de toutes les données de développeur (2 dossiers et le GitHub).

## Stack / contraintes techniques (stable, rarement modifié)
HTML + CSS + JavaScript vanilla, Web Audio API, canvas 2D. Zéro dépendance, zéro réseau,
fonctionne en file:// (pas de modules ES). Données uniquement en localStorage.

## État actuel (réécrit intégralement à chaque /close)
Rêverie v1.0 fonctionnelle : jardin sonore génératif (plantes fractales déterministes qui
chantent en pentatonique, cycle jour/nuit, lucioles, mode calme, sauvegarde localStorage).
Rendu visuel validé par capture Playwright, zéro erreur console. Audio non testé à l'oreille.
Référence pour la suite : _docs/analyse_technique.md (invariants + 10 pistes de features).

## Décisions structurantes (append only — 10 entrées max, 5 lignes max/entrée, archiver au-delà)
- 2026-07-21 : Initialisation du protocole vibecoding.
- 2026-07-21 : Projet choisi par Claude (analyse dossiers + GitHub) : Rêverie, jardin sonore
  génératif — intersection des fils rouges IA locale, neuroinclusion, musique, sobriété.
- 2026-07-21 : Invariants gravés (analyse_technique.md §8) : file:// hors-ligne, zéro dépendance,
  aucune interaction fausse, mode calme = moins de stimuli, déterminisme graine→plante.
- 2026-07-21 : Squelette des plantes précalculé au constructeur ; ordre des tirages mulberry32
  figé (nouveaux tirages en fin de constructeur uniquement, sinon jardins sauvegardés invalidés).
