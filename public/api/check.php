<?php
/* Setup check: open /api/check.php in the browser to see what is working.
   It never shows passwords. Only works from the same computer (localhost) unless 'allow_check' => true in config.php. */
declare(strict_types=1);
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-store');

$local = in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'], true);
$rows = [];
$ok = function (string $what, bool $pass, string $detail = '') use (&$rows) { $rows[] = [$what, $pass, $detail]; return $pass; };

$ok('PHP version 8.0 or newer', version_compare(PHP_VERSION, '8.0.0', '>='), 'You have PHP ' . PHP_VERSION);
foreach (['pdo_mysql' => 'Connects to MySQL', 'mbstring' => 'Text handling', 'json' => 'Data format', 'session' => 'Admin login'] as $ext => $why)
  $ok("PHP extension: $ext", extension_loaded($ext), extension_loaded($ext) ? $why : "Missing. In C:\\xampp\\php\\php.ini remove the ; before extension=$ext and restart PHP");

$f = getenv('GAA_CONFIG') ?: __DIR__ . '/config.php';
$c = null;
if ($ok('config.php found', is_file($f), is_file($f) ? $f : 'Not found. Put config.php in the public\\api folder (next to config.sample.php)')) {
  $c = require $f;
  if (!$local && empty($c['allow_check'])) { http_response_code(403); echo 'Setup check is only available on this computer.'; exit; }
  $ok('config.php settings', is_array($c) && isset($c['db_host'], $c['db_name'], $c['db_user']), 'Database: ' . htmlspecialchars((string) ($c['db_name'] ?? '?')) . ' on ' . htmlspecialchars((string) ($c['db_host'] ?? '?')) . ', user ' . htmlspecialchars((string) ($c['db_user'] ?? '?')));
}

$pdo = null;
if ($c && extension_loaded('pdo_mysql')) {
  try {
    $pdo = new PDO('mysql:host=' . $c['db_host'] . ';charset=utf8mb4', (string) $c['db_user'], (string) ($c['db_pass'] ?? ''), [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $ok('MySQL is running and the login works', true);
  } catch (Throwable $e) {
    $m = $e->getMessage();
    $hint = str_contains($m, 'refused') || str_contains($m, '2002') ? 'MySQL is not running. Start it in the XAMPP Control Panel. If it runs on port 3307, set db_host to 127.0.0.1;port=3307'
      : (str_contains($m, '1045') ? 'Wrong db_user or db_pass in config.php (XAMPP default: root with an empty password)' : $m);
    $ok('MySQL is running and the login works', false, htmlspecialchars($hint));
  }
}
if ($pdo) {
  try {
    $pdo->exec('USE `' . str_replace('`', '', (string) $c['db_name']) . '`');
    $ok('Database "' . htmlspecialchars((string) $c['db_name']) . '" exists', true);
    $have = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
    $need = ['admin_users', 'posts', 'enquiries', 'subscribers', 'rate_limits'];
    $miss = array_diff($need, $have);
    if ($ok('All tables imported', !$miss, $miss ? 'Missing: ' . implode(', ', $miss) . '. Import gaa_website.sql into this database in phpMyAdmin' : implode(', ', $need))) {
      $n = (int) $pdo->query('SELECT COUNT(*) FROM admin_users')->fetchColumn();
      $emails = $pdo->query('SELECT email FROM admin_users ORDER BY id')->fetchAll(PDO::FETCH_COLUMN);
      $ok('Admin user exists', $n > 0, $n ? 'Log in with: ' . htmlspecialchars(implode(', ', $emails)) : 'No admin user. Re-import gaa_website.sql');
    }
  } catch (Throwable $e) {
    $ok('Database "' . htmlspecialchars((string) $c['db_name']) . '" exists', false, 'Not found. Create it in phpMyAdmin (or fix db_name in config.php) and import gaa_website.sql');
  }
}

$sp = session_save_path() ?: sys_get_temp_dir();
$ok('Sessions can be saved (needed to stay logged in)', is_dir($sp) && is_writable($sp), $sp);
if ($c) {
  $st = (string) ($c['storage_dir'] ?? (__DIR__ . '/storage'));
  if (!is_dir($st)) @mkdir($st, 0750, true);
  $ok('Storage folder for CVs is writable', is_dir($st) && is_writable($st), $st);
}

$all = !array_filter($rows, fn ($r) => !$r[1]);
?><!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>GAA setup check</title>
<style>body{font:15px/1.5 system-ui,sans-serif;max-width:760px;margin:40px auto;padding:0 20px;color:#141414}h1{font-size:24px}table{width:100%;border-collapse:collapse;margin-top:16px}td{padding:12px 10px;border-top:1px solid #eee;vertical-align:top}td:first-child{width:32px;font-size:18px}small{color:#666}.ok{color:#1a7f37}.no{color:#c62828}.box{padding:14px 16px;border-radius:10px;margin-top:10px}.g{background:#e9f7ee}.r{background:#fdecec}</style>
<h1>GAA website setup check</h1>
<div class="box <?= $all ? 'g' : 'r' ?>"><?= $all ? '<b>Everything is ready.</b> Open the admin panel at /admin and log in.' : '<b>Fix the first red item below</b>, then refresh this page.' ?></div>
<table><?php foreach ($rows as [$w, $p, $d]): ?><tr><td class="<?= $p ? 'ok' : 'no' ?>"><?= $p ? '✔' : '✘' ?></td><td><b><?= $w ?></b><br><small><?= $d ?></small></td></tr><?php endforeach; ?></table>
