<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

function sendJsonResponse(
    bool $success,
    string $message,
    int $statusCode = 200
): void {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');

    echo json_encode(
        [
            'success' => $success,
            'message' => $message,
        ],
        JSON_UNESCAPED_UNICODE
    );

    exit;
}

function textLength(string $value): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($value, 'UTF-8');
    }

    return strlen($value);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST'
    && ($_POST['action'] ?? '') === 'save_contact_message'
) {
    $name = trim((string) ($_POST['name'] ?? ''));
    $email = trim((string) ($_POST['email'] ?? ''));
    $subject = trim((string) ($_POST['subject'] ?? ''));
    $message = trim((string) ($_POST['message'] ?? ''));
    $website = trim((string) ($_POST['website'] ?? ''));

    /*
     * Honeypot spam protection.
     * Real users never see or complete the website field.
     */
    if ($website !== '') {
        sendJsonResponse(true, 'Message sent successfully.');
    }

    if ($name === '' || $email === '' || $subject === '' || $message === '') {
        sendJsonResponse(
            false,
            'Please complete all contact fields.',
            422
        );
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJsonResponse(
            false,
            'Please enter a valid email address.',
            422
        );
    }

    if (textLength($name) > 120
        || textLength($email) > 190
        || textLength($subject) > 190
        || textLength($message) > 5000
    ) {
        sendJsonResponse(
            false,
            'One or more fields are too long.',
            422
        );
    }

    try {
        $pdo = getDatabaseConnection();

        $statement = $pdo->prepare(
            'INSERT INTO contact_messages
                (full_name, email, subject, message)
             VALUES
                (:full_name, :email, :subject, :message)'
        );

        $statement->execute([
            'full_name' => $name,
            'email'     => $email,
            'subject'   => $subject,
            'message'   => $message,
        ]);

        sendJsonResponse(
            true,
            'Your message was saved successfully.'
        );
    } catch (Throwable $exception) {
        error_log($exception->getMessage());

        sendJsonResponse(
            false,
            'Database connection failed. Please open setup.php first.',
            500
        );
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Portfolio of Cher Micole Plete Lirio, BS Information Technology student.">
    <title>Cher Micole Plete Lirio | Portfolio</title>

    <link rel="stylesheet" href="style.css">
    <script src="script.js" defer></script>
</head>
<body>
    <header class="header" id="header">
        <nav class="nav container">
            <a href="#home" class="logo">PORTFOLIO</a>

            <button class="menu-button" id="menuButton" type="button" aria-label="Open menu">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <div class="nav-links" id="navLinks">
                <a href="#home" class="active">HOME</a>
                <a href="#game">GAME</a>
                <a href="#about">ABOUT</a>
                <a href="#skills">SKILLS</a>
                <a href="#projects">PROJECTS</a>
                <a href="#resume">RESUME</a>
                <a href="#certificates">CERTIFICATES</a>
                <a href="#contact">CONTACT</a>

                <button class="theme-button" id="themeButton" type="button" aria-label="Change theme">
                    ◐
                </button>
            </div>
        </nav>
    </header>

    <main>
        <section class="hero section" id="home">
            <div class="container hero-grid">
                <div class="hero-content reveal">
                    <p class="small-label">PERSONAL PORTFOLIO</p>

                    <h1>CHER<br> MICOLE P.<br> LIRIO</h1>

                    <p class="hero-title">BS INFORMATION TECHNOLOGY STUDENT</p>

                    <p class="hero-description">
                        I create clean, responsive, and functional websites using
                        HTML, CSS, JavaScript, PHP, and MySQL.
                    </p>

                    <div class="hero-buttons">
                        <a href="#game" class="button primary-button">PLAY GAME</a>
                        <a href="#resume" class="button outline-button">VIEW RESUME</a>
                    </div>
                </div>

                <div class="profile-card reveal">
                    <div class="profile-card-top">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <div class="profile-card-body">
                        <div class="profile-photo-frame">
                            <img
                                src="profile-photo-2x2.jpg"
                                alt="Cher Micole Plete Lirio"
                                class="profile-photo">
                        </div>

                        <div class="profile-card-info">
                            <p class="profile-name">CHER MICOLE PLETE LIRIO</p>
                            <p>BS Information Technology Student</p>
                            <p>Aspiring Web and System Developer</p>

                            <div class="profile-tags">
                                <span>WEB DEVELOPMENT</span>
                                <span>PHP &amp; MYSQL</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="section game-section" id="game">
            <div class="container">
                <div class="section-heading reveal">
                    <p class="small-label">INTERACTIVE NAVIGATION</p>
                    <h2>SNAKE GAME</h2>
                    <p class="section-description">
                        Move the snake using the arrow keys or WASD. On phones and tablets,
                        use the touch controls or swipe on the game board. Enter a category
                        box to open that section.
                    </p>
                </div>

                <div class="game-box reveal">
                    <div class="game-top">
                        <div class="score-box">
                            SCORE:
                            <strong id="score">0</strong>
                        </div>

                        <div id="gameMessage">PRESS ARROW KEYS OR WASD</div>

                        <div class="game-actions">
                            <button id="pauseButton" type="button">PAUSE</button>
                            <button id="restartButton" type="button">RESTART</button>
                        </div>
                    </div>

                    <div class="canvas-holder">
                        <canvas id="snakeCanvas" width="960" height="520" aria-label="Responsive snake navigation game"></canvas>
                    </div>

                    <div class="mobile-controls">
                        <button data-direction="up" type="button" aria-label="Move snake up">▲</button>

                        <div>
                            <button data-direction="left" type="button" aria-label="Move snake left">◀</button>
                            <button id="mobilePause" type="button" aria-label="Pause or continue game">●</button>
                            <button data-direction="right" type="button" aria-label="Move snake right">▶</button>
                        </div>

                        <button data-direction="down" type="button" aria-label="Move snake down">▼</button>
                    </div>
                </div>
            </div>
        </section>

        <section class="section" id="about">
            <div class="container">
                <div class="section-heading reveal">
                    <p class="small-label">GET TO KNOW ME</p>
                    <h2>ABOUT ME</h2>
                </div>
                <div class="about-layout">
                    <article class="about-card reveal">
                        <h3>Hello, I’m Cher.</h3>
                        <p>Motivated and responsible Information Technology student with knowledge in web development, databases, and system development. Able to communicate well, organize tasks, and solve basic technical problems. Comfortable working independently or with a team and willing to learn new skills when needed. Looking for an opportunity to gain experience, improve technical abilities, and contribute to the organization.</p>
                    </article>
                    <div class="about-grid reveal">
                        <article class="info-card"><strong>BSIT</strong><span>COURSE</span></article>
                        <article class="info-card"><strong>WEB</strong><span>DEVELOPMENT</span></article>
                        <article class="info-card"><strong>DB</strong><span>DATABASE</span></article>
                        <article class="info-card"><strong>UI/UX</strong><span>DESIGN</span></article>
                    </div>
                </div>
            </div>
        </section>

        <section class="section alternate-section" id="skills">
            <div class="container">
                <div class="section-heading reveal"><p class="small-label">WHAT I USE</p><h2>SKILLS</h2></div>
                <div class="skills-grid">
                    <article class="skill-card reveal"><div class="skill-number">01</div><h3>UI/UX Design</h3><p>Creating simple, readable, and responsive interfaces for desktop and mobile devices.</p></article>
                    <article class="skill-card reveal"><div class="skill-number">02</div><h3>Web Development</h3><p>Building responsive websites and interfaces using HTML, CSS, and JavaScript.</p></article>
                    <article class="skill-card reveal"><div class="skill-number">03</div><h3>Database Management</h3><p>Working with MySQL databases, records, forms, and basic data management.</p></article>
                    <article class="skill-card reveal"><div class="skill-number">04</div><h3>System Development & Testing</h3><p>Developing and testing web-based systems with PHP and MySQL.</p></article>
                </div>
            </div>
        </section>

        <section class="section" id="projects">
            <div class="container">
                <div class="section-heading reveal"><p class="small-label">SELECTED WORKS</p><h2>PROJECTS</h2></div>
                <div class="project-filters reveal">
                    <button class="filter active" data-filter="all" type="button">ALL</button>
                    <button class="filter" data-filter="one" type="button">PORTFOLIO</button>
                    <button class="filter" data-filter="two" type="button">SPORTZLE</button>
                </div>
                <div class="project-grid">
                    <article class="project-card reveal" id="project-portfolio" data-category="one">
                        <div class="project-image project-one"><span>01</span></div>
                        <div class="project-body">
                            <p class="project-type">PERSONAL WEBSITE</p><h3>Personal Portfolio Website</h3>
                            <p>Designed and developed a responsive personal portfolio website to showcase projects, skills, achievements, and certificates.</p>
                            <div class="project-tools"><span>HTML</span><span>CSS</span><span>JAVASCRIPT</span></div>
                            <button class="project-open" data-project="1" type="button">VIEW DETAILS</button>
                        </div>
                    </article>
                    <article class="project-card reveal" id="project-sportzle" data-category="two">
                        <div class="project-image project-two"><span>02</span></div>
                        <div class="project-body">
                            <p class="project-type">EDUCATIONAL GAME SYSTEM</p><h3>Sportzle Educational Game System</h3>
                            <p>Developed an interactive sports-themed educational game with solo and multiplayer modes, scoring, difficulty levels, leaderboards, and responsive features.</p>
                            <div class="project-tools"><span>PHP</span><span>MYSQL</span><span>JAVASCRIPT</span></div>
                            <button class="project-open" data-project="2" type="button">VIEW DETAILS</button>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <section class="section alternate-section" id="resume">
            <div class="container">
                <div class="resume-heading reveal"><div class="section-heading"><p class="small-label">MY BACKGROUND</p><h2>RESUME</h2></div><button class="button primary-button" id="printResume" type="button">PRINT / SAVE PDF</button></div>
                <article class="resume-template reveal" id="resumeTemplate">
                    <div class="resume-top"><div class="resume-photo"><img src="profile-photo-2x2.jpg" alt="Cher Micole Plete Lirio"></div><div><h3>CHER MICOLE PLETE LIRIO</h3><p>BS Information Technology Student</p><span>Balele, Tanauan City, Batangas, Philippines</span></div></div>
                    <div class="resume-columns">
                        <aside>
                            <div class="resume-block"><h4>CONTACT</h4><p>09764332931</p><p>liriocher25@gmail.com</p><p>Balele, Tanauan City, Batangas, Philippines</p></div>
                            <div class="resume-block"><h4>TECHNICAL SKILLS</h4><ul><li>UI/UX Design</li><li>Web Development</li><li>Database Management</li><li>System Development &amp; Testing</li><li>PHP &amp; MySQL</li><li>HTML, CSS, JavaScript</li></ul></div>
                            <div class="resume-block"><h4>SOFT SKILLS</h4><ul><li>Communication Skills</li><li>Problem-Solving</li><li>Teamwork and Collaboration</li><li>Willingness to Learn</li><li>Time Management</li><li>Adaptability</li><li>Hardworking</li></ul></div>
                            <div class="resume-block"><h4>REFERENCES</h4><p><strong>Dr. Salem Laylo</strong><br>IT Program Chair<br>La Consolacion College of Tanauan<br>Phone: 09178898876</p><p><strong>Ms. Regine Lopez</strong><br>SHS Teacher<br>La Consolacion College of Tanauan<br>Phone: 09677966337</p></div>
                        </aside>
                        <div class="resume-main">
                            <div class="resume-block"><h4>ABOUT ME</h4><p>Motivated and responsible Information Technology student with knowledge in web development, databases, and system development. Able to communicate well, organize tasks, and solve basic technical problems. Comfortable working independently or with a team and willing to learn new skills when needed. Looking for an opportunity to gain experience, improve technical abilities, and contribute to the organization.</p></div>
                            <div class="resume-block"><h4>EDUCATION</h4><div class="resume-item"><p class="resume-label">2017 - PRESENT</p><h5>La Consolacion College of Tanauan</h5><p>Bachelor of Science in Information Technology</p></div></div>
                            <div class="resume-block"><h4>PROJECT AND EXPERIENCE</h4>
                                <div class="resume-item"><h5>Personal Portfolio Website</h5><p>Designed and developed a responsive personal portfolio website to showcase projects, skills, achievements, and certificates. Added interactive features and organized navigation for a better user experience. Applied front-end development skills using HTML, CSS, and JavaScript.</p><a class="resume-project-link" href="https://lcct-24-13152.github.io/portfolio/#home" target="_blank" rel="noopener noreferrer">VIEW PROJECT ↗</a></div>
                                <div class="resume-item"><h5>Sportzle Educational Game System</h5><p>Developed an interactive sports-themed educational game with solo and multiplayer modes. Implemented player registration, scoring, difficulty levels, leaderboards, and responsive game features. Worked on the system design, database integration, and overall user experience.</p><a class="resume-project-link" href="https://intelsportzle.infinityfreeapp.com/?i=1" target="_blank" rel="noopener noreferrer">VIEW PROJECT ↗</a></div>
                            </div>
                            <div class="resume-block resume-certifications-block"><h4>CERTIFICATION</h4><div class="resume-certifications">
                                <div class="resume-cert-item"><strong>HTML Essentials</strong><span>DICT-ITU DTC Initiative through Cisco Networking Academy · August 11, 2026</span></div>
                                <div class="resume-cert-item"><strong>Network Technician Career Path Exam</strong><span>Cisco Networking Academy · April 22, 2026</span></div>
                                <div class="resume-cert-item"><strong>Network Support and Security</strong><span>Cisco Networking Academy · April 14, 2026</span></div>
                                <div class="resume-cert-item"><strong>Network Addressing and Basic Troubleshooting</strong><span>Cisco Networking Academy · April 14, 2026</span></div>
                                <div class="resume-cert-item"><strong>Networking Devices and Initial Configuration</strong><span>Cisco Networking Academy · April 8, 2026</span></div>
                                <div class="resume-cert-item"><strong>Networking Basics</strong><span>Cisco Networking Academy · April 6, 2026</span></div>
                                <div class="resume-cert-item"><strong>Certificate of Participation: BSIT Educational Exposure Trip, IT Week 2026</strong><span>March 23, 2026</span></div>
                                <div class="resume-cert-item"><strong>Certificate of Participation — “Design, Build, Innovate: The Robotics Experience”</strong><span>2026</span></div>
                            </div></div>
                        </div>
                    </div>
                </article>
            </div>
        </section>

        <section class="section certificates-section" id="certificates">
            <div class="container">
                <div class="section-heading reveal">
                    <p class="small-label">CERTIFICATIONS &amp; ACHIEVEMENTS</p>
                    <h2>CERTIFICATES</h2>
                    <p class="section-description">
                        Selected certificates and achievements from networking, web development,
                        and academic activities. Open any item to view the original certificate.
                    </p>
                </div>

                <div class="certificate-grid">
                    <article class="certificate-card reveal">
                        <a class="certificate-preview" href="assets/certificates/network-technician-career-path.pdf" target="_blank" rel="noopener noreferrer" aria-label="View Network Technician Career Path Exam certificate">
                            <img src="assets/certificates/network-technician-career-path-thumb.jpg" alt="Network Technician Career Path Exam certificate">
                            <span>VIEW</span>
                        </a>
                        <div class="certificate-body">
                            <p class="certificate-type">CISCO NETWORKING ACADEMY</p>
                            <h3>Network Technician Career Path Exam</h3>
                            <p class="certificate-date">Completed April 22, 2026</p>
                            <a class="certificate-button" href="assets/certificates/network-technician-career-path.pdf" target="_blank" rel="noopener noreferrer">VIEW CERTIFICATE ↗</a>
                        </div>
                    </article>

                    <article class="certificate-card reveal">
                        <a class="certificate-preview" href="assets/certificates/network-addressing-basic-troubleshooting.pdf" target="_blank" rel="noopener noreferrer" aria-label="View Network Addressing and Basic Troubleshooting certificate">
                            <img src="assets/certificates/network-addressing-basic-troubleshooting-thumb.jpg" alt="Network Addressing and Basic Troubleshooting certificate">
                            <span>VIEW</span>
                        </a>
                        <div class="certificate-body">
                            <p class="certificate-type">CISCO NETWORKING ACADEMY</p>
                            <h3>Network Addressing and Basic Troubleshooting</h3>
                            <p class="certificate-date">Completed April 14, 2026</p>
                            <a class="certificate-button" href="assets/certificates/network-addressing-basic-troubleshooting.pdf" target="_blank" rel="noopener noreferrer">VIEW CERTIFICATE ↗</a>
                        </div>
                    </article>

                    <article class="certificate-card reveal">
                        <a class="certificate-preview" href="assets/certificates/network-support-security.pdf" target="_blank" rel="noopener noreferrer" aria-label="View Network Support and Security certificate">
                            <img src="assets/certificates/network-support-security-thumb.jpg" alt="Network Support and Security certificate">
                            <span>VIEW</span>
                        </a>
                        <div class="certificate-body">
                            <p class="certificate-type">CISCO NETWORKING ACADEMY</p>
                            <h3>Network Support and Security</h3>
                            <p class="certificate-date">Completed April 14, 2026</p>
                            <a class="certificate-button" href="assets/certificates/network-support-security.pdf" target="_blank" rel="noopener noreferrer">VIEW CERTIFICATE ↗</a>
                        </div>
                    </article>

                    <article class="certificate-card reveal">
                        <a class="certificate-preview" href="assets/certificates/networking-devices-initial-configuration.pdf" target="_blank" rel="noopener noreferrer" aria-label="View Networking Devices and Initial Configuration certificate">
                            <img src="assets/certificates/networking-devices-initial-configuration-thumb.jpg" alt="Networking Devices and Initial Configuration certificate">
                            <span>VIEW</span>
                        </a>
                        <div class="certificate-body">
                            <p class="certificate-type">CISCO NETWORKING ACADEMY</p>
                            <h3>Networking Devices and Initial Configuration</h3>
                            <p class="certificate-date">Completed April 8, 2026</p>
                            <a class="certificate-button" href="assets/certificates/networking-devices-initial-configuration.pdf" target="_blank" rel="noopener noreferrer">VIEW CERTIFICATE ↗</a>
                        </div>
                    </article>

                    <article class="certificate-card reveal">
                        <a class="certificate-preview" href="assets/certificates/networking-basics.pdf" target="_blank" rel="noopener noreferrer" aria-label="View Networking Basics certificate">
                            <img src="assets/certificates/networking-basics-thumb.jpg" alt="Networking Basics certificate">
                            <span>VIEW</span>
                        </a>
                        <div class="certificate-body">
                            <p class="certificate-type">CISCO NETWORKING ACADEMY</p>
                            <h3>Networking Basics</h3>
                            <p class="certificate-date">Completed April 6, 2026</p>
                            <a class="certificate-button" href="assets/certificates/networking-basics.pdf" target="_blank" rel="noopener noreferrer">VIEW CERTIFICATE ↗</a>
                        </div>
                    </article>

                    <article class="certificate-card reveal">
                        <a class="certificate-preview" href="assets/certificates/html-essentials-certificate.pdf" target="_blank" rel="noopener noreferrer" aria-label="View HTML Essentials certificate">
                            <img src="assets/certificates/html-essentials-certificate-thumb.jpg" alt="HTML Essentials certificate">
                            <span>VIEW</span>
                        </a>
                        <div class="certificate-body">
                            <p class="certificate-type">CISCO NETWORKING ACADEMY · DICT-ITU DTC</p>
                            <h3>HTML Essentials</h3>
                            <p class="certificate-date">Completed August 11, 2026</p>
                            <a class="certificate-button" href="assets/certificates/html-essentials-certificate.pdf" target="_blank" rel="noopener noreferrer">VIEW CERTIFICATE ↗</a>
                        </div>
                    </article>

                    <article class="certificate-card reveal">
                        <a class="certificate-preview" href="assets/certificates/html-essentials-statement-of-achievement.pdf" target="_blank" rel="noopener noreferrer" aria-label="View HTML Essentials Statement of Achievement">
                            <img src="assets/certificates/html-essentials-statement-of-achievement-thumb.jpg" alt="HTML Essentials Statement of Achievement">
                            <span>VIEW</span>
                        </a>
                        <div class="certificate-body">
                            <p class="certificate-type">CISCO NETWORKING ACADEMY · JS INSTITUTE</p>
                            <h3>HTML Essentials — Statement of Achievement</h3>
                            <p class="certificate-date">Issued August 11, 2026</p>
                            <a class="certificate-button" href="assets/certificates/html-essentials-statement-of-achievement.pdf" target="_blank" rel="noopener noreferrer">VIEW ACHIEVEMENT ↗</a>
                        </div>
                    </article>

                    <article class="certificate-card reveal">
                        <a class="certificate-preview" href="assets/certificates/bsit-educational-exposure-trip.png" target="_blank" rel="noopener noreferrer" aria-label="View BSIT Educational Exposure Trip certificate of participation">
                            <img src="assets/certificates/bsit-educational-exposure-trip-thumb.jpg" alt="BSIT Educational Exposure Trip Certificate of Participation">
                            <span>VIEW</span>
                        </a>
                        <div class="certificate-body">
                            <p class="certificate-type">LA CONSOLACION COLLEGE TANAUAN · IT WEEK 2026</p>
                            <h3>BSIT Educational Exposure Trip — Certificate of Participation</h3>
                            <p class="certificate-date">March 23, 2026 · Bonifacio Global City</p>
                            <a class="certificate-button" href="assets/certificates/bsit-educational-exposure-trip.png" target="_blank" rel="noopener noreferrer">VIEW CERTIFICATE ↗</a>
                        </div>
                    </article>
                </div>
            </div>
        </section>


        <section class="section" id="contact">
            <div class="container contact-layout">
                <div class="contact-information reveal">
                    <p class="small-label">GET IN TOUCH</p>
                    <h2>CONTACT</h2>

                    <p>
                        Feel free to contact me for collaborations, website projects, system development, or other opportunities. 
                        You may send a message through the form, and I will respond as soon as possible.
                    </p>

                    <div class="contact-details">
                        <div>
                            <span>EMAIL</span>
                            <strong>liriocher25@gmail.com</strong>
                        </div>

                        <div>
                            <span>LOCATION</span>
                            <strong>Tanauan City, Batangas, Philippines</strong>
                        </div>
                    </div>
                </div>

                <form
                    class="contact-form reveal"
                    id="contactForm"
                    method="post"
                    action="index.php#contact">

                    <input
                        type="hidden"
                        name="action"
                        value="save_contact_message">

                    <div
                        aria-hidden="true"
                        style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;">
                        <label>
                            WEBSITE
                            <input
                                type="text"
                                name="website"
                                tabindex="-1"
                                autocomplete="off">
                        </label>
                    </div>

                    <div class="form-row">
                        <label>
                            NAME
                            <input
                                type="text"
                                id="contactName"
                                name="name"
                                maxlength="120"
                                autocomplete="name"
                                required>
                        </label>

                        <label>
                            EMAIL
                            <input
                                type="email"
                                id="contactEmail"
                                name="email"
                                maxlength="190"
                                autocomplete="email"
                                required>
                        </label>
                    </div>

                    <label>
                        SUBJECT
                        <input
                            type="text"
                            id="contactSubject"
                            name="subject"
                            maxlength="190"
                            required>
                    </label>

                    <label>
                        MESSAGE
                        <textarea
                            id="contactMessage"
                            name="message"
                            rows="6"
                            maxlength="5000"
                            required></textarea>
                    </label>

                    <button
                        class="button primary-button"
                        id="contactSubmitButton"
                        type="submit">
                        SEND MESSAGE
                    </button>
                </form>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container footer-content">
            <span>CHER MICOLE PLETE LIRIO</span>
            <span>PORTFOLIO</span>
            <a href="#home">↑</a>
        </div>
    </footer>


    <div class="resume-pdf-modal" id="resumePdfModal" aria-hidden="true">
        <div class="resume-pdf-backdrop" data-close-resume-pdf></div>

        <section class="resume-pdf-dialog"
                 role="dialog"
                 aria-modal="true"
                 aria-labelledby="resumePdfTitle">

            <div class="resume-pdf-toolbar">
                <div>
                    <p class="small-label">RESUME PREVIEW</p>
                    <h2 id="resumePdfTitle">CHER MICOLE PLETE LIRIO</h2>
                    <span class="resume-pdf-toolbar-description">
                        Review your styled A4 resume before printing or saving it as PDF.
                    </span>
                </div>

                <div class="resume-pdf-actions">
                    <button class="button primary-button"
                            id="confirmResumePdf"
                            type="button">
                        PRINT / SAVE PDF
                    </button>

                    <button class="button outline-button"
                            data-close-resume-pdf
                            type="button">
                        CLOSE
                    </button>
                </div>
            </div>

            <div class="resume-pdf-scroll">
                <div class="resume-pdf-paper" id="resumePdfPaper"></div>
            </div>
        </section>
    </div>

    <div class="modal" id="projectModal" aria-hidden="true">
        <div class="modal-background" data-close-modal></div>

        <article class="modal-card">
            <button class="modal-close" data-close-modal type="button">×</button>

            <p class="small-label" id="modalLabel">PROJECT</p>
            <h2 id="modalTitle">PROJECT TITLE</h2>
            <p id="modalDescription"></p>

            <div class="modal-tools" id="modalTools"></div>

            <a
                class="modal-project-link"
                id="modalProjectLink"
                href="#"
                target="_blank"
                rel="noopener noreferrer">
                OPEN LIVE SYSTEM ↗
            </a>
        </article>
    </div>

    <div class="toast" id="toast">READY</div>
</body>
</html>