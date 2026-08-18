"use strict";

(() => {
    const style = document.createElement("style");
    style.id = "mobileGameRoomyFix";
    style.textContent = `
        /* Keep the two newly added certificates sharp and uncropped. */
        #certificates [data-added-certificate] .certificate-preview {
            background: #fff !important;
        }
        #certificates [data-added-certificate] .certificate-preview img {
            width: 100% !important;
            height: 100% !important;
            object-fit: contain !important;
            object-position: center !important;
            image-rendering: auto !important;
            filter: none !important;
        }
        #certificates [data-added-certificate] .certificate-preview:hover img {
            filter: none !important;
            transform: scale(1.015) !important;
        }

        @media (max-width: 720px) {
            body.portfolio-router:not(.browse-mode) #game.route-active {
                padding: calc(var(--header-height) + 4px) 0 8px !important;
                overflow-y: auto !important;
                overscroll-behavior: contain !important;
            }

            body.portfolio-router:not(.browse-mode) #game > .container {
                width: min(calc(100% - 12px), 520px) !important;
            }

            body.portfolio-router:not(.browse-mode) #game .section-heading {
                width: 100% !important;
                max-width: none !important;
                margin: 0 0 7px !important;
            }

            body.portfolio-router:not(.browse-mode) #game .section-heading .small-label {
                display: none !important;
            }

            body.portfolio-router:not(.browse-mode) #game .section-heading h2 {
                margin: 0 !important;
                font-size: clamp(1.65rem, 8vw, 2.25rem) !important;
                line-height: 1 !important;
            }

            body.portfolio-router:not(.browse-mode) #game .section-description {
                margin-top: 5px !important;
                font-size: clamp(.65rem, 2.75vw, .76rem) !important;
                line-height: 1.28 !important;
            }

            body.portfolio-router:not(.browse-mode) #game .game-box {
                width: 100% !important;
                max-width: 520px !important;
                margin: 0 auto !important;
                border-radius: 14px !important;
            }

            body.portfolio-router:not(.browse-mode) #game .game-top {
                display: grid !important;
                min-height: 0 !important;
                padding: 7px 8px !important;
                grid-template-columns: 1fr auto !important;
                gap: 5px 8px !important;
            }

            body.portfolio-router:not(.browse-mode) #game .score-box {
                align-self: center !important;
                font-size: .66rem !important;
            }

            body.portfolio-router:not(.browse-mode) #game .game-actions {
                justify-content: flex-end !important;
                gap: 5px !important;
            }

            body.portfolio-router:not(.browse-mode) #game .game-actions button {
                min-height: 31px !important;
                padding: 0 9px !important;
                font-size: .62rem !important;
                border-radius: 8px !important;
            }

            body.portfolio-router:not(.browse-mode) #game #gameMessage {
                grid-column: 1 / -1 !important;
                width: 100% !important;
                padding-top: 1px !important;
                font-size: clamp(.58rem, 2.45vw, .69rem) !important;
                white-space: normal !important;
                line-height: 1.2 !important;
            }

            body.portfolio-router:not(.browse-mode) #game .canvas-holder {
                display: flex !important;
                justify-content: center !important;
                overflow: hidden !important;
                padding: 5px !important;
            }

            body.portfolio-router:not(.browse-mode) #game #snakeCanvas {
                width: 100% !important;
                height: auto !important;
                min-width: 0 !important;
                max-width: 100% !important;
                max-height: none !important;
                border-radius: 10px !important;
                touch-action: none !important;
            }

            body.portfolio-router:not(.browse-mode) #game .mobile-controls {
                display: grid !important;
                justify-items: center !important;
                padding: 7px 4px 5px !important;
                gap: 1px !important;
            }

            body.portfolio-router:not(.browse-mode) #game .mobile-controls > button,
            body.portfolio-router:not(.browse-mode) #game .mobile-controls div button {
                width: 48px !important;
                height: 39px !important;
                margin: 2px !important;
                border-radius: 9px !important;
                font-size: .9rem !important;
                touch-action: manipulation !important;
            }
        }

        @media (max-width: 390px) {
            body.portfolio-router:not(.browse-mode) #game > .container {
                width: calc(100% - 8px) !important;
            }
            body.portfolio-router:not(.browse-mode) #game .mobile-controls > button,
            body.portfolio-router:not(.browse-mode) #game .mobile-controls div button {
                width: 44px !important;
                height: 36px !important;
            }
        }

        /* Phone in landscape: board gets priority over headings. */
        @media (orientation: landscape) and (max-height: 600px) {
            body.portfolio-router:not(.browse-mode) #game.route-active {
                padding: calc(var(--header-height) + 3px) 0 5px !important;
            }
            body.portfolio-router:not(.browse-mode) #game > .container {
                width: min(calc(100% - 12px), 900px) !important;
            }
            body.portfolio-router:not(.browse-mode) #game .section-heading {
                display: grid !important;
                grid-template-columns: auto 1fr !important;
                align-items: center !important;
                gap: 10px !important;
                margin-bottom: 4px !important;
            }
            body.portfolio-router:not(.browse-mode) #game .section-heading h2 {
                font-size: 1.35rem !important;
            }
            body.portfolio-router:not(.browse-mode) #game .section-description {
                margin: 0 !important;
                font-size: .62rem !important;
            }
            body.portfolio-router:not(.browse-mode) #game .game-box {
                max-width: 900px !important;
            }
            body.portfolio-router:not(.browse-mode) #game .canvas-holder {
                padding: 4px !important;
            }
            body.portfolio-router:not(.browse-mode) #game #snakeCanvas {
                width: auto !important;
                max-width: 100% !important;
                max-height: 62svh !important;
            }
            body.portfolio-router:not(.browse-mode) #game .mobile-controls {
                position: absolute !important;
                right: 9px !important;
                bottom: 8px !important;
                z-index: 4 !important;
                padding: 3px !important;
                border: 1px solid var(--border) !important;
                border-radius: 12px !important;
                background: color-mix(in srgb, var(--card) 88%, transparent) !important;
                backdrop-filter: blur(8px) !important;
            }
            body.portfolio-router:not(.browse-mode) #game .mobile-controls > button,
            body.portfolio-router:not(.browse-mode) #game .mobile-controls div button {
                width: 38px !important;
                height: 31px !important;
                margin: 1px !important;
            }
        }
    `;
    document.head.appendChild(style);
})();
