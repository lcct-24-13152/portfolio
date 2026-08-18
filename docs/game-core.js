"use strict";

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

/* HEADER AND MOBILE MENU */
const header = $("#header");
const menuButton = $("#menuButton");
const navLinks = $("#navLinks");

window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 15);
});

menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuButton.classList.toggle("active", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
});

$$(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuButton.classList.remove("active");
        document.body.classList.remove("menu-open");
    });
});

/* ACTIVE NAVIGATION */
const sections = $$("main section[id]");
const navigationItems = $$(".nav-links a");

const navigationObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            navigationItems.forEach((item) => {
                item.classList.toggle(
                    "active",
                    item.getAttribute("href") === `#${entry.target.id}`
                );
            });
        });
    },
    {
        rootMargin: "-35% 0px -55% 0px"
    }
);

sections.forEach((section) => navigationObserver.observe(section));

/* THEME */
const themeButton = $("#themeButton");
const savedTheme = localStorage.getItem("cherPortfolioTheme");

if (savedTheme === "light") {
    document.body.classList.add("light-mode");
}

themeButton.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-mode");
    localStorage.setItem("cherPortfolioTheme", isLight ? "light" : "dark");
});

/* REVEAL ANIMATION */
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

$$(".reveal").forEach((element) => revealObserver.observe(element));

/* PROJECT FILTER */
const filterButtons = $$(".filter");
const projectCards = $$(".project-card");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selected = button.dataset.filter;

        filterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        projectCards.forEach((card) => {
            const visible =
                selected === "all" ||
                card.dataset.category === selected;

            card.classList.toggle("hide", !visible);
        });
    });
});

/* PROJECT MODAL */
const projectInformation = {
    1: {
        label: "PERSONAL WEBSITE",
        title: "Interactive Portfolio",
        description:
            "A responsive personal portfolio with dark mode, animated sections, project filtering, a printable resume, and a Snake category navigation game.",
        tools: ["HTML", "CSS", "JavaScript"],
        url: "https://lcct-24-13152.github.io/portfolio/",
        linkText: "OPEN LIVE PORTFOLIO ↗"
    },
    2: {
        label: "WEB SYSTEM",
        title: "Reservation System",
        description:
            "A reservation system concept that manages schedules, availability, customer details, bookings, payments, and reports.",
        tools: ["PHP", "MySQL", "JavaScript"],
        url: "",
        linkText: ""
    },
    3: {
        label: "MANAGEMENT SYSTEM",
        title: "Laundry Management",
        description:
            "A management system for recording customers, laundry services, transactions, inventory, payments, receipts, reports, and QR-based laundry status tracking.",
        tools: ["PHP", "MySQL", "CRUD"],
        url: "https://disabled-sprint-depends-lighter.trycloudflare.com/laundry-system/auth/login.php",
        linkText: "OPEN LIVE SYSTEM ↗"
    }
};

const projectModal = $("#projectModal");
const modalLabel = $("#modalLabel");
const modalTitle = $("#modalTitle");
const modalDescription = $("#modalDescription");
const modalTools = $("#modalTools");
const modalProjectLink = $("#modalProjectLink");

function openProjectModal(projectNumber) {
    const project = projectInformation[projectNumber];
    if (!project) return;

    modalLabel.textContent = project.label;
    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    modalTools.innerHTML = project.tools
        .map((tool) => `<span>${tool}</span>`)
        .join("");

    if (project.url) {
        modalProjectLink.href = project.url;
        modalProjectLink.textContent = project.linkText || "OPEN PROJECT ↗";
        modalProjectLink.classList.add("show");
    } else {
        modalProjectLink.removeAttribute("href");
        modalProjectLink.classList.remove("show");
    }

    projectModal.classList.add("open");
    projectModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
}

function closeProjectModal() {
    projectModal.classList.remove("open");
    projectModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
}

$$(".project-open").forEach((button) => {
    button.addEventListener("click", () => {
        openProjectModal(button.dataset.project);
    });
});

$$("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", closeProjectModal);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeProjectModal();
    }
});

