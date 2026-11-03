<?php
/* One-time setup: open https://your-domain/api/install/ in a browser.
   It checks the server, creates the database tables, the first admin user and the six starter articles,
   and writes api/config.php. After it finishes it locks itself (install.lock). */
declare(strict_types=1);
$apiDir = dirname(__DIR__);
$lock = __DIR__ . '/install.lock';
$cfgFile = $apiDir . '/config.php';
header('Content-Type: text/html; charset=utf-8');
header('X-Robots-Tag: noindex');
function h($s) { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); }

function install(array $in, string $apiDir, string $cfgFile, string $lock): array {
  $pdo = new PDO('mysql:host=' . $in['db_host'] . ';dbname=' . $in['db_name'] . ';charset=utf8mb4', $in['db_user'], $in['db_pass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
  foreach (array_filter(array_map('trim', explode(';', file_get_contents(__DIR__ . '/schema.sql')))) as $sql) {
    if (preg_match('/^\s*(--.*\n)*\s*$/', $sql)) continue;
    $pdo->exec($sql);
  }
  $email = strtolower(trim($in['admin_email']));
  $q = $pdo->prepare('SELECT id FROM admin_users WHERE email = ?'); $q->execute([$email]);
  if (!$q->fetch()) {
    $pdo->prepare('INSERT INTO admin_users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, \'admin\', NOW())')
      ->execute([trim($in['admin_name']), $email, password_hash($in['admin_pass'], PASSWORD_DEFAULT)]);
  }
  $added = 0;
  if ((int) $pdo->query('SELECT COUNT(*) FROM posts')->fetchColumn() === 0) {
    $ins = $pdo->prepare('INSERT INTO posts (slug, title, excerpt, content_html, cover_image, company, category, author_name, status, published_at, seo_title, seo_description, read_minutes, created_at, updated_at)
      VALUES (?, ?, ?, ?, \'\', ?, ?, ?, \'published\', ?, ?, ?, ?, NOW(), NOW())');
    foreach (require __DIR__ . '/seed-posts.php' as $p) {
      $ins->execute([$p['slug'], $p['title'], $p['excerpt'], trim($p['content_html']), $p['company'], $p['category'], $p['author_name'], $p['published_at'],
        $p['seo_title'], $p['seo_description'], max(1, (int) round(str_word_count(strip_tags($p['content_html'])) / 200))]);
      $added++;
    }
  }
  $inbox = trim($in['inbox']);
  $cfg = [
    'db_host' => $in['db_host'], 'db_name' => $in['db_name'], 'db_user' => $in['db_user'], 'db_pass' => $in['db_pass'],
    'site_url' => rtrim(trim($in['site_url']), '/'),
    'inbox' => ['gaa-group' => $inbox, 'gaa-consulting' => $inbox, 'filings-first' => $inbox, 'hirings-first' => $inbox, 'careers' => $inbox],
    'mail_from' => trim($in['mail_from']), 'mail_from_name' => 'GAA Group Website', 'send_acknowledgement' => true,
    'smtp_host' => trim($in['smtp_host'] ?? ''), 'smtp_port' => (int) ($in['smtp_port'] ?? 587) ?: 587, 'smtp_secure' => $in['smtp_secure'] ?? 'tls',
    'smtp_user' => trim($in['smtp_user'] ?? ''), 'smtp_pass' => $in['smtp_pass'] ?? '',
    'storage_dir' => trim($in['storage_dir']) ?: $apiDir . '/storage',
    'uploads_dir' => dirname($apiDir) . '/uploads', 'uploads_url' => '/uploads',
  ];
  foreach ([$cfg['storage_dir'] . '/cv', $cfg['uploads_dir'] . '/blog'] as $d) if (!is_dir($d)) @mkdir($d, 0755, true);
  if (file_put_contents($cfgFile, "<?php\n/* Written by the installer. Keep this file private. */\nreturn " . var_export($cfg, true) . ";\n") === false) throw new RuntimeException('Could not write api/config.php. Make the api folder writable, or create config.php from config.sample.php by hand.');
  @chmod($cfgFile, 0640);
  file_put_contents($lock, date('c'));
  return ['posts' => $added];
}

/* command line: php api/install/index.php db_host db_name db_user db_pass site_url admin_name admin_email admin_pass inbox mail_from */
if (PHP_SAPI === 'cli') {
  $k = ['db_host', 'db_name', 'db_user', 'db_pass', 'site_url', 'admin_name', 'admin_email', 'admin_pass', 'inbox', 'mail_from'];
  if (count($argv) < 11) { fwrite(STDERR, "usage: php index.php " . implode(' ', $k) . "\n"); exit(1); }
  $in = array_combine($k, array_slice($argv, 1, 10)) + ['storage_dir' => ''];
  $r = install($in, $apiDir, $cfgFile, $lock);
  echo "Installed. Starter articles added: {$r['posts']}\n";
  exit(0);
}

$checks = [
  ['PHP 8.0 or newer', version_compare(PHP_VERSION, '8.0.0', '>='), PHP_VERSION],
  ['PDO MySQL extension', extension_loaded('pdo_mysql'), ''],
  ['GD extension (blog images)', extension_loaded('gd'), ''],
  ['mbstring extension', extension_loaded('mbstring'), ''],
  ['api folder writable (for config.php)', is_writable($apiDir), ''],
  ['uploads folder can be created', is_writable(dirname($apiDir)) || is_dir(dirname($apiDir) . '/uploads'), ''],
];
$done = is_file($lock);
$err = ''; $ok = null;
if (!$done && ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
  $in = array_map(fn($v) => is_string($v) ? $v : '', $_POST);
  if (strlen($in['admin_pass'] ?? '') < 10) $err = 'Please choose an admin password of at least 10 characters.';
  elseif (!filter_var($in['admin_email'] ?? '', FILTER_VALIDATE_EMAIL)) $err = 'Please enter a valid admin email.';
  elseif (!filter_var($in['inbox'] ?? '', FILTER_VALIDATE_EMAIL)) $err = 'Please enter a valid email for form submissions.';
  else {
    try { $ok = install($in, $apiDir, $cfgFile, $lock); $done = true; }
    catch (Throwable $e) { $err = 'Setup failed: ' . $e->getMessage(); }
  }
}
$v = fn($k, $d = '') => h($_POST[$k] ?? $d);
$host = ($_SERVER['HTTPS'] ?? '') === 'on' ? 'https://' : 'http://';
?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Website setup | GAA Group</title>
<style>body{margin:0;background:#F6F3EF;font:15px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif;color:#1d1d1f}main{max-width:720px;margin:40px auto;padding:0 20px}h1{font-size:28px;margin:0 0 6px}h2{font-size:17px;margin:26px 0 10px}.card{background:#fff;border-radius:16px;padding:26px;box-shadow:0 20px 40px -30px rgba(0,0,0,.25)}label{display:block;margin-top:12px;font-weight:600;font-size:13px;color:#555}input,select{width:100%;box-sizing:border-box;margin-top:5px;padding:10px 12px;border:1px solid #ddd;border-radius:10px;font:inherit}button{margin-top:22px;padding:13px 24px;border:0;border-radius:10px;background:linear-gradient(90deg,#D9532B,#E98A45);color:#fff;font-weight:700;font-size:15px;cursor:pointer}.two{display:grid;grid-template-columns:1fr 1fr;gap:0 14px}.ok{color:#1F7A44}.no{color:#B3261E}.err{margin:14px 0;padding:12px 14px;border-radius:10px;background:#F8E5E3;color:#B3261E}.done{padding:14px;border-radius:10px;background:#E9F6EE;color:#1F7A44}small{color:#777}ul{padding-left:18px}</style></head><body><main>
<h1>Website setup</h1><p>Connects the website to your MySQL database and creates the admin login.</p>
<div class="card">
<?php if ($done): ?>
  <p class="done"><b>Setup is complete.</b><?php if ($ok): ?> <?= (int) $ok['posts'] ?> starter articles were added.<?php endif; ?></p>
  <ul><li>Sign in at <a href="/admin">/admin</a>.</li><li>For safety, delete the <code>api/install</code> folder from the server now (it is locked either way).</li><li>To change settings later, edit <code>api/config.php</code>.</li></ul>
<?php else: ?>
  <h2>Server check</h2><ul><?php foreach ($checks as [$n, $pass, $x]): ?><li class="<?= $pass ? 'ok' : 'no' ?>"><?= $pass ? '✓' : '✗' ?> <?= h($n) ?> <?= h($x) ?></li><?php endforeach; ?></ul>
  <?php if ($err): ?><p class="err"><?= h($err) ?></p><?php endif; ?>
  <form method="post" autocomplete="off">
    <h2>1. MySQL database</h2><small>Create an empty database and a user in your hosting panel first.</small>
    <div class="two"><label>Database host<input name="db_host" required value="<?= $v('db_host', 'localhost') ?>"></label><label>Database name<input name="db_name" required value="<?= $v('db_name') ?>"></label>
    <label>Database user<input name="db_user" required value="<?= $v('db_user') ?>"></label><label>Database password<input name="db_pass" type="password" value=""></label></div>
    <h2>2. Website</h2>
    <label>Website address<input name="site_url" required value="<?= $v('site_url', $host . ($_SERVER['HTTP_HOST'] ?? '')) ?>"></label>
    <label>Email that receives form submissions<input name="inbox" type="email" required value="<?= $v('inbox', 'Akshay@gakshayassociates.com') ?>"></label>
    <label>Send emails from (an address on your domain)<input name="mail_from" type="email" required value="<?= $v('mail_from', 'no-reply@' . preg_replace('/^www\./', '', $_SERVER['HTTP_HOST'] ?? 'example.com')) ?>"></label>
    <label>Folder for uploaded CVs <small>(optional, best outside public_html)</small><input name="storage_dir" value="<?= $v('storage_dir') ?>" placeholder="<?= h($apiDir . '/storage') ?>"></label>
    <h2>3. SMTP <small>(optional, recommended)</small></h2>
    <div class="two"><label>SMTP host<input name="smtp_host" value="<?= $v('smtp_host') ?>" placeholder="smtp.hostinger.com"></label><label>Port<input name="smtp_port" value="<?= $v('smtp_port', '587') ?>"></label>
    <label>Security<select name="smtp_secure"><option value="tls">TLS (587)</option><option value="ssl">SSL (465)</option><option value="">None</option></select></label><label>SMTP user<input name="smtp_user" value="<?= $v('smtp_user') ?>"></label></div>
    <label>SMTP password<input name="smtp_pass" type="password" value=""></label>
    <h2>4. First admin user</h2>
    <div class="two"><label>Name<input name="admin_name" required value="<?= $v('admin_name') ?>"></label><label>Email<input name="admin_email" type="email" required value="<?= $v('admin_email') ?>"></label></div>
    <label>Password <small>(at least 10 characters)</small><input name="admin_pass" type="password" required minlength="10"></label>
    <button>Set up the website</button>
  </form>
<?php endif; ?>
</div></main></body></html>
