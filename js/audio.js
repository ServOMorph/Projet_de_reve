/* Rêverie — moteur sonore (Web Audio, 100 % local)
 *
 * Gamme : Do majeur pentatonique — les mêmes notes que La mineur pentatonique.
 * Le jour, la nappe repose sur Do ; la nuit, elle glisse vers La mineur.
 * Aucune combinaison de notes ne peut être dissonante : on ne peut pas se tromper.
 */

const Son = (() => {
  let ctx = null;
  let master, filtre, delay, delayGain, droneJour, droneNuit;
  let coupe = false;
  let volumeCalme = 1;
  let voixActives = 0;
  const VOIX_MAX = 10;

  // Do majeur pentatonique sur 3 octaves (demi-tons depuis Do3 ≈ 130.81 Hz)
  const DEMI_TONS = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28];
  const DO3 = 130.81;
  const GAMME = DEMI_TONS.map(s => DO3 * Math.pow(2, s / 12));

  function demarrer() {
    if (ctx) { if (ctx.state === "suspended") ctx.resume(); return; }
    ctx = new (window.AudioContext || window.webkitAudioContext)();

    master = ctx.createGain();
    master.gain.value = 0.55;

    filtre = ctx.createBiquadFilter();
    filtre.type = "lowpass";
    filtre.frequency.value = 2600;
    filtre.Q.value = 0.4;

    // Écho doux : un delay avec réinjection, mixé en parallèle
    delay = ctx.createDelay(2);
    delay.delayTime.value = 0.46;
    delayGain = ctx.createGain();
    delayGain.gain.value = 0.32;
    delay.connect(delayGain);
    delayGain.connect(delay);
    delayGain.connect(filtre);

    master.connect(delay);
    master.connect(filtre);
    filtre.connect(ctx.destination);

    droneJour = creerDrone([130.81, 196.0]);   // Do3 + Sol3
    droneNuit = creerDrone([110.0, 164.81]);   // La2 + Mi3
  }

  function creerDrone(freqs) {
    const gain = ctx.createGain();
    gain.gain.value = 0;
    freqs.forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      o.detune.value = i === 0 ? -4 : 4;
      const g = ctx.createGain();
      g.gain.value = 0.02;
      o.connect(g);
      g.connect(gain);
      o.start();
    });
    gain.connect(filtre);
    return gain;
  }

  /* daylight : 0 (nuit noire) → 1 (plein jour). Appelé à chaque frame. */
  function accorderDrone(daylight) {
    if (!ctx || coupe) return;
    const t = ctx.currentTime;
    const v = volumeCalme;
    droneJour.gain.setTargetAtTime(daylight * 0.9 * v, t, 0.5);
    droneNuit.gain.setTargetAtTime((1 - daylight) * 0.9 * v, t, 0.5);
  }

  /* Joue une note de la gamme. indice : position dans GAMME. */
  function note(indice, options = {}) {
    if (!ctx || coupe || voixActives >= VOIX_MAX) return;
    const freq = GAMME[Math.max(0, Math.min(GAMME.length - 1, indice))];
    const duree = options.duree || 2.2;
    const vol = (options.volume || 0.14) * volumeCalme;
    const t = ctx.currentTime + (options.dans || 0);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0004, t + duree);
    g.connect(master);

    // Deux oscillateurs légèrement désaccordés : un timbre de cloche douce
    [["sine", 0], ["triangle", 6]].forEach(([type, det]) => {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = freq;
      o.detune.value = det;
      const og = ctx.createGain();
      og.gain.value = type === "triangle" ? 0.35 : 1;
      o.connect(og);
      og.connect(g);
      o.start(t);
      o.stop(t + duree + 0.1);
    });

    voixActives++;
    setTimeout(() => { voixActives--; }, (options.dans || 0) * 1000 + duree * 1000 + 200);
  }

  /* Petit arpège ascendant quand une plante éclot. */
  function eclosion(indiceBase) {
    [0, 2, 4].forEach((pas, i) => {
      note(indiceBase + pas, { dans: i * 0.22, duree: 2.6, volume: 0.12 });
    });
  }

  function couperSon(etat) {
    coupe = etat;
    if (ctx && droneJour && droneNuit && etat) {
      const t = ctx.currentTime;
      droneJour.gain.setTargetAtTime(0, t, 0.2);
      droneNuit.gain.setTargetAtTime(0, t, 0.2);
    }
  }

  function modeCalme(etat) { volumeCalme = etat ? 0.45 : 1; }

  return {
    demarrer, note, eclosion, accorderDrone, couperSon, modeCalme,
    get pret() { return ctx !== null; },
    get coupe() { return coupe; },
    get tailleGamme() { return GAMME.length; },
  };
})();
