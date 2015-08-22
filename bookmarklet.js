const origin = "https://bandenburg.com";
//const origin = "http://localhost:8080";
//const origin = "https://bandenburg-backup.s3.amazonaws.com";

(() => {
  const activeElement = document.activeElement;
  if (!activeElement) {
    return;
  }
  const receiveMessage = e => {
    if (e.source === w && e.origin === origin) {
      activeElement.value = e.data;
      window.removeEventListener("message", receiveMessage, false);
      w.close();
    }
  }

  window.addEventListener("message", receiveMessage, false);
  var w = window.open(origin + "/darkness.html", "darkness", "menubar=no,width=400,height=500");
})();
