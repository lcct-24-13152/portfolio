"use strict";

(() => {
    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

    const PORTFOLIO_PAGES = ["about", "skills", "projects", "resume", "certificates", "contact"];
    const PORTFOLIO_PAGE_SET = new Set(PORTFOLIO_PAGES);
    const TRANSITION_MS = 380;

    let mode = "home";
    let activeGamePage = null;
    let transitionBusy = false;
    let toastTimer = null;

    const header = $("#header");
    const menuButton = $("#menuButton");
    const navLinks = $("#navLinks");
    const themeButton = $("#themeButton");

    window.addEventListener("scroll", () => {
        header?.classList.toggle("scrolled", window.scrollY > 15);
    });

    menuButton?.addEventListener("click", () => {
        const opened = navLinks?.classList.toggle("open");
        menuButton.classList.toggle("active", Boolean(opened));
        document.body.classList.toggle("menu-open", Boolean(opened));
    });

    function closeMobileMenu() {
        navLinks?.classList.remove("open");
        menuButton?.classList.remove("active");
        document.body.classList.remove("menu-open");
    }

    const savedTheme = localStorage.getItem("cherPortfolioTheme");
    if (savedTheme === "light") document.body.classList.add("light-mode");

    themeButton?.addEventListener("click", () => {
        const isLight = document.body.classList.toggle("light-mode");
        localStorage.setItem("cherPortfolioTheme", isLight ? "light" : "dark");
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.10 });

    $$(".reveal").forEach((element) => revealObserver.observe(element));

    const projectInformation = {
        1: {
            label: "PERSONAL WEBSITE",
            title: "Interactive Portfolio",
            description: "A responsive personal portfolio with dark mode, animated sections, project filtering, a printable resume, and an interactive Snake navigation game.",
            tools: ["HTML", "CSS", "JavaScript"],
            url: "https://lcct-24-13152.github.io/portfolio/",
            linkText: "OPEN LIVE PORTFOLIO ↗"
        },
        2: {
            label: "WEB SYSTEM",
            title: "Reservation System",
            description: "A reservation system concept that manages schedules, availability, customer details, bookings, payments, and reports.",
            tools: ["PHP", "MySQL", "JavaScript"],
            url: "",
            linkText: ""
        },
        3: {
            label: "MANAGEMENT SYSTEM",
            title: "Laundry Management",
            description: "A management system for recording customers, laundry services, transactions, inventory, payments, receipts, reports, and QR-based laundry status tracking.",
            tools: ["PHP", "MySQL", "CRUD"],
            url: "https://disabled-sprint-depends-lighter.trycloudflare.com/laundry-system/auth/login.php",
            linkText: "OPEN LIVE SYSTEM ↗"
        }
    };

    $$(".filter").forEach((button) => {
        button.addEventListener("click", () => {
            const selected = button.dataset.filter;
            $$(".filter").forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            $$(".project-card").forEach((card) => {
                const visible = selected === "all" || card.dataset.category === selected;
                card.classList.toggle("hide", !visible);
            });
        });
    });

    const projectModal = $("#projectModal");

    function openProjectModal(number) {
        const project = projectInformation[number];
        if (!project || !projectModal) return;

        const modalLabel = $("#modalLabel");
        const modalTitle = $("#modalTitle");
        const modalDescription = $("#modalDescription");
        const modalTools = $("#modalTools");
        const modalProjectLink = $("#modalProjectLink");

        if (modalLabel) modalLabel.textContent = project.label;
        if (modalTitle) modalTitle.textContent = project.title;
        if (modalDescription) modalDescription.textContent = project.description;
        if (modalTools) modalTools.innerHTML = project.tools.map((tool) => `<span>${tool}</span>`).join("");

        if (modalProjectLink) {
            if (project.url) {
                modalProjectLink.href = project.url;
                modalProjectLink.textContent = project.linkText || "OPEN PROJECT ↗";
                modalProjectLink.classList.add("show");
            } else {
                modalProjectLink.removeAttribute("href");
                modalProjectLink.classList.remove("show");
            }
        }

        projectModal.classList.add("open");
        projectModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
    }

    function closeProjectModal() {
        if (!projectModal) return;
        projectModal.classList.remove("open");
        projectModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
    }

    $$(".project-open").forEach((button) => {
        button.addEventListener("click", () => openProjectModal(button.dataset.project));
    });

    $$('[data-close-modal]').forEach((element) => {
        element.addEventListener("click", closeProjectModal);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeProjectModal();
    });

    const toast = $("#toast");

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3000);
    }

    const contactForm = $("#contactForm");
    const contactSubmitButton = $("#contactSubmitButton");

    contactForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = $("#contactName")?.value.trim();
        const email = $("#contactEmail")?.value.trim();
        const subject = $("#contactSubject")?.value.trim();
        const message = $("#contactMessage")?.value.trim();

        if (!name || !email || !subject || !message) {
            showToast("COMPLETE ALL FIELDS");
            return;
        }

        const staticSite = location.hostname.endsWith("github.io") || location.protocol === "file:";

        if (staticSite) {
            const emailSubject = encodeURIComponent(subject);
            const emailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
            showToast("OPENING EMAIL APP...");
            location.href = `mailto:liriocher25@gmail.com?subject=${emailSubject}&body=${emailBody}`;
            return;
        }

        const originalText = contactSubmitButton?.textContent || "SEND MESSAGE";

        if (contactSubmitButton) {
            contactSubmitButton.disabled = true;
            contactSubmitButton.textContent = "SENDING...";
        }

        try {
            const response = await fetch("index.php", {
                method: "POST",
                body: new FormData(contactForm),
                headers: { "X-Requested-With": "XMLHttpRequest" }
            });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.message || "Unable to save your message.");
            contactForm.reset();
            showToast("MESSAGE SAVED SUCCESSFULLY");
        } catch (error) {
            showToast(error.message || "DATABASE ERROR.");
        } finally {
            if (contactSubmitButton) {
                contactSubmitButton.disabled = false;
                contactSubmitButton.textContent = originalText;
            }
        }
    });

    function installRouterStyles() {
        if ($("#portfolioRouterStyles")) return;

        const style = document.createElement("style");
        style.id = "portfolioRouterStyles";
        style.textContent = `
            html.portfolio-router, body.portfolio-router { width: 100%; min-height: 100%; }
            html.portfolio-router:not(.browse-mode), body.portfolio-router:not(.browse-mode) { height: 100%; overflow: hidden !important; overscroll-behavior: none; }
            body.portfolio-router:not(.browse-mode) main { position: relative; width: 100%; height: 100vh; height: 100svh; overflow: hidden; }
            body.portfolio-router:not(.browse-mode) main > section { position: absolute; inset: 0; display: none !important; width: 100%; height: 100vh; height: 100svh; min-height: 0 !important; overflow-x: hidden; overflow-y: auto; overscroll-behavior: contain; }
            body.portfolio-router:not(.browse-mode) main > section.route-active { z-index: 2; display: block !important; animation: portfolioEnter ${TRANSITION_MS}ms cubic-bezier(.2,.75,.25,1) both; }
            body.portfolio-router:not(.browse-mode) #home.route-active { display: grid !important; overflow: hidden !important; padding-bottom: 0 !important; }
            body.portfolio-router:not(.browse-mode) #game.route-active { display: block !important; }
            body.portfolio-router:not(.browse-mode) .footer { display: none !important; }
            @keyframes portfolioEnter { from { opacity: 0; transform: translateY(22px) scale(.995); } to { opacity: 1; transform: translateY(0) scale(1); } }
            .portfolio-route-cover { position: fixed; z-index: 99990; inset: 0; background: var(--background); opacity: 0; visibility: hidden; pointer-events: none; transition: opacity 180ms ease, visibility 180ms ease; }
            .portfolio-route-cover.show { opacity: 1; visibility: visible; pointer-events: auto; }
            #home .hero-description.home-choice-text { max-width: 760px; padding-left: 16px; border-left: 2px solid var(--primary); color: var(--muted); line-height: 1.54; }
            #home .hero-description.home-choice-text strong { color: var(--primary); font-size: .78rem; font-weight: 900; letter-spacing: .07em; }
            #home .hero-description.home-choice-text b { color: var(--text); }
            .game-return-panel { width: min(calc(100% - 40px), var(--container)); margin: 32px auto 0; padding: 28px; border: 1px solid var(--border); border-radius: var(--radius); background: linear-gradient(135deg, color-mix(in srgb, var(--primary) 8%, var(--card)), var(--card)); text-align: center; box-shadow: var(--shadow); }
            .game-return-panel p { max-width: 620px; margin: 0 auto 16px; color: var(--muted); font-size: .9rem; }
            html.browse-mode, body.browse-mode { height: auto !important; overflow-x: hidden !important; overflow-y: auto !important; overscroll-behavior: auto; }
            body.browse-mode main { position: static !important; height: auto !important; overflow: visible !important; }
            body.browse-mode main > section { position: relative !important; inset: auto !important; display: block !important; width: 100%; height: auto !important; min-height: auto !important; overflow: visible !important; opacity: 1 !important; transform: none !important; animation: none !important; }
            body.browse-mode #home, body.browse-mode #game { display: none !important; }
            body.browse-mode .footer { display: block !important; }
            @media (prefers-reduced-motion: reduce) { body.portfolio-router main > section.route-active { animation-duration: 1ms !important; } .portfolio-route-cover { transition-duration: 1ms !important; } }
            @media (max-width: 900px) { body.portfolio-router:not(.browse-mode) #home.route-active { padding-top: calc(var(--header-height) + 20px); } #home .hero-grid { gap: 24px; } #home .hero-description.home-choice-text { font-size: .86rem; line-height: 1.44; } }
            @media (max-width: 600px) { body.portfolio-router:not(.browse-mode) #home.route-active { padding-top: calc(var(--header-height) + 8px); } #home .hero-grid { gap: 12px; } #home .hero-description.home-choice-text { margin-top: 10px; padding-left: 10px; font-size: .75rem; line-height: 1.37; } #home .hero-buttons { margin-top: 15px; } .game-return-panel { width: min(calc(100% - 24px), var(--container)); padding: 20px 15px; } }
        `;
        document.head.appendChild(style);
    }

    function createTransitionCover() {
        const cover = document.createElement("div");
        cover.id = "portfolioRouteCover";
        cover.className = "portfolio-route-cover";
        document.body.appendChild(cover);
    }

    function withTransition(callback) {
        if (transitionBusy) return;
        const cover = $("#portfolioRouteCover");
        transitionBusy = true;
        cover?.classList.add("show");
        window.setTimeout(() => {
            callback();
            window.setTimeout(() => {
                cover?.classList.remove("show");
                window.setTimeout(() => { transitionBusy = false; }, 190);
            }, 40);
        }, 185);
    }

    function setBrowseMode(enabled) {
        document.documentElement.classList.toggle("browse-mode", enabled);
        document.body.classList.toggle("browse-mode", enabled);
    }

    function clearSinglePages() {
        $$("main > section[id]").forEach((section) => {
            section.classList.remove("route-active");
            section.setAttribute("aria-hidden", "true");
        });
    }

    function showSinglePage(pageId) {
        const target = document.getElementById(pageId);
        if (!target) return;
        clearSinglePages();
        target.classList.add("route-active");
        target.setAttribute("aria-hidden", "false");
        target.scrollTop = 0;
        window.scrollTo(0, 0);
    }

    function setActiveNav(pageId) {
        $$(".nav-links a").forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href") === `#${pageId}`);
        });
    }

    function setHash(pageId) {
        history.replaceState({ mode, pageId }, "", `${location.pathname}${location.search}#${pageId}`);
    }

    function configureHomeChoices() {
        const description = $("#home .hero-description");
        if (description) {
            description.classList.add("home-choice-text");
            description.innerHTML = `<strong>CHOOSE HOW YOU WANT TO VIEW MY PORTFOLIO:</strong><br><b>PLAY GAME</b> — play Snake, eat food to make the snake longer, and touch a section box to open that page.<br><b>BROWSE PORTFOLIO</b> — skip the game and scroll normally from About all the way to Contact.`;
        }

        const buttons = $("#home .hero-buttons");
        if (!buttons) return;

        const gameButton = buttons.querySelector('a[href="#game"]');
        if (gameButton) {
            gameButton.textContent = "PLAY GAME";
            gameButton.dataset.homeGameChoice = "true";
        }

        let browseButton = buttons.querySelector('a[href="#resume"]');
        if (!browseButton) {
            browseButton = document.createElement("a");
            browseButton.className = "button outline-button";
            buttons.appendChild(browseButton);
        }
        browseButton.href = "#about";
        browseButton.textContent = "BROWSE PORTFOLIO";
        browseButton.dataset.homeBrowseChoice = "true";
    }

    function configureGameText() {
        const description = $("#game .section-description");
        if (description) {
            description.textContent = "Classic Snake navigation: wait for 3 → 2 → 1 → START!, then move with Arrow Keys/WASD on desktop or swipe/use the arrow buttons on mobile. Eat the glowing food to increase the score and make the snake longer. Keep playing until the snake touches About, Skills, Projects, Resume, Certificates, or Contact. Touching a section box opens that page.";
        }
    }

    function addGameAgainButtons() {
        PORTFOLIO_PAGES.forEach((pageId) => {
            const section = document.getElementById(pageId);
            if (!section || section.querySelector(".game-return-panel")) return;
            const panel = document.createElement("div");
            panel.className = "game-return-panel";
            panel.innerHTML = `<p>Want to visit another section through the game? Use this button instead of the GAME menu.</p><button class="button primary-button" type="button" data-play-game-again>PLAY GAME AGAIN</button>`;
            section.appendChild(panel);
        });
    }

    function enterHome(transition = true) {
        const apply = () => {
            mode = "home";
            activeGamePage = null;
            setBrowseMode(false);
            showSinglePage("home");
            setActiveNav("home");
            setHash("home");
            closeMobileMenu();
        };
        transition ? withTransition(apply) : apply();
    }

    function restartGameSoon() {
        window.setTimeout(() => window.portfolioSnakeGame?.restart?.(), 470);
    }

    function enterGame(transition = true) {
        const apply = () => {
            mode = "game";
            activeGamePage = null;
            setBrowseMode(false);
            showSinglePage("game");
            setActiveNav("game");
            setHash("game");
            closeMobileMenu();
            restartGameSoon();
        };
        transition ? withTransition(apply) : apply();
    }

    function openGamePage(pageId) {
        if (!PORTFOLIO_PAGE_SET.has(pageId)) return;
        withTransition(() => {
            mode = "game-page";
            activeGamePage = pageId;
            setBrowseMode(false);
            showSinglePage(pageId);
            setActiveNav(pageId);
            setHash(pageId);
            closeMobileMenu();
        });
    }

    function enterBrowse(transition = true) {
        const apply = () => {
            mode = "browse";
            activeGamePage = null;
            clearSinglePages();
            setBrowseMode(true);
            setActiveNav("about");
            setHash("about");
            closeMobileMenu();
            window.scrollTo({ top: 0, behavior: "instant" });
        };
        transition ? withTransition(apply) : apply();
    }

    function getPageFromLink(link) {
        const href = link?.getAttribute("href") || "";
        if (!href.startsWith("#")) return null;
        const id = href.slice(1);
        if (id === "home" || id === "game" || PORTFOLIO_PAGE_SET.has(id)) return id;
        const target = document.getElementById(id);
        return target?.closest("main > section[id]")?.id || null;
    }

    document.addEventListener("click", (event) => {
        const playAgain = event.target.closest?.("[data-play-game-again]");
        if (playAgain) {
            event.preventDefault();
            enterGame();
            return;
        }

        const link = event.target.closest?.('a[href^="#"]');
        if (!link) return;
        const pageId = getPageFromLink(link);
        if (!pageId) return;

        if (mode === "home") {
            event.preventDefault();
            if (link.dataset.homeGameChoice === "true") {
                enterGame();
                return;
            }
            if (link.dataset.homeBrowseChoice === "true") {
                enterBrowse();
                return;
            }
            if (pageId === "home") return;
            showToast("CHOOSE PLAY GAME OR BROWSE PORTFOLIO");
            return;
        }

        if (mode === "browse") {
            if (pageId === "home") {
                event.preventDefault();
                enterHome();
                return;
            }
            if (pageId === "game") {
                event.preventDefault();
                enterGame();
                return;
            }
            return;
        }

        if (mode === "game") {
            if (pageId === "home") {
                event.preventDefault();
                enterHome();
                return;
            }
            if (pageId === "game") {
                event.preventDefault();
                return;
            }
            if (PORTFOLIO_PAGE_SET.has(pageId)) {
                event.preventDefault();
                showToast(`HIT THE ${pageId.toUpperCase()} BOX WITH THE SNAKE`);
                return;
            }
        }

        if (mode === "game-page") {
            if (pageId === "home") {
                event.preventDefault();
                enterHome();
                return;
            }
            if (pageId === "game") {
                event.preventDefault();
                showToast("USE PLAY GAME AGAIN AT THE BOTTOM");
                return;
            }
            if (PORTFOLIO_PAGE_SET.has(pageId) && pageId !== activeGamePage) {
                event.preventDefault();
                showToast("USE PLAY GAME AGAIN TO CHOOSE ANOTHER SECTION");
                return;
            }
        }
    }, true);

    document.addEventListener("wheel", (event) => {
        if (mode === "home") event.preventDefault();
    }, { passive: false });

    document.addEventListener("touchmove", (event) => {
        if (mode === "home") event.preventDefault();
    }, { passive: false });

    const browseObserver = new IntersectionObserver((entries) => {
        if (mode !== "browse") return;
        entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveNav(entry.target.id);
        });
    }, { rootMargin: "-35% 0px -55% 0px" });

    PORTFOLIO_PAGES.forEach((pageId) => {
        const section = document.getElementById(pageId);
        if (section) browseObserver.observe(section);
    });

    window.addEventListener("portfolio:game-target", (event) => {
        const pageId = event.detail?.id;
        if (mode === "game" && PORTFOLIO_PAGE_SET.has(pageId)) openGamePage(pageId);
    });

    function loadSnakeGame() {
        const script = document.createElement("script");
        script.src = "game-core.js?v=20260818-1525";
        script.async = false;
        script.addEventListener("error", () => {
            showToast("SNAKE GAME FAILED TO LOAD. REFRESH THE PAGE.");
        }, { once: true });
        document.head.appendChild(script);
    }

    installRouterStyles();
    createTransitionCover();
    document.documentElement.classList.add("portfolio-router");
    document.body.classList.add("portfolio-router");

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    configureHomeChoices();
    configureGameText();
    addGameAgainButtons();
    enterHome(false);
    loadSnakeGame();

    window.portfolioRouter = {
        home: enterHome,
        game: enterGame,
        browse: enterBrowse,
        getMode() { return mode; }
    };
})();
