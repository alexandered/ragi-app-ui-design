/* Boot: read URL parameters, start on the splash screen, fit the phone to the window. */
(function () {
  "use strict";
  var App = window.App, q = new URLSearchParams(location.search);
  if (q.get("size") === "small") { App.small = true; document.getElementById("phone").classList.add("phone--small"); }
  if (q.get("panel") === "0") document.body.classList.add("no-panel");
  var role = q.get("role"), screen = q.get("screen");
  if (role === "student" || role === "chef") { App.role = role; App.user = role === "chef" ? window.DB.users.c1 : window.DB.users.u1; }
  if (screen && (App.screens[screen] || App.overlays[screen])) {
    if (q.get("state") && App.screens[screen]) App.states[screen] = q.get("state");
    App.jump(screen);
  } else { App.stack = [{ id: "S1", params: {} }]; App.render(); }
  if (q.get("ts") === "1.3") App.setTextScale(1.3); // after the first screen exists: the panel reads App.top()
  App.fit();
  setTimeout(App.fit, 50);
})();
