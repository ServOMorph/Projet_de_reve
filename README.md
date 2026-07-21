# Rêverie — jardin sonore génératif

Un jardin vivant dans votre navigateur. Chaque graine plantée devient une plante unique, générée procéduralement, qui **chante** : chaque fleur porte une note d'une gamme pentatonique — impossible de jouer faux. Le jour se lève, le soleil traverse le ciel, la nuit tombe, les fleurs deviennent des lanternes, les lucioles sortent, parfois une étoile file.

**100 % local. Hors-ligne. Zéro dépendance. Zéro tracking.**

## Lancer

Double-cliquez sur `index.html`. C'est tout.

(Fonctionne en `file://`, aucun serveur, aucun `npm install`, aucun CDN.)

## Jouer

| Geste | Effet |
|---|---|
| Clic / toucher | Plante une graine à cet endroit |
| N'importe quelle touche du clavier | Plante une graine (cause → effet, sans erreur possible) |
| 🔊 Son | Coupe / remet le son |
| 🌿 Mode calme | Moins de mouvement, pas de lucioles ni d'étoiles filantes, son plus doux, cycle ralenti |
| Observatoire | Affiche vos durées, usages et l'évaluation des expériences |
| ✦ Nouveau jardin | Les plantes retournent doucement à la terre |

Le jardin est sauvegardé dans le `localStorage` du navigateur — il vous attend d'une visite à l'autre. Rien ne quitte jamais votre machine.

Après l'éclosion de cinq plantes, un passage apparaît au centre du jardin. Il mène au **Sanctuaire nocturne**, un paysage secret en profondeur où chaque clic éveille une lueur et une note. Cette expérience peut être mise en pause depuis l'Observatoire.

## Observatoire local

Rêverie mesure ce qui aide réellement à faire évoluer l'application : nombre de sessions, temps visible, temps actif, temps avec le son, catégories d'interactions et usage des expériences. Le journal ne conserve jamais les touches saisies, les coordonnées précises du pointeur ou du contenu personnel.

- stockage exclusivement dans `localStorage` sous `reverie.observatoire.v1` ;
- aucune requête réseau ni tracking externe ;
- historique borné à 60 sessions, 90 jours et 500 événements catégoriels ;
- export JSON lisible pour une analyse ou un article de recherche ;
- effacement complet depuis l'interface ;
- verdict humain « À garder / À améliorer / À mettre en pause » ;
- recommandation automatique seulement après assez d'usage, sans suppression automatique.

## Ce qui se passe sous le capot

- **Plantes génératives déterministes** : chaque plante naît d'une graine entière ; un générateur `mulberry32` en dérive son squelette fractal (hauteur, branches, pétales, teinte, souplesse, note). Le squelette est précalculé une fois, puis animé par le vent.
- **Musique émergente** : Web Audio API pure. Gamme de Do majeur pentatonique (= La mineur pentatonique) ; nappe harmonique qui glisse de Do (jour) vers La mineur (nuit) ; écho à réinjection ; timbre de cloche douce (deux oscillateurs désaccordés). Les fleurs écloses chantent au gré du vent.
- **Cycle jour/nuit** (~3 minutes) : dégradés interpolés entre 8 étapes (aube, matin, couchant, crépuscule…), soleil et lune sur le même arc, étoiles scintillantes.
- **Accessibilité** : pilotable entièrement au clavier, `prefers-reduced-motion` respecté (active le mode calme par défaut), stimuli réduits en mode calme — pensé pour pouvoir servir aussi en accompagnement TSA.
- **Expériences réversibles** : chaque nouveauté possède un identifiant, des mesures d'exposition et d'usage, un interrupteur et un verdict humain. Une expérience en pause disparaît du jardin sans effacer son historique.

## État actuel

v1.1 fonctionnelle : jardin v1.0, Observatoire d'usage local et première expérience réversible,
le Sanctuaire nocturne. Parcours visuel et persistance vérifiés par Playwright sans erreur console
ni requête réseau ; rendu audio à valider à l'oreille. Pistes d'évolution :
[_docs/analyse_technique.md](_docs/analyse_technique.md).

## Pourquoi ce projet

Voir [_docs/genese.md](_docs/genese.md) — le choix est né de l'analyse des projets ServOMorph : IA locale, neuroinclusion, musique, solidarité, sobriété numérique. Rêverie est le point où ces fils se croisent, versant rêve.

Le prompt d'origine est conservé dans [_docs/prompt_initial.md](_docs/prompt_initial.md).

## Licence

MIT — comme le reste de l'écosystème ServOMorph.
