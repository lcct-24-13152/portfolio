"use strict";

(() => {
    const current = document.currentScript;
    const base = current
        ? new URL(".", current.src)
        : new URL("./", window.location.href);

    function loadScript(fileName) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = new URL(fileName, base).href;
            script.async = false;
            script.addEventListener("load", resolve, { once: true });
            script.addEventListener("error", reject, { once: true });
            document.head.appendChild(script);
        });
    }

    loadScript("responsive-core.js?v=20260818-1629")
        .then(() => loadScript("portfolio-updates.js?v=20260818-1629"))
        .catch((error) => {
            console.error("Portfolio update failed to load:", error);
        });
})();
