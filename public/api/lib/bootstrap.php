<?php
/* Shared setup for every API endpoint: configuration, database, JSON responses, sessions, security helpers. */
declare(strict_types=1);
error_reporting(E_ALL);
ini_set('display_errors', '0');
date_default_timezone_set('Asia/Kolkata');

const COMPANIES = ['gaa-group' => 'GAA Group', 'gaa-consulting' => 'GAA Consulting', 'filings-first' => 'Filings First', 'hirings-first' => 'Hirings First'];

function cfg(?string $key = null, $default = null) {
  static $c = null;
  if ($c === null) {
    $f = getenv('GAA_CONFIG') ?: dirname(__DIR__) . '/config.php';
    if (!is_file($f)) {
      json_out(['ok' => false, 'error' => 'The website is not set up yet. Open /api/install/ to finish the setup.'], 503);
    }
    $c = require $f;
  }
  return $key === null ? $c : ($c[$key] ?? $default);
}

function db(): PDO {
  static $pdo = null;
  if ($pdo) return $pdo;
  try {
    $pdo = new PDO('mysql:host=' . cfg('db_host') . ';dbname=' . cfg('db_name') . ';charset=utf8mb4', cfg('db_user'), cfg('db_pass'), [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    $pdo->exec("SET time_zone = '+05:30'");
  } catch (Throwable $e) {
    error_log('DB connection failed: ' . $e->getMessage());
    json_out(['ok' => false, 'error' => 'The database is not available right now.'], 503);
  }
  return $pdo;
}

function json_out(array $data, int $code = 200): void {
  http_response_code($code);
  header('Content-Type: application/json; charset=utf-8');
  header('Cache-Control: no-store');
  header('X-Content-Type-Options: nosniff');
  echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  exit;
}

function fail(string $msg, int $code = 400): void { json_out(['ok' => false, 'error' => $msg], $code); }

function body(): array {
  static $b = null;
  if ($b !== null) return $b;
  $raw = file_get_contents('php://input') ?: '';
  if (strlen($raw) > 8 * 1024 * 1024) fail('Request too large.', 413);
  $b = json_decode($raw, true);
  if (!is_array($b)) $b = $_POST ?: [];
  return $b;
}

function method(string ...$allowed): string {
  $m = $_SERVER['REQUEST_METHOD'] ?? 'GET';
  if (!in_array($m, $allowed, true)) { header('Allow: ' . implode(', ', $allowed)); fail('Method not allowed.', 405); }
  return $m;
}

function client_ip(): string { return substr($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0', 0, 45); }

function clean(?string $s, int $max): string {
  $s = (string) $s;
  $s = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $s) ?? '';
  return trim(mb_substr($s, 0, $max));
}

/* simple per-IP limit, stored in the database */
function rate_limit(string $action, int $max, int $seconds): void {
  $pdo = db();
  $pdo->prepare('DELETE FROM rate_limits WHERE created_at < (NOW() - INTERVAL 1 DAY)')->execute();
  $q = $pdo->prepare('SELECT COUNT(*) FROM rate_limits WHERE action = ? AND ip = ? AND created_at > (NOW() - INTERVAL ? SECOND)');
  $q->execute([$action, client_ip(), $seconds]);
  if ((int) $q->fetchColumn() >= $max) fail('Too many attempts. Please wait a few minutes and try again.', 429);
  $pdo->prepare('INSERT INTO rate_limits (action, ip, created_at) VALUES (?, ?, NOW())')->execute([$action, client_ip()]);
}

/* ---------- admin sessions ---------- */
function start_session(): void {
  if (session_status() === PHP_SESSION_ACTIVE) return;
  $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
  session_name('gaa_admin');
  session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => $secure, 'httponly' => true, 'samesite' => 'Strict']);
  session_start();
  if (!empty($_SESSION['uid']) && (time() - ($_SESSION['seen'] ?? 0)) > 8 * 3600) { $_SESSION = []; session_destroy(); session_start(); }
  $_SESSION['seen'] = time();
}

function csrf_token(): string {
  start_session();
  if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(24));
  return $_SESSION['csrf'];
}

/* every admin endpoint calls this; POST requests also need the CSRF header */
function require_admin(bool $adminRole = false): array {
  start_session();
  if (empty($_SESSION['uid'])) fail('Please sign in again.', 401);
  $q = db()->prepare('SELECT id, name, email, role FROM admin_users WHERE id = ?');
  $q->execute([$_SESSION['uid']]);
  $u = $q->fetch();
  if (!$u) { $_SESSION = []; fail('Please sign in again.', 401); }
  if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    $t = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!$t || !hash_equals($_SESSION['csrf'] ?? '', $t)) fail('Your session has expired. Please reload the page.', 403);
  }
  if ($adminRole && $u['role'] !== 'admin') fail('Only administrators can do this.', 403);
  return $u;
}

