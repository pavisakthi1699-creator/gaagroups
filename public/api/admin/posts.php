<?php
/* GET  /api/admin/posts.php                 list posts (?company=&status=&q=&page=&limit=)
   GET  /api/admin/posts.php?id=<id>         one post
   POST /api/admin/posts.php {action:save, post}   create or update
   POST /api/admin/posts.php {action:delete, id}   delete */
declare(strict_types=1);
require dirname(__DIR__) . '/lib/bootstrap.php';
$m = method('GET', 'POST');
$me = require_admin();
$pdo = db();

if ($m === 'GET') {
  if (isset($_GET['id'])) {
    $q = $pdo->prepare('SELECT * FROM posts WHERE id = ?'); $q->execute([(int) $_GET['id']]);
    $p = $q->fetch();
    if (!$p) fail('Post not found.', 404);
    json_out(['ok' => true, 'post' => $p]);
  }
  $where = ['1=1']; $args = [];
  if (!empty($_GET['company']) && isset(COMPANIES[$_GET['company']])) { $where[] = 'company = ?'; $args[] = $_GET['company']; }
  if (in_array($_GET['status'] ?? '', ['draft', 'published'], true)) { $where[] = 'status = ?'; $args[] = $_GET['status']; }
  if (($s = trim((string) ($_GET['q'] ?? ''))) !== '') { $where[] = 'title LIKE ?'; $args[] = '%' . addcslashes($s, '%_\\') . '%'; }
  $limit = max(1, min(100, (int) ($_GET['limit'] ?? 20))); $page = max(1, (int) ($_GET['page'] ?? 1));
  $w = implode(' AND ', $where);
  $c = $pdo->prepare("SELECT COUNT(*) FROM posts WHERE $w"); $c->execute($args);
  $q = $pdo->prepare("SELECT id, slug, title, company, category, status, published_at, updated_at FROM posts WHERE $w ORDER BY updated_at DESC LIMIT $limit OFFSET " . (($page - 1) * $limit));
  $q->execute($args);
  json_out(['ok' => true, 'total' => (int) $c->fetchColumn(), 'posts' => $q->fetchAll()]);
}

$b = body();
if (($b['action'] ?? '') === 'delete') {
  $pdo->prepare('DELETE FROM posts WHERE id = ?')->execute([(int) ($b['id'] ?? 0)]);
  json_out(['ok' => true]);
}
if (($b['action'] ?? '') !== 'save') fail('Unknown action.');

$p = is_array($b['post'] ?? null) ? $b['post'] : [];
$id = (int) ($p['id'] ?? 0);
$title = clean($p['title'] ?? '', 200);
$slug = slugify((string) ($p['slug'] ?? '') ?: $title);
if ($title === '') fail('Please add a title.');
if ($slug === '' || $slug === '_post') fail('Please add a valid web address.');
$company = isset(COMPANIES[$p['company'] ?? '']) ? $p['company'] : 'gaa-group';
$status = ($p['status'] ?? '') === 'published' ? 'published' : 'draft';
$content = sanitize_html((string) ($p['content_html'] ?? ''));
if ($status === 'published' && strlen(strip_tags($content)) < 50) fail('The article is too short to publish.');
$cover = clean($p['cover_image'] ?? '', 255);
if ($cover !== '' && !preg_match('#^(/uploads/|https://)#', $cover)) $cover = '';
$pub = trim((string) ($p['published_at'] ?? ''));
$pubAt = $pub !== '' && strtotime($pub) ? date('Y-m-d H:i:s', strtotime($pub)) : null;

$dupe = $pdo->prepare('SELECT id FROM posts WHERE slug = ? AND id <> ?'); $dupe->execute([$slug, $id]);
if ($dupe->fetch()) fail('Another post already uses this web address. Please change it.');

$fields = [
  'slug' => $slug, 'title' => $title, 'excerpt' => clean($p['excerpt'] ?? '', 300), 'content_html' => $content, 'cover_image' => $cover,
  'company' => $company, 'category' => clean($p['category'] ?? '', 60), 'author_name' => clean($p['author_name'] ?? '', 100),
  'status' => $status, 'seo_title' => clean($p['seo_title'] ?? '', 70), 'seo_description' => clean($p['seo_description'] ?? '', 170),
  'read_minutes' => read_minutes($content),
];
if ($id) {
  $cur = $pdo->prepare('SELECT published_at FROM posts WHERE id = ?'); $cur->execute([$id]);
  $old = $cur->fetch();
  if (!$old) fail('Post not found.', 404);
  $fields['published_at'] = $pubAt ?? ($status === 'published' ? ($old['published_at'] ?: date('Y-m-d H:i:s')) : $old['published_at']);
  $set = implode(', ', array_map(fn($k) => "$k = ?", array_keys($fields)));
  $pdo->prepare("UPDATE posts SET $set, updated_at = NOW() WHERE id = ?")->execute([...array_values($fields), $id]);
} else {
  $fields['published_at'] = $pubAt ?? ($status === 'published' ? date('Y-m-d H:i:s') : null);
  $fields['created_by'] = (int) $me['id'];
  $cols = implode(', ', array_keys($fields));
  $pdo->prepare("INSERT INTO posts ($cols, created_at, updated_at) VALUES (" . implode(', ', array_fill(0, count($fields), '?')) . ', NOW(), NOW())')->execute(array_values($fields));
  $id = (int) $pdo->lastInsertId();
}
$q = $pdo->prepare('SELECT * FROM posts WHERE id = ?'); $q->execute([$id]);
json_out(['ok' => true, 'post' => $q->fetch()]);
