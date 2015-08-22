import base64 from "base64-js";
import material from "material-design-lite/material.min";
import style from "material-design-lite/material.css";
import style2 from "./style.css";

const subtle = window.crypto.subtle;
const encoder = new TextEncoder("utf-8");
const form = document.getElementById("form");
const generate = document.getElementById("generate");
const key = document.getElementById("key");
const salt = document.getElementById("salt");
const result = document.getElementById("result");
const spinner = document.getElementById("spinner");
setTimeout(() => key.focus(), 10);
form.addEventListener("submit", e => {
  e.preventDefault();
  generate.setAttribute("disabled", "true");
  key.setAttribute("disabled", "true");
  salt.setAttribute("disabled", "true");
  spinner.classList.add("is-active");
  subtle.importKey("raw", encoder.encode(key.value), {
      "name": "PBKDF2"
    }, false, ["deriveKey"])
    .then(k => {
      return subtle.deriveKey({
          name: "PBKDF2",
          salt: encoder.encode("darkness" + salt.value),
          iterations: 1000000,
          hash: "SHA-256"
        }, k, {
          name: "AES-CBC",
          length: 128
        }, true, ["encrypt"]);
    })
    .then(k => subtle.exportKey("raw", k))
    .then(keyBytes => base64.fromByteArray(new Uint8Array(keyBytes)))
    .then(p => p.substr(0, 20))
    .then(p => {
      if (window.opener) {
        window.opener.postMessage(p, "*");
      } else {
        result.textContent = p;
        generate.removeAttribute("disabled");
        key.removeAttribute("disabled");
        salt.removeAttribute("disabled");
        spinner.classList.remove("is-active");
      }
    });
}, false);
