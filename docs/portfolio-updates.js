"use strict";

(() => {
    const CERTIFICATES = [
        {
            id: "business-tech-2026",
            title: "Bridging Business and Technology for the Next Generation",
            issuer: "La Consolacion College Tanauan · IT Week 2026",
            date: "March 21, 2026",
            image: () => `data:image/jpeg;base64,${window.__CERT1 || ""}`
        },
        {
            id: "robotics-experience-2026",
            title: "Design, Build, Innovate: The Robotics Experience",
            issuer: "First Eduspec Inc. / LCCT · ICT Week 2026",
            date: "March 19, 2026",
            image: () => `data:image/jpeg;base64,${window.__CERT2 || ""}`
        }
    ];

    function patchResumeLocation() {
        const resume = document.querySelector("#resumeTemplate");
        if (!resume) return;

        resume.querySelectorAll("*").forEach((element) => {
            if (element.children.length > 0) return;
            if ((element.textContent || "").trim() === "Philippines") {
                element.textContent = "Tanauan City, Batangas";
            }
        });
    }

    function addCertificateCards() {
        const grid = document.querySelector("#certificates .certificate-grid");
        if (!grid) return;

        CERTIFICATES.forEach((certificate) => {
            if (grid.querySelector(`[data-added-certificate="${certificate.id}"]`)) return;
            const image = certificate.image();
            if (!image || image.endsWith(",")) return;

            const article = document.createElement("article");
            article.className = "certificate-card reveal visible";
            article.dataset.addedCertificate = certificate.id;
            article.innerHTML = `
                <a class="certificate-preview" href="${image}" target="_blank" rel="noopener noreferrer" aria-label="View ${certificate.title} certificate">
                    <img src="${image}" alt="${certificate.title} certificate" loading="lazy">
                    <span>VIEW</span>
                </a>
                <div class="certificate-body">
                    <p class="certificate-type">CERTIFICATE OF PARTICIPATION</p>
                    <h3>${certificate.title}</h3>
                    <p class="certificate-date">${certificate.issuer} · ${certificate.date}</p>
                    <a class="certificate-button" href="${image}" target="_blank" rel="noopener noreferrer">VIEW CERTIFICATE</a>
                </div>`;
            grid.appendChild(article);
        });
    }

    function addResumeCertificates() {
        const list = document.querySelector("#resumeTemplate .resume-certifications");
        if (!list) return;

        const items = [
            ["resume-business-tech-2026", "Bridging Business and Technology for the Next Generation", "La Consolacion College Tanauan · Mar 21, 2026"],
            ["resume-robotics-experience-2026", "Design, Build, Innovate: The Robotics Experience", "First Eduspec Inc. / LCCT · Mar 19, 2026"]
        ];

        items.forEach(([id, title, meta]) => {
            if (list.querySelector(`[data-added-resume-cert="${id}"]`)) return;
            const block = document.createElement("div");
            block.className = "resume-cert-item";
            block.dataset.addedResumeCert = id;
            block.innerHTML = `<strong>${title}</strong><span>${meta}</span>`;
            list.appendChild(block);
        });
    }

    function autoStartAfterCountdown() {
        window.clearTimeout(window.__snakeAutoStartTimer);
        window.__snakeAutoStartTimer = window.setTimeout(() => {
            if (window.portfolioRouter?.getMode?.() !== "game") return;
            document.dispatchEvent(new KeyboardEvent("keydown", {
                key: "ArrowRight",
                code: "ArrowRight",
                bubbles: true,
                cancelable: true
            }));
        }, 3050);
    }

    function patchSnakeRestart() {
        const snakeGame = window.portfolioSnakeGame;
        if (!snakeGame || snakeGame.__autoStartPatched) return false;
        const originalRestart = snakeGame.restart.bind(snakeGame);
        snakeGame.restart = () => {
            originalRestart();
            autoStartAfterCountdown();
        };
        snakeGame.__autoStartPatched = true;
        return true;
    }

    function installSnakeAutoStart() {
        document.querySelector("#restartButton")?.addEventListener("click", autoStartAfterCountdown, true);
        let attempts = 0;
        const timer = window.setInterval(() => {
            attempts += 1;
            if (patchSnakeRestart() || attempts > 120) window.clearInterval(timer);
        }, 50);
    }

    patchResumeLocation();
    addCertificateCards();
    addResumeCertificates();
    installSnakeAutoStart();
})();
