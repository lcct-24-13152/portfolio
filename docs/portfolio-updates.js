"use strict";

(() => {
    const VERSION = "20260818-1952";

    const CERTIFICATES = [
        {
            id: "business-tech-2026",
            title: "Bridging Business and Technology for the Next Generation",
            issuer: "La Consolacion College Tanauan · IT Week 2026",
            date: "March 21, 2026",
            image: "assets/certificates/bridging-business-technology-2026.jpg"
        },
        {
            id: "robotics-experience-2026",
            title: "Design, Build, Innovate: The Robotics Experience",
            issuer: "First Eduspec Inc. / LCCT · ICT Week 2026",
            date: "March 19, 2026",
            image: "assets/certificates/robotics-experience-2026.jpg"
        }
    ];

    function imageUrl(path) {
        return `${path}?v=${VERSION}`;
    }

    function getCertificateSource(certificate) {
        if (
            certificate.id === "business-tech-2026" &&
            typeof window.__BRIDGE_EXACT === "string" &&
            window.__BRIDGE_EXACT.startsWith("/9j/")
        ) {
            return `data:image/jpeg;base64,${window.__BRIDGE_EXACT}`;
        }

        return imageUrl(certificate.image);
    }

    function installCertificateStyles() {
        if (document.querySelector("#certificateImageRepairStyles")) return;

        const style = document.createElement("style");
        style.id = "certificateImageRepairStyles";
        style.textContent = `
            #certificates [data-added-certificate] .certificate-preview {
                display: grid !important;
                place-items: center !important;
                overflow: hidden !important;
                background: #ffffff !important;
            }

            #certificates [data-added-certificate] .certificate-preview img {
                display: block !important;
                width: 100% !important;
                height: 100% !important;
                object-fit: contain !important;
                object-position: center !important;
                image-rendering: auto !important;
                filter: none !important;
                opacity: 1 !important;
                transform: none !important;
            }

            #certificates [data-added-certificate] .certificate-preview:hover img {
                filter: none !important;
                transform: none !important;
            }
        `;

        document.head.appendChild(style);
    }

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

    function createOrRepairCertificateCard(certificate) {
        const grid = document.querySelector("#certificates .certificate-grid");
        if (!grid) return;

        let article = grid.querySelector(`[data-added-certificate="${certificate.id}"]`);

        if (!article) {
            article = document.createElement("article");
            article.className = "certificate-card reveal visible";
            article.dataset.addedCertificate = certificate.id;
            grid.appendChild(article);
        }

        const source = getCertificateSource(certificate);

        article.innerHTML = `
            <a class="certificate-preview" href="${source}" target="_blank" rel="noopener noreferrer" aria-label="View ${certificate.title} certificate">
                <img src="${source}" alt="${certificate.title} signed certificate" loading="eager" decoding="async">
                <span>VIEW</span>
            </a>
            <div class="certificate-body">
                <p class="certificate-type">CERTIFICATE OF PARTICIPATION</p>
                <h3>${certificate.title}</h3>
                <p class="certificate-date">${certificate.issuer} · ${certificate.date}</p>
                <a class="certificate-button" href="${source}" target="_blank" rel="noopener noreferrer">VIEW SIGNED CERTIFICATE</a>
            </div>
        `;
    }

    function addCertificateCards() {
        CERTIFICATES.forEach(createOrRepairCertificateCard);
    }

    function addResumeCertificates() {
        const list = document.querySelector("#resumeTemplate .resume-certifications");
        if (!list) return;

        const items = [
            ["resume-business-tech-2026", "Bridging Business and Technology for the Next Generation", "La Consolacion College Tanauan · Mar 21, 2026"],
            ["resume-robotics-experience-2026", "Design, Build, Innovate: The Robotics Experience", "First Eduspec Inc. / LCCT · Mar 19, 2026"]
        ];

        items.forEach(([id, title, meta]) => {
            let block = list.querySelector(`[data-added-resume-cert="${id}"]`);

            if (!block) {
                block = document.createElement("div");
                block.className = "resume-cert-item";
                block.dataset.addedResumeCert = id;
                list.appendChild(block);
            }

            block.innerHTML = `<strong>${title}</strong><span>${meta}</span>`;
        });
    }

    function applyUpdates() {
        installCertificateStyles();
        patchResumeLocation();
        addCertificateCards();
        addResumeCertificates();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", applyUpdates, { once: true });
    } else {
        applyUpdates();
    }

    window.setTimeout(applyUpdates, 700);
})();