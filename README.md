# Cher Micole Portfolio — Git + Laragon + MySQL

This folder is ready to commit to a Git/GitHub repository and is also ready to run locally in Laragon with PHP + MySQL.

## Project files

- `index.php` — portfolio and contact form handler
- `style.css` — all website styles, including resume/PDF styles
- `script.js` — all JavaScript, including contact form, modal, and Snake game
- `db.php` — PDO connection used by the portfolio/admin/setup
- `config.example.php` — optional local database configuration template
- `setup.php` — creates the database, tables, and default admin account
- `database.sql` — optional manual phpMyAdmin import
- `admin_messages.php` — admin login and contact-message management
- `profile-photo-2x2.jpg` — portfolio/resume photo
- `.gitignore` — keeps local secrets and editor files out of Git

## Run in Laragon

1. Extract/copy this folder to:
   `C:\laragon\www\my_portfolio`
2. Open Laragon and click **Start All**.
3. Open:
   `http://localhost/my_portfolio/setup.php`
4. Click **INSTALL DATABASE**.
5. Open the portfolio:
   `http://localhost/my_portfolio/`
6. Open the admin messages page:
   `http://localhost/my_portfolio/admin_messages.php`

Default admin after setup:
- Username: `admin`
- Password: `admin123`

Change the admin password after the first login.

## Laragon MySQL defaults

The project uses these defaults automatically:
- Host: `127.0.0.1`
- Database: `db_cher_portfolio`
- Username: `root`
- Password: blank

If your Laragon MySQL password is different, copy `config.example.php` to `config.php`, edit the values, and keep `config.php` local. It is already excluded by `.gitignore`.

## Database behavior

The Contact form inserts Name, Email, Subject, Message, Read/Unread status, and submission time into the `contact_messages` table. The admin page reads the same table and can mark messages read/unread or delete them. Admin authentication uses the `admin_users` table with PHP password hashing.

## Optional phpMyAdmin import

Instead of using `setup.php`, you may import `database.sql` in phpMyAdmin. The SQL creates the same `db_cher_portfolio` database and tables.

## Push to GitHub

Open the project folder in VS Code, then use Terminal:

```bash
git init
git add .
git commit -m "Portfolio with Laragon database"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

If the repository already has a remote, do not add `origin` again. Check it with:

```bash
git remote -v
```

## Important: GitHub vs Laragon

GitHub can store this PHP/MySQL source code, but **GitHub Pages cannot execute PHP or connect to the MySQL database running on your Laragon computer**. For the complete database version, run it through Laragon locally or deploy it to a web host that supports PHP + MySQL.
