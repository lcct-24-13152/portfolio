<?php
declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| Database configuration
|--------------------------------------------------------------------------
| These defaults match a normal Laragon MySQL installation.
| If your MySQL password/settings are different, copy config.example.php
| to config.php and edit config.php. config.php is ignored by Git.
*/

$databaseConfig = [
    'host'    => '127.0.0.1',
    'name'    => 'db_cher_portfolio',
    'user'    => 'root',
    'pass'    => '',
    'charset' => 'utf8mb4',
];

$localConfigFile = __DIR__ . '/config.php';

if (is_file($localConfigFile)) {
    $localConfig = require $localConfigFile;

    if (is_array($localConfig)) {
        $databaseConfig = array_merge($databaseConfig, $localConfig);
    }
}

define('DB_HOST', (string) $databaseConfig['host']);
define('DB_NAME', (string) $databaseConfig['name']);
define('DB_USER', (string) $databaseConfig['user']);
define('DB_PASS', (string) $databaseConfig['pass']);
define('DB_CHARSET', (string) $databaseConfig['charset']);

function createPdo(string $dsn): PDO
{
    return new PDO(
        $dsn,
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]
    );
}

function getServerConnection(): PDO
{
    $dsn = 'mysql:host=' . DB_HOST . ';charset=' . DB_CHARSET;
    return createPdo($dsn);
}

function getDatabaseConnection(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = 'mysql:host=' . DB_HOST
         . ';dbname=' . DB_NAME
         . ';charset=' . DB_CHARSET;

    $pdo = createPdo($dsn);

    return $pdo;
}
