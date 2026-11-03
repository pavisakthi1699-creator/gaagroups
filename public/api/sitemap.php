<?php
/* /sitemap.xml (mapped here by .htaccess): every page of the website plus every published article. */
declare(strict_types=1);
require __DIR__ . '/lib/bootstrap.php';
$site = rtrim((string) cfg('site_url', ''), '/');
$routes = json_decode((string) @file_get_contents(dirname(__DIR__) . '/api-routes.json'), true) ?: [['path' => '/', 'priority' => '1.0', 'image' => '']];
$today = date('Y-m-d');
header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=3600');
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n" . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">' . "\n";
foreach ($routes as $r) {
  $img = $r['image'] ? '<image:image><image:loc>' . esc($site . $r['image']) . '</image:loc></image:image>' : '';
  echo '  <url><loc>' . esc($site . ($r['path'] === '/' ? '/' : $r['path'])) . "</loc><lastmod>$today</lastmod><changefreq>monthly</changefreq><priority>" . esc((string) $r['priority']) . "</priority>$img</url>\n";
}
try {
  foreach (db()->query("SELECT slug, cover_image, updated_at FROM posts WHERE status = 'published' AND published_at <= NOW() ORDER BY published_at DESC") as $p) {
    $img = $p['cover_image'] ? '<image:image><image:loc>' . esc(str_starts_with($p['cover_image'], 'http') ? $p['cover_image'] : $site . $p['cover_image']) . '</image:loc></image:image>' : '';
    echo '  <url><loc>' . esc($site . '/insights/' . $p['slug']) . '</loc><lastmod>' . substr($p['updated_at'], 0, 10) . "</lastmod><changefreq>monthly</changefreq><priority>0.7</priority>$img</url>\n";
  }
} catch (Throwable $e) { error_log('sitemap: ' . $e->getMessage()); }
echo "</urlset>\n";
