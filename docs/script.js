"use strict";

/* =========================================================
   CHER MICOLE PORTFOLIO - GAME CONTROLLED NAVIGATION
   ---------------------------------------------------------
   HOME is locked to the first screen.
   GAME is the only way to open:
   ABOUT, SKILLS, PROJECTS, RESUME, CERTIFICATES, CONTACT.

   The existing Snake Game engine is kept in game-core.js.
   ========================================================= */

(() => {
    const PAGE_IDS = new Set([
        "home",
        "game",
        "about",
        "skills",
        "projects",
        "resume",
        "certificates",
        "contact"
    ]);

    const GAME_ONLY_IDS = new Set([
        "about",
        "skills",
        "projects",
        "resume",
        "certificates",
        "contact"
    ]);

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    let activePage = "home";

    function installLockedPageStyles() {
        const style = document.createElement("style");

        style.id = "gameOnlyNavigationStyles";
        style.textContent = `
            html.game-only-navigation,
            body.game-only-navigation {
                width: 100%;
                height: 100%;
                overflow: hidden !important;
                overscroll-behavior: none;
            }

            body.game-only-navigation main {
                position: relative;
                width: 100%;
                height: 100vh;
                height: 100svh;
                overflow: hidden;
            }

            body.game-only-navigation main > section {
                display: none !important;
                width: 100%;
                height: 100vh;
                height: 100svh;
                min-height: 0 !important;
                overflow-x: hidden;
                overflow-y: auto;
                overscroll-behavior: contain;
            }

            body.game-only-navigation
            main > section.portfolio-page-active {
                display: block !important;
            }

            body.game-only-navigation
            #home.portfolio-page-active {
                display: grid !important;
                height: 100vh;
                height: 100svh;
                min-height: 0 !important;
                overflow: hidden !important;
                padding-bottom: 0 !important;
            }

            body.game-only-navigation
            #game.portfolio-page-active {
                display: block !important;
            }

            body.game-only-navigation .footer {
                display: none !important;
            }

            body.game-only-navigation
            .hero-description.game-instruction {
                max-width: 720px;
                padding-left: 15px;
                border-left: 2px solid var(--primary);
                color: var(--muted);
                line-height: 1.58;
            }

            body.game-only-navigation
            .hero-description.game-instruction strong {
                color: var(--primary);
                font-weight: 900;
            }

            body.game-only-navigation
            .nav-links a.game-locked-link {
                cursor: pointer;
            }

            @media (max-width: 900px) {
                body.game-only-navigation
                #home.portfolio-page-active {
                    padding-top:
                        calc(var(--header-height) + 24px);
                }

                body.game-only-navigation
                #home .hero-grid {
                    gap: 28px;
                }
            }

            @media (max-width: 600px) {
                body.game-only-navigation
                #home.portfolio-page-active {
                    padding-top:
                        calc(var(--header-height) + 10px);
                }

                body.game-only-navigation
                #home .hero-grid {
                    gap: 14px;
                }

                body.game-only-navigation
                .hero-description.game-instruction {
                    margin-top: 12px;
                    padding-left: 11px;
                    font-size: 0.82rem;
                    line-height: 1.45;
                }

                body.game-only-navigation
                #home .hero-buttons {
                    margin-top: 18px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function updateActiveNavigation(pageId) {
        $$(".nav-links a").forEach((link) => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${pageId}`
            );
        });
    }

    function closeMobileMenu() {
        $("#navLinks")?.classList.remove("open");
        $("#menuButton")?.classList.remove("active");
        document.body.classList.remove("menu-open");
    }

    function setGameMessage(text) {
        const message = $("#gameMessage");

        if (message) {
            message.textContent = text;
        }
    }

    function showPage(
        pageId,
        {
            fromGame = false,
            updateHash = true
        } = {}
    ) {
        if (!PAGE_IDS.has(pageId)) {
            pageId = "home";
        }

        if (GAME_ONLY_IDS.has(pageId) && !fromGame) {
            pageId = "game";
        }

        const target = document.getElementById(pageId);

        if (!target) {
            return;
        }

        $$("main > section[id]").forEach((section) => {
            section.classList.toggle(
                "portfolio-page-active",
                section.id === pageId
            );
        });

        activePage = pageId;
        target.scrollTop = 0;

        updateActiveNavigation(pageId);
        closeMobileMenu();

        if (updateHash) {
            const newUrl =
                `${location.pathname}${location.search}#${pageId}`;

            history.replaceState(
                { portfolioPage: pageId },
                "",
                newUrl
            );
        }

        window.scrollTo(0, 0);
    }

    function getProtectedPage(element) {
        if (!element) {
            return null;
        }

        if (
            element.matches?.("main > section[id]") &&
            GAME_ONLY_IDS.has(element.id)
        ) {
            return element.id;
        }

        const section =
            element.closest?.("main > section[id]");

        if (
            section &&
            GAME_ONLY_IDS.has(section.id)
        ) {
            return section.id;
        }

        return null;
    }

    function replaceHomeDescription() {
        const heroDescription =
            $("#home .hero-description");

        if (!heroDescription) {
            return;
        }

        heroDescription.classList.add(
            "game-instruction"
        );

        heroDescription.innerHTML = `
            <strong>HOW TO USE THE GAME:</strong>
            Click <b>PLAY GAME</b> and wait for
            <b>3 → 2 → 1 → START!</b>.
            On laptop/desktop, use
            <b>Arrow Keys or WASD</b>.
            On phone/tablet, <b>swipe</b> on the game
            or use the <b>arrow buttons</b>.
            Guide the snake into
            <b>ABOUT, SKILLS, PROJECTS, RESUME,
            CERTIFICATES, or CONTACT</b>.
            The page will open only when the snake
            touches its target.
        `;
    }

    function configureLockedLinks() {
        $$(".nav-links a").forEach((link) => {
            const href =
                link.getAttribute("href") || "";

            if (!href.startsWith("#")) {
                return;
            }

            const pageId = href.slice(1);

            if (GAME_ONLY_IDS.has(pageId)) {
                link.classList.add(
                    "game-locked-link"
                );

                link.title =
                    `${pageId.toUpperCase()} opens through the Snake Game`;
            }
        });

        const resumeButton =
            $('#home .hero-buttons a[href="#resume"]');

        if (resumeButton) {
            resumeButton.textContent =
                "RESUME VIA GAME";

            resumeButton.title =
                "Play the Snake Game to open Resume";
        }
    }

    function configureGameInstructions() {
        const gameDescription =
            $("#game .section-description");

        if (gameDescription) {
            gameDescription.textContent =
                "Wait for 3 → 2 → 1 → START! before moving. Use Arrow Keys/WASD on laptop or desktop. On phones and tablets, swipe on the board or use the arrow buttons. Touch one of the six labeled targets with the snake to open that portfolio page.";
        }
    }

    function installNavigationGuard() {
        document.addEventListener(
            "click",
            (event) => {
                const link =
                    event.target.closest?.(
                        'a[href^="#"]'
                    );

                if (!link) {
                    return;
                }

                const href =
                    link.getAttribute("href") || "";

                const pageId =
                    href.startsWith("#")
                        ? href.slice(1)
                        : "";

                if (!PAGE_IDS.has(pageId)) {
                    return;
                }

                event.preventDefault();

                if (
                    GAME_ONLY_IDS.has(pageId)
                ) {
                    showPage("game");

                    setGameMessage(
                        `USE THE SNAKE TO OPEN ${pageId.toUpperCase()}`
                    );

                    return;
                }

                showPage(pageId);
            },
            true
        );
    }

    const originalScrollIntoView =
        Element.prototype.scrollIntoView;

    Element.prototype.scrollIntoView =
        function (...args) {
            const protectedPage =
                getProtectedPage(this);

            if (protectedPage) {
                showPage(
                    protectedPage,
                    {
                        fromGame: true,
                        updateHash: true
                    }
                );

                return;
            }

            return originalScrollIntoView.apply(
                this,
                args
            );
        };

    function loadGameEngine() {
        return new Promise(
            (resolve, reject) => {
                const script =
                    document.createElement(
                        "script"
                    );

                script.src = "game-core.js";
                script.async = false;

                script.addEventListener(
                    "load",
                    resolve,
                    { once: true }
                );

                script.addEventListener(
                    "error",
                    reject,
                    { once: true }
                );

                document.head.appendChild(
                    script
                );
            }
        );
    }

    installLockedPageStyles();

    document.documentElement.classList.add(
        "game-only-navigation"
    );

    document.body.classList.add(
        "game-only-navigation"
    );

    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    replaceHomeDescription();
    configureLockedLinks();
    configureGameInstructions();
    installNavigationGuard();

    showPage(
        "home",
        {
            fromGame: false,
            updateHash: true
        }
    );

    loadGameEngine().catch(() => {
        console.error(
            "Unable to load the Snake Game engine."
        );

        showPage("game");

        setGameMessage(
            "GAME ENGINE FAILED TO LOAD. REFRESH THE PAGE."
        );
    });

    window.portfolioNavigation = {
        home() {
            showPage("home");
        },

        game() {
            showPage("game");
        },

        activePage() {
            return activePage;
        }
    };
})();
