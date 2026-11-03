<?php
/* GET  /api/admin/enquiries.php            list (?company=&type=&status=&q=&page=&limit=), or ?export=csv
   GET  /api/admin/enquiries.php?id=<id>    one submission
   POST {action:update, id, status?, notes?}   change status or notes
   POST {action:delete, id}                    delete (and its CV file) */
declare(strict_types=1);
require dirname(__DIR__) . '/lib/bootstrap.php';
$m = method('GET', 'POST');
require_admin();
$pdo = db();
const STATUSES = ['new', 'in_progress', 'closed', 'spam'];

if ($m === 'GET') {
  if (isset($_GET['id'])) {
    $q = $pdo->prepare('SELECT * FROM enquiries WHERE id = ?'); $q->execute([(int) $_GET['id']]);
    $e = $q->fetch();
    if (!$e) fail('Submission not found.', 404);
    $e['has_cv'] = !empty($e['cv_path']); unset($e['cv_path']);
    json_out(['ok' => true, 'item' => $e]);
  }
  $where = ["type <> 'subscription'"]; $args = [];
  if (!empty($_GET['company']) && isset(COMPANIES[$_GET['company']])) { $where[] = 'company = ?'; $args[] = $_GET['company']; }
  if (in_array($_GET['type'] ?? '', ['client_lead', 'recruitment'], true)) { $where[] = 'type = ?'; $args[] = $_GET['type']; }
  if (in_array($_GET['status'] ?? '', STATUSES, true)) { $where[] = 'status = ?'; $args[] = $_GET['status']; }
  if (($s = trim((string) ($_GET['q'] ?? ''))) !== '') {
    $like = '%' . addcslashes($s, '%_\\') . '%';
    $where[] = '(name LIKE ? OR email LIKE ? OR company_name LIKE ? OR message LIKE ? OR phone LIKE ?)';
    array_push($args, $like, $like, $like, $like, $like);
  }
  $w = implode(' AND ', $where);
  if (($_GET['export'] ?? '') === 'csv') {
    $q = $pdo->prepare("SELECT id, created_at, type, service_label, company, name, email, phone, company_name, message, status, notes, page_url FROM enquiries WHERE $w ORDER BY id DESC");
    $q->execute($args);
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="form-submissions-' . date('Y-m-d') . '.csv"');
    $out = fopen('php://output', 'w');
    fwrite($out, "\xEF\xBB\xBF");
    fputcsv($out, ['ID', 'Received', 'Type', 'Service', 'Company', 'Name', 'Email', 'Phone', 'Organisation', 'Message', 'Status', 'Notes', 'Page']);
    /* values starting with = + - @ are prefixed so spreadsheets do not run them as formulas */
    while ($r = $q->fetch()) fputcsv($out, array_map(fn($v) => preg_match('/^[=+\-@]/', (string) $v) ? "'" . $v : $v, array_values($r)));
    exit;
  }
  $limit = max(1, min(100, (int) ($_GET['limit'] ?? 25))); $page = max(1, (int) ($_GET['page'] ?? 1));
  $c = $pdo->prepare("SELECT COUNT(*) FROM enquiries WHERE $w"); $c->execute($args);
  $q = $pdo->prepare("SELECT id, type, service_label, company, name, email, company_name, status, created_at, (cv_path IS NOT NULL) AS has_cv FROM enquiries WHERE $w ORDER BY id DESC LIMIT $limit OFFSET " . (($page - 1) * $limit));
  $q->execute($args);
  json_out(['ok' => true, 'total' => (int) $c->fetchColumn(), 'items' => $q->fetchAll()]);
}

$b = body();
$id = (int) ($b['id'] ?? 0);
if (($b['action'] ?? '') === 'delete') {
  $q = $pdo->prepare('SELECT cv_path FROM enquiries WHERE id = ?'); $q->execute([$id]);
  $cv = $q->fetchColumn();
  if ($cv && is_file($cv)) @unlink($cv);
  $pdo->prepare('DELETE FROM enquiries WHERE id = ?')->execute([$id]);
  json_out(['ok' => true]);
}
if (($b['action'] ?? '') !== 'update') fail('Unknown action.');
if (isset($b['status'])) {
  if (!in_array($b['status'], STATUSES, true)) fail('Unknown status.');
  $pdo->prepare('UPDATE enquiries SET status = ?, updated_at = NOW() WHERE id = ?')->execute([$b['status'], $id]);
}
if (isset($b['notes'])) $pdo->prepare('UPDATE enquiries SET notes = ?, updated_at = NOW() WHERE id = ?')->execute([clean($b['notes'], 5000), $id]);
json_out(['ok' => true]);
