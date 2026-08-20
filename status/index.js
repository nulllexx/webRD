// --- DOM refs ---
const statusDiv = document.getElementById("overview-status");
const statusTitle = document.getElementById("overview-title");
const componentsContainer = document.getElementById("full-status");
const currentIncidentContainer = document.getElementById("current-incident");
const incidentHistoryContainer = document.getElementById("incident-history");

// --- Config / maps ---
// Colours live in status/status.css, keyed off the data-impact / data-status
// attributes set below, so they follow the light/dark theme. Do not set
// element.style.backgroundColor here - inline styles beat the stylesheet.

const COMPONENT_STATUS_TEXT = {
  operational: "Operational",
  degraded:    "Degraded Service",
  disruption:  "Service Disruption",
  default:     "Unknown"
};

// Local preview hook: /status/index.html?mock=1 reads fixtures from /_mock
// instead of the API. Inert in production.
const USE_MOCK = new URLSearchParams(location.search).has("mock");
const statusUrl  = USE_MOCK ? "/_mock/status.json"          : "/api/status/status";
const historyUrl = USE_MOCK ? "/_mock/incidentHistory.json" : "/api/status/incidentHistory";

// --- Helpers ---
const componentStatusText = (status) => COMPONENT_STATUS_TEXT[status] || COMPONENT_STATUS_TEXT.default;
const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
const formatDateShort = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); // "26 Aug 2024"
};

// Worst impact across a set of incidents, used for the overview banner.
const worstImpact = (incidents) => incidents.reduce((acc, x) => {
  if (x.impact === "full_outage") return "full_outage";
  if (x.impact === "partial_outage" && acc !== "full_outage") return "partial_outage";
  return acc;
}, "minimal_outage");

// --- Overview (top area) ---
function setOverview(payload = {}) {
  const incidents = Array.isArray(payload.incidents) ? payload.incidents : [];

  if (incidents.length === 0) {
    statusTitle.textContent = "All Systems Operational";
    statusDiv.dataset.impact = "minimal_outage";
    return;
  }

  if (incidents.length === 1) {
    const inc = incidents[0];
    statusTitle.textContent = inc.title || "Incident";
    statusDiv.dataset.impact = inc.impact || "unknown";
    return;
  }

  statusTitle.textContent = "Multiple Active Events";
  statusDiv.dataset.impact = worstImpact(incidents);
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

    const statusP = document.createElement("p");
    statusP.className = "status-badge";
    statusP.dataset.status = component.status || "unknown";
    statusP.textContent = componentStatusText(component.status);

    row.appendChild(nameP);
    row.appendChild(statusP);
    componentsContainer.appendChild(row);
  });
}

// --- Helper function to create an incident card ---
function createIncidentCard(incident) {
  const wrapper = document.createElement("div");
  wrapper.className = "incident-card";
  wrapper.dataset.impact = incident.impact || "unknown";

  // Top bar
  const topbar = document.createElement("div");
  topbar.className = "incident-topbar";

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

// --- Current active incidents (from the /status payload) ---
function renderCurrentIncident(payload = {}) {
  const incidents = Array.isArray(payload.incidents) ? payload.incidents : [];
  currentIncidentContainer.innerHTML = "";

  if (incidents.length === 0) return;

  // Sort incidents by started_at (newest first)
  const sortedIncidents = incidents.slice().sort((a, b) => {
    const ta = a.started_at ? new Date(a.started_at).getTime() : 0;
    const tb = b.started_at ? new Date(b.started_at).getTime() : 0;
    return tb - ta;
  });

  sortedIncidents.forEach(incident => {
    currentIncidentContainer.appendChild(createIncidentCard(incident));
  });
}

// --- Incident history (from the /incidentHistory endpoint) ---
function renderIncidentHistory(incidents = []) {
  incidentHistoryContainer.innerHTML = "";

  if (!Array.isArray(incidents) || incidents.length === 0) {
    const noHist = document.createElement("p");
    noHist.className = "rd-empty";
    noHist.textContent = "No incident history.";
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
    incidentHistoryContainer.appendChild(createIncidentCard(incident));
  });
}

// --- Wiring & fetches ---
document.addEventListener("DOMContentLoaded", () => {
  // Fetch overview/status + components + current incident
  fetch(statusUrl)
    .then(res => res.json())
    .then(data => {
      setOverview(data);
      renderComponents(data);
      renderCurrentIncident(data);
    })
    .catch(err => {
      console.error("Error fetching status:", err);
      statusTitle.textContent = "Error Fetching Status";
      statusDiv.dataset.impact = "unknown";
      componentsContainer.innerHTML = '<p class="rd-empty">Failed to load component status.</p>';
      currentIncidentContainer.innerHTML = "";
    });

  // Fetch full incident history (separate endpoint)
  fetch(historyUrl)
    .then(res => res.json())
    .then(data => renderIncidentHistory(Array.isArray(data) ? data : []))
    .catch(err => {
      console.error("Error fetching incident history:", err);
      incidentHistoryContainer.innerHTML = '<p class="rd-empty">Failed to load incident history.</p>';
    });
});
