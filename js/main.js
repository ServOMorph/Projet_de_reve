/* Rêverie — boucle principale, entrées, sauvegarde locale. */

(() => {
  const canvas = document.getElementById("ciel");
  const ctx = canvas.getContext("2d");
  const titre = document.getElementById("titre");
  const invite = document.getElementById("invite");

  const CLE_STOCKAGE = "reverie.jardin.v1";
  const DUREE_CYCLE = 180;        // secondes pour un jour complet
  const PLANTES_MAX = 40;

  let largeur, hauteur;
  let temps = 0;                  // temps du monde (s)
  let phase = 0.32;               // on commence en matinée
  let plantes = [];
  let lucioles = [];
  let etoiles = [];
  let etoileFilante = null;
  let modeCalme = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let sonCoupe = false;
  let interactionFaite = false;

  /* ---------- Redimensionnement ---------- */
  function redimensionner() {
    largeur = canvas.width = window.innerWidth;
    hauteur = canvas.height = window.innerHeight;
    etoiles = [];
    const nb = Math.floor((largeur * hauteur) / 9000);
    for (let i = 0; i < nb; i++) {
      etoiles.push({
        x: Math.random() * largeur,
        y: Math.random() * hauteur * 0.7,
        r: 0.4 + Math.random() * 1.1,
        scintille: Math.random() * Math.PI * 2,
      });
    }
  }
  window.addEventListener("resize", redimensionner);
  redimensionner();

  /* ---------- Sol ---------- */
  function solY(x) {
    return hauteur * 0.82
         + Math.sin(x * 0.004 + 1.3) * hauteur * 0.012
         + Math.sin(x * 0.0013) * hauteur * 0.02;
  }

  /* ---------- Sauvegarde locale (rien ne quitte la machine) ---------- */
  function sauvegarder() {
    try {
      const donnees = plantes.filter(p => !p.mourante)
        .map(p => ({ g: p.graine, x: p.xFrac }));
      localStorage.setItem(CLE_STOCKAGE, JSON.stringify(donnees));
    } catch (_) { /* stockage indisponible : le jardin sera éphémère */ }
  }

  function restaurer() {
    try {
      const brut = localStorage.getItem(CLE_STOCKAGE);
      if (!brut) return;
      for (const d of JSON.parse(brut).slice(0, PLANTES_MAX)) {
        const p = new Plante(d.g, d.x, true);
        p.prochainChant = temps + 2 + Math.random() * 10;
        plantes.push(p);
      }
    } catch (_) { /* données illisibles : on repart d'un jardin vierge */ }
  }

  /* ---------- Plantation ---------- */
  function planter(xFrac) {
    premiereInteraction();
    if (plantes.filter(p => !p.mourante).length >= PLANTES_MAX) {
      const ancienne = plantes.find(p => !p.mourante);
      if (ancienne) ancienne.mourante = true;   // la plus ancienne retourne à la terre
    }
    const p = new Plante((Math.random() * 0xFFFFFFFF) >>> 0, xFrac);
    p.prochainChant = temps + 8 + Math.random() * 8;
    plantes.push(p);
    Son.note(p.noteBase, { duree: 1.2, volume: 0.1 }); // la graine touche la terre
    Observatoire.action("planter");
    sauvegarder();
  }

  function premiereInteraction() {
    Son.demarrer();
    Observatoire.definirAudioActif(!sonCoupe);
    if (interactionFaite) return;
    interactionFaite = true;
    invite.classList.add("cache");
    setTimeout(() => titre.classList.add("estompe"), 6000);
  }

  /* ---------- Entrées ---------- */
  canvas.addEventListener("pointerdown", e => {
    if (Observatoire.estOuvert()) return;
    premiereInteraction();
    planter(e.clientX / largeur);
  });

  window.addEventListener("keydown", e => {
    if (Observatoire.estOuvert()) return;
    if (e.target.tagName === "BUTTON" && (e.key === "Enter" || e.key === " ")) return;
    if (e.key === "Tab" || e.altKey || e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    // N'importe quelle touche plante une graine : cause → effet, sans erreur possible
    planter(0.08 + Math.random() * 0.84);
  });

  /* ---------- Boutons ---------- */
  const btnSon = document.getElementById("btn-son");
  const btnCalme = document.getElementById("btn-calme");
  const btnNouveau = document.getElementById("btn-nouveau");

  btnSon.addEventListener("click", () => {
    premiereInteraction();
    sonCoupe = !sonCoupe;
    Son.couperSon(sonCoupe);
    Observatoire.definirAudioActif(!sonCoupe);
    Observatoire.action(sonCoupe ? "son_coupe" : "son_active");
    btnSon.textContent = sonCoupe ? "🔇 Muet" : "🔊 Son";
    btnSon.setAttribute("aria-pressed", String(sonCoupe));
  });

  btnCalme.addEventListener("click", () => {
    premiereInteraction();
    modeCalme = !modeCalme;
    Son.modeCalme(modeCalme);
    Observatoire.action(modeCalme ? "mode_calme_active" : "mode_calme_desactive");
    btnCalme.setAttribute("aria-pressed", String(modeCalme));
  });
  if (modeCalme) { Son.modeCalme(true); btnCalme.setAttribute("aria-pressed", "true"); }

  btnNouveau.addEventListener("click", () => {
    premiereInteraction();
    plantes.forEach(p => { p.mourante = true; });
    Observatoire.action("nouveau_jardin");
    sauvegarder();
  });

  /* ---------- Rendu du ciel ---------- */
  function dessinerCiel(etat) {
    const grad = ctx.createLinearGradient(0, 0, 0, hauteur);
    grad.addColorStop(0, rgbCss(etat.haut));
    grad.addColorStop(1, rgbCss(etat.bas));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, largeur, hauteur);

    const nuit = 1 - etat.lum;

    // Étoiles
    if (nuit > 0.1) {
      for (const s of etoiles) {
        const a = nuit * (0.35 + 0.65 * Math.abs(Math.sin(temps * 0.8 + s.scintille)));
        ctx.fillStyle = `rgba(255,255,240,${a * 0.9})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Soleil et lune sur le même arc, opposés
    const arc = (p, decale) => {
      const a = ((p + decale) % 1) * Math.PI * 2 - Math.PI / 2;
      return {
        x: largeur * 0.5 + Math.cos(a) * largeur * 0.42,
        y: hauteur * 0.85 + Math.sin(a) * hauteur * 0.75,
        visible: Math.sin(a) < 0.05,
      };
    };
    const soleil = arc(phase, 0.62);
    if (soleil.visible && etat.lum > 0.05) {
      const halo = ctx.createRadialGradient(soleil.x, soleil.y, 0, soleil.x, soleil.y, 90);
      halo.addColorStop(0, `rgba(255, 240, 190, ${0.9 * etat.lum})`);
      halo.addColorStop(0.25, `rgba(255, 220, 150, ${0.5 * etat.lum})`);
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(soleil.x, soleil.y, 90, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = `rgba(255, 250, 225, ${etat.lum})`;
      ctx.beginPath(); ctx.arc(soleil.x, soleil.y, 26, 0, Math.PI * 2); ctx.fill();
    }
    const lune = arc(phase, 0.12);
    if (lune.visible && nuit > 0.05) {
      ctx.fillStyle = `rgba(235, 238, 255, ${0.9 * nuit})`;
      ctx.beginPath(); ctx.arc(lune.x, lune.y, 20, 0, Math.PI * 2); ctx.fill();
      const e = Ciel.etat(phase);
      ctx.fillStyle = rgbCss(e.haut, 0.9 * nuit);
      ctx.beginPath(); ctx.arc(lune.x - 8, lune.y - 5, 17, 0, Math.PI * 2); ctx.fill();
    }

    // Étoile filante, parfois, la nuit (jamais en mode calme)
    if (!modeCalme && nuit > 0.6) {
      if (!etoileFilante && Math.random() < 0.0012) {
        etoileFilante = {
          x: Math.random() * largeur * 0.8, y: Math.random() * hauteur * 0.25,
          vx: 6 + Math.random() * 5, vy: 2.5 + Math.random() * 2, vie: 1,
        };
      }
      if (etoileFilante) {
        const f = etoileFilante;
        ctx.strokeStyle = `rgba(255,255,230,${f.vie * 0.85})`;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(f.x, f.y);
        ctx.lineTo(f.x - f.vx * 8, f.y - f.vy * 8);
        ctx.stroke();
        f.x += f.vx; f.y += f.vy; f.vie -= 0.02;
        if (f.vie <= 0) etoileFilante = null;
      }
    } else {
      etoileFilante = null;
    }
  }

  /* ---------- Rendu du sol et de l'herbe ---------- */
  function dessinerSol(etat) {
    const sombre = melange([18, 34, 26], [70, 110, 72], etat.lum);
    const clair = melange([26, 46, 34], [96, 142, 92], etat.lum);
    const grad = ctx.createLinearGradient(0, hauteur * 0.78, 0, hauteur);
    grad.addColorStop(0, rgbCss(clair));
    grad.addColorStop(1, rgbCss(sombre));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, hauteur);
    for (let x = 0; x <= largeur; x += 16) ctx.lineTo(x, solY(x));
    ctx.lineTo(largeur, hauteur);
    ctx.closePath();
    ctx.fill();

    // Brins d'herbe qui ondulent
    const vent = modeCalme ? 0.3 : 1;
    ctx.strokeStyle = rgbCss(clair, 0.7);
    ctx.lineWidth = 1;
    const pas = Math.max(14, Math.floor(largeur / 90));
    for (let x = 7; x < largeur; x += pas) {
      const y = solY(x);
      const h = 7 + ((x * 7919) % 9);
      const pente = Math.sin(temps * 1.3 + x * 0.05) * 2.4 * vent;
      ctx.beginPath();
      ctx.moveTo(x, y + 2);
      ctx.quadraticCurveTo(x + pente * 0.4, y - h * 0.6, x + pente, y - h);
      ctx.stroke();
    }
  }

  /* ---------- Boucle principale ---------- */
  let precedent = performance.now();

  function boucle(maintenant) {
    const dt = Math.min(0.05, (maintenant - precedent) / 1000);
    precedent = maintenant;
    temps += dt;
    phase = (phase + dt / (DUREE_CYCLE * (modeCalme ? 1.6 : 1))) % 1;

    const etat = Ciel.etat(phase);
    const nuit = 1 - etat.lum;
    const vent = modeCalme ? 0.25 : 0.7 + Math.sin(temps * 0.13) * 0.45;
    dessinerCiel(etat);
    dessinerSol(etat);

    // Plantes : croissance, chant, dessin
    for (const p of plantes) {
      const seuils = p.pousser(dt);
      for (const s of seuils) {
        if (s >= 1) Son.eclosion(p.noteBase);
        else Son.note(p.noteBase + Math.round(s * 4), { duree: 1.6, volume: 0.09 });
      }
      // Le vent fait chanter les fleurs écloses, de temps en temps
      if (p.croissance >= 1 && !p.mourante && temps >= p.prochainChant) {
        Son.note(p.noteBase + [0, 2, 4][Math.floor(Math.random() * 3)],
                 { duree: 3, volume: 0.06 + nuit * 0.03 });
        p.prochainChant = temps + 6 + Math.random() * 14 + (modeCalme ? 8 : 0);
      }
      p.dessiner(ctx, p.xFrac * largeur, solY(p.xFrac * largeur), temps, vent, etat.lum);
    }
    const avant = plantes.length;
    plantes = plantes.filter(p => p.opacite > 0);
    if (plantes.length !== avant) sauvegarder();

    // Lucioles la nuit
    if (!modeCalme && nuit > 0.3) {
      const cible = Math.min(14, 3 + plantes.length);
      while (lucioles.length < cible) lucioles.push(new Luciole(largeur, hauteur));
    } else if (nuit < 0.1 || modeCalme) {
      lucioles = [];
    }
    for (const l of lucioles) {
      l.bouger(dt, largeur, hauteur);
      l.dessiner(ctx, Math.min(1, nuit * 1.4));
    }

    Son.accorderDrone(etat.lum);
    requestAnimationFrame(boucle);
  }

  restaurer();
  requestAnimationFrame(boucle);
})();
