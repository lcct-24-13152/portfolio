"use strict";

(() => {
    const canvas = document.querySelector("#snakeCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const scoreText = document.querySelector("#score");
    const gameMessage = document.querySelector("#gameMessage");
    const pauseButton = document.querySelector("#pauseButton");
    const restartButton = document.querySelector("#restartButton");
    const mobilePause = document.querySelector("#mobilePause");
    const gameBox = canvas.closest(".game-box");
    const directionButtons = [...document.querySelectorAll("[data-direction]")];

    const CELL = 20;
    const SPEED = 112;
    const COUNTDOWN_STEP = 700;
    const START_DIRECTION = { x: 1, y: 0 };

    const ALLOWED_SECTIONS = new Set([
        "about", "skills", "projects", "resume", "certificates", "contact"
    ]);

    const LAYOUTS = {
        desktop: {
            name: "desktop",
            columns: 48,
            rows: 26,
            startSnake: [
                { x: 24, y: 13 }, { x: 23, y: 13 }, { x: 22, y: 13 }, { x: 21, y: 13 }
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
                { x: 17, y: 14 }, { x: 16, y: 14 }, { x: 15, y: 14 }, { x: 14, y: 14 }
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
            columns: 20,
            rows: 26,
            startSnake: [
                { x: 7, y: 16 }, { x: 6, y: 16 }, { x: 5, y: 16 }, { x: 4, y: 16 }
            ],
            portals: [
                { id: "about", label: "ABOUT", x: 1, y: 1, width: 7, height: 3, color: "#6ff0bf" },
                { id: "skills", label: "SKILLS", x: 12, y: 1, width: 7, height: 3, color: "#77a4ff" },
                { id: "projects", label: "PROJECTS", x: 1, y: 8, width: 7, height: 3, color: "#c38dff" },
                { id: "certificates", label: "CERTIFICATES", x: 10, y: 8, width: 9, height: 3, color: "#5fd9ff" },
                { id: "resume", label: "RESUME", x: 1, y: 22, width: 7, height: 3, color: "#ffca6a" },
                { id: "contact", label: "CONTACT", x: 12, y: 22, width: 7, height: 3, color: "#ff7f8d" }
            ]
        },
        mobileLandscape: {
            name: "mobile-landscape",
            columns: 30,
            rows: 18,
            startSnake: [
                { x: 15, y: 9 }, { x: 14, y: 9 }, { x: 13, y: 9 }, { x: 12, y: 9 }
            ],
            portals: [
                { id: "about", label: "ABOUT", x: 1, y: 1, width: 6, height: 3, color: "#6ff0bf" },
                { id: "skills", label: "SKILLS", x: 9, y: 1, width: 6, height: 3, color: "#77a4ff" },
                { id: "projects", label: "PROJECTS", x: 17, y: 1, width: 7, height: 3, color: "#c38dff" },
                { id: "resume", label: "RESUME", x: 1, y: 14, width: 7, height: 3, color: "#ffca6a" },
                { id: "certificates", label: "CERTIFICATES", x: 10, y: 14, width: 9, height: 3, color: "#5fd9ff" },
                { id: "contact", label: "CONTACT", x: 22, y: 14, width: 7, height: 3, color: "#ff7f8d" }
            ]
        }
    };

    let layout;
    let columns = 48;
    let rows = 26;
    let portals = [];
    let snake = [];
    let food = { x: 1, y: 1 };
    let direction = { x: 0, y: 0 };
    let nextDirection = { x: 0, y: 0 };
    let score = 0;
    let started = false;
    let paused = false;
    let gameOverState = false;
    let openingSection = false;
    let controlsEnabled = false;
    let countdownActive = false;
    let countdownText = "";
    let gameLoop;
    let resizeTimer;
    let countdownTimers = [];
    let touchStartX = 0;
    let touchStartY = 0;

    const isPhoneLandscape = () => window.innerWidth > window.innerHeight && window.innerHeight <= 600;

    function getLayout() {
        if (isPhoneLandscape()) return LAYOUTS.mobileLandscape;
        if (window.innerWidth <= 600) return LAYOUTS.mobile;
        if (window.innerWidth <= 1100) return LAYOUTS.tablet;
        return LAYOUTS.desktop;
    }

    function gameModeIsActive() {
        return window.portfolioRouter?.getMode?.() === "game";
    }

    function applyLayout(restartCountdown = false) {
        layout = getLayout();
        columns = layout.columns;
        rows = layout.rows;
        portals = layout.portals.filter((portal) => ALLOWED_SECTIONS.has(portal.id)).map((portal) => ({ ...portal }));
        canvas.width = columns * CELL;
        canvas.height = rows * CELL;
        canvas.dataset.layout = layout.name;
        if (gameBox) gameBox.dataset.gameLayout = layout.name;
        resetGame(restartCountdown);
    }

    const pointOnSnake = (x, y) => snake.some((part) => part.x === x && part.y === y);
    const pointInPortal = (x, y) => portals.some((portal) => x >= portal.x && x < portal.x + portal.width && y >= portal.y && y < portal.y + portal.height);

    function spawnFood() {
        for (let attempt = 0; attempt < 900; attempt += 1) {
            const x = Math.floor(Math.random() * columns);
            const y = Math.floor(Math.random() * rows);
            if (!pointOnSnake(x, y) && !pointInPortal(x, y)) {
                food = { x, y };
                return;
            }
        }
    }

    function clearCountdown() {
        countdownTimers.forEach(clearTimeout);
        countdownTimers = [];
    }

    function setControls(enabled) {
        controlsEnabled = enabled;
        directionButtons.forEach((button) => {
            button.disabled = !enabled;
            button.setAttribute("aria-disabled", String(!enabled));
        });
        if (pauseButton) pauseButton.disabled = !enabled || gameOverState;
        if (mobilePause) mobilePause.disabled = !enabled || gameOverState;
    }

    function startMovingAutomatically() {
        if (!gameModeIsActive()) return;
        direction = { ...START_DIRECTION };
        nextDirection = { ...START_DIRECTION };
        started = true;
        paused = false;
        if (gameMessage) gameMessage.textContent = "EAT FOOD • GROW • HIT A SECTION";
    }

    function beginCountdown() {
        clearCountdown();
        started = false;
        paused = false;
        gameOverState = false;
        openingSection = false;
        direction = { x: 0, y: 0 };
        nextDirection = { x: 0, y: 0 };
        countdownActive = true;
        setControls(false);

        ["3", "2", "1", "START!"].forEach((value, index) => {
            countdownTimers.push(setTimeout(() => {
                countdownText = value;
                if (gameMessage) gameMessage.textContent = value === "START!" ? "START!" : `GET READY • ${value}`;
                draw();
            }, index * COUNTDOWN_STEP));
        });

        countdownTimers.push(setTimeout(() => {
            countdownActive = false;
            countdownText = "";
            setControls(true);
            startMovingAutomatically();
            draw();
        }, 4 * COUNTDOWN_STEP));
    }

    function resetGame(countdown = false) {
        clearCountdown();
        snake = layout.startSnake.map((part) => ({ ...part }));
        direction = { x: 0, y: 0 };
        nextDirection = { x: 0, y: 0 };
        score = 0;
        started = false;
        paused = false;
        gameOverState = false;
        openingSection = false;
        countdownActive = false;
        countdownText = "";
        spawnFood();
        if (scoreText) scoreText.textContent = "0";
        if (pauseButton) pauseButton.textContent = "PAUSE";
        if (mobilePause) mobilePause.textContent = "PAUSE";
        setControls(false);
        clearInterval(gameLoop);
        gameLoop = setInterval(update, SPEED);
        if (gameMessage) gameMessage.textContent = countdown ? "GET READY" : "GAME READY";
        draw();
        if (countdown) beginCountdown();
    }

    function setDirection(newDirection) {
        if (!controlsEnabled || countdownActive || openingSection || gameOverState || !newDirection) return;
        const current = (nextDirection.x || nextDirection.y) ? nextDirection : direction;
        const reversing = current.x + newDirection.x === 0 && current.y + newDirection.y === 0 && (current.x || current.y);
        if (reversing) return;
        nextDirection = { ...newDirection };
        if (!started) {
            started = true;
            paused = false;
        }
        if (gameMessage) gameMessage.textContent = "EAT FOOD • GROW • HIT A SECTION";
    }

    function togglePause() {
        if (!controlsEnabled || countdownActive || openingSection || gameOverState || !started) return;
        paused = !paused;
        if (pauseButton) pauseButton.textContent = paused ? "CONTINUE" : "PAUSE";
        if (mobilePause) mobilePause.textContent = paused ? "CONTINUE" : "PAUSE";
        if (gameMessage) gameMessage.textContent = paused ? "PAUSED" : "EAT FOOD • GROW • HIT A SECTION";
        draw();
    }

    function findPortal(head) {
        return portals.find((portal) => head.x >= portal.x && head.x < portal.x + portal.width && head.y >= portal.y && head.y < portal.y + portal.height);
    }

    function openPortal(portal) {
        if (!portal || openingSection) return;
        openingSection = true;
        paused = true;
        setControls(false);
        if (gameMessage) gameMessage.textContent = `OPENING ${portal.label} • FOOD SCORE: ${score}`;
        draw();
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent("portfolio:game-target", {
                detail: { id: portal.id, label: portal.label, score, length: snake.length }
            }));
        }, 180);
    }

    function endGame() {
        gameOverState = true;
        started = false;
        paused = true;
        setControls(false);
        if (gameMessage) gameMessage.textContent = "GAME OVER • PRESS RESTART";
        draw();
    }

    function update() {
        if (countdownActive || !started || paused || gameOverState || openingSection) return draw();
        direction = { ...nextDirection };
        if (!direction.x && !direction.y) return draw();

        const head = {
            x: (snake[0].x + direction.x + columns) % columns,
            y: (snake[0].y + direction.y + rows) % rows
        };

        const ateFood = head.x === food.x && head.y === food.y;
        const bodyToCheck = ateFood ? snake : snake.slice(0, -1);
        if (bodyToCheck.some((part) => part.x === head.x && part.y === head.y)) return endGame();

        snake.unshift(head);
        if (ateFood) {
            score += 1;
            if (scoreText) scoreText.textContent = String(score);
            spawnFood();
            if (gameMessage) gameMessage.textContent = `FOOD: ${score} • LENGTH: ${snake.length} • FIND A SECTION`;
        } else {
            snake.pop();
        }

        const portal = findPortal(head);
        if (portal) openPortal(portal);
        draw();
    }

    function roundRect(x, y, width, height, radius) {
        const r = Math.max(0, Math.min(radius, width / 2, height / 2));
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + width, y, x + width, y + height, r);
        ctx.arcTo(x + width, y + height, x, y + height, r);
        ctx.arcTo(x, y + height, x, y, r);
        ctx.arcTo(x, y, x + width, y, r);
        ctx.closePath();
    }

    function drawGrid() {
        ctx.strokeStyle = "rgba(111, 240, 191, 0.035)";
        ctx.lineWidth = 1;
        for (let x = 0; x <= canvas.width; x += CELL) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
        }
        for (let y = 0; y <= canvas.height; y += CELL) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        }
    }

    function drawPortal(portal) {
        const x = portal.x * CELL;
        const y = portal.y * CELL;
        const width = portal.width * CELL;
        const height = portal.height * CELL;
        const phone = layout.name.startsWith("mobile");
        const inset = phone ? 3 : 5;
        let fontSize = phone ? 11 : (layout.name === "tablet" ? 13 : 15);
        if (portal.id === "certificates") fontSize = phone ? 9 : (layout.name === "tablet" ? 11 : 12);

        ctx.save();
        ctx.globalAlpha = 0.13;
        ctx.fillStyle = portal.color;
        roundRect(x + inset, y + inset, width - inset * 2, height - inset * 2, phone ? 8 : 14);
        ctx.fill();
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = portal.color;
        ctx.lineWidth = phone ? 1.5 : 2;
        ctx.setLineDash(phone ? [4, 4] : [7, 7]);
        roundRect(x + inset, y + inset, width - inset * 2, height - inset * 2, phone ? 8 : 14);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
        ctx.fillStyle = portal.color;
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(portal.label, x + width / 2, y + height / 2);
        ctx.restore();
    }

    function drawFood() {
        const x = food.x * CELL + CELL / 2;
        const y = food.y * CELL + CELL / 2;
        const phone = layout.name.startsWith("mobile");
        ctx.save();
        ctx.shadowColor = "#ff7f8d";
        ctx.shadowBlur = phone ? 12 : 18;
        ctx.fillStyle = "#ff7f8d";
        ctx.beginPath();
        ctx.arc(x, y + 1, phone ? 6 : 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#6ff0bf";
        ctx.beginPath();
        ctx.ellipse(x + 5, y - 6, 4, 2, -0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawSnake() {
        snake.forEach((part, index) => {
            const x = part.x * CELL + 2;
            const y = part.y * CELL + 2;
            ctx.save();
            ctx.fillStyle = index === 0 ? "#a0ffdc" : `rgba(111,240,191,${Math.max(0.34, 0.93 - index * 0.035)})`;
            if (index === 0) {
                ctx.shadowColor = "#6ff0bf";
                ctx.shadowBlur = layout.name.startsWith("mobile") ? 9 : 14;
            }
            roundRect(x, y, CELL - 4, CELL - 4, index === 0 ? 7 : 5);
            ctx.fill();
            ctx.restore();
        });
    }

    function drawOverlay(title, subtitle) {
        const phone = layout.name.startsWith("mobile");
        ctx.fillStyle = "rgba(4, 10, 18, 0.72)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff";
        ctx.font = `bold ${phone ? 24 : layout.name === "tablet" ? 28 : 31}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 8);
        ctx.fillStyle = "#9eafc4";
        ctx.font = `${phone ? 11 : 13}px Arial`;
        ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 24);
    }

    function draw() {
        if (!layout) return;
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "#081423");
        gradient.addColorStop(1, "#0a1a2c");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        portals.forEach(drawPortal);
        drawFood();
        drawSnake();

        if (countdownActive) {
            drawOverlay(countdownText || "3", countdownText === "START!" ? "AUTO STARTING" : "CONTROLS LOCKED");
        } else if (paused && started && !openingSection) {
            drawOverlay("PAUSED", "PRESS CONTINUE");
        } else if (gameOverState) {
            drawOverlay("GAME OVER", "PRESS RESTART");
        }
    }

    const directionMap = {
        up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 }
    };

    function handleKeyboard(event) {
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (["input", "textarea", "select"].includes(tag) || !gameModeIsActive()) return;
        const map = {
            ArrowUp: directionMap.up, w: directionMap.up, W: directionMap.up,
            ArrowDown: directionMap.down, s: directionMap.down, S: directionMap.down,
            ArrowLeft: directionMap.left, a: directionMap.left, A: directionMap.left,
            ArrowRight: directionMap.right, d: directionMap.right, D: directionMap.right
        };
        if (map[event.key]) {
            if (!controlsEnabled) return;
            event.preventDefault();
            setDirection(map[event.key]);
        } else if (event.code === "Space" && controlsEnabled) {
            event.preventDefault();
            togglePause();
        }
    }

    document.addEventListener("keydown", handleKeyboard);
    pauseButton?.addEventListener("click", togglePause);
    mobilePause?.addEventListener("click", togglePause);
    restartButton?.addEventListener("click", () => resetGame(true));

    directionButtons.forEach((button) => {
        button.addEventListener("pointerdown", (event) => {
            if (!controlsEnabled || !gameModeIsActive()) return;
            event.preventDefault();
            setDirection(directionMap[button.dataset.direction]);
        });
    });

    canvas.addEventListener("touchstart", (event) => {
        if (!controlsEnabled || !gameModeIsActive()) return;
        const touch = event.changedTouches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }, { passive: true });

    canvas.addEventListener("touchmove", (event) => {
        if (controlsEnabled && gameModeIsActive()) event.preventDefault();
    }, { passive: false });

    canvas.addEventListener("touchend", (event) => {
        if (!controlsEnabled || !gameModeIsActive()) return;
        const touch = event.changedTouches[0];
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;
        if (Math.abs(dx) < 16 && Math.abs(dy) < 16) return;
        setDirection(Math.abs(dx) > Math.abs(dy)
            ? (dx > 0 ? directionMap.right : directionMap.left)
            : (dy > 0 ? directionMap.down : directionMap.up));
    }, { passive: true });

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const next = getLayout();
            if (!layout || next.name !== layout.name) applyLayout(gameModeIsActive());
            else draw();
        }, 160);
    });

    window.addEventListener("orientationchange", () => setTimeout(() => applyLayout(gameModeIsActive()), 220));

    document.addEventListener("visibilitychange", () => {
        if (document.hidden && started && !paused && !countdownActive && !openingSection) {
            paused = true;
            if (pauseButton) pauseButton.textContent = "CONTINUE";
            if (mobilePause) mobilePause.textContent = "CONTINUE";
            draw();
        }
    });

    window.portfolioSnakeGame = {
        restart() { resetGame(true); },
        getState() { return { score, length: snake.length, started, paused, countdownActive, layout: layout?.name }; }
    };

    applyLayout(false);
})();
