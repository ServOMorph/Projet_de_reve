# Genèse — pourquoi ce projet

## Ce que l'analyse a révélé

En parcourant `C:\Users\raph6\Documents\ServOMorph`, `D:\ServOMorph` et la centaine de dépôts GitHub (publics et privés), cinq fils rouges ressortent :

1. **Le local d'abord, toujours.** Ollama, Piper TTS, faster-whisper, air-gap, RGPD strict : robert-ia, IA_V7, VisioAide, jarvis_V2. Rien ne part dans le cloud, jamais.
2. **La neuroinclusion.** Appli_TSA_SDI_TDAH, IA-TSA et ses activités cause-effet apaisantes (« Touche → ça réagit », timer visuel, stimuli réduits), Handy_Appli. Le numérique comme prothèse douce, pas comme machine à notifications.
3. **La musique et le son.** crea_zik_electro_IA (synthèse temps réel), iTi-Radio, Karaoké, TravelingSound, Cordes_Bambous.
4. **La solidarité et le lien.** Micro Solidaire Network, Symphonie Équitable, La Rev (monnaie-temps), JeGeekUtile, appli_solidarite.
5. **La sobriété numérique.** Vanilla JS, zéro dépendance, HTML statique, « pixels blancs < 5 % ».

## Le choix : Rêverie, un jardin sonore génératif

Beaucoup de ces projets sont *utiles*. La consigne était de faire *rêver*. Le point d'intersection exact de ces cinq fils, versant rêve :

**Rêverie** — un jardin vivant où chaque graine plantée devient une plante générative unique qui *chante*. Synthèse sonore en temps réel (Web Audio, comme crea_zik mais en apesanteur), gammes pentatoniques impossibles à rendre dissonantes (n'importe qui peut jouer, personne ne peut se tromper — l'esprit cause-effet d'IA-TSA), cycle jour/nuit, lucioles, étoiles filantes, mode calme pour les sens sensibles, 100 % hors-ligne, zéro dépendance, zéro tracking, un simple double-clic sur `index.html`.

C'est un instrument, un tableau, un endroit où respirer. Il peut servir tel quel en salle informatique avec des apprenants TSA, tourner en borne dans un tiers-lieu à côté de Robert-IA, ou juste être un endroit où venir le soir.

## Principes techniques

- HTML + CSS + JavaScript vanilla, aucun module, aucun CDN : fonctionne en `file://`.
- Génération procédurale déterministe (chaque plante naît d'une graine aléatoire, redessinée à l'identique à chaque frame).
- Web Audio API : voix synthétisées, écho, nappe harmonique jour/nuit (Do pentatonique ↔ La mineur).
- Sauvegarde du jardin en `localStorage` uniquement.
- Accessibilité : clavier, `prefers-reduced-motion` respecté, mode calme.
