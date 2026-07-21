/* Rêverie — expérience isolable : le Sanctuaire nocturne. */

const SanctuaireNocturne = (() => {
  const ID = "sanctuaire_nocturne_v1";
  const PLANTES_REQUISES = 5;

  let dedans = false;
  let apparition = 0;
  let expositionComptee = false;
  let largeurMemoire = 0;
  let hauteurMemoire = 0;
  let astres = [];
  let poussieres = [];
  let ondes = [];

  function actif() { return Observatoire.estActive(ID); }

  function construireCiel(largeur, hauteur) {
    if (largeur === largeurMemoire && hauteur === hauteurMemoire) return;
    largeurMemoire = largeur;
    hauteurMemoire = hauteur;
    const rng = mulberry32(0x51A7C7A1 ^ largeur ^ (hauteur << 8));
    astres = Array.from({ length: Math.max(70, Math.floor(largeur * hauteur / 7000)) }, () => ({
      x: rng(),
      y: rng() * 0.68,
      r: 0.4 + rng() * 1.5,
      phase: rng() * Math.PI * 2,
      teinte: rng() < 0.18 ? 188 : 48,
    }));
    poussieres = Array.from({ length: 34 }, () => ({
      x: rng(),
      y: 0.22 + rng() * 0.64,
      rayon: 0.7 + rng() * 2.1,
      phase: rng() * Math.PI * 2,
      vitesse: 0.12 + rng() * 0.28,
    }));
  }

  function mettreAJour(dt, plantesMatures) {
    const cible = actif() && plantesMatures >= PLANTES_REQUISES ? 1 : 0;
    apparition += (cible - apparition) * Math.min(1, dt * 0.9);
    if (cible && !expositionComptee) {
      expositionComptee = true;
      Observatoire.exposer(ID);
    }
    const bouton = document.getElementById("btn-sanctuaire");
    if (bouton) bouton.hidden = !(apparition > 0.82 && !dedans);
  }

  function arche(ctx, x, y, taille, temps, intensite) {
    ctx.save();
    ctx.globalAlpha = intensite;
    ctx.lineCap = "round";

    const halo = ctx.createRadialGradient(x, y - taille * 0.72, 0, x, y - taille * 0.72, taille * 1.45);
    halo.addColorStop(0, "rgba(148, 238, 255, 0.36)");
    halo.addColorStop(0.42, "rgba(106, 102, 224, 0.15)");
    halo.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y - taille * 0.72, taille * 1.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(25, 35, 48, 0.96)";
    ctx.lineWidth = taille * 0.2;
    ctx.beginPath();
    ctx.moveTo(x - taille * 0.7, y);
    ctx.lineTo(x - taille * 0.62, y - taille * 0.7);
    ctx.quadraticCurveTo(x, y - taille * 1.45, x + taille * 0.62, y - taille * 0.7);
    ctx.lineTo(x + taille * 0.7, y);
    ctx.stroke();

    ctx.strokeStyle = `rgba(142, 239, 255, ${0.52 + Math.sin(temps * 1.7) * 0.12})`;
    ctx.lineWidth = Math.max(1, taille * 0.025);
    for (let i = 0; i < 7; i++) {
      const a = Math.PI * (1.08 + i * 0.14);
      const rx = x + Math.cos(a) * taille * 0.67;
      const ry = y + Math.sin(a) * taille * 0.87 - taille * 0.12;
      ctx.beginPath();
      ctx.arc(rx, ry, taille * 0.035, 0, Math.PI * 2);
      ctx.stroke();
    }

    const coeur = ctx.createRadialGradient(x, y - taille * 0.58, taille * 0.05, x, y - taille * 0.58, taille * 0.62);
    coeur.addColorStop(0, "rgba(235, 255, 250, 0.82)");
    coeur.addColorStop(0.22, "rgba(106, 224, 238, 0.45)");
    coeur.addColorStop(0.7, "rgba(80, 67, 170, 0.17)");
    coeur.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = coeur;
    ctx.beginPath();
    ctx.ellipse(x, y - taille * 0.58, taille * 0.49, taille * 0.73, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function dessinerPassage(ctx, largeur, hauteur, temps, solY) {
    if (apparition < 0.01 || dedans) return;
    const x = largeur * 0.5;
    const y = solY(x) + 2;
    const taille = Math.min(70, Math.max(42, hauteur * 0.085));
    ctx.save();
    ctx.translate(0, (1 - apparition) * 80);
    arche(ctx, x, y, taille, temps, apparition);
    ctx.restore();
  }

  function collines(ctx, largeur, hauteur, decalage, couleur, base, amplitude, frequence) {
    ctx.fillStyle = couleur;
    ctx.beginPath();
    ctx.moveTo(0, hauteur);
    for (let x = -40; x <= largeur + 40; x += 24) {
      const y = hauteur * base
        + Math.sin((x + decalage) * frequence) * hauteur * amplitude
        + Math.sin((x - decalage * 0.4) * frequence * 0.37) * hauteur * amplitude * 0.65;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(largeur, hauteur);
    ctx.closePath();
    ctx.fill();
  }

  function dessinerSanctuaire(ctx, largeur, hauteur, temps, modeCalme, pointeurX) {
    construireCiel(largeur, hauteur);
    const derive = (pointeurX - 0.5) * largeur;

    const ciel = ctx.createLinearGradient(0, 0, 0, hauteur);
    ciel.addColorStop(0, "#050817");
    ciel.addColorStop(0.48, "#17234a");
    ciel.addColorStop(1, "#55748b");
    ctx.fillStyle = ciel;
    ctx.fillRect(0, 0, largeur, hauteur);

    const luneX = largeur * 0.72 - derive * 0.018;
    const luneY = hauteur * 0.2;
    const halo = ctx.createRadialGradient(luneX, luneY, 0, luneX, luneY, hauteur * 0.19);
    halo.addColorStop(0, "rgba(215, 244, 255, 0.62)");
    halo.addColorStop(0.2, "rgba(145, 192, 225, 0.22)");
    halo.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, largeur, hauteur * 0.55);
    ctx.fillStyle = "rgba(225, 244, 247, 0.88)";
    ctx.beginPath();
    ctx.arc(luneX, luneY, Math.min(hauteur * 0.052, 42), 0, Math.PI * 2);
    ctx.fill();

    for (const s of astres) {
      const alpha = 0.35 + Math.abs(Math.sin(temps * 0.55 + s.phase)) * 0.55;
      ctx.fillStyle = `hsla(${s.teinte}, 80%, 88%, ${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x * largeur - derive * 0.009, s.y * hauteur, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    collines(ctx, largeur, hauteur, -derive * 0.025, "#121b38", 0.52, 0.09, 0.006);
    collines(ctx, largeur, hauteur, -derive * 0.05, "#172a3d", 0.64, 0.075, 0.009);

    const brume = ctx.createLinearGradient(0, hauteur * 0.48, 0, hauteur * 0.82);
    brume.addColorStop(0, "rgba(141, 198, 202, 0)");
    brume.addColorStop(0.45, "rgba(141, 198, 202, 0.18)");
    brume.addColorStop(1, "rgba(17, 37, 43, 0)");
    ctx.fillStyle = brume;
    ctx.fillRect(0, hauteur * 0.42, largeur, hauteur * 0.43);

    collines(ctx, largeur, hauteur, -derive * 0.085, "#10252b", 0.77, 0.045, 0.014);

    const centreX = largeur * 0.5 - derive * 0.11;
    const sol = hauteur * 0.79;
    const taille = Math.min(125, hauteur * 0.16);
    arche(ctx, centreX, sol, taille, temps, 1);

    ctx.save();
    ctx.strokeStyle = "rgba(152, 238, 227, 0.34)";
    ctx.lineWidth = 1;
    const nbPoussiere = modeCalme ? 12 : poussieres.length;
    for (let i = 0; i < nbPoussiere; i++) {
      const p = poussieres[i];
      const x = ((p.x + temps * p.vitesse * 0.015) % 1) * largeur - derive * 0.13;
      const y = p.y * hauteur + Math.sin(temps * p.vitesse + p.phase) * 14;
      const a = 0.18 + Math.max(0, Math.sin(temps * 1.2 + p.phase)) * 0.58;
      ctx.fillStyle = `rgba(164, 250, 229, ${a})`;
      ctx.beginPath();
      ctx.arc(x, y, p.rayon, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    for (const onde of ondes) {
      ctx.strokeStyle = `rgba(169, 244, 236, ${onde.vie * 0.55})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(onde.x, onde.y, (1 - onde.vie) * 78, 0, Math.PI * 2);
      ctx.stroke();
      onde.vie -= modeCalme ? 0.006 : 0.012;
    }
    ondes = ondes.filter(o => o.vie > 0);

    const voile = ctx.createRadialGradient(largeur / 2, hauteur * 0.55, hauteur * 0.2,
      largeur / 2, hauteur * 0.55, Math.max(largeur, hauteur) * 0.72);
    voile.addColorStop(0, "rgba(0, 0, 0, 0)");
    voile.addColorStop(1, "rgba(1, 4, 12, 0.64)");
    ctx.fillStyle = voile;
    ctx.fillRect(0, 0, largeur, hauteur);
  }

  function entrer() {
    if (!actif() || apparition < 0.82 || dedans) return false;
    Son.demarrer();
    Observatoire.definirAudioActif(!Son.coupe);
    dedans = true;
    document.body.classList.add("sanctuaire-actif");
    document.getElementById("btn-sanctuaire").hidden = true;
    document.getElementById("btn-retour-sanctuaire").hidden = false;
    Observatoire.entrer(ID);
    Son.eclosion(3);
    return true;
  }

  function sortir() {
    if (!dedans) return;
    dedans = false;
    document.body.classList.remove("sanctuaire-actif");
    document.getElementById("btn-retour-sanctuaire").hidden = true;
    document.getElementById("btn-sanctuaire").hidden = apparition <= 0.82;
    Observatoire.quitter(ID);
    Son.note(2, { duree: 2.8, volume: 0.08 });
  }

  function gererClic(x, y, largeur, hauteur, solY) {
    if (dedans) {
      ondes.push({ x, y, vie: 1 });
      Son.note(Math.floor((x / largeur) * Son.tailleGamme), { duree: 3.4, volume: 0.08 });
      Observatoire.action("sanctuaire_lueur", { feature: ID });
      return true;
    }
    if (!actif() || apparition < 0.82) return false;
    const px = largeur * 0.5;
    const py = solY(px);
    if (Math.abs(x - px) < 75 && y > py - 135 && y < py + 25) return entrer();
    return false;
  }

  function initialiserUI() {
    document.getElementById("btn-sanctuaire")?.addEventListener("click", entrer);
    document.getElementById("btn-retour-sanctuaire")?.addEventListener("click", sortir);
    window.addEventListener("reverie:feature-toggle", e => {
      if (e.detail.id !== ID) return;
      if (!e.detail.active) {
        sortir();
        apparition = 0;
        document.getElementById("btn-sanctuaire").hidden = true;
      }
    });
  }

  initialiserUI();

  return {
    mettreAJour,
    dessinerPassage,
    dessinerSanctuaire,
    gererClic,
    entrer,
    sortir,
    get dedans() { return dedans; },
  };
})();
