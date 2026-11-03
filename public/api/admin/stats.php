<?php
/* GET /api/admin/stats.php  numbers and latest items for the dashboard */
declare(strict_types=1);
require dirname(__DIR__) . '/lib/bootstrap.php';
method('GET');
require_admin();
$pdo = db();
$n = fn(string $sql) => (int) $pdo->query($sql)->fetchColumn();
json_out([
  'ok' => true,
  'enquiries_new' => $n("SELECT COUNT(*) FROM enquiries WHERE status = 'new'"),
  'enquiries_month' => $n("SELECT COUNT(*) FROM enquiries WHERE created_at >= DATE_FORMAT(NOW(), '%Y-%m-01')"),
  'posts_published' => $n("SELECT COUNT(*) FROM posts WHERE status = 'published'"),
  'posts_draft' => $n("SELECT COUNT(*) FROM posts WHERE status = 'draft'"),
  'subscribers' => $n('SELECT COUNT(*) FROM subscribers'),
  'latest_enquiries' => $pdo->query("SELECT id, name, service_label, company, status, created_at FROM enquiries WHERE status <> 'spam' ORDER BY id DESC LIMIT 6")->fetchAll(),
  'latest_posts' => $pdo->query('SELECT id, title, company, status, updated_at FROM posts ORDER BY updated_at DESC LIMIT 6')->fetchAll(),
]);