/* ---------- content helpers ---------- */
function slugify(string $s): string {
  $s = strtolower(trim($s));
  $s = preg_replace('/[^a-z0-9]+/', '-', $s) ?? '';
  return trim(substr($s, 0, 90), '-');
}

function read_minutes(string $html): int {
  $w = str_word_count(strip_tags($html));
  return max(1, (int) round($w / 200));
}

/* Keeps only safe tags and attributes in blog content */
function sanitize_html(string $html): string {
  $allowed = ['p' => [], 'br' => [], 'h2' => [], 'h3' => [], 'h4' => [], 'strong' => [], 'b' => [], 'em' => [], 'i' => [], 'u' => [],
    'ul' => [], 'ol' => [], 'li' => [], 'blockquote' => [], 'a' => ['href', 'title'], 'img' => ['src', 'alt', 'width', 'height'],
    'table' => [], 'thead' => [], 'tbody' => [], 'tr' => [], 'th' => [], 'td' => [], 'hr' => [], 'figure' => [], 'figcaption' => [],
    'code' => [], 'pre' => [], 'sup' => [], 'sub' => []];
  $doc = new DOMDocument();
  libxml_use_internal_errors(true);
  $doc->loadHTML('<?xml encoding="utf-8"?><div id="root">' . $html . '</div>', LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
  libxml_clear_errors();
  $root = $doc->getElementById('root');
  if (!$root) return '';
  $walk = function (DOMNode $node) use (&$walk, $allowed, $doc) {
    for ($i = $node->childNodes->length - 1; $i >= 0; $i--) {
      $c = $node->childNodes->item($i);
      if ($c instanceof DOMElement) {
        $tag = strtolower($c->tagName);
        if (in_array($tag, ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'svg', 'math', 'link', 'meta'], true)) { $node->removeChild($c); continue; }
        $walk($c);
        if ($tag === 'div' || $tag === 'span' || $tag === 'font' || !isset($allowed[$tag])) {
          /* keep the text, drop the tag (a div becomes a paragraph) */
          if ($tag === 'div') { $p = $doc->createElement('p'); while ($c->firstChild) $p->appendChild($c->firstChild); $node->replaceChild($p, $c); }
          else { while ($c->firstChild) $node->insertBefore($c->firstChild, $c); $node->removeChild($c); }
          continue;
        }
        foreach (iterator_to_array($c->attributes) as $a) {
          if (!in_array(strtolower($a->name), $allowed[$tag], true)) $c->removeAttribute($a->name);
        }
        if ($tag === 'a') {
          $h = trim($c->getAttribute('href'));
          if (!preg_match('#^(https?://|mailto:|/|\#)#i', $h)) $c->removeAttribute('href');
          if (preg_match('#^https?://#i', $h)) { $c->setAttribute('target', '_blank'); $c->setAttribute('rel', 'noopener noreferrer'); }
        }
        if ($tag === 'img') {
          $s = trim($c->getAttribute('src'));
          if (!preg_match('#^(https://|/uploads/)#i', $s)) { $node->removeChild($c); continue; }
          $c->setAttribute('loading', 'lazy');
        }
      } elseif ($c instanceof DOMComment) {
        $node->removeChild($c);
      }
    }
  };
  $walk($root);
  $out = '';
  foreach ($root->childNodes as $n) $out .= $doc->saveHTML($n);
  $out = preg_replace('#<p>(\s|&nbsp;|<br>)*</p>#i', '', $out) ?? $out;
  return trim($out);
}

function esc(string $s): string { return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }

function public_post(array $p, bool $full = false): array {
  $o = ['id' => (int) $p['id'], 'slug' => $p['slug'], 'title' => $p['title'], 'excerpt' => $p['excerpt'], 'cover_image' => $p['cover_image'],
    'company' => $p['company'], 'category' => $p['category'], 'author_name' => $p['author_name'], 'published_at' => $p['published_at'],
    'read_minutes' => (int) $p['read_minutes']];
  if ($full) { $o['content_html'] = $p['content_html']; $o['seo_title'] = $p['seo_title']; $o['seo_description'] = $p['seo_description']; $o['updated_at'] = $p['updated_at']; }
  return $o;
}
