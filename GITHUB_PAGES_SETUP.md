# GitHub Pages setup for lcct-24-13152/portfolio

Target URL:
https://lcct-24-13152.github.io/portfolio/

Files in this package:
- index.html            GitHub Pages homepage
- style.css             Existing portfolio design
- script.js             Dual-mode JS: GitHub Pages + Laragon
- profile-photo-2x2.jpg Your profile image
- .nojekyll             Tells GitHub Pages to serve the files directly

IMPORTANT
---------
Do NOT delete these files from your existing repository:
- index.php
- db.php
- setup.php
- database.sql
- admin_messages.php
- config.example.php

Those files are for the Laragon/MySQL version.

COPY STEPS
----------
1. Copy index.html into:
   C:\laragon\www\my_portfolio\

2. Replace the current script.js with the script.js from this package.
   This updated script still saves to MySQL when opened through Laragon.
   On GitHub Pages, the Contact form opens an email message because GitHub Pages cannot run PHP.

3. style.css can stay as-is. The copy in this package is included for completeness.

4. Make sure profile-photo-2x2.jpg is in the project root.

5. Open VS Code terminal in:
   C:\laragon\www\my_portfolio

6. Run one command at a time:
   git status
   git add .
   git commit -m "Add GitHub Pages version"
   git remote set-url origin https://github.com/lcct-24-13152/portfolio.git
   git push

7. On GitHub:
   Repository > Settings > Pages
   Source: Deploy from a branch
   Branch: main
   Folder: / (root)
   Click Save.

8. Wait 1-3 minutes, then open:
   https://lcct-24-13152.github.io/portfolio/

LOCAL LARAGON VERSION
---------------------
http://localhost/my_portfolio/

Database setup:
http://localhost/my_portfolio/setup.php

Admin:
http://localhost/my_portfolio/admin_messages.php
