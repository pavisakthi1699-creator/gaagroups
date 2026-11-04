<?php
/* POST /api/enquiry.php
   Receives the Contact Us form (client enquiries and job applications with a CV) and the Insights newsletter sign-up.
   Saves it in MySQL (seen in the admin panel), emails the right company's inbox and, if enabled, sends an acknowledgement. */
declare(strict_types=1);
require __DIR__ . '/lib/bootstrap.php';
require __DIR__ . '/lib/mail.php';
method('POST');

/* service code => [label, company] */
const SERVICES = [
  'india-entry' => ['India Entry Desk', 'gaa-consulting'], 'corporate' => ['Corporate Advisory', 'gaa-consulting'],
  'transactions' => ['Transactional Advisory', 'gaa-consulting'], 'fundraising' => ['Fundraising Advisory', 'gaa-consulting'],
  'nbfc' => ['NBFC Compliance Office', 'gaa-consulting'], 'startup' => ['Startup Compliance Office (legal)', 'gaa-consulting'],
  'accounting' => ['Accounting & Bookkeeping', 'filings-first'], 'tax' => ['Tax & Financial Compliance', 'filings-first'],
  'ff-startup' => ['Startup Compliance Office', 'filings-first'],
  'talent' => ['Talent Acquisition', 'hirings-first'], 'workforce' => ['Workforce & HR Solutions', 'hirings-first'],
  'articleship' => ['CS Articleship', 'gaa-consulting'], 'cs-semi-qualified' => ['CS Semi-qualified', 'gaa-consulting'],
  'cs-qualified' => ['CS Qualified', 'gaa-consulting'], 'lawyers' => ['Lawyers', 'gaa-consulting'],
  'internship' => ['College Internship Programmes', 'hirings-first'], 'accounts-roles' => ['Accounts and finance roles', 'filings-first'],
  'careers' => ['Other roles', 'gaa-group'], 'other' => ['Something else', 'gaa-group'], 'insights' => ['Insights updates', 'gaa-group'],
];
const RECRUITMENT = ['articleship', 'cs-semi-qualified', 'cs-qualified', 'lawyers', 'internship', 'accounts-roles', 'careers'];
const MAX_CV = 3 * 1024 * 1024;

$b = body();
/* bots: hidden field filled in, or the form sent in under 2 seconds */
if (!empty($b['website']) || (isset($b['elapsedMs']) && (int) $b['elapsedMs'] < 2000)) json_out(['ok' => true, 'acknowledged' => false]);

$service = (string) ($b['service'] ?? '');
if (!isset(SERVICES[$service])) fail('Please choose a service.');
[$label, $company] = SERVICES[$service];
$email = clean($b['email'] ?? '', 160);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail('Please enter a valid email address.');
if (empty($b['consent'])) fail('Please agree to be contacted about your enquiry.');

/* ---------- newsletter sign-up ---------- */
if ($service === 'insights' || ($b['type'] ?? '') === 'subscription') {
  rate_limit('subscribe', 5, 600);
  $q = db()->prepare('INSERT INTO subscribers (email, source, ip, created_at) VALUES (?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE source = VALUES(source)');
  $q->execute([strtolower($email), clean($b['page'] ?? '', 255), client_ip()]);
  json_out(['ok' => true, 'acknowledged' => false]);
}

rate_limit('enquiry', 8, 600);
$name = clean($b['name'] ?? '', 120);
$message = clean($b['message'] ?? '', 5000);
if ($name === '') fail('Please enter your name.');
if ($message === '') fail('Please tell us briefly what you need.');
$phone = clean($b['phone'] ?? '', 40);
$org = clean($b['company'] ?? '', 160);
$page = clean($b['page'] ?? '', 255);
$recruit = in_array($service, RECRUITMENT, true);
$type = $recruit ? 'recruitment' : 'client_lead';

