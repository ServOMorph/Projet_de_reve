/* Rêverie — observatoire d'usage local et registre des expériences. */

const Observatoire = (() => {
  const CLE = "reverie.observatoire.v1";
  const VERSION = 1;
  const INACTIVITE_MS = 90 * 1000;
  const EVENEMENTS_MAX = 500;
  const SESSIONS_MAX = 60;
  const JOURS_MAX = 90;

  const EXPERIENCES = {};

  const maintenantIso = () => new Date().toISOString();
  const jourLocal = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  function donneesVides() {
    return {
      version: VERSION,
      creeLe: maintenantIso(),
      totaux: { sessions: 0, visibleS: 0, actifS: 0, audioS: 0, interactions: 0 },
      compteurs: {},
      jours: [],
      sessions: [],
      evenements: [],
      experiences: {},
    };
  }

  function charger() {
    try {
      const brut = localStorage.getItem(CLE);
      if (!brut) return donneesVides();
      const lu = JSON.parse(brut);
      if (!lu || lu.version !== VERSION) return donneesVides();
      const base = donneesVides();
      return {
        ...base,
        ...lu,
        totaux: { ...base.totaux, ...(lu.totaux || {}) },
        compteurs: lu.compteurs || {},
        jours: Array.isArray(lu.jours) ? lu.jours : [],
        sessions: Array.isArray(lu.sessions) ? lu.sessions : [],
        evenements: Array.isArray(lu.evenements) ? lu.evenements : [],
        experiences: lu.experiences || {},
      };
    } catch (_) {
      return donneesVides();
    }
  }

  let donnees = charger();
  let dernierGeste = Date.now();
  let dernierTick = performance.now();
  let audioActif = false;
  let experienceEnCours = null;
  let panneauOuvert = false;

  const session = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    debut: maintenantIso(),
    fin: maintenantIso(),
    visibleS: 0,
    actifS: 0,
    audioS: 0,
    interactions: 0,
    experiences: {},
  };
  donnees.sessions.push(session);
  donnees.sessions = donnees.sessions.slice(-SESSIONS_MAX);
  donnees.totaux.sessions += 1;

  function experience(id) {
    if (!donnees.experiences[id]) {
      donnees.experiences[id] = {
        active: true,
        premiereExposition: null,
        expositions: 0,
        activations: 0,
        dureeS: 0,
        appreciation: null,
        changementsEtat: 0,
      };
    }
    return donnees.experiences[id];
  }

  Object.keys(EXPERIENCES).forEach(experience);

  function jourCourant() {
    const cleJour = jourLocal();
    let jour = donnees.jours.find(j => j.date === cleJour);
    if (!jour) {
      jour = { date: cleJour, sessions: 0, visibleS: 0, actifS: 0, audioS: 0, interactions: 0 };
      donnees.jours.push(jour);
      donnees.jours = donnees.jours.slice(-JOURS_MAX);
    }
    return jour;
  }

  const aujourdHui = jourCourant();
  aujourdHui.sessions += 1;

  function sauvegarder() {
    try {
      session.fin = maintenantIso();
      localStorage.setItem(CLE, JSON.stringify(donnees));
    } catch (_) { /* L'observatoire devient éphémère si le stockage est indisponible. */ }
  }

  function ajouterDuree(champ, secondes) {
    const valeur = Math.max(0, Math.round(secondes * 10) / 10);
    donnees.totaux[champ] += valeur;
    session[champ] += valeur;
    jourCourant()[champ] += valeur;
  }

  function tick() {
    const present = performance.now();
    const dt = Math.min(10, Math.max(0, (present - dernierTick) / 1000));
    dernierTick = present;
    if (document.visibilityState !== "visible") return;

    ajouterDuree("visibleS", dt);
    if (Date.now() - dernierGeste <= INACTIVITE_MS) ajouterDuree("actifS", dt);
    if (audioActif) ajouterDuree("audioS", dt);
    if (experienceEnCours) {
      const exp = experience(experienceEnCours);
      exp.dureeS += dt;
      session.experiences[experienceEnCours] = (session.experiences[experienceEnCours] || 0) + dt;
    }
    sauvegarder();
    if (panneauOuvert) rendrePanneau();
  }

  function presence() { dernierGeste = Date.now(); }
  window.addEventListener("pointermove", presence, { passive: true });
  window.addEventListener("keydown", presence, { passive: true });
  window.addEventListener("focus", presence);
  document.addEventListener("visibilitychange", () => {
    dernierTick = performance.now();
    sauvegarder();
  });
  setInterval(tick, 5000);

  function action(type, options = {}) {
    presence();
    donnees.totaux.interactions += 1;
    session.interactions += 1;
    jourCourant().interactions += 1;
    donnees.compteurs[type] = (donnees.compteurs[type] || 0) + 1;
    donnees.evenements.push({
      t: maintenantIso(),
      type,
      feature: options.feature || undefined,
    });
    donnees.evenements = donnees.evenements.slice(-EVENEMENTS_MAX);
    sauvegarder();
  }

  function estActive(id) { return experience(id).active !== false; }

  function exposer(id) {
    const exp = experience(id);
    if (!exp.active) return;
    exp.expositions += 1;
    if (!exp.premiereExposition) exp.premiereExposition = maintenantIso();
    action("experience_vue", { feature: id });
  }

  function entrer(id) {
    const exp = experience(id);
    if (!exp.active) return;
    exp.activations += 1;
    experienceEnCours = id;
    action("experience_entree", { feature: id });
  }

  function quitter(id) {
    if (experienceEnCours === id) experienceEnCours = null;
    action("experience_sortie", { feature: id });
  }

  function noter(id, appreciation) {
    experience(id).appreciation = appreciation;
    action("experience_evaluee", { feature: id });
    sauvegarder();
    rendrePanneau();
  }

  function recommander(id) {
    const exp = experience(id);
    if (exp.appreciation === "pause") return "Mettre en pause";
    if (exp.appreciation === "garder") return "Garder";
    if (exp.expositions < 5 || donnees.totaux.sessions < 3) return "Continuer l’observation";
    const conversion = exp.activations / Math.max(1, exp.expositions);
    const dureeMoyenne = exp.dureeS / Math.max(1, exp.activations);
    if (conversion >= 0.5 && dureeMoyenne >= 25) return "Garder";
    if (conversion < 0.2 || dureeMoyenne < 8) return "Mettre en pause";
    return "Améliorer";
  }

  function formatDuree(secondes) {
    const total = Math.round(secondes || 0);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h) return `${h} h ${m} min`;
    if (m) return `${m} min ${s} s`;
    return `${s} s`;
  }

  function rendrePanneau() {
    const stats = document.getElementById("observatoire-stats");
    const liste = document.getElementById("observatoire-experiences");
    if (!stats || !liste) return;

    stats.innerHTML = `
      <article><strong>${donnees.totaux.sessions}</strong><span>sessions</span></article>
      <article><strong>${formatDuree(donnees.totaux.visibleS)}</strong><span>temps visible</span></article>
      <article><strong>${formatDuree(donnees.totaux.actifS)}</strong><span>temps actif</span></article>
      <article><strong>${donnees.compteurs.planter || 0}</strong><span>graines plantées</span></article>
    `;

    const cartes = Object.entries(EXPERIENCES).map(([id, definition]) => {
      const exp = experience(id);
      const recommandation = recommander(id);
      return `
        <article class="experience" data-feature="${id}">
          <div class="experience-entete">
            <div><h3>${definition.nom}</h3><p>${definition.description}</p></div>
            <label class="interrupteur">
              <input type="checkbox" data-action="basculer" ${exp.active ? "checked" : ""}>
              <span>${exp.active ? "Active" : "En pause"}</span>
            </label>
          </div>
          <dl>
            <div><dt>Vue</dt><dd>${exp.expositions} fois</dd></div>
            <div><dt>Visitée</dt><dd>${exp.activations} fois</dd></div>
            <div><dt>Temps</dt><dd>${formatDuree(exp.dureeS)}</dd></div>
            <div><dt>Conseil</dt><dd>${recommandation}</dd></div>
          </dl>
          <div class="evaluation" aria-label="Votre avis sur ${definition.nom}">
            <span>Votre verdict</span>
            <button data-note="garder" aria-pressed="${exp.appreciation === "garder"}">À garder</button>
            <button data-note="ameliorer" aria-pressed="${exp.appreciation === "ameliorer"}">À améliorer</button>
            <button data-note="pause" aria-pressed="${exp.appreciation === "pause"}">À mettre en pause</button>
          </div>
        </article>
      `;
    }).join("");
    liste.innerHTML = cartes || "<p class=\"experience-vide\">Aucune expérience n’est en cours d’évaluation. La prochaine idée sera ajoutée ici avec ses critères de décision.</p>";
  }

  function ouvrir() {
    const panneau = document.getElementById("observatoire");
    if (!panneau) return;
    panneauOuvert = true;
    rendrePanneau();
    panneau.hidden = false;
    document.body.classList.add("panneau-ouvert");
    action("observatoire_ouvert");
    document.getElementById("btn-fermer-observatoire")?.focus();
  }

  function fermer() {
    const panneau = document.getElementById("observatoire");
    if (!panneau) return;
    panneauOuvert = false;
    panneau.hidden = true;
    document.body.classList.remove("panneau-ouvert");
    document.getElementById("btn-observatoire")?.focus();
  }

  function exporter() {
    action("observatoire_export");
    const blob = new Blob([JSON.stringify(donnees, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = `reverie-observatoire-${jourLocal()}.json`;
    lien.click();
    URL.revokeObjectURL(url);
  }

  function effacer() {
    if (!window.confirm("Effacer définitivement toutes les mesures locales de Rêverie ?")) return;
    localStorage.removeItem(CLE);
    donnees = donneesVides();
    location.reload();
  }

  function initialiserUI() {
    document.getElementById("btn-observatoire")?.addEventListener("click", ouvrir);
    document.getElementById("btn-fermer-observatoire")?.addEventListener("click", fermer);
    document.getElementById("btn-exporter-observatoire")?.addEventListener("click", exporter);
    document.getElementById("btn-effacer-observatoire")?.addEventListener("click", effacer);
    document.getElementById("observatoire")?.addEventListener("click", e => {
      const carte = e.target.closest("[data-feature]");
      if (!carte) return;
      const id = carte.dataset.feature;
      if (e.target.matches("[data-action='basculer']")) {
        const exp = experience(id);
        exp.active = e.target.checked;
        exp.changementsEtat += 1;
        action(exp.active ? "experience_activee" : "experience_suspendue", { feature: id });
        window.dispatchEvent(new CustomEvent("reverie:feature-toggle", {
          detail: { id, active: exp.active },
        }));
        rendrePanneau();
      }
      const note = e.target.closest("[data-note]");
      if (note) noter(id, note.dataset.note);
    });
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && panneauOuvert) {
        e.preventDefault();
        e.stopPropagation();
        fermer();
      }
    });
    sauvegarder();
  }

  function definirAudioActif(etat) { audioActif = Boolean(etat); }
  function estOuvert() { return panneauOuvert; }

  window.addEventListener("beforeunload", sauvegarder);
  initialiserUI();

  return {
    action,
    estActive,
    exposer,
    entrer,
    quitter,
    noter,
    recommander,
    definirAudioActif,
    estOuvert,
  };
})();
