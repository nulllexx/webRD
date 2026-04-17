// --- DOM refs ---
const statusDiv = document.getElementById("overview-status");
const statusTitle = document.getElementById("overview-title");
const componentsContainer = document.getElementById("full-status");
const currentIncidentContainer = document.getElementById("current-incident");
const incidentHistoryContainer = document.getElementById("incident-history");

// --- Config / maps ---
const IMPACT_COLORS = {
  minimal_outage: "#28ac64", // green
  partial_outage: "#ffac34", // amber
  full_outage:    "#c84434", // red
  default:        "grey"
};

const COMPONENT_STATUS_TEXT = {
  operational: "Operational",
  degraded:    "Degraded Service",
  disruption:  "Service Disruption",
  default:     "Unknown"
};

// --- Helpers ---
const impactToColor = (impact) => IMPACT_COLORS[impact] || IMPACT_COLORS.default;
const componentStatusText = (status) => COMPONENT_STATUS_TEXT[status] || COMPONENT_STATUS_TEXT.default;
const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
const formatDateShort = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); // "26 Aug 2024"
};

// --- Overview (top area) ---
function setOverview(payload = {}) {
  const incidents = Array.isArray(payload.incidents) ? payload.incidents : [];

  if (incidents.length === 0) {
    statusTitle.textContent = "All Systems Operational";
    statusDiv.style.backgroundColor = IMPACT_COLORS.minimal_outage;
    return;
  }

  if (incidents.length === 1) {
    const inc = incidents[0];
    statusTitle.textContent = inc.title || "Incident";
    statusDiv.style.backgroundColor = impactToColor(inc.impact);
    return;
  }
  // multiple incidents -> choose worst impact
  statusTitle.textContent = "Multiple Active Events";
  const worst = incidents.reduce((acc, x) => {
    if (x.impact === "full_outage") return "full_outage";
    if (x.impact === "partial_outage" && acc !== "full_outage") return "partial_outage";
    return acc;
  }, "minimal_outage");
  statusDiv.style.backgroundColor = impactToColor(worst);
}

// --- Components list ---
function renderComponents(payload = {}) {
  const components = Array.isArray(payload.components) ? payload.components : [];
  componentsContainer.innerHTML = "";

  if (components.length === 0) {
    // nothing to show; keep container empty
    return;
  }

  components.forEach(component => {
    const row = document.createElement("div");
    row.className = "component-row";

    const nameP = document.createElement("p");
    nameP.className = "component-name";
    nameP.textContent = component.name || "Unnamed Component";
    nameP.style.margin = "0";

    const statusP = document.createElement("p");
    statusP.className = "status-badge";
    const text = componentStatusText(component.status);
    statusP.textContent = text;
    statusP.style.backgroundColor = impactToColor(
      // for components we treat 'operational' green, 'degraded' amber, 'disruption' red
      component.status === "operational" ? "minimal_outage"
        : (component.status === "degraded" ? "partial_outage"
          : (component.status === "disruption" ? "full_outage" : "default"))
    );

    row.appendChild(nameP);
    row.appendChild(statusP);
    componentsContainer.appendChild(row);
  });
}

// --- Helper function to create an incident card ---
function createIncidentCard(incident) {
  const wrapper = document.createElement("div");
  wrapper.className = "incident-card";

  // Top bar
  const topbar = document.createElement("div");
  topbar.className = "incident-topbar";
  topbar.style.backgroundColor = impactToColor(incident.impact);

  const title = document.createElement("h3");
  title.textContent = incident.title || "Incident";
  title.className = "incident-topbar-title";

  const date = document.createElement("span");
  date.className = "incident-topbar-date";
  date.textContent = formatDateShort(incident.started_at || incident.created_at);

  topbar.appendChild(title);
  topbar.appendChild(date);
  wrapper.appendChild(topbar);

  // Status updates (timeline)
  const hist = Array.isArray(incident.history_status) ? incident.history_status : [];
  hist.forEach(entry => {
    const entryDiv = document.createElement("div");
    entryDiv.className = "incident-update";

    const time = document.createElement("h5");
    time.className = "incident-update-time";
    time.textContent = `${entry.time} [${capitalize(entry.status)}]`;

    const text = document.createElement("p");
    text.className = "incident-update-text";
    text.textContent = entry.context || "";

    entryDiv.appendChild(time);
    entryDiv.appendChild(text);
    wrapper.appendChild(entryDiv);
  });

  return wrapper;
}