/* ---------- CV (job applications) ---------- */
$cv = null;
if ($recruit) {
  $c = $b['cv'] ?? null;
  if (!is_array($c) || empty($c['data'])) fail('Please attach your CV.');
  $data = base64_decode((string) $c['data'], true);
  if ($data === false || strlen($data) === 0) fail('Your CV could not be read. Please try another file.');
  if (strlen($data) > MAX_CV) fail('Your CV is larger than 3 MB. Please upload a smaller file.');
  $ext = strtolower(pathinfo((string) ($c['name'] ?? ''), PATHINFO_EXTENSION));
  $head = substr($data, 0, 8);
  $kind = str_starts_with($head, '%PDF') ? 'pdf' : (str_starts_with($head, "PK\x03\x04") ? 'docx' : (str_starts_with($head, "\xD0\xCF\x11\xE0") ? 'doc' : ''));
  if (!$kind || !in_array($ext, ['pdf', 'doc', 'docx'], true)) fail('Please upload your CV as a PDF, DOC or DOCX file.');
  $mime = ['pdf' => 'application/pdf', 'doc' => 'application/msword', 'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'][$kind];
  $dir = rtrim((string) cfg('storage_dir'), '/') . '/cv/' . date('Y-m');
  if (!is_dir($dir) && !@mkdir($dir, 0750, true)) { error_log('Cannot create ' . $dir); fail('We could not save your CV right now. Please email it to us.', 500); }
  $file = $dir . '/' . bin2hex(random_bytes(12)) . '.' . $kind;
  if (file_put_contents($file, $data) === false) fail('We could not save your CV right now. Please email it to us.', 500);
  $safeName = preg_replace('/[^A-Za-z0-9._ -]/', '_', basename((string) $c['name'])) ?: "cv.$kind";
  $cv = ['path' => $file, 'name' => mb_substr($safeName, 0, 120), 'type' => $mime, 'size' => strlen($data), 'data' => $data];
}

$pdo = db();
$q = $pdo->prepare('INSERT INTO enquiries (type, service, service_label, company, name, email, phone, company_name, message, page_url, consent, ip, user_agent, cv_path, cv_name, cv_type, cv_size, status, created_at, updated_at)
  VALUES (?,?,?,?,?,?,?,?,?,?,1,?,?,?,?,?,?,\'new\',NOW(),NOW())');
$q->execute([$type, $service, $label, $company, $name, $email, $phone, $org, $message, $page, client_ip(), clean($_SERVER['HTTP_USER_AGENT'] ?? '', 255),
  $cv['path'] ?? null, $cv['name'] ?? null, $cv['type'] ?? null, $cv['size'] ?? null]);
$id = (int) $pdo->lastInsertId();

/* ---------- emails ---------- */
$inboxes = cfg('inbox', []);
$to = $inboxes[$recruit ? 'careers' : $company] ?? ($inboxes['gaa-group'] ?? '');
$co = COMPANIES[$company] ?? 'GAA Group';
$subject = ($recruit ? 'Job application' : 'New enquiry') . ": $label ($co) from $name";
$html = '<div style="font:14px Arial,sans-serif;color:#222"><h2 style="font:600 18px Arial,sans-serif;margin:0 0 12px">' . esc($subject) . '</h2>' .
  mail_table(['Type' => $recruit ? 'Job application' : 'Client enquiry', 'Service' => $label, 'Company' => $co, 'Name' => $name, 'Email' => $email,
    'Phone' => $phone ?: '-', 'Organisation' => $org ?: '-', 'Message' => $message, 'Page' => $page, 'Reference' => '#' . $id]) .
  '<p style="margin-top:16px"><a href="' . esc(rtrim((string) cfg('site_url'), '/')) . '/admin/enquiries/' . $id . '">Open in the admin panel</a></p></div>';
$mailed = send_mail((string) $to, $subject, $html, $email, $cv ? ['name' => $cv['name'], 'type' => $cv['type'], 'data' => $cv['data']] : null);
$pdo->prepare('UPDATE enquiries SET mailed = ? WHERE id = ?')->execute([$mailed ? 1 : 0, $id]);
if (!$mailed) error_log("Enquiry #$id saved but the email to $to was not sent");

$ack = false;
if (cfg('send_acknowledgement', true)) {
  $what = $recruit ? 'application' : 'enquiry';
  $ack = send_mail($email, "We have received your $what | $co",
    '<div style="font:15px/1.6 Arial,sans-serif;color:#222"><p>Hello ' . esc($name) . ',</p><p>Thank you for contacting ' . esc($co) . '. Your ' . $what . ' about <b>' . esc($label) . '</b> has been received and our team will get back to you shortly.</p><p>Reference: #' . $id . '</p><p style="color:#777">' . esc($co) . ', part of GAA Group</p></div>');
}

json_out(['ok' => true, 'id' => $id, 'routedTo' => $co, 'acknowledged' => $ack, 'mailed' => $mailed]);
