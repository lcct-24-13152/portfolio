"use strict";

/* =========================================================
   CHER MICOLE PORTFOLIO
   GAME-CONTROLLED PAGE NAVIGATION
   =========================================================
   RULES:
   1. The portfolio always opens on HOME.
   2. HOME cannot scroll to another portfolio page.
   3. Only the PLAY GAME button can leave HOME.
   4. ABOUT, SKILLS, PROJECTS, RESUME, CERTIFICATES,
      and CONTACT can only be opened when the snake
      touches their target in the game.
   5. Page changes use a fade/slide transition instead
      of normal document scrolling.
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

    const TRANSITION_MS = 420;

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    let activePage = "home";
    let isTransitioning = false;
    let noticeTimer = null;

    function installNavigationStyles() {
        if ($("#gameNavigationStyles")) {
            return;
        }

        const style = document.createElement("style");
        style.id = "gameNavigationStyles";

        style.textContent = `
            html.game-navigation-mode,
            body.game-navigation-mode {
                width: 100%;
                height: 100%;
                overflow: hidden !important;
                overscroll-behavior: none;
            }

            body.game-navigation-mode main {
                position: relative;
                width: 100%;
                height: 100vh;
                height: 100svh;
                overflow: hidden;
            }

            body.game-navigation-mode main > section {
                position: absolute;
                inset: 0;
                z-index: 0;
                display: none !important;
                width: 100%;
                height: 100vh;
                height: 100svh;
                min-height: 0 !important;
                overflow-x: hidden;
                overflow-y: auto;
                overscroll-behavior: contain;
                opacity: 0;
            }

            body.game-navigation-mode
            main > section.portfolio-page-active,
            body.game-navigation-mode
            main > section.portfolio-page-leaving {
                display: block !important;
            }

            body.game-navigation-mode
            main > section.portfolio-page-active {
                z-index: 2;
                opacity: 1;
                pointer-events: auto;
                animation:
                    portfolioPageIn ${TRANSITION_MS}ms
                    cubic-bezier(.2,.75,.25,1) both;
            }

            body.game-navigation-mode
            main > section.portfolio-page-leaving {
                z-index: 1;
                pointer-events: none;
                animation:
                    portfolioPageOut 340ms
                    cubic-bezier(.4,0,.2,1) both;
            }

            @keyframes portfolioPageIn {
                from {
                    opacity: 0;
                    transform: translate3d(0, 22px, 0) scale(.995);
                }

                to {
                    opacity: 1;
                    transform: translate3d(0, 0, 0) scale(1);
                }
            }

            @keyframes portfolioPageOut {
                from {
                    opacity: 1;
                    transform: translate3d(0, 0, 0) scale(1);
                }

                to {
                    opacity: 0;
                    transform: translate3d(0, -16px, 0) scale(.995);
                }
            }

            body.game-navigation-mode
            #home.portfolio-page-active {
                display: grid !important;
                height: 100vh;
                height: 100svh;
                min-height: 0 !important;
                overflow: hidden !important;
                padding-bottom: 0 !important;
                overscroll-behavior: none;
            }

            body.game-navigation-mode
            #game.portfolio-page-active {
                display: block !important;
            }

            body.game-navigation-mode .footer {
                display: none !important;
            }

            body.game-navigation-mode
            #home .hero-description.game-navigation-instruction {
                max-width: 720px;
                padding-left: 16px;
                border-left: 2px solid var(--primary);
                color: var(--muted);
                font-size: .95rem;
                line-height: 1.58;
            }

            body.game-navigation-mode
            #home .hero-description.game-navigation-instruction
            strong {
                color: var(--primary);
                font-size: .78rem;
                font-weight: 900;
                letter-spacing: .08em;
            }

            body.game-navigation-mode
            .nav-links a.game-only-link {
                opacity: .72;
            }

            body.game-navigation-mode
            .nav-links a.game-only-link:hover {
                opacity: 1;
            }

            body.game-navigation-mode
            #game .section-description {
                max-width: 820px;
            }

            @media (prefers-reduced-motion: reduce) {
                body.game-navigation-mode
                main > section.portfolio-page-active,
                body.game-navigation-mode
                main > section.portfolio-page-leaving {
                    animation-duration: 1ms !important;
                }
            }

            @media (max-width: 900px) {
                body.game-navigation-mode
                #home.portfolio-page-active {
                    padding-top:
                        calc(var(--header-height) + 20px);
                }

                body.game-navigation-mode
                #home .hero-grid {
                    gap: 24px;
                }

                body.game-navigation-mode
                #home .hero-description.game-navigation-instruction {
                    font-size: .88rem;
                    line-height: 1.48;
                }
            }

            @media (max-width: 600px) {
                body.game-navigation-mode
                #home.portfolio-page-active {
                    padding-top:
                        calc(var(--header-height) + 8px);
                }

                body.game-navigation-mode
                #home .hero-grid {
                    gap: 12px;
                }

                body.game-navigation-mode
                #home .hero-description.game-navigation-instruction {
                    margin-top: 12px;
                    padding-left: 10px;
                    font-size: .78rem;
                    line-height: 1.40;
                }

                body.game-navigation-mode
                #home .hero-buttons {
                    margin-top: 16px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function showNotice(message) {
        const toast = $("#toast");

        if (!toast) {
            return;
        }

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(noticeTimer);

        noticeTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
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

    function updateHash(pageId) {
        const nextUrl =
            `${location.pathname}${location.search}#${pageId}`;

        history.replaceState(
            { portfolioPage: pageId },
            "",
            nextUrl
        );
    }

    function setInitialPage(pageId) {
        $$("main > section[id]").forEach((section) => {
            const isActive = section.id === pageId;

            section.classList.toggle(
                "portfolio-page-active",
                isActive
            );

            section.classList.remove(
                "portfolio-page-leaving"
            );

            section.setAttribute(
                "aria-hidden",
                String(!isActive)
            );
        });

        activePage = pageId;
        updateActiveNavigation(pageId);
        updateHash(pageId);
        window.scrollTo(0, 0);
    }

    function transitionToPage(
        pageId,
        {
            fromGame = false
        } = {}
    ) {
        if (!PAGE_IDS.has(pageId)) {
            return false;
        }

        if (
            GAME_ONLY_IDS.has(pageId) &&
            !fromGame
        ) {
            return false;
        }

        if (
            pageId === activePage ||
            isTransitioning
        ) {
            return pageId === activePage;
        }

        const current =
            document.getElementById(activePage);

        const target =
            document.getElementById(pageId);

        if (!target) {
            return false;
        }

        isTransitioning = true;

        if (current) {
            current.classList.add(
                "portfolio-page-leaving"
            );

            current.classList.remove(
                "portfolio-page-active"
            );

            current.setAttribute(
                "aria-hidden",
                "true"
            );
        }

        target.scrollTop = 0;
        target.classList.remove(
            "portfolio-page-leaving"
        );

        target.setAttribute(
            "aria-hidden",
            "false"
        );

        requestAnimationFrame(() => {
            target.classList.add(
                "portfolio-page-active"
            );
        });

        activePage = pageId;

        updateActiveNavigation(pageId);
        closeMobileMenu();
        updateHash(pageId);
        window.scrollTo(0, 0);

        window.setTimeout(() => {
            current?.classList.remove(
                "portfolio-page-leaving"
            );

            isTransitioning = false;
        }, TRANSITION_MS + 30);

        return true;
    }

    function isPlayGameButton(link) {
        return Boolean(
            link?.matches?.(
                '#home .hero-buttons a[href="#game"]'
            )
        );
    }

    function getTargetInformation(link) {
        const href =
            link?.getAttribute("href") || "";

        if (
            !href.startsWith("#") ||
            href === "#"
        ) {
            return null;
        }

        const targetId = href.slice(1);
        const target =
            document.getElementById(targetId);

        if (!target) {
            return null;
        }

        let pageId = null;

        if (
            target.matches("main > section[id]")
        ) {
            pageId = target.id;
        } else {
            pageId =
                target.closest(
                    "main > section[id]"
                )?.id || null;
        }

        return {
            targetId,
            target,
            pageId
        };
    }

    function replaceHomeText() {
        const description =
            $("#home .hero-description");

        if (description) {
            description.classList.add(
                "game-navigation-instruction"
            );

            description.innerHTML = `
                <strong>GAME NAVIGATION INSTRUCTION:</strong>
                Click <b>PLAY GAME</b> first.
                Wait for <b>3 → 2 → 1 → START!</b>,
                then control the snake using
                <b>Arrow Keys/WASD</b> on laptop or desktop,
                or <b>swipe / arrow buttons</b> on phone and tablet.
                <b>You cannot scroll or use the menu to open
                About, Skills, Projects, Resume, Certificates,
                or Contact.</b>
                The page will open only when the snake
                touches that page's target inside the game.
            `;
        }

        const resumeButton =
            $('#home .hero-buttons a[href="#resume"]');

        if (resumeButton) {
            resumeButton.textContent =
                "SECTIONS VIA GAME";

            resumeButton.title =
                "Click PLAY GAME to navigate the portfolio";
        }
    }

    function configureGameText() {
        const gameDescription =
            $("#game .section-description");

        if (gameDescription) {
            gameDescription.textContent =
                "HOW TO PLAY: Wait for 3 → 2 → 1 → START! before moving. Use Arrow Keys or WASD on laptop/desktop. On phones and tablets, swipe on the board or use the arrow buttons. The six boxes — About, Skills, Projects, Resume, Certificates, and Contact — are the only destinations. When the snake touches a box, the portfolio will transition to that page.";
        }
    }

    function configureNavbar() {
        $$(".nav-links a").forEach((link) => {
            const href =
                link.getAttribute("href") || "";

            if (!href.startsWith("#")) {
                return;
            }

            const pageId = href.slice(1);

            if (GAME_ONLY_IDS.has(pageId)) {
                link.classList.add(
                    "game-only-link"
                );

                link.title =
                    "This page opens only through the Snake Game";
            }
        });
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

                const info =
                    getTargetInformation(link);

                if (!info?.pageId) {
                    return;
                }

                const {
                    targetId,
                    target,
                    pageId
                } = info;

                if (activePage === "home") {
                    event.preventDefault();

                    if (
                        pageId === "game" &&
                        isPlayGameButton(link)
                    ) {
                        transitionToPage("game");
                        return;
                    }

                    if (pageId === "home") {
                        return;
                    }

                    showNotice(
                        "CLICK PLAY GAME FIRST — OTHER PAGES OPEN ONLY WHEN THE SNAKE HITS THEIR TARGET"
                    );

                    return;
                }

                if (
                    pageId === "home" ||
                    pageId === "game"
                ) {
                    event.preventDefault();
                    transitionToPage(pageId);
                    return;
                }

                if (
                    pageId === activePage &&
                    targetId !== pageId
                ) {
                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                    return;
                }

                if (GAME_ONLY_IDS.has(pageId)) {
                    event.preventDefault();

                    showNotice(
                        `RETURN TO GAME AND HIT THE ${pageId.toUpperCase()} TARGET`
                    );

                    return;
                }
            },
            true
        );
    }

    function installHomeScrollLock() {
        document.addEventListener(
            "wheel",
            (event) => {
                if (activePage === "home") {
                    event.preventDefault();
                }
            },
            {
                passive: false
            }
        );

        document.addEventListener(
            "touchmove",
            (event) => {
                if (activePage === "home") {
                    event.preventDefault();
                }
            },
            {
                passive: false
            }
        );
    }

    const nativeScrollIntoView =
        Element.prototype.scrollIntoView;

    Element.prototype.scrollIntoView =
        function (...args) {
            const isProtectedSection =
                this.matches?.(
                    "main > section[id]"
                ) &&
                GAME_ONLY_IDS.has(this.id);

            if (isProtectedSection) {
                transitionToPage(
                    this.id,
                    {
                        fromGame: true
                    }
                );

                return;
            }

            return nativeScrollIntoView.apply(
                this,
                args
            );
        };

    function loadGameEngine() {
        return new Promise(
            (resolve, reject) => {
                const gameScript =
                    document.createElement(
                        "script"
                    );

                gameScript.src =
                    "game-core.js?v=20260818-1515";

                gameScript.async = false;

                gameScript.addEventListener(
                    "load",
                    resolve,
                    {
                        once: true
                    }
                );

                gameScript.addEventListener(
                    "error",
                    reject,
                    {
                        once: true
                    }
                );

                document.head.appendChild(
                    gameScript
                );
            }
        );
    }

    installNavigationStyles();

    document.documentElement.classList.add(
        "game-navigation-mode"
    );

    document.body.classList.add(
        "game-navigation-mode"
    );

    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }

    replaceHomeText();
    configureGameText();
    configureNavbar();
    installNavigationGuard();
    installHomeScrollLock();

    setInitialPage("home");

    loadGameEngine().catch(() => {
        showNotice(
            "GAME FAILED TO LOAD. PLEASE REFRESH THE PAGE."
        );

        console.error(
            "Unable to load game-core.js"
        );
    });

    window.portfolioNavigation = {
        goHome() {
            transitionToPage("home");
        },

        goGame() {
            transitionToPage("game");
        },

        getActivePage() {
            return activePage;
        }
    };
})();
