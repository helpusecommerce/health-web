const statusEl = document.getElementById("dynamic-status");

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, function (ch) {
    if (ch === "&") return "&amp;";
    if (ch === "<") return "&lt;";
    if (ch === ">") return "&gt;";
    if (ch === '"') return "&quot;";
    return "&#39;";
  });
}

function metric(label, value) {
  return "<div>" + esc(label) + ": <code>" + esc(value) + "</code></div>";
}

fetch("data/status.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (status) {
    const c = status.calibration || {};
    const g = status.gesture_report || null;
    const actions = (status.next_actions || [])
      .map(function (item) {
        return "<li>" + esc(item) + "</li>";
      })
      .join("");

    let html =
      "<div class=\"codebox\">" +
      metric("Domain", status.domain) +
      metric("Stage", status.stage) +
      metric("Updated UTC", status.updated_at_utc || "not recorded") +
      metric("Calibration session", c.session_id) +
      metric("Accepted samples", String(c.accepted) + "/" + String(c.samples)) +
      metric("Tracking quality", String(c.quality_mean) + " (" + String(c.quality_min) + "-" + String(c.quality_max) + ")") +
      metric("Calibration raw media files", c.raw_media_files) +
      "</div>";

    if (g) {
      html +=
        "<h3>Gesture report</h3>" +
        "<div class=\"codebox\">" +
        metric("Mode", g.mode) +
        metric("Session", g.session_id) +
        metric("Total trials", g.total_trials) +
        metric("Overall accuracy", g.overall_accuracy) +
        metric("Level-1 accuracy", g.level1_accuracy) +
        metric("Mean latency ms", g.mean_latency_ms) +
        metric("False positives per minute", g.false_positives_per_minute) +
        metric("Gesture raw media files", g.raw_media_files) +
        "</div>";
    }

    html +=
      "<h3>Next actions</h3>" +
      "<ul>" + actions + "</ul>" +
      "<p>" + esc(status.privacy || "") + "</p>";

    statusEl.innerHTML = html;
  })
  .catch(function () {
    statusEl.textContent = "Status file unavailable";
  });
