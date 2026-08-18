"use strict";

(() => {
    const canvas = document.querySelector("#snakeCanvas");
    if (!canvas) return;

    const context = canvas.getContext("2d");
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

    const ALLOWED_SECTIONS = new Set([
        "about",
        "skills",
        "projects",
        "resume",
        "certificates",
        "contact"
    ]);

    const LAYOUTS = {
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

    let layout = null;
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
    let gameLoop = null;
    let resizeTimer = null;
    let countdownTimers = [];
    let touchStartX = 0;
    let touchStartY = 0;

    function getLayout() {
        if (window.innerWidth <= 600) return LAYOUTS.mobile;
        if (window.innerWidth <= 1100) return LAYOUTS.tablet;
        return LAYOUTS.desktop;
    }

    function applyLayout(restartCountdown = false) {
        layout = getLayout();
        columns = layout.columns;
        rows = layout.rows;
        portals = layout.portals
            .filter((portal) => ALLOWED_SECTIONS.has(portal.id))
            .map((portal) => ({ ...portal }));

        canvas.width = columns * CELL;
        canvas.height = rows * CELL;
        canvas.dataset.layout = layout.name;
        if (gameBox) gameBox.dataset.gameLayout = layout.name;
        resetGame(restartCountdown);
    }

    function pointOnSnake(x, y) {
        return snake.some((part) => part.x === x && part.y === y);
    }

    function pointInPortal(x, y) {
        return portals.some((portal) => (
            x >= portal.x &&
            x < portal.x + portal.width &&
            y >= portal.y &&
            y < portal.y + portal.height
        ));
    }

    function foodCellIsSafe(x, y) {
        return !pointOnSnake(x, y) && !pointInPortal(x, y);
    }

    function spawnFood() {
        for (let attempt = 0; attempt < 700; attempt += 1) {
            const x = Math.floor(Math.random() * columns);
            const y = Math.floor(Math.random() * rows);
            if (foodCellIsSafe(x, y)) {
                food = { x, y };
                return;
            }
        }

        for (let y = 0; y < rows; y += 1) {
            for (let x = 0; x < columns; x += 1) {
                if (foodCellIsSafe(x, y)) {
                    food = { x, y };
                    return;
                }
            }
        }
    }

    function clearCountdown() {
        countdownTimers.forEach((timer) => clearTimeout(timer));
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

        const sequence = ["3", "2", "1", "START!"];

        sequence.forEach((value, index) => {
            const timer = window.setTimeout(() => {
                countdownText = value;
                if (gameMessage) {
                    gameMessage.textContent = value === "START!" ? "START!" : `GET READY • ${value}`;
                }
                draw();
            }, index * COUNTDOWN_STEP);
            countdownTimers.push(timer);
        });

        const finishTimer = window.setTimeout(() => {
            countdownActive = false;
            countdownText = "";
            setControls(true);
            if (gameMessage) gameMessage.textContent = "EAT FOOD TO GROW • THEN HIT A SECTION";
            draw();
        }, sequence.length * COUNTDOWN_STEP);

        countdownTimers.push(finishTimer);
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
        gameLoop = window.setInterval(update, SPEED);

        if (gameMessage) gameMessage.textContent = countdown ? "GET READY" : "GAME READY";
        draw();
        if (countdown) beginCountdown();
    }

    function setDirection(newDirection) {
        if (!controlsEnabled || countdownActive || openingSection || gameOverState || !newDirection) return;

        const currentDirection = (nextDirection.x !== 0 || nextDirection.y !== 0) ? nextDirection : direction;
        const reversing =
            currentDirection.x + newDirection.x === 0 &&
            currentDirection.y + newDirection.y === 0 &&
            (currentDirection.x !== 0 || currentDirection.y !== 0);

        if (reversing) return;

        nextDirection = newDirection;

        if (!started) {
            started = true;
            paused = false;
            if (gameMessage) gameMessage.textContent = "EAT FOOD • GROW • HIT A SECTION";
        }
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
        return portals.find((portal) => (
            head.x >= portal.x &&
            head.x < portal.x + portal.width &&
            head.y >= portal.y &&
            head.y < portal.y + portal.height
        ));
    }

    function openPortal(portal) {
        if (!portal || openingSection) return;
        openingSection = true;
        paused = true;
        direction = { x: 0, y: 0 };
        nextDirection = { x: 0, y: 0 };
        setControls(false);

        if (gameMessage) gameMessage.textContent = `OPENING ${portal.label} • FOOD SCORE: ${score}`;
        draw();

        window.setTimeout(() => {
            window.dispatchEvent(new CustomEvent("portfolio:game-target", {
                detail: {
                    id: portal.id,
                    label: portal.label,
                    score,
                    length: snake.length
                }
            }));
        }, 220);
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
        if (countdownActive || !started || paused || gameOverState || openingSection) {
            draw();
            return;
        }

        direction = nextDirection;
        if (direction.x === 0 && direction.y === 0) {
            draw();
            return;
        }

        const head = {
            x: snake[0].x + direction.x,
            y: snake[0].y + direction.y
        };

        const hitWall = head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows;
        const bodyToCheck = snake.slice(0, Math.max(0, snake.length - 1));
        const hitSelf = bodyToCheck.some((part) => part.x === head.x && part.y === head.y);

        if (hitWall || hitSelf) {
            endGame();
            return;
        }

        const ateFood = head.x === food.x && head.y === food.y;
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
        context.beginPath();
        context.moveTo(x + r, y);
        context.arcTo(x + width, y, x + width, y + height, r);
        context.arcTo(x + width, y + height, x, y + height, r);
        context.arcTo(x, y + height, x, y, r);
        context.arcTo(x, y, x + width, y, r);
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
        const inset = layout.name === "mobile" ? 3 : 5;
        const fontSize = layout.name === "mobile"
            ? (portal.id === "certificates" ? 10 : 12)
            : (layout.name === "tablet"
                ? (portal.id === "certificates" ? 11 : 13)
                : (portal.id === "certificates" ? 12 : 15));

        context.save();
        context.globalAlpha = 0.13;
        context.fillStyle = portal.color;
        roundRect(x + inset, y + inset, width - inset * 2, height - inset * 2, layout.name === "mobile" ? 10 : 14);
        context.fill();

        context.globalAlpha = 0.85;
        context.strokeStyle = portal.color;
        context.lineWidth = layout.name === "mobile" ? 1.5 : 2;
        context.setLineDash(layout.name === "mobile" ? [5, 5] : [7, 7]);
        roundRect(x + inset, y + inset, width - inset * 2, height - inset * 2, layout.name === "mobile" ? 10 : 14);
        context.stroke();

        context.globalAlpha = 1;
        context.setLineDash([]);
        context.fillStyle = portal.color;
        context.font = `bold ${fontSize}px Arial`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(portal.label, x + width / 2, y + height / 2);
        context.restore();
    }

    function drawFood() {
        const x = food.x * CELL + CELL / 2;
        const y = food.y * CELL + CELL / 2;
        const radius = layout.name === "mobile" ? 6 : 7;

        context.save();
        context.shadowColor = "#ff7f8d";
        context.shadowBlur = layout.name === "mobile" ? 12 : 18;
        context.fillStyle = "#ff7f8d";
        context.beginPath();
        context.arc(x, y + 1, radius, 0, Math.PI * 2);
        context.fill();

        context.shadowBlur = 0;
        context.fillStyle = "#6ff0bf";
        context.beginPath();
        context.ellipse(x + 5, y - 6, 4, 2, -0.7, 0, Math.PI * 2);
        context.fill();
        context.restore();
    }

    function drawSnake() {
        snake.forEach((part, index) => {
            const x = part.x * CELL + 2;
            const y = part.y * CELL + 2;
            const size = CELL - 4;

            context.save();
            context.fillStyle = index === 0
                ? "#a0ffdc"
                : `rgba(111, 240, 191, ${Math.max(0.34, 0.93 - index * 0.035)})`;

            if (index === 0) {
                context.shadowColor = "#6ff0bf";
                context.shadowBlur = layout.name === "mobile" ? 9 : 14;
            }

            roundRect(x, y, size, size, index === 0 ? 7 : 5);
            context.fill();
            context.restore();
        });
    }

    function drawOverlay(title, subtitle) {
        const titleSize = layout.name === "mobile" ? 24 : (layout.name === "tablet" ? 28 : 31);
        context.fillStyle = "rgba(4, 10, 18, 0.72)";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#ffffff";
        context.font = `bold ${titleSize}px Arial`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(title, canvas.width / 2, canvas.height / 2 - 8);
        context.fillStyle = "#9eafc4";
        context.font = `${layout.name === "mobile" ? 12 : 13}px Arial`;
        context.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 24);
    }

    function draw() {
        if (!layout) return;

        const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "#081423");
        gradient.addColorStop(1, "#0a1a2c");
        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        drawGrid();
        portals.forEach(drawPortal);
        drawFood();
        drawSnake();

        if (countdownActive) {
            drawOverlay(countdownText || "3", countdownText === "START!" ? "GET READY TO EAT AND GROW" : "CONTROLS LOCKED");
            return;
        }

        if (!started && controlsEnabled && !gameOverState) {
            drawOverlay("READY", layout.name === "mobile" ? "SWIPE OR TAP AN ARROW" : "PRESS ARROWS OR WASD");
        }

        if (paused && started && !openingSection) {
            drawOverlay("PAUSED", "PRESS CONTINUE");
        }

        if (gameOverState) {
            drawOverlay("GAME OVER", "PRESS RESTART");
        }
    }

    function gameModeIsActive() {
        return window.portfolioRouter?.getMode?.() === "game";
    }

    function handleKeyboard(event) {
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (tag === "input" || tag === "textarea" || tag === "select") return;
        if (!gameModeIsActive()) return;

        const map = {
            ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
            ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
            ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
            ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 }
        };

        if (map[event.key]) {
            if (!controlsEnabled) return;
            event.preventDefault();
            setDirection(map[event.key]);
            return;
        }

        if (event.code === "Space") {
            if (!controlsEnabled) return;
            event.preventDefault();
            togglePause();
        }
    }

    document.addEventListener("keydown", handleKeyboard);
    pauseButton?.addEventListener("click", togglePause);
    mobilePause?.addEventListener("click", togglePause);
    restartButton?.addEventListener("click", () => resetGame(true));

    const directionMap = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 }
    };

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
        const minimum = 18;

        if (Math.abs(dx) < minimum && Math.abs(dy) < minimum) return;

        if (Math.abs(dx) > Math.abs(dy)) {
            setDirection(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
        } else {
            setDirection(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
        }
    }, { passive: true });

    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
            const next = getLayout();
            if (!layout || next.name !== layout.name) {
                applyLayout(gameModeIsActive());
            } else {
                draw();
            }
        }, 160);
    });

    window.addEventListener("orientationchange", () => {
        window.setTimeout(() => applyLayout(gameModeIsActive()), 250);
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden && started && !paused && !countdownActive && !openingSection) {
            paused = true;
            if (pauseButton) pauseButton.textContent = "CONTINUE";
            if (mobilePause) mobilePause.textContent = "CONTINUE";
            draw();
        }
    });

    window.portfolioSnakeGame = {
        restart() {
            resetGame(true);
        },
        getState() {
            return {
                score,
                length: snake.length,
                started,
                paused,
                countdownActive
            };
        }
    };

    applyLayout(false);
})();
