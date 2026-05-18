const statusEl = document.getElementById("dynamic-status");

fetch("data/status.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (status) {
    const c = status.calibration;
    const actions = status.next_actions
      .map(function (item) {
        return "<li>" + item + "</li>";
      })
      .join("");

    statusEl.innerHTML =
      "<div class=\"codebox\">" +
      "<div>Domain: <code>" + status.domain + "</code></div>" +
      "<div>Session: <code>" + c.session_id + "</code></div>" +
      "<div>Accepted samples: <code>" + c.accepted + "/" + c.samples + "</code></div>" +
      "<div>Quality: <code>" + c.quality_mean + " (" + c.quality_min + "-" + c.quality_max + ")</code></div>" +
      "<div>Raw media files: <code>" + c.raw_media_files + "</code></div>" +
      "</div>" +
      "<h3>Next actions</h3>" +
      "<ul>" + actions + "</ul>";
  })
  .catch(function () {
    statusEl.textContent = "Status file unavailable";
  });
