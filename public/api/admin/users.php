<?php
/* GET  /api/admin/users.php                       admin users
   POST {action:save, name, email, password, role}  add a user (administrators only)
   POST {action:delete, id}                         remove a user (administrators only)
   POST {action:password, current, next}            change your own password */
declare(strict_types=1);
require dirname(__DIR__) . '/lib/bootstrap.php';
$m = method('GET', 'POST');
$me = require_admin();
$pdo = db();
if ($m === 'GET') {
  json_out(['ok' => true, 'me' => (int) $me['id'], 'role' => $me['role'],
    'users' => array_map(fn($u) => [...$u, 'id' => (int) $u['id']], $pdo->query('SELECT id, name, email, role, last_login, created_at FROM admin_users ORDER BY id')->fetchAll())]);
}
$b = body();
switch ($b['action'] ?? '') {
  case 'password':
    $q = $pdo->prepare('SELECT password_hash FROM admin_users WHERE id = ?'); $q->execute([$me['id']]);
    if (!password_verify((string) ($b['current'] ?? ''), (string) $q->fetchColumn())) fail('Your current password is not correct.');
    $next = (string) ($b['next'] ?? '');
    if (strlen($next) < 10) fail('Please choose a password of at least 10 characters.');
    $pdo->prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?')->execute([password_hash($next, PASSWORD_DEFAULT), $me['id']]);
    json_out(['ok' => true]);
  case 'save':
    if ($me['role'] !== 'admin') fail('Only administrators can add users.', 403);
    $email = strtolower(clean($b['email'] ?? '', 160));
    $name = clean($b['name'] ?? '', 100);
    $pass = (string) ($b['password'] ?? '');
    if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) fail('Please enter a name and a valid email.');
    if (strlen($pass) < 10) fail('Please choose a password of at least 10 characters.');
    $role = ($b['role'] ?? '') === 'admin' ? 'admin' : 'editor';
    $q = $pdo->prepare('SELECT id FROM admin_users WHERE email = ?'); $q->execute([$email]);
    if ($q->fetch()) fail('A user with this email already exists.');
    $pdo->prepare('INSERT INTO admin_users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, NOW())')->execute([$name, $email, password_hash($pass, PASSWORD_DEFAULT), $role]);
    json_out(['ok' => true]);
  case 'delete':
    if ($me['role'] !== 'admin') fail('Only administrators can remove users.', 403);
    $id = (int) ($b['id'] ?? 0);
    if ($id === (int) $me['id']) fail('You cannot remove yourself.');
    $pdo->prepare('DELETE FROM admin_users WHERE id = ?')->execute([$id]);
    json_out(['ok' => true]);
}
fail('Unknown action.');
