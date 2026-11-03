<?php
/* GET /api/posts.php                       published articles: ?company=&q=&page=&limit=&exclude=
   GET /api/posts.php?slug=<slug>           one published article with up to 3 related articles */
declare(strict_types=1);
require __DIR__ . '/lib/bootstrap.php';
method('GET');
header('Cache-Control: public, max-age=60');

$pdo = db();
$live = "status = 'published' AND published_at <= NOW()";

if (isset($_GET['slug'])) {
  $q = $pdo->prepare("SELECT * FROM posts WHERE slug = ? AND $live");
  $q->execute([slugify((string) $_GET['slug'])]);
  $p = $q->fetch();
  if (!$p) fail('Article not found.', 404);
  echo_post($pdo, $p, $live);
}

$company = (string) ($_GET['company'] ?? '');
$where = [$live]; $args = [];
if ($company !== '' && isset(COMPANIES[$company])) { $where[] = 'company = ?'; $args[] = $company; }
$s = trim((string) ($_GET['q'] ?? ''));
if ($s !== '') { $where[] = '(title LIKE ? OR excerpt LIKE ? OR category LIKE ?)'; $like = '%' . addcslashes(mb_substr($s, 0, 80), '%_\\') . '%'; array_push($args, $like, $like, $like); }
if (!empty($_GET['exclude'])) { $where[] = 'slug <> ?'; $args[] = slugify((string) $_GET['exclude']); }
$limit = max(1, min(30, (int) ($_GET['limit'] ?? 12)));
$page = max(1, (int) ($_GET['page'] ?? 1));
$w = implode(' AND ', $where);
$c = $pdo->prepare("SELECT COUNT(*) FROM posts WHERE $w"); $c->execute($args);
$q = $pdo->prepare("SELECT id, slug, title, excerpt, cover_image, company, category, author_name, published_at, read_minutes FROM posts WHERE $w ORDER BY published_at DESC, id DESC LIMIT $limit OFFSET " . (($page - 1) * $limit));
$q->execute($args);
json_out(['ok' => true, 'total' => (int) $c->fetchColumn(), 'page' => $page, 'posts' => array_map('public_post', $q->fetchAll())]);

function echo_post(PDO $pdo, array $p, string $live): void {
  json_out(['ok' => true, 'post' => public_post($p, true), 'related' => related($pdo, $p, $live)]);
}

function related(PDO $pdo, array $p, string $live): array {
  $q = $pdo->prepare("SELECT id, slug, title, excerpt, cover_image, company, category, author_name, published_at, read_minutes FROM posts
    WHERE $live AND id <> ? ORDER BY (company = ?) DESC, published_at DESC LIMIT 3");
  $q->execute([$p['id'], $p['company']]);
  return array_map('public_post', $q->fetchAll());
}
