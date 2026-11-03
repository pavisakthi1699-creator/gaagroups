<?php
/* Serves /insights/<slug>: the pre-built article page with the article's own title, description, sharing tags,
   structured data and text filled in, so search engines and link previews see the real article.
   (The address is mapped here by .htaccess.) */
declare(strict_types=1);
require __DIR__ . '/lib/bootstrap.php';

$tpl = dirname(__DIR__) . '/insights/_post/index.html';
$slug = slugify((string) ($_GET['slug'] ?? ''));
$html = is_file($tpl) ? file_get_contents($tpl) : '';
if (!$html) { http_response_code(500); exit('Template missing. Upload the whole build again.'); }

$q = db()->prepare("SELECT * FROM posts WHERE slug = ? AND status = 'published' AND published_at <= NOW()");
$q->execute([$slug]);
$p = $q->fetch();

$site = rtrim((string) cfg('site_url', ''), '/');
if (!$p) {
  http_response_code(404);
  $nf = dirname(__DIR__) . '/404.html';
  echo is_file($nf) ? file_get_contents($nf) : 'Page not found';
  exit;
}

$url = $site . '/insights/' . $p['slug'];
$title = ($p['seo_title'] ?: $p['title']) . ' | GAA Group Insights';
$desc = $p['seo_description'] ?: $p['excerpt'];
$img = $p['cover_image'] ? (str_starts_with($p['cover_image'], 'http') ? $p['cover_image'] : $site . $p['cover_image']) : $site . '/og-image.jpg';
$co = COMPANIES[$p['company']] ?? 'GAA Group';

/* replace the template's generic tags */
$rep = function (string $pattern, string $value) use (&$html) { $html = preg_replace($pattern, $value, $html, 1) ?? $html; };
$rep('#<title>.*?</title>#s', '<title>' . esc($title) . '</title>');
$rep('#<meta name="description" content="[^"]*"\s*/?>#', '<meta name="description" content="' . esc($desc) . '" />');
$rep('#<meta property="og:title" content="[^"]*"\s*/?>#', '<meta property="og:title" content="' . esc($title) . '" />');
$rep('#<meta property="og:description" content="[^"]*"\s*/?>#', '<meta property="og:description" content="' . esc($desc) . '" />');
$rep('#<meta property="og:image" content="[^"]*"\s*/?>#', '<meta property="og:image" content="' . esc($img) . '" />');
$rep('#<meta property="og:type" content="[^"]*"\s*/?>#', '<meta property="og:type" content="article" />');
$rep('#<meta name="twitter:title" content="[^"]*"\s*/?>#', '<meta name="twitter:title" content="' . esc($title) . '" />');
$rep('#<meta name="twitter:description" content="[^"]*"\s*/?>#', '<meta name="twitter:description" content="' . esc($desc) . '" />');
$rep('#<meta name="twitter:image" content="[^"]*"\s*/?>#', '<meta name="twitter:image" content="' . esc($img) . '" />');
$rep('#<meta name="robots" content="[^"]*"\s*/?>#', '<meta name="robots" content="index, follow, max-image-preview:large" />');
$rep('#<link rel="canonical" href="[^"]*"\s*/?>#', '<link rel="canonical" href="' . esc($url) . '" />');
if (!str_contains($html, 'rel="canonical"')) $html = str_replace('</head>', '<link rel="canonical" href="' . esc($url) . '" /><meta property="og:url" content="' . esc($url) . "\" />\n</head>", $html);

$ld = ['@context' => 'https://schema.org', '@graph' => [
  ['@type' => 'Article', 'headline' => $p['title'], 'description' => $desc, 'image' => $img, 'datePublished' => date('c', strtotime($p['published_at'])),
   'dateModified' => date('c', strtotime($p['updated_at'])), 'author' => ['@type' => 'Organization', 'name' => $p['author_name'] ?: $co],
   'publisher' => ['@type' => 'Organization', 'name' => 'GAA Group', 'logo' => ['@type' => 'ImageObject', 'url' => $site . '/logo.png']],
   'mainEntityOfPage' => $url],
  ['@type' => 'BreadcrumbList', 'itemListElement' => [
    ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $site . '/'],
    ['@type' => 'ListItem', 'position' => 2, 'name' => 'Insights', 'item' => $site . '/insights'],
    ['@type' => 'ListItem', 'position' => 3, 'name' => $p['title'], 'item' => $url]]],
]];
$ldJson = str_replace('</', '<\/', json_encode($ld, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
$q = db()->prepare("SELECT id, slug, title, excerpt, cover_image, company, category, author_name, published_at, read_minutes FROM posts
  WHERE status = 'published' AND published_at <= NOW() AND id <> ? ORDER BY (company = ?) DESC, published_at DESC LIMIT 3");
$q->execute([$p['id'], $p['company']]);
$data = ['post' => public_post($p, true), 'related' => array_map('public_post', $q->fetchAll())];
$boot = '<script type="application/ld+json">' . $ldJson . '</script><script>window.__POST__=' . str_replace('</', '<\/', json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)) . ';</script>';
$html = str_contains($html, '<!--post-ld-->') ? str_replace('<!--post-ld-->', $boot, $html) : str_replace('</head>', $boot . '</head>', $html);

/* the article text for crawlers that do not run JavaScript */
$plain = '<noscript><article><h1>' . esc($p['title']) . '</h1><p>' . esc((string) $p['excerpt']) . '</p>' . $p['content_html'] . '</article></noscript>';
$html = str_replace('</body>', $plain . '</body>', $html);

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: public, max-age=300');
echo $html;
