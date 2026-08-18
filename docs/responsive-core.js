"use strict";

(() => {
    const style = document.createElement("style");
    style.id = "responsivePortfolioFix";
    style.textContent = `
        /* Always show both HOME choices on every device */
        #home .hero-buttons > .button {
            display: inline-flex !important;
            visibility: visible !important;
            opacity: 1 !important;
        }

        /* IMPORTANT: game-return buttons are ONLY for PLAY GAME mode */
        body.browse-mode .game-return-panel {
            display: none !important;
        }

        body.portfolio-router:not(.browse-mode)
        main > section.route-active .game-return-panel {
            display: block !important;
        }

        /* Locked HOME screen */
        body.portfolio-router:not(.browse-mode) #home.route-active {
            padding-top: var(--header-height) !important;
            padding-bottom: 0 !important;
            align-items: center !important;
            overflow: hidden !important;
        }

        body.portfolio-router:not(.browse-mode) #home.route-active .hero-grid {
            width: min(calc(100% - 40px), var(--container)) !important;
            min-height: calc(100svh - var(--header-height)) !important;
            max-height: calc(100svh - var(--header-height)) !important;
            padding-block: clamp(10px, 2vh, 26px) !important;
            grid-template-columns: minmax(0, 1.08fr) minmax(280px, .78fr) !important;
            align-items: center !important;
            align-content: center !important;
            gap: clamp(22px, 4vw, 60px) !important;
        }

        body.portfolio-router:not(.browse-mode) #home .hero-content,
        body.portfolio-router:not(.browse-mode) #home .profile-card {
            min-width: 0 !important;
        }

        body.portfolio-router:not(.browse-mode) #home h1 {
            margin-top: clamp(6px, 1.2vh, 14px) !important;
            font-size: clamp(3.2rem, min(6.7vw, 10vh), 7rem) !important;
            line-height: .84 !important;
        }

        body.portfolio-router:not(.browse-mode) #home .hero-title {
            margin-top: clamp(10px, 2vh, 22px) !important;
            font-size: clamp(.7rem, 1vw, .9rem) !important;
        }

        body.portfolio-router:not(.browse-mode) #home .hero-description {
            margin-top: clamp(8px, 1.5vh, 16px) !important;
            font-size: clamp(.76rem, 1vw, .94rem) !important;
            line-height: 1.4 !important;
        }

        body.portfolio-router:not(.browse-mode) #home .hero-buttons {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            width: min(100%, 470px) !important;
            gap: 10px !important;
            margin-top: clamp(12px, 2vh, 22px) !important;
        }

        body.portfolio-router:not(.browse-mode) #home .hero-buttons .button {
            width: 100% !important;
            min-width: 0 !important;
            min-height: 46px !important;
            padding-inline: 12px !important;
            text-align: center !important;
        }

        body.portfolio-router:not(.browse-mode) #home .profile-card {
            width: 100% !important;
            max-width: 520px !important;
            max-height: calc(100svh - var(--header-height) - 30px) !important;
        }

        body.portfolio-router:not(.browse-mode) #home .profile-card-top {
            min-height: clamp(32px, 5vh, 48px) !important;
        }

        body.portfolio-router:not(.browse-mode) #home .profile-card-body {
            min-height: 0 !important;
            padding: clamp(16px, 3vh, 32px) !important;
        }

        body.portfolio-router:not(.browse-mode) #home .profile-photo-frame {
            width: clamp(112px, 19vh, 176px) !important;
            height: clamp(112px, 19vh, 176px) !important;
        }

        body.portfolio-router:not(.browse-mode) #home .profile-card-info {
            margin-top: clamp(10px, 2vh, 20px) !important;
        }

        body.portfolio-router:not(.browse-mode) #home .profile-tags {
            margin-top: clamp(8px, 1.5vh, 16px) !important;
        }

        /* Tablet / small laptop navigation */
        @media (max-width: 1100px) {
            .menu-button {
                display: block !important;
            }

            .nav-links {
                position: fixed !important;
                top: var(--header-height) !important;
                right: 20px !important;
                left: 20px !important;
                display: grid !important;
                max-height: calc(100svh - var(--header-height) - 24px) !important;
                overflow-y: auto !important;
                padding: 16px !important;
                border: 1px solid var(--border) !important;
                border-radius: 17px !important;
                background: var(--card) !important;
                box-shadow: var(--shadow) !important;
                opacity: 0 !important;
                pointer-events: none !important;
                transform: translateY(-12px) !important;
                transition: .2s ease !important;
            }

            .nav-links.open {
                opacity: 1 !important;
                pointer-events: auto !important;
                transform: none !important;
            }

            .theme-button {
                width: 100% !important;
            }
        }

        @media (min-width: 721px) and (max-width: 1100px) {
            body.portfolio-router:not(.browse-mode) #home.route-active .hero-grid {
                grid-template-columns: minmax(0, 1fr) minmax(250px, .68fr) !important;
                gap: clamp(16px, 3vw, 36px) !important;
            }

            body.portfolio-router:not(.browse-mode) #home h1 {
                font-size: clamp(2.9rem, min(7vw, 8.8vh), 5.2rem) !important;
            }

            body.portfolio-router:not(.browse-mode) #home .profile-card {
                transform: rotate(1deg) !important;
            }
        }

        /* Phone */
        @media (max-width: 720px) {
            :root {
                --header-height: 66px;
            }

            .container {
                width: min(calc(100% - 24px), var(--container)) !important;
            }

            body.portfolio-router:not(.browse-mode) #home.route-active {
                padding-top: var(--header-height) !important;
            }

            body.portfolio-router:not(.browse-mode) #home.route-active .hero-grid {
                width: min(calc(100% - 24px), var(--container)) !important;
                min-height: calc(100svh - var(--header-height)) !important;
                max-height: calc(100svh - var(--header-height)) !important;
                padding-block: 8px !important;
                grid-template-columns: 1fr !important;
                grid-template-rows: auto auto !important;
                align-content: center !important;
                gap: 9px !important;
            }

            body.portfolio-router:not(.browse-mode) #home h1 {
                margin-top: 5px !important;
                font-size: clamp(2.55rem, 11.8vw, 4rem) !important;
                line-height: .82 !important;
            }

            body.portfolio-router:not(.browse-mode) #home .small-label {
                font-size: .61rem !important;
            }

            body.portfolio-router:not(.browse-mode) #home .hero-title {
                margin-top: 8px !important;
                padding-bottom: 5px !important;
                font-size: .66rem !important;
                line-height: 1.25 !important;
            }

            body.portfolio-router:not(.browse-mode) #home .hero-description {
                margin-top: 7px !important;
                padding-left: 9px !important;
                font-size: clamp(.66rem, 2.7vw, .76rem) !important;
                line-height: 1.3 !important;
            }

            body.portfolio-router:not(.browse-mode) #home .hero-buttons {
                grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                width: 100% !important;
                gap: 7px !important;
                margin-top: 9px !important;
            }

            body.portfolio-router:not(.browse-mode) #home .hero-buttons .button {
                min-height: 41px !important;
                padding: 0 7px !important;
                font-size: clamp(.56rem, 2.55vw, .68rem) !important;
                letter-spacing: .03em !important;
            }

            body.portfolio-router:not(.browse-mode) #home .profile-card {
                width: 100% !important;
                max-width: none !important;
                max-height: 138px !important;
                transform: none !important;
                border-radius: 15px !important;
            }

            body.portfolio-router:not(.browse-mode) #home .profile-card-top {
                min-height: 24px !important;
                padding-inline: 11px !important;
            }

            body.portfolio-router:not(.browse-mode) #home .profile-card-top span {
                width: 7px !important;
                height: 7px !important;
            }

            body.portfolio-router:not(.browse-mode) #home .profile-card-body {
                display: grid !important;
                grid-template-columns: 74px minmax(0, 1fr) !important;
                min-height: 0 !important;
                place-content: stretch !important;
                align-items: center !important;
                gap: 11px !important;
                padding: 9px 11px !important;
                text-align: left !important;
            }

            body.portfolio-router:not(.browse-mode) #home .profile-photo-frame {
                width: 68px !important;
                height: 68px !important;
                margin: 0 !important;
                border-width: 3px !important;
                border-radius: 10px !important;
            }

            body.portfolio-router:not(.browse-mode) #home .profile-card-info {
                margin-top: 0 !important;
                min-width: 0 !important;
            }

            body.portfolio-router:not(.browse-mode) #home .profile-name {
                font-size: .75rem !important;
                line-height: 1.2 !important;
            }

            body.portfolio-router:not(.browse-mode) #home .profile-card-info p {
                font-size: .64rem !important;
                line-height: 1.28 !important;
            }

            body.portfolio-router:not(.browse-mode) #home .profile-card-info p + p {
                margin-top: 2px !important;
            }

            body.portfolio-router:not(.browse-mode) #home .profile-tags {
                display: none !important;
            }

            body.portfolio-router:not(.browse-mode) #game.route-active {
                padding: calc(var(--header-height) + 10px) 0 16px !important;
                overflow-y: auto !important;
            }

            body.portfolio-router:not(.browse-mode) #game .section-heading {
                margin-bottom: 12px !important;
            }

            body.portfolio-router:not(.browse-mode) #game .section-heading h2 {
                font-size: clamp(2rem, 10vw, 3.2rem) !important;
            }

            body.portfolio-router:not(.browse-mode) #game .section-description {
                margin-top: 10px !important;
                font-size: .76rem !important;
                line-height: 1.38 !important;
            }

            body.portfolio-router:not(.browse-mode) #game .game-top {
                min-height: 0 !important;
                padding: 10px !important;
                gap: 7px !important;
            }

            body.portfolio-router:not(.browse-mode) #game #snakeCanvas {
                width: auto !important;
                max-width: 100% !important;
                max-height: 48svh !important;
                margin-inline: auto !important;
            }

            body.portfolio-router:not(.browse-mode) #game .mobile-controls {
                padding: 10px 6px 14px !important;
                gap: 6px !important;
            }
        }

        /* Short phone screens: scroll only inside HOME, never into another section */
        @media (max-width: 720px) and (max-height: 690px) {
            body.portfolio-router:not(.browse-mode) #home.route-active {
                overflow-y: auto !important;
                overscroll-behavior: contain !important;
            }

            body.portfolio-router:not(.browse-mode) #home.route-active .hero-grid {
                min-height: auto !important;
                max-height: none !important;
                padding-block: 10px 16px !important;
            }
        }

        /* Short laptop */
        @media (min-width: 721px) and (max-height: 720px) {
            body.portfolio-router:not(.browse-mode) #home.route-active .hero-grid {
                padding-block: 8px !important;
                gap: 22px !important;
            }

            body.portfolio-router:not(.browse-mode) #home h1 {
                font-size: clamp(2.7rem, min(5.8vw, 8vh), 4.5rem) !important;
            }

            body.portfolio-router:not(.browse-mode) #home .hero-title,
            body.portfolio-router:not(.browse-mode) #home .hero-buttons {
                margin-top: 9px !important;
            }

            body.portfolio-router:not(.browse-mode) #home .hero-description {
                margin-top: 7px !important;
                font-size: .74rem !important;
            }

            body.portfolio-router:not(.browse-mode) #home .profile-card-top {
                min-height: 29px !important;
            }

            body.portfolio-router:not(.browse-mode) #home .profile-card-body {
                padding: 13px !important;
            }

            body.portfolio-router:not(.browse-mode) #home .profile-photo-frame {
                width: 100px !important;
                height: 100px !important;
            }

            body.portfolio-router:not(.browse-mode) #home .profile-card-info,
            body.portfolio-router:not(.browse-mode) #home .profile-tags {
                margin-top: 7px !important;
            }
        }

        /* Normal Browse mode: About -> Contact only, responsive */
        body.browse-mode main > section {
            max-width: 100% !important;
        }

        body.browse-mode img,
        body.browse-mode canvas,
        body.browse-mode video,
        body.browse-mode iframe {
            max-width: 100% !important;
        }
    `;

    document.head.appendChild(style);

    const current = document.currentScript;
    const base = current
        ? new URL(".", current.src)
        : new URL("./", location.href);

    const core = document.createElement("script");
    core.src = new URL(
        "site-core.js?v=responsive-20260818-1550",
        base
    ).href;
    core.async = false;

    core.addEventListener(
        "error",
        () => {
            console.error("Unable to load site-core.js");
        },
        { once: true }
    );

    document.head.appendChild(core);
})();
