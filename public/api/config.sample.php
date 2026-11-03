<?php
/* Copy this file to config.php and fill in your details (or run /api/install/ which writes it for you).
   config.php holds passwords: never share it or commit it to GitHub. */
return [
  // MySQL database (from your hosting control panel)
  'db_host' => 'localhost',
  'db_name' => 'gaa_website',
  'db_user' => 'gaa_user',
  'db_pass' => 'change-me',

  // Public address of the website, without a trailing slash
  'site_url' => 'https://www.your-domain.com',

  // Where form submissions are emailed. Several addresses: separate with commas.
  'inbox' => [
    'gaa-group'      => 'Akshay@gakshayassociates.com',
    'gaa-consulting' => 'Akshay@gakshayassociates.com',
    'filings-first'  => 'Akshay@gakshayassociates.com',
    'hirings-first'  => 'Akshay@gakshayassociates.com',
    'careers'        => 'Akshay@gakshayassociates.com',
  ],

  // Sender of the emails. Use an address on your own domain so emails are not marked as spam.
  'mail_from'      => 'no-reply@your-domain.com',
  'mail_from_name' => 'GAA Group Website',
  // Send a "we have received your enquiry" email to the person who wrote in
  'send_acknowledgement' => true,

  // Optional SMTP (recommended). Leave smtp_host empty to use the server's PHP mail().
  'smtp_host'   => '',          // e.g. smtp.hostinger.com or smtp.gmail.com
  'smtp_port'   => 587,         // 587 (STARTTLS) or 465 (SSL)
  'smtp_secure' => 'tls',       // 'tls', 'ssl' or ''
  'smtp_user'   => '',
  'smtp_pass'   => '',

  // Folder for uploaded CVs. Best outside public_html, e.g. '/home/USER/gaa-storage'. Must be writable.
  'storage_dir' => __DIR__ . '/storage',
  // Folder and public address for blog images
  'uploads_dir' => dirname(__DIR__) . '/uploads',
  'uploads_url' => '/uploads',
];
