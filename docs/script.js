"use strict";

(() => {
    const VERSION = "20260818-1715";
    const current = document.currentScript;
    const base = current
        ? new URL(".", current.src)
        : new URL("./", window.location.href);

    /* Force fresh copies of the dynamically loaded router/game files. */
    const originalAppendChild = Node.prototype.appendChild;
    Node.prototype.appendChild = function (node) {
        if (node?.tagName === "SCRIPT" && node.src) {
            try {
                const url = new URL(node.src, window.location.href);
                if (url.pathname.endsWith("/site-core.js") || url.pathname.endsWith("/game-core.js")) {
                    url.search = `?v=${VERSION}`;
                    node.src = url.href;
                }
            } catch (_) {}
        }
        return originalAppendChild.call(this, node);
    };

    function loadScript(fileName) {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = new URL(`${fileName}?v=${VERSION}`, base).href;
            script.async = false;
            script.addEventListener("load", resolve, { once: true });
            script.addEventListener("error", reject, { once: true });
            document.head.appendChild(script);
        });
    }

    loadScript("responsive-core.js")
        .then(() => loadScript("mobile-game-fix.js"))
        .then(() => loadScript("cert-hq-1.js"))
        .then(() => loadScript("cert-hq-2.js"))
        .then(() => loadScript("portfolio-updates.js"))
        .catch((error) => {
            console.error("Portfolio update failed to load:", error);
        });
})();
