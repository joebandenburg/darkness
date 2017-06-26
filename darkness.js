import base64 from "base64-js";
import material from "material-design-lite/material.min";
import style from "material-design-lite/material.css";
import style2 from "./style.css";

const subtle = window.crypto.subtle;
const encoder = new TextEncoder("utf-8");

const emoji = [0x1F337,0x1F338,0x1F339,0x1F33A,0x1F33B,0x1F33C,0x1F33D,0x1F33E,0x1F33F,0x1F340,0x1F341,0x1F342,0x1F343,0x1F344,0x1F345,0x1F346,0x1F347,0x1F348,0x1F349,0x1F34A,0x1F34B,0x1F34C,0x1F34D,0x1F34E,0x1F34F,0x1F350,0x1F351,0x1F352,0x1F353,0x1F354,0x1F355,0x1F356,0x1F357,0x1F358,0x1F359,0x1F35A,0x1F35B,0x1F35C,0x1F35D,0x1F35E,0x1F35F,0x1F360,0x1F361,0x1F362,0x1F363,0x1F364,0x1F365,0x1F366,0x1F367,0x1F368,0x1F369,0x1F36A,0x1F36B,0x1F36C,0x1F36D,0x1F36E,0x1F36F,0x1F370,0x1F371,0x1F372,0x1F373,0x1F374,0x1F375,0x1F376,0x1F377,0x1F378,0x1F379,0x1F37A,0x1F37B,0x1F37C,0x1F37E,0x1F37F,0x1F380,0x1F381,0x1F382,0x1F383,0x1F384,0x1F385,0x1F386,0x1F387,0x1F388,0x1F389,0x1F38A,0x1F38B,0x1F38C,0x1F38D,0x1F38E,0x1F38F,0x1F390,0x1F391,0x1F392,0x1F393,0x1F3A0,0x1F3A1,0x1F3A2,0x1F3A3,0x1F3A4,0x1F3A5,0x1F3A6,0x1F3A7,0x1F3A8,0x1F3A9,0x1F3AA,0x1F3AB,0x1F3AC,0x1F3AD,0x1F3AE,0x1F3AF,0x1F3B0,0x1F3B1,0x1F3B2,0x1F3B3,0x1F3B4,0x1F3B5,0x1F3B6,0x1F3B7,0x1F3B8,0x1F3B9,0x1F3BA,0x1F3BB,0x1F3BC,0x1F3BD,0x1F3BE,0x1F3BF,0x1F3C0,0x1F3C1,0x1F3C2,0x1F3C3,0x1F3C4,0x1F3C5,0x1F3C6,0x1F3C7,0x1F3C8,0x1F3C9,0x1F3CA,0x1F3CB,0x1F3CC,0x1F400,0x1F401,0x1F402,0x1F403,0x1F404,0x1F405,0x1F406,0x1F407,0x1F408,0x1F409,0x1F40A,0x1F40B,0x1F40C,0x1F40D,0x1F40E,0x1F40F,0x1F410,0x1F411,0x1F412,0x1F413,0x1F414,0x1F415,0x1F416,0x1F417,0x1F418,0x1F419,0x1F41A,0x1F41B,0x1F41C,0x1F41D,0x1F41E,0x1F41F,0x1F420,0x1F421,0x1F422,0x1F423,0x1F424,0x1F425,0x1F426,0x1F427,0x1F428,0x1F429,0x1F42A,0x1F42B,0x1F42C,0x1F42D,0x1F42E,0x1F42F,0x1F430,0x1F431,0x1F432,0x1F433,0x1F434,0x1F435,0x1F436,0x1F437,0x1F438,0x1F439,0x1F43A,0x1F43B,0x1F43C,0x1F43D,0x1F43E,0x1F451,0x1F452,0x1F453,0x1F454,0x1F455,0x1F456,0x1F457,0x1F458,0x1F459,0x1F45A,0x1F45B,0x1F45C,0x1F45D,0x1F45E,0x1F45F,0x1F460,0x1F461,0x1F462,0x1F463,0x1F4A1,0x1F4A2,0x1F4A3,0x1F4A4,0x1F4A5,0x1F4A6,0x1F4A7,0x1F4A8,0x1F4A9,0x1F4AA,0x1F4AB,0x1F4AC,0x1F4AD,0x1F680,0x1F681,0x1F682,0x1F683,0x1F690,0x1F691,0x1F692,0x1F693,0x1F694,0x1F695,0x1F696,0x1F697,0x1F698,0x1F699,0x1F69A,0x1F69B,0x1F69C,0x1F69D,0x1F69E,0x1F69F,0x1F6A0,0x1F6A1,0x1F6A2,0x1F6A3];

window.addEventListener("load", () => {
  const form = document.getElementById("form");
  const generate = document.getElementById("generate");
  const key = document.getElementById("key");
  const salt = document.getElementById("salt");
  const result = document.getElementById("result");
  const spinner = document.getElementById("spinner");
  const fingerprint = document.getElementById("fingerprint");
  setTimeout(() => key.focus(), 10);
  key.addEventListener("keydown", debounce(e => {
    computeFingerprint(key.value).then(f => {
      fingerprint.innerHTML = f;
    });
  }, 100, false));
  form.addEventListener("submit", e => {
    e.preventDefault();
    generate.setAttribute("disabled", "true");
    key.setAttribute("disabled", "true");
    salt.setAttribute("disabled", "true");
    result.classList.add("hidden");
    spinner.classList.add("is-active");
    spinner.classList.remove("hidden");
    computePassword(key.value, salt.value)
      .then(p => {
        if (window.opener) {
          window.opener.postMessage(p, "*");
        } else {
          result.textContent = p;
          result.classList.remove("hidden");
          generate.removeAttribute("disabled");
          key.removeAttribute("disabled");
          salt.removeAttribute("disabled");
          spinner.classList.remove("is-active");
          spinner.classList.add("hidden");
          const selection = window.getSelection();
          const range = document.createRange();

          range.selectNodeContents(result);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      });
  }, false);
}, false);

function computeFingerprint(masterSecret) {
  return subtle.importKey("raw", encoder.encode(masterSecret), {
      "name": "PBKDF2"
    }, false, ["deriveKey"])
    .then(k => {
      return subtle.deriveKey({
          name: "PBKDF2",
          salt: encoder.encode("darknessFingerprint"),
          iterations: 1000,
          hash: "SHA-256"
        }, k, {
          name: "AES-CBC",
          length: 128
        }, true, ["encrypt"]);
    })
    .then(k => subtle.exportKey("raw", k))
    .then(keyBytes => Array.from(new Uint8Array(keyBytes, 0, 4)).map(b => emoji[b]).map(e => "&#" + e + ";").join(""));
}

function computePassword(masterSecret, salt) {
  return subtle.importKey("raw", encoder.encode(masterSecret), {
      "name": "PBKDF2"
    }, false, ["deriveKey"])
    .then(k => {
      return subtle.deriveKey({
          name: "PBKDF2",
          salt: encoder.encode("darkness" + salt),
          iterations: 1000000,
          hash: "SHA-256"
        }, k, {
          name: "AES-CBC",
          length: 128
        }, true, ["encrypt"]);
    })
    .then(k => subtle.exportKey("raw", k))
    .then(keyBytes => base64.fromByteArray(new Uint8Array(keyBytes)))
    .then(p => p.substr(0, 20));
}

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};