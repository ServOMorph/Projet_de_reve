# Historique des validations

## VAL-2026-07-22-UI-002

- Décision : accord explicite reçu (« accord UI-002 »).
- Action autorisée : lecture de l'image indiquée pour analyser l'interface, sans modification.
- Résultat : le fichier n'était pas présent à ce chemin ; aucune image n'a été lue.

## VAL-2026-07-24-UI-003

- Décision : accord explicite reçu (« accord UI-003 »).
- Action autorisée : lecture de la capture dans le projet pour analyser l'interface, sans modification.
- Résultat : capture consultée ; aucune modification de l'image ni d'autres fichiers de l'interface.

## VAL-2026-07-24-UI-004

- Décision : accord explicite reçu (« accord UI-004 »).
- Action autorisée : repérer, lire, modifier et vérifier les fichiers d'interface directement concernés dans le projet.
- Résultat : le menu compact a remplacé les quatre commandes permanentes dans les versions racine et `dist/`. La syntaxe JavaScript et la cohérence des copies ont été vérifiées ; aucune lecture ou écriture hors projet n'a été effectuée.

## VAL-2026-07-24-UI-005

- Décision : accord explicite reçu (« accord UI-005 »).
- Action autorisée : modifier le positionnement de l'invite dans les feuilles de style concernées.
- Résultat : l'invite a été remontée au-dessus du bouton Menu, avec une marge adaptée aux écrans courants et aux écrans mobiles en paysage ; les versions racine et `dist/` restent synchronisées.

## VAL-2026-07-24-UI-006

- Décision : accord explicite reçu (« accord UI-006 »).
- Action autorisée : retirer l'entrée Observatoire du menu visible, sans supprimer sa fonctionnalité ni ses données.
- Résultat : l'entrée et sa liaison au menu ont été retirées dans les versions racine et `dist/`. La syntaxe JavaScript et la cohérence des copies ont été vérifiées.

## VAL-2026-07-24-CLOSE-008

- Décision : accord explicite reçu (« accord CLOSE-008 »).
- Action autorisée : lecture de `close.md` uniquement.
- Résultat : procédure de clôture consultée ; son exécution attend la validation distincte CLOSE-009.

## VAL-2026-07-24-CLOSE-009

- Décision : accord explicite reçu (« accord CLOSE-009 »).
- Action autorisée : exécuter la clôture dans le projet et créer un commit local limité à cette session.
- Résultat : contexte, README et changelog mis à jour ; commit en cours de préparation. Les validations START-001 et PROD-007 restent en attente.
