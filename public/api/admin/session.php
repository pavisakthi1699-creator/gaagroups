<?php
/* GET  /api/admin/session.php                 who is signed in (and the CSRF token)
   POST /api/admin/session.php {action:login}  sign in with email and password
   POST /api/admin/session.php {action:logout} sign out */
declare(strict_types=1);
require dirname(__DIR__) . '/lib/bootstrap.php';
$m = method('GET', 'POST');
start_session();

if ($m === 'GET') {
  if (empty($_SESSION['uid'])) json_out(['ok' => true, 'user' => null]);
  $q = db()->prepare('SELECT id, name, email, role FROM admin_users WHERE id = ?');
  $q->execute([$_SESSION['uid']]);
  $u = $q->fetch();
  json_out(['ok' => true, 'user' => $u ?: null, 'csrf' => $u ? csrf_token() : null]);
}

$b = body();
$action = $b['action'] ?? '';
if ($action === 'logout') {
  $_SESSION = [];
  if (ini_get('session.use_cookies')) { $p = session_get_cookie_params(); setcookie(session_name(), '', time() - 3600, $p['path'], $p['domain'] ?? '', $p['secure'], $p['httponly']); }
  session_destroy();
  json_out(['ok' => true]);
}
if ($action !== 'login') fail('Unknown action.');

rate_limit('login', 8, 900);
$email = strtolower(clean($b['email'] ?? '', 160));
$pass = (string) ($b['password'] ?? '');
$q = db()->prepare('SELECT * FROM admin_users WHERE email = ?');
$q->execute([$email]);
$u = $q->fetch();
if (!$u || !password_verify($pass, $u['password_hash'])) { usleep(400000); fail('The email or password is not correct.', 401); }
if (password_needs_rehash($u['password_hash'], PASSWORD_DEFAULT)) db()->prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?')->execute([password_hash($pass, PASSWORD_DEFAULT), $u['id']]);
session_regenerate_id(true);
$_SESSION['uid'] = (int) $u['id'];
$_SESSION['csrf'] = bin2hex(random_bytes(24));
db()->prepare('UPDATE admin_users SET last_login = NOW() WHERE id = ?')->execute([$u['id']]);
json_out(['ok' => true, 'user' => ['id' => (int) $u['id'], 'name' => $u['name'], 'email' => $u['email'], 'role' => $u['role']], 'csrf' => $_SESSION['csrf']]);