/* RESUME PRINT */
$("#printResume").addEventListener("click", () => {
    window.print();
});

/* CONTACT FORM - LARAGON MYSQL + GITHUB PAGES FALLBACK */
const toast = $("#toast");
let toastTimer;

function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

const contactForm = $("#contactForm");
const contactSubmitButton = $("#contactSubmitButton");

contactForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = $("#contactName").value.trim();
    const email = $("#contactEmail").value.trim();
    const subject = $("#contactSubject").value.trim();
    const message = $("#contactMessage").value.trim();

    if (!name || !email || !subject || !message) {
        showToast("COMPLETE ALL FIELDS");
        return;
    }

    const isGitHubPages = window.location.hostname.endsWith("github.io");
    const isStaticFile = window.location.protocol === "file:";

    if (isGitHubPages || isStaticFile) {
        const emailSubject = encodeURIComponent(subject);
        const emailBody = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\n${message}`
        );

        showToast("OPENING EMAIL APP...");
        window.location.href =
            `mailto:liriocher25@gmail.com?subject=${emailSubject}&body=${emailBody}`;
        return;
    }

    const originalButtonText = contactSubmitButton?.textContent || "SEND MESSAGE";

    if (contactSubmitButton) {
        contactSubmitButton.disabled = true;
        contactSubmitButton.textContent = "SENDING...";
    }

    try {
        const response = await fetch("index.php", {
            method: "POST",
            body: new FormData(contactForm),
            headers: {
                "X-Requested-With": "XMLHttpRequest"
            }
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || "Unable to save your message."
            );
        }

        contactForm.reset();
        showToast("MESSAGE SAVED SUCCESSFULLY");
    } catch (error) {
        showToast(
            error.message ||
            "DATABASE ERROR. OPEN SETUP.PHP FIRST."
        );
    } finally {
        if (contactSubmitButton) {
            contactSubmitButton.disabled = false;
            contactSubmitButton.textContent = originalButtonText;
        }
    }
});

/* ======================================================
   RESPONSIVE SNAKE PORTFOLIO NAVIGATION
   Only these destinations are allowed:
   About, Skills, Projects, Resume, Certificates, Contact
   ====================================================== */

const canvas = $("#snakeCanvas");

if (canvas) {
    const context = canvas.getContext("2d");

    const scoreText = $("#score");
    const gameMessage = $("#gameMessage");
    const pauseButton = $("#pauseButton");
    const restartButton = $("#restartButton");
    const mobilePause = $("#mobilePause");
    const gameBox = canvas.closest(".game-box");
    const gameSection = $("#game");
    const directionButtons = $$('[data-direction]');

    const CELL = 20;
    const SPEED = 115;
    const COUNTDOWN_STEP = 700;

    const ALLOWED_SECTIONS = new Set([
        "about",
        "skills",
        "projects",
        "resume",
        "certificates",
        "contact"
    ]);

    const GAME_LAYOUTS = {
        desktop: {
            name: "desktop",
            columns: 48,
            rows: 26,
            startSnake: [
                { x: 24, y: 13 },
                { x: 23, y: 13 },
                { x: 22, y: 13 },
                { x: 21, y: 13 }
            ],
            portals: [
                { id: "about", label: "ABOUT", x: 1, y: 2, width: 7, height: 5, color: "#6ff0bf" },
                { id: "skills", label: "SKILLS", x: 11, y: 2, width: 7, height: 5, color: "#77a4ff" },
                { id: "projects", label: "PROJECTS", x: 21, y: 2, width: 8, height: 5, color: "#c38dff" },
                { id: "certificates", label: "CERTIFICATES", x: 32, y: 2, width: 10, height: 5, color: "#5fd9ff" },
                { id: "resume", label: "RESUME", x: 7, y: 19, width: 9, height: 5, color: "#ffca6a" },
                { id: "contact", label: "CONTACT", x: 32, y: 19, width: 10, height: 5, color: "#ff7f8d" }
            ]
        },
        tablet: {
            name: "tablet",
            columns: 32,
            rows: 28,
            startSnake: [
                { x: 17, y: 14 },
                { x: 16, y: 14 },
                { x: 15, y: 14 },
                { x: 14, y: 14 }
            ],
            portals: [
                { id: "about", label: "ABOUT", x: 1, y: 1, width: 8, height: 5, color: "#6ff0bf" },
                { id: "skills", label: "SKILLS", x: 12, y: 1, width: 8, height: 5, color: "#77a4ff" },
                { id: "projects", label: "PROJECTS", x: 23, y: 1, width: 8, height: 5, color: "#c38dff" },
                { id: "certificates", label: "CERTIFICATES", x: 9, y: 8, width: 14, height: 4, color: "#5fd9ff" },
                { id: "resume", label: "RESUME", x: 4, y: 21, width: 9, height: 5, color: "#ffca6a" },
                { id: "contact", label: "CONTACT", x: 18, y: 21, width: 11, height: 5, color: "#ff7f8d" }
            ]
        },
        mobile: {
            name: "mobile",
            columns: 18,
            rows: 30,
            startSnake: [
                { x: 10, y: 25 },
                { x: 9, y: 25 },
                { x: 8, y: 25 },
                { x: 7, y: 25 }
            ],
            portals: [
                { id: "about", label: "ABOUT", x: 1, y: 1, width: 7, height: 4, color: "#6ff0bf" },
                { id: "skills", label: "SKILLS", x: 10, y: 1, width: 7, height: 4, color: "#77a4ff" },
                { id: "projects", label: "PROJECTS", x: 1, y: 7, width: 8, height: 4, color: "#c38dff" },
                { id: "certificates", label: "CERTIFICATES", x: 9, y: 7, width: 8, height: 4, color: "#5fd9ff" },
                { id: "resume", label: "RESUME", x: 1, y: 14, width: 8, height: 4, color: "#ffca6a" },
                { id: "contact", label: "CONTACT", x: 9, y: 14, width: 8, height: 4, color: "#ff7f8d" }
            ]
        }
    };

    let currentLayout = null;
    let COLUMNS = 48;
    let ROWS = 26;
    let portals = [];

    let snake = [];
    let direction = { x: 0, y: 0 };
    let nextDirection = { x: 0, y: 0 };

    let score = 0;
    let started = false;
    let paused = false;
    let movingToSection = false;
    let gameEnded = false;

    let controlsEnabled = false;
    let countdownActive = false;
    let countdownDisplay = "";
    let gameIsVisible = false;
    let firstCountdownStarted = false;
    let lastPortalId = null;

    let gameLoop;
    let resizeTimer;
    let countdownTimers = [];

    let touchStartX = 0;
    let touchStartY = 0;

    function isTouchDevice() {
        return (
            window.matchMedia("(pointer: coarse)").matches ||
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0
        );
    }

    function getLayoutForScreen() {
        const viewportWidth = window.innerWidth;

        if (viewportWidth <= 600) return GAME_LAYOUTS.mobile;
        if (viewportWidth <= 1100) return GAME_LAYOUTS.tablet;
        return GAME_LAYOUTS.desktop;
    }

    function defaultInstruction() {
        if (currentLayout?.name === "mobile" || isTouchDevice()) {
            return "SWIPE OR USE THE ARROW BUTTONS";
        }

        return "PRESS ARROW KEYS OR WASD";
    }

    function clearCountdownTimers() {
        countdownTimers.forEach((timer) => clearTimeout(timer));
        countdownTimers = [];
    }

    function setControlsEnabled(enabled) {
        controlsEnabled = enabled;

        directionButtons.forEach((button) => {
            button.disabled = !enabled;
            button.setAttribute("aria-disabled", String(!enabled));
        });

        if (pauseButton) {
            pauseButton.disabled = !enabled || gameEnded;
            pauseButton.setAttribute("aria-disabled", String(!enabled || gameEnded));
        }

        if (mobilePause) {
            mobilePause.disabled = !enabled || gameEnded;
            mobilePause.setAttribute("aria-disabled", String(!enabled || gameEnded));
        }

        canvas.setAttribute("aria-disabled", String(!enabled));
    }

    function applyGameLayout(forceReset = false, restartCountdown = false) {
        const nextLayout = getLayoutForScreen();
        const layoutChanged = currentLayout?.name !== nextLayout.name;

        currentLayout = nextLayout;
        COLUMNS = currentLayout.columns;
        ROWS = currentLayout.rows;
        portals = currentLayout.portals
            .filter((portal) => ALLOWED_SECTIONS.has(portal.id))
            .map((portal) => ({ ...portal }));

        canvas.width = COLUMNS * CELL;
        canvas.height = ROWS * CELL;
        canvas.dataset.layout = currentLayout.name;

        if (gameBox) gameBox.dataset.gameLayout = currentLayout.name;

        if (layoutChanged || forceReset || snake.length === 0) {
            resetGame({ countdown: restartCountdown });
        } else {
            drawGame();
        }
    }

    function resetGame({ countdown = false } = {}) {
        clearCountdownTimers();

        snake = currentLayout.startSnake.map((part) => ({ ...part }));
        direction = { x: 0, y: 0 };
        nextDirection = { x: 0, y: 0 };

        score = 0;
        started = false;
        paused = false;
        movingToSection = false;
        gameEnded = false;
        countdownActive = false;
        countdownDisplay = "";
        lastPortalId = null;

        if (scoreText) scoreText.textContent = "0";
        if (pauseButton) pauseButton.textContent = "PAUSE";
        if (mobilePause) mobilePause.textContent = "PAUSE";

        setControlsEnabled(false);

        clearInterval(gameLoop);
        gameLoop = setInterval(updateGame, SPEED);

        if (gameMessage) {
            gameMessage.textContent = countdown ? "GET READY" : "GAME READY";
        }

        drawGame();

        if (countdown) beginCountdown();
    }

    function beginCountdown() {
        if (!currentLayout || countdownActive || movingToSection) return;

        clearCountdownTimers();
        started = false;
        paused = false;
        gameEnded = false;
        direction = { x: 0, y: 0 };
        nextDirection = { x: 0, y: 0 };
        countdownActive = true;
        setControlsEnabled(false);

        const sequence = ["3", "2", "1", "START!"];

        sequence.forEach((value, index) => {
            const timer = setTimeout(() => {
                countdownDisplay = value;

                if (gameMessage) {
                    gameMessage.textContent = value === "START!" ? "START!" : `GET READY • ${value}`;
                }

                drawGame();
            }, index * COUNTDOWN_STEP);

            countdownTimers.push(timer);
        });

        const finishTimer = setTimeout(() => {
            countdownActive = false;
            countdownDisplay = "";
            setControlsEnabled(true);

            if (gameMessage) {
                gameMessage.textContent = `${defaultInstruction()} • CHOOSE A DIRECTION`;
            }

            drawGame();
        }, sequence.length * COUNTDOWN_STEP);

        countdownTimers.push(finishTimer);
    }

    function setDirection(newDirection) {
        if (!controlsEnabled || countdownActive || movingToSection || gameEnded || !newDirection) {
            return;
        }

        const activeDirection =
            nextDirection.x !== 0 || nextDirection.y !== 0
                ? nextDirection
                : direction;

        const opposite =
            activeDirection.x + newDirection.x === 0 &&
            activeDirection.y + newDirection.y === 0 &&
            (activeDirection.x !== 0 || activeDirection.y !== 0);

        if (opposite) return;

        nextDirection = newDirection;

        if (!started) {
            started = true;
            paused = false;

            if (gameMessage) gameMessage.textContent = "NAVIGATE TO A SECTION";
            if (pauseButton) pauseButton.textContent = "PAUSE";
            if (mobilePause) mobilePause.textContent = "PAUSE";
            return;
        }

        if (paused && gameMessage) {
            gameMessage.textContent = "PAUSED • PRESS CONTINUE";
        }
    }

    function updateGame() {
        if (countdownActive || !started || paused || movingToSection || gameEnded) {
            drawGame();
            return;
        }

        direction = nextDirection;

        if (direction.x === 0 && direction.y === 0) {
            drawGame();
            return;
        }

        const newHead = {
            x: snake[0].x + direction.x,
            y: snake[0].y + direction.y
        };

        const hitWall =
            newHead.x < 0 ||
            newHead.x >= COLUMNS ||
            newHead.y < 0 ||
            newHead.y >= ROWS;

        const hitSnake = snake.some((part, index) => {
            return index > 0 && part.x === newHead.x && part.y === newHead.y;
        });

        if (hitWall || hitSnake) {
            gameOver();
            return;
        }

        snake.unshift(newHead);
        snake.pop();

        const portal = portals.find((item) => {
            return (
                newHead.x >= item.x &&
                newHead.x < item.x + item.width &&
                newHead.y >= item.y &&
                newHead.y < item.y + item.height
            );
        });

        if (!portal) {
            lastPortalId = null;
        } else if (portal.id !== lastPortalId) {
            lastPortalId = portal.id;
            score += 1;
            if (scoreText) scoreText.textContent = String(score);
            openSection(portal);
        }

        drawGame();
    }

    function gameOver() {
        gameEnded = true;
        paused = true;
        started = false;
        direction = { x: 0, y: 0 };
        nextDirection = { x: 0, y: 0 };
        setControlsEnabled(false);

        if (gameMessage) gameMessage.textContent = "GAME OVER • PRESS RESTART";
        if (pauseButton) pauseButton.textContent = "PAUSE";
        if (mobilePause) mobilePause.textContent = "PAUSE";

        drawGame(true);
    }

    function openSection(portal) {
        if (!portal || !ALLOWED_SECTIONS.has(portal.id)) return;

        const target = document.getElementById(portal.id);
        if (!target) return;

        movingToSection = true;
        paused = true;
        setControlsEnabled(false);

        if (gameMessage) gameMessage.textContent = `OPENING ${portal.label}`;
        if (pauseButton) pauseButton.textContent = "CONTINUE";
        if (mobilePause) mobilePause.textContent = "CONTINUE";

        drawGame();

        const scrollTimer = setTimeout(() => {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 250);

        const finishTimer = setTimeout(() => {
            movingToSection = false;
            setControlsEnabled(true);

            if (gameMessage) {
                gameMessage.textContent = `${portal.label} OPENED • RETURN TO GAME TO CONTINUE`;
            }

            drawGame();
        }, 850);

        countdownTimers.push(scrollTimer, finishTimer);
    }

    function togglePause() {
        if (!controlsEnabled || countdownActive || movingToSection || gameEnded) return;

        if (!started) {
            if (gameMessage) {
                gameMessage.textContent = `${defaultInstruction()} • CHOOSE A DIRECTION`;
            }
            return;
        }

        paused = !paused;

        if (pauseButton) pauseButton.textContent = paused ? "CONTINUE" : "PAUSE";
        if (mobilePause) mobilePause.textContent = paused ? "CONTINUE" : "PAUSE";
        if (gameMessage) gameMessage.textContent = paused ? "PAUSED" : "NAVIGATE TO A SECTION";

        drawGame();
    }

    function roundedRectangle(x, y, width, height, radius) {
        const safeRadius = Math.max(0, Math.min(radius, width / 2, height / 2));

        context.beginPath();
        context.moveTo(x + safeRadius, y);
        context.arcTo(x + width, y, x + width, y + height, safeRadius);
        context.arcTo(x + width, y + height, x, y + height, safeRadius);
        context.arcTo(x, y + height, x, y, safeRadius);
        context.arcTo(x, y, x + width, y, safeRadius);
        context.closePath();
    }

    function drawGrid() {
        context.strokeStyle = "rgba(111, 240, 191, 0.035)";
        context.lineWidth = 1;

        for (let x = 0; x <= canvas.width; x += CELL) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, canvas.height);
            context.stroke();
        }

        for (let y = 0; y <= canvas.height; y += CELL) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(canvas.width, y);
            context.stroke();
        }
    }

    function drawPortal(portal) {
        const x = portal.x * CELL;
        const y = portal.y * CELL;
        const width = portal.width * CELL;
        const height = portal.height * CELL;
        const inset = currentLayout.name === "mobile" ? 3 : 5;
        const portalFont =
            currentLayout.name === "mobile"
                ? portal.id === "certificates" ? 10 : 12
                : currentLayout.name === "tablet"
                    ? portal.id === "certificates" ? 11 : 13
                    : portal.id === "certificates" ? 12 : 15;

        context.save();
        context.globalAlpha = 0.13;
        context.fillStyle = portal.color;

        roundedRectangle(
            x + inset,
            y + inset,
            width - inset * 2,
            height - inset * 2,
            currentLayout.name === "mobile" ? 10 : 14
        );
        context.fill();

        context.globalAlpha = 0.8;
        context.strokeStyle = portal.color;
        context.lineWidth = currentLayout.name === "mobile" ? 1.5 : 2;
        context.setLineDash(currentLayout.name === "mobile" ? [5, 5] : [7, 7]);

        roundedRectangle(
            x + inset,
            y + inset,
            width - inset * 2,
            height - inset * 2,
            currentLayout.name === "mobile" ? 10 : 14
        );
        context.stroke();

        context.globalAlpha = 1;
        context.setLineDash([]);
        context.fillStyle = portal.color;
        context.font = `bold ${portalFont}px Arial`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(portal.label, x + width / 2, y + height / 2);
        context.restore();
    }

    function drawSnake() {
        snake.forEach((part, index) => {
            const x = part.x * CELL + 2;
            const y = part.y * CELL + 2;
            const size = CELL - 4;

            context.save();
            context.fillStyle =
                index === 0
                    ? "#a0ffdc"
                    : `rgba(111, 240, 191, ${Math.max(0.35, 0.92 - index * 0.05)})`;

            if (index === 0) {
                context.shadowColor = "#6ff0bf";
                context.shadowBlur = currentLayout.name === "mobile" ? 9 : 14;
            }

            roundedRectangle(x, y, size, size, index === 0 ? 7 : 5);
            context.fill();
            context.restore();
        });
    }

    function drawOverlay(title, subtitle) {
        const titleSize =
            currentLayout.name === "mobile"
                ? 24
                : currentLayout.name === "tablet"
                    ? 28
                    : 31;

        context.fillStyle = "rgba(4, 10, 18, 0.70)";
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = "#ffffff";
        context.font = `bold ${titleSize}px Arial`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(title, canvas.width / 2, canvas.height / 2 - 8);

        context.fillStyle = "#9eafc4";
        context.font = `${currentLayout.name === "mobile" ? 12 : 13}px Arial`;
        context.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 24);
    }

    function drawGame(gameOverScreen = false) {
        if (!currentLayout) return;

        const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "#081423");
        gradient.addColorStop(1, "#0a1a2c");

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        drawGrid();
        portals.forEach(drawPortal);
        drawSnake();

        if (countdownActive) {
            drawOverlay(
                countdownDisplay || "3",
                countdownDisplay === "START!" ? "CONTROLS ARE NOW UNLOCKING" : "CONTROLS LOCKED"
            );
            return;
        }

        if (!firstCountdownStarted && !controlsEnabled) {
            drawOverlay("READY", "COUNTDOWN STARTS WHEN THE GAME IS IN VIEW");
            return;
        }

        if (!started && controlsEnabled && !gameEnded) {
            drawOverlay(
                "READY",
                currentLayout.name === "mobile" || isTouchDevice()
                    ? "SWIPE OR TAP AN ARROW TO MOVE"
                    : "PRESS ARROWS OR WASD TO MOVE"
            );
        }

        if (paused && started && !movingToSection) {
            drawOverlay(
                "PAUSED",
                currentLayout.name === "mobile"
                    ? "TAP CONTINUE TO PLAY"
                    : "PRESS SPACE OR CONTINUE"
            );
        }

        if (gameOverScreen || gameEnded) {
            drawOverlay("GAME OVER", "PRESS RESTART");
        }
    }

    function handleKeyboard(event) {
        const activeElement = document.activeElement;
        const activeTag = activeElement?.tagName?.toLowerCase() || "";

        if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") return;
        if (!gameIsVisible) return;

        const directions = {
            ArrowUp: { x: 0, y: -1 },
            w: { x: 0, y: -1 },
            W: { x: 0, y: -1 },
            ArrowDown: { x: 0, y: 1 },
            s: { x: 0, y: 1 },
            S: { x: 0, y: 1 },
            ArrowLeft: { x: -1, y: 0 },
            a: { x: -1, y: 0 },
            A: { x: -1, y: 0 },
            ArrowRight: { x: 1, y: 0 },
            d: { x: 1, y: 0 },
            D: { x: 1, y: 0 }
        };

        if (directions[event.key]) {
            if (!controlsEnabled) return;
            event.preventDefault();
            setDirection(directions[event.key]);
            return;
        }

        if (event.code === "Space") {
            if (!controlsEnabled) return;
            event.preventDefault();
            togglePause();
        }
    }

    function handleSwipe(startX, startY, endX, endY) {
        if (!controlsEnabled || countdownActive || movingToSection || gameEnded) return;

        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minimumSwipe = currentLayout.name === "mobile" ? 18 : 24;

        if (Math.abs(deltaX) < minimumSwipe && Math.abs(deltaY) < minimumSwipe) {
            return;
        }

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            setDirection(deltaX > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
        } else {
            setDirection(deltaY > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
        }
    }

    document.addEventListener("keydown", handleKeyboard);
    pauseButton?.addEventListener("click", togglePause);
    mobilePause?.addEventListener("click", togglePause);

    restartButton?.addEventListener("click", () => {
        firstCountdownStarted = true;
        resetGame({ countdown: true });
    });

    const directionMap = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 }
    };

    directionButtons.forEach((button) => {
        button.addEventListener("pointerdown", (event) => {
            if (!controlsEnabled) return;
            event.preventDefault();
            setDirection(directionMap[button.dataset.direction]);
        });
    });

    canvas.addEventListener("pointerdown", () => {
        canvas.focus({ preventScroll: true });
    });

    canvas.addEventListener(
        "touchstart",
        (event) => {
            if (!controlsEnabled) return;
            const touch = event.changedTouches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
        },
        { passive: true }
    );

    canvas.addEventListener(
        "touchmove",
        (event) => {
            if (!controlsEnabled) return;
            event.preventDefault();
        },
        { passive: false }
    );

    canvas.addEventListener(
        "touchend",
        (event) => {
            if (!controlsEnabled) return;
            const touch = event.changedTouches[0];
            handleSwipe(touchStartX, touchStartY, touch.clientX, touch.clientY);
        },
        { passive: true }
    );

    if (!canvas.hasAttribute("tabindex")) {
        canvas.setAttribute("tabindex", "0");
    }

    if (gameSection) {
        const gameVisibilityObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    gameIsVisible = entry.isIntersecting && entry.intersectionRatio >= 0.2;

                    if (gameIsVisible && !firstCountdownStarted) {
                        firstCountdownStarted = true;
                        beginCountdown();
                    }
                });
            },
            { threshold: [0, 0.2, 0.45, 0.7] }
        );

        gameVisibilityObserver.observe(gameSection);
    }

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {
            const nextLayout = getLayoutForScreen();

            if (currentLayout?.name !== nextLayout.name) {
                applyGameLayout(true, firstCountdownStarted && gameIsVisible);
            } else {
                drawGame();
            }
        }, 160);
    });

    window.addEventListener("orientationchange", () => {
        setTimeout(() => {
            applyGameLayout(true, firstCountdownStarted && gameIsVisible);
        }, 250);
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden && started && !paused && !countdownActive && !movingToSection) {
            paused = true;

            if (pauseButton) pauseButton.textContent = "CONTINUE";
            if (mobilePause) mobilePause.textContent = "CONTINUE";
            if (gameMessage) gameMessage.textContent = "PAUSED";

            drawGame();
        }
    });

    applyGameLayout(true, false);
}
