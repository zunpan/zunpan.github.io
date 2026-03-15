(function () {
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        var successful = document.execCommand("copy");
        document.body.removeChild(textarea);
        successful ? resolve() : reject(new Error("copy failed"));
      } catch (err) {
        document.body.removeChild(textarea);
        reject(err);
      }
    });
  }

  function markCopied(button) {
    if (!button) return;
    button.setAttribute("data-copied", "true");
    button.textContent = "Copied";
    window.clearTimeout(button.__copyTimeout);
    button.__copyTimeout = window.setTimeout(function () {
      button.removeAttribute("data-copied");
      button.textContent = "Copy";
    }, 1600);
  }

  function getCodeText(pre) {
    if (!pre) return "";
    var code = pre.querySelector("code");
    if (code) {
      return code.innerText || code.textContent || "";
    }
    var clone = pre.cloneNode(true);
    var button = clone.querySelector(".code-copy-btn");
    if (button) {
      button.parentNode.removeChild(button);
    }
    return clone.innerText || clone.textContent || "";
  }

  function attachCopyButton(pre) {
    if (!pre) return;
    var container = pre.closest(".highlight") || pre;
    if (container.querySelector(".code-copy-btn")) return;

    var button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy-btn";
    button.setAttribute("aria-label", "Copy code");
    button.textContent = "Copy";
    button.addEventListener("click", function () {
      var text = getCodeText(pre);
      copyText(text)
        .then(function () {
          markCopied(button);
        })
        .catch(function () {
          button.textContent = "Failed";
          window.clearTimeout(button.__copyTimeout);
          button.__copyTimeout = window.setTimeout(function () {
            button.textContent = "Copy";
          }, 1600);
        });
    });

    container.appendChild(button);
  }

  function initCopyButtons() {
    var pres = document.querySelectorAll("pre");
    for (var i = 0; i < pres.length; i += 1) {
      var pre = pres[i];
      if (pre.closest(".highlight") || pre.querySelector("code") || pre.classList.contains("hljs")) {
        attachCopyButton(pre);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCopyButtons);
  } else {
    initCopyButtons();
  }
})();