// --- Current active incidents (from /api/status/status payload) - now renders ALL active incidents ---
// --- Current active incidents (fixed to show ALL incidents) ---
function renderCurrentIncident(payload = {}) {
  const incidents = Array.isArray(payload.incidents) ? payload.incidents : [];
  currentIncidentContainer.innerHTML = "";

  console.log("Processing incidents:", incidents.length); // Debug log

  if (incidents.length === 0) {
    currentIncidentContainer.style.display = "none";
    return;
  }
  currentIncidentContainer.style.display = "block";

  // Sort incidents by started_at (newest first)
  const sortedIncidents = incidents.slice().sort((a, b) => {
    const ta = a.started_at ? new Date(a.started_at).getTime() : 0;
    const tb = b.started_at ? new Date(b.started_at).getTime() : 0;
    return tb - ta;
  });

  console.log("Sorted incidents:", sortedIncidents.map(i => i.title)); // Debug log

  // Create a card for each active incident
  sortedIncidents.forEach((incident, index) => {
    console.log(`Creating card ${index + 1}:`, incident.title); // Debug log
    const card = createIncidentCard(incident);
    currentIncidentContainer.appendChild(card);
  });
}

// --- Helper function to create an incident card (enhanced with debug) ---
function createIncidentCard(incident) {
  console.log("Creating incident card for:", incident.title); // Debug log
  
  const wrapper = document.createElement("div");
  wrapper.className = "incident-card";

  // Top bar
  const topbar = document.createElement("div");
  topbar.className = "incident-topbar";
  topbar.style.backgroundColor = impactToColor(incident.impact);

  const title = document.createElement("h3");
  title.textContent = incident.title || "Incident";
  title.className = "incident-topbar-title";

  const date = document.createElement("span");
  date.className = "incident-topbar-date";
  date.textContent = formatDateShort(incident.started_at || incident.created_at);

  topbar.appendChild(title);
  topbar.appendChild(date);
  wrapper.appendChild(topbar);

  // Status updates (timeline)
  const hist = Array.isArray(incident.history_status) ? incident.history_status : [];
  hist.forEach(entry => {
    const entryDiv = document.createElement("div");
    entryDiv.className = "incident-update";

    const time = document.createElement("h5");
    time.className = "incident-update-time";
    time.textContent = `${entry.time} [${capitalize(entry.status)}]`;

    const text = document.createElement("p");
    text.className = "incident-update-text";
    text.textContent = entry.context || "";

    entryDiv.appendChild(time);
    entryDiv.appendChild(text);
    wrapper.appendChild(entryDiv);
  });

  return wrapper;
}

// --- Incident history (from /api/status/incidents endpoint) ---
function renderIncidentHistory(incidents = []) {
  incidentHistoryContainer.innerHTML = "";

  if (!Array.isArray(incidents) || incidents.length === 0) {
    const noHist = document.createElement("h3");
    noHist.textContent = "No incident history.";
    noHist.style.textAlign = "center";
    incidentHistoryContainer.appendChild(noHist);
    return;
  }

  // Sort latest first
  const sorted = incidents.slice().sort((a, b) => {
    const ta = a.started_at ? new Date(a.started_at).getTime() : 0;
    const tb = b.started_at ? new Date(b.started_at).getTime() : 0;
    return tb - ta;
  });

  sorted.forEach(incident => {
    const card = createIncidentCard(incident);
    incidentHistoryContainer.appendChild(card);
  });
}

// --- Wiring & fetches ---
document.addEventListener("DOMContentLoaded", () => {
  // Fetch overview/status + components + current incident
  fetch("/api/status/status")
    .then(res => res.json())
    .then(data => {
      setOverview(data);
      renderComponents(data);
      renderCurrentIncident(data);
    })
    .catch(err => {
      console.error("Error fetching /api/status/status:", err);
      statusTitle.textContent = "Error Fetching Status";
      statusDiv.style.backgroundColor = "grey";
      // show errors in components & current incident areas
      componentsContainer.innerHTML = "<h3>Failed to load status</h3>";
      currentIncidentContainer.style.display = "none";
    });

  // Fetch full incident history (separate endpoint)
  fetch("/api/status/incidentHistory")
    .then(res => res.json())
    .then(data => renderIncidentHistory(Array.isArray(data) ? data : []))
    .catch(err => {
      console.error("Error fetching /api/status/incidentHistory:", err);
      incidentHistoryContainer.innerHTML = "<h3 style='text-align:center'>Failed to load incident history</h3>";
    });
});