"use strict";

(() => {
    const sharpImage = (value, fallback) => value
        ? `data:image/webp;base64,${value}`
        : fallback;

    const CERTIFICATES = [
        {
            id: "business-tech-2026",
            title: "Bridging Business and Technology for the Next Generation",
            issuer: "La Consolacion College Tanauan · IT Week 2026",
            date: "March 21, 2026",
            image: sharpImage(window.__CERT_HQ1, "assets/certificates/bridging-business-technology-2026.jpg")
        },
        {
            id: "robotics-experience-2026",
            title: "Design, Build, Innovate: The Robotics Experience",
            issuer: "First Eduspec Inc. / LCCT · ICT Week 2026",
            date: "March 19, 2026",
            image: sharpImage(window.__CERT_HQ2, "assets/certificates/robotics-experience-2026.jpg")
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

            const article = document.createElement("article");
            article.className = "certificate-card reveal visible";
            article.dataset.addedCertificate = certificate.id;
            article.innerHTML = `
                <a class="certificate-preview" href="${certificate.image}" target="_blank" rel="noopener noreferrer" aria-label="View ${certificate.title} certificate">
                    <img src="${certificate.image}" alt="${certificate.title} certificate" loading="lazy" decoding="async">
                    <span>VIEW</span>
                </a>
                <div class="certificate-body">
                    <p class="certificate-type">CERTIFICATE OF PARTICIPATION</p>
                    <h3>${certificate.title}</h3>
                    <p class="certificate-date">${certificate.issuer} · ${certificate.date}</p>
                    <a class="certificate-button" href="${certificate.image}" target="_blank" rel="noopener noreferrer">VIEW CERTIFICATE</a>
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

    patchResumeLocation();
    addCertificateCards();
    addResumeCertificates();
})();
