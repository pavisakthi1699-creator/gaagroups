<?php
/* POST /api/admin/upload.php (multipart, field "file")  blog image upload.
   The image is checked, resized to at most 1800 px wide and saved as WebP (or JPEG if WebP is not available). */
declare(strict_types=1);
require dirname(__DIR__) . '/lib/bootstrap.php';
method('POST');
require_admin();

$f = $_FILES['file'] ?? null;
if (!$f || ($f['error'] ?? 1) !== UPLOAD_ERR_OK) fail('The upload did not arrive. Please try again (maximum 5 MB).');
if ($f['size'] > 5 * 1024 * 1024) fail('The image is larger than 5 MB.');
$info = @getimagesize($f['tmp_name']);
if (!$info || !in_array($info[2], [IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_WEBP], true)) fail('Please upload a JPG, PNG or WebP image.');
if (!function_exists('imagecreatetruecolor')) fail('The server cannot process images (the PHP GD extension is missing).', 500);

$src = match ($info[2]) { IMAGETYPE_JPEG => @imagecreatefromjpeg($f['tmp_name']), IMAGETYPE_PNG => @imagecreatefrompng($f['tmp_name']), IMAGETYPE_WEBP => @imagecreatefromwebp($f['tmp_name']) };
if (!$src) fail('The image could not be read.');
[$w, $h] = [$info[0], $info[1]];
$max = 1800;
if ($w > $max) { $nh = (int) round($h * $max / $w); $dst = imagecreatetruecolor($max, $nh); imagealphablending($dst, false); imagesavealpha($dst, true); imagecopyresampled($dst, $src, 0, 0, 0, 0, $max, $nh, $w, $h); imagedestroy($src); $src = $dst; }

$dir = rtrim((string) cfg('uploads_dir'), '/') . '/blog/' . date('Y/m');
if (!is_dir($dir) && !@mkdir($dir, 0755, true)) fail('The uploads folder is not writable. Check folder permissions.', 500);
$name = bin2hex(random_bytes(8));
if (function_exists('imagewebp')) { $file = "$name.webp"; $ok = imagewebp($src, "$dir/$file", 82); }
else { $file = "$name.jpg"; $ok = imagejpeg($src, "$dir/$file", 85); }
imagedestroy($src);
if (!$ok) fail('The image could not be saved.', 500);
json_out(['ok' => true, 'url' => rtrim((string) cfg('uploads_url', '/uploads'), '/') . '/blog/' . date('Y/m') . '/' . $file]);
