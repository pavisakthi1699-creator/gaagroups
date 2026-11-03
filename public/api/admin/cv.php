<?php
/* GET /api/admin/cv.php?id=<id>  download the CV attached to a job application (signed-in users only) */
declare(strict_types=1);
require dirname(__DIR__) . '/lib/bootstrap.php';
method('GET');
require_admin();
$q = db()->prepare('SELECT cv_path, cv_name, cv_type FROM enquiries WHERE id = ?');
$q->execute([(int) ($_GET['id'] ?? 0)]);
$r = $q->fetch();
$root = realpath((string) cfg('storage_dir'));
$file = $r && $r['cv_path'] ? realpath($r['cv_path']) : false;
if (!$file || !$root || !str_starts_with($file, $root) || !is_file($file)) fail('CV not found.', 404);
header('Content-Type: ' . ($r['cv_type'] ?: 'application/octet-stream'));
header('Content-Length: ' . filesize($file));
header('Content-Disposition: attachment; filename="' . str_replace('"', '', $r['cv_name'] ?: basename($file)) . '"');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: private, no-store');
readfile($file);
