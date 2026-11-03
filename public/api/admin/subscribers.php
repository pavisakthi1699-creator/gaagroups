<?php
/* GET  /api/admin/subscribers.php   list (?q=&page=&limit=) or ?export=csv
   POST {action:delete, id}           remove a subscriber */
declare(strict_types=1);
require dirname(__DIR__) . '/lib/bootstrap.php';
$m = method('GET', 'POST');
require_admin();
$pdo = db();
if ($m === 'POST') {
  $b = body();
  if (($b['action'] ?? '') !== 'delete') fail('Unknown action.');
  $pdo->prepare('DELETE FROM subscribers WHERE id = ?')->execute([(int) ($b['id'] ?? 0)]);
  json_out(['ok' => true]);
}
$where = '1=1'; $args = [];
if (($s = trim((string) ($_GET['q'] ?? ''))) !== '') { $where = 'email LIKE ?'; $args[] = '%' . addcslashes($s, '%_\\') . '%'; }
if (($_GET['export'] ?? '') === 'csv') {
  $q = $pdo->prepare("SELECT email, created_at, source FROM subscribers WHERE $where ORDER BY id DESC"); $q->execute($args);
  header('Content-Type: text/csv; charset=utf-8');
  header('Content-Disposition: attachment; filename="subscribers-' . date('Y-m-d') . '.csv"');
  $out = fopen('php://output', 'w'); fwrite($out, "\xEF\xBB\xBF"); fputcsv($out, ['Email', 'Signed up', 'Page']);
  while ($r = $q->fetch()) fputcsv($out, array_values($r));
  exit;
}
$limit = max(1, min(200, (int) ($_GET['limit'] ?? 50))); $page = max(1, (int) ($_GET['page'] ?? 1));
$c = $pdo->prepare("SELECT COUNT(*) FROM subscribers WHERE $where"); $c->execute($args);
$q = $pdo->prepare("SELECT id, email, source, created_at FROM subscribers WHERE $where ORDER BY id DESC LIMIT $limit OFFSET " . (($page - 1) * $limit));
$q->execute($args);
json_out(['ok' => true, 'total' => (int) $c->fetchColumn(), 'items' => $q->fetchAll()]);
