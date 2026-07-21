/* Rêverie — le jardin : ciel, terre, plantes génératives, lucioles, étoiles.
 *
 * Chaque plante naît d'une graine (un entier). À chaque frame, son squelette
 * est redessiné à l'identique depuis cette graine (générateur mulberry32) :
 * la génération est procédurale et déterministe, seule la croissance et le
 * vent varient.
 */

/* ---------- Générateur pseudo-aléatoire déterministe ---------- */
function mulberry32(graine) {
  let a = graine >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- Couleurs ---------- */
function hexVersRgb(hex) {
  return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
}
function melange(c1, c2, t) {
  return [0, 1, 2].map(i => Math.round(c1[i] + (c2[i] - c1[i]) * t));
}
function rgbCss(c, a = 1) { return `rgba(${c[0]},${c[1]},${c[2]},${a})`; }

/* ---------- Le ciel : cycle jour / nuit ---------- */
const Ciel = (() => {
  // Étapes du cycle : position (0..1), couleur haut, couleur bas, lumière (0..1)
  const ETAPES = [
    { p: 0.00, haut: "#0a0e2a", bas: "#1c2249", lum: 0.00 },  // nuit profonde
    { p: 0.10, haut: "#2a2050", bas: "#8a4a6a", lum: 0.25 },  // aube
    { p: 0.18, haut: "#4a7ab5", bas: "#ffd9a0", lum: 0.75 },  // lever
    { p: 0.30, haut: "#6aa8d8", bas: "#cfe8f5", lum: 1.00 },  // matin
    { p: 0.50, haut: "#5a9fd4", bas: "#c2e2f0", lum: 1.00 },  // plein jour
    { p: 0.62, haut: "#7a6aa8", bas: "#ffb070", lum: 0.65 },  // couchant
    { p: 0.72, haut: "#2c2258", bas: "#7a3a5a", lum: 0.20 },  // crépuscule
    { p: 0.82, haut: "#0d1230", bas: "#232a55", lum: 0.00 },  // nuit
    { p: 1.00, haut: "#0a0e2a", bas: "#1c2249", lum: 0.00 },
  ].map(e => ({ p: e.p, haut: hexVersRgb(e.haut), bas: hexVersRgb(e.bas), lum: e.lum }));

  function etat(phase) {
    let i = 0;
    while (i < ETAPES.length - 2 && ETAPES[i + 1].p < phase) i++;
    const a = ETAPES[i], b = ETAPES[i + 1];
    const t = (phase - a.p) / (b.p - a.p);
    const lisse = t * t * (3 - 2 * t);
    return {
      haut: melange(a.haut, b.haut, lisse),
      bas: melange(a.bas, b.bas, lisse),
      lum: a.lum + (b.lum - a.lum) * lisse,
    };
  }

  return { etat };
})();

/* ---------- Une plante générative ---------- */
const TEINTES = [335, 355, 20, 45, 275, 300, 200, 160]; // roses, corail, ambre, violets, bleus

class Plante {
  constructor(graine, xFrac, adulte = false) {
    this.graine = graine;
    this.xFrac = xFrac;             // position horizontale relative (0..1)
    this.croissance = adulte ? 1 : 0;
    this.mourante = false;
    this.opacite = 1;

    const rng = mulberry32(graine);
    this.hauteur = 90 + rng() * 130;                    // px
    this.profMax = 4 + Math.floor(rng() * 2);           // profondeur de l'arbre
    this.teinte = TEINTES[Math.floor(rng() * TEINTES.length)];
    this.petales = 4 + Math.floor(rng() * 4);
    this.noteBase = Math.floor(rng() * (Son.tailleGamme - 5));
    this.souplesse = 0.5 + rng() * 0.8;
    this.prochainChant = 0;
    this.dernierSeuil = 0;                              // pour l'arpège d'éclosion
    this.phaseVent = rng() * Math.PI * 2;
    // Squelette précalculé une fois pour toutes : la forme est figée dès la graine
    this.racine = this._construire(rng, 0);
  }

  _construire(rng, prof) {
    if (prof >= this.profMax) return { fleur: rng(), enfants: [] };
    const nb = prof === 0 ? 2 : (rng() < 0.4 ? 3 : 2);
    const ecart = 0.35 + rng() * 0.35;
    const asym = (rng() - 0.5) * 0.3;
    const enfants = [];
    for (let i = 0; i < nb; i++) {
      enfants.push({
        decalage: (i - (nb - 1) / 2) * ecart + asym,
        facteur: 0.68 + 0.08 * (i % 2),
        noeud: this._construire(rng, prof + 1),
      });
    }
    return { fleur: null, enfants };
  }

  /* Fait pousser ; renvoie les seuils d'éclosion franchis (pour le son). */
  pousser(dt) {
    if (this.mourante) {
      this.opacite = Math.max(0, this.opacite - dt * 0.4);
      return [];
    }
    if (this.croissance >= 1) return [];
    this.croissance = Math.min(1, this.croissance + dt / 6); // ~6 s pour éclore
    const seuils = [0.35, 0.6, 0.8, 1.0];
    const franchis = [];
    for (const s of seuils) {
      if (this.croissance >= s && this.dernierSeuil < s) franchis.push(s);
    }
    if (franchis.length) this.dernierSeuil = franchis[franchis.length - 1];
    return franchis;
  }

  dessiner(ctx, x0, y0, temps, vent, lum) {
    ctx.save();
    ctx.globalAlpha = this.opacite;
    this.fleurs = [];
    const tige = melange([46, 84, 58], [148, 190, 150], lum * 0.7);
    ctx.strokeStyle = rgbCss(tige);
    ctx.lineCap = "round";
    this._branche(ctx, this.racine, x0, y0, this.hauteur * 0.42, -Math.PI / 2,
                  0, temps, vent);
    this._dessinerFleurs(ctx, lum);
    ctx.restore();
  }

  _branche(ctx, noeud, x, y, longueur, angle, prof, temps, vent) {
    // La croissance déploie l'arbre profondeur par profondeur
    const avancement = this.croissance * (this.profMax + 1) - prof;
    if (avancement <= 0) return;
    const pousse = Math.min(1, avancement);

    const balancement = Math.sin(temps * 1.1 + this.phaseVent + prof * 0.6)
                      * vent * this.souplesse * (prof + 1) * 0.018;
    const a = angle + balancement;
    const lg = longueur * pousse;
    const x2 = x + Math.cos(a) * lg;
    const y2 = y + Math.sin(a) * lg;

    ctx.lineWidth = Math.max(0.6, (this.profMax - prof + 1) * 0.9);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + Math.cos(a - 0.3) * lg * 0.5,
                         y + Math.sin(a - 0.3) * lg * 0.5, x2, y2);
    ctx.stroke();

    if (noeud.fleur !== null) {
      if (pousse >= 1) this.fleurs.push({ x: x2, y: y2, ecarts: noeud.fleur });
      return;
    }
    for (const enfant of noeud.enfants) {
      this._branche(ctx, enfant.noeud, x2, y2, longueur * enfant.facteur,
                    a + enfant.decalage, prof + 1, temps, vent);
    }
  }

  _dessinerFleurs(ctx, lum) {
    const nuit = 1 - lum;
    for (const f of this.fleurs) {
      const rayon = 3.2 + f.ecarts * 3;
      // Halo lumineux la nuit : les fleurs deviennent des lanternes
      if (nuit > 0.15) {
        const halo = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, rayon * 5);
        halo.addColorStop(0, `hsla(${this.teinte}, 90%, 75%, ${0.28 * nuit * this.opacite})`);
        halo.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(f.x, f.y, rayon * 5, 0, Math.PI * 2);
        ctx.fill();
      }
      const clarte = 55 + lum * 18 + nuit * 20;
      ctx.fillStyle = `hsla(${this.teinte}, 85%, ${clarte}%, ${this.opacite})`;
      for (let p = 0; p < this.petales; p++) {
        const pa = (p / this.petales) * Math.PI * 2 + f.ecarts * 6;
        ctx.beginPath();
        ctx.ellipse(f.x + Math.cos(pa) * rayon * 0.75, f.y + Math.sin(pa) * rayon * 0.75,
                    rayon * 0.62, rayon * 0.36, pa, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = `hsla(${(this.teinte + 45) % 360}, 95%, 82%, ${this.opacite})`;
      ctx.beginPath();
      ctx.arc(f.x, f.y, rayon * 0.34, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/* ---------- Lucioles ---------- */
class Luciole {
  constructor(largeur, hauteur) {
    this.x = Math.random() * largeur;
    this.y = hauteur * (0.45 + Math.random() * 0.4);
    this.phase = Math.random() * Math.PI * 2;
    this.vitesse = 0.3 + Math.random() * 0.5;
    this.cap = Math.random() * Math.PI * 2;
  }
  bouger(dt, largeur, hauteur) {
    this.cap += (Math.random() - 0.5) * 0.4;
    this.x += Math.cos(this.cap) * this.vitesse * dt * 30;
    this.y += Math.sin(this.cap) * this.vitesse * dt * 18;
    this.phase += dt * (1.5 + this.vitesse);
    if (this.x < 0) this.x = largeur;
    if (this.x > largeur) this.x = 0;
    this.y = Math.max(hauteur * 0.35, Math.min(hauteur * 0.88, this.y));
  }
  dessiner(ctx, nuit) {
    const eclat = (0.4 + 0.6 * Math.max(0, Math.sin(this.phase))) * nuit;
    if (eclat < 0.03) return;
    const halo = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 9);
    halo.addColorStop(0, `rgba(220, 255, 160, ${eclat * 0.8})`);
    halo.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 9, 0, Math.PI * 2);
    ctx.fill();
  }
}
