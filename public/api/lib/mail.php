<?php
/* Sends email through SMTP when configured, otherwise through PHP mail(). Supports one attachment (CVs). */
declare(strict_types=1);

function mail_build(string $to, string $subject, string $html, ?string $replyTo, ?array $att, string $boundary): array {
  $from = cfg('mail_from', 'no-reply@localhost');
  $name = cfg('mail_from_name', 'GAA Group Website');
  $enc = fn($s) => '=?UTF-8?B?' . base64_encode($s) . '?=';
  $headers = [
    'From: ' . $enc($name) . ' <' . $from . '>',
    'MIME-Version: 1.0',
    'Date: ' . date('r'),
    'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . (explode('@', $from)[1] ?? 'localhost') . '>',
  ];
  if ($replyTo) $headers[] = 'Reply-To: ' . $replyTo;
  $text = trim(html_entity_decode(strip_tags(str_replace(['<br>', '</p>', '</tr>'], ["\n", "\n\n", "\n"], $html)), ENT_QUOTES, 'UTF-8'));
  $alt = 'alt' . $boundary;
  $body = "--$alt\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($text)) .
          "--$alt\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode($html)) . "--$alt--\r\n";
  if ($att) {
    $headers[] = "Content-Type: multipart/mixed; boundary=\"$boundary\"";
    $msg = "--$boundary\r\nContent-Type: multipart/alternative; boundary=\"$alt\"\r\n\r\n" . $body .
           "--$boundary\r\nContent-Type: " . $att['type'] . '; name="' . addslashes($att['name']) . "\"\r\nContent-Transfer-Encoding: base64\r\nContent-Disposition: attachment; filename=\"" . addslashes($att['name']) . "\"\r\n\r\n" .
           chunk_split(base64_encode($att['data'])) . "--$boundary--\r\n";
  } else {
    $headers[] = "Content-Type: multipart/alternative; boundary=\"$alt\"";
    $msg = $body;
  }
  return [$headers, $msg, $enc($subject)];
}

function smtp_send(string $to, array $headers, string $subject, string $msg): bool {
  $host = cfg('smtp_host'); $port = (int) cfg('smtp_port', 587); $sec = cfg('smtp_secure', 'tls');
  $remote = ($sec === 'ssl' ? 'ssl://' : '') . $host . ':' . $port;
  $fp = @stream_socket_client($remote, $errno, $errstr, 15);
  if (!$fp) { error_log("SMTP connect failed: $errstr"); return false; }
  stream_set_timeout($fp, 20);
  $read = function () use ($fp) { $d = ''; while (($l = fgets($fp, 515)) !== false) { $d .= $l; if (isset($l[3]) && $l[3] === ' ') break; } return $d; };
  $cmd = function (string $c, array $ok) use ($fp, $read) { fwrite($fp, $c . "\r\n"); $r = $read(); if (!in_array((int) substr($r, 0, 3), $ok, true)) { error_log('SMTP: ' . trim($r)); return false; } return true; };
  $read();
  $me = parse_url(cfg('site_url', 'http://localhost'), PHP_URL_HOST) ?: 'localhost';
  if (!$cmd("EHLO $me", [250])) return false;
  if ($sec === 'tls') {
    if (!$cmd('STARTTLS', [220])) return false;
    if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT)) { error_log('SMTP TLS failed'); return false; }
    if (!$cmd("EHLO $me", [250])) return false;
  }
  if (cfg('smtp_user')) {
    if (!$cmd('AUTH LOGIN', [334]) || !$cmd(base64_encode(cfg('smtp_user')), [334]) || !$cmd(base64_encode(cfg('smtp_pass')), [235])) return false;
  }
  if (!$cmd('MAIL FROM:<' . cfg('mail_from') . '>', [250])) return false;
  foreach (array_filter(array_map('trim', explode(',', $to))) as $rcpt) if (!$cmd("RCPT TO:<$rcpt>", [250, 251])) return false;
  if (!$cmd('DATA', [354])) return false;
  $data = 'To: ' . $to . "\r\nSubject: " . $subject . "\r\n" . implode("\r\n", $headers) . "\r\n\r\n" . preg_replace('/^\./m', '..', $msg);
  if (!$cmd($data . "\r\n.", [250])) return false;
  $cmd('QUIT', [221]);
  fclose($fp);
  return true;
}

/* returns true when the message was handed over for delivery */
function send_mail(string $to, string $subject, string $html, ?string $replyTo = null, ?array $att = null): bool {
  if (!$to) return false;
  $boundary = 'b' . bin2hex(random_bytes(8));
  [$headers, $msg, $subj] = mail_build($to, $subject, $html, $replyTo, $att, $boundary);
  if (cfg('smtp_host')) return smtp_send($to, $headers, $subj, $msg);
  return @mail($to, $subj, $msg, implode("\r\n", $headers), '-f' . cfg('mail_from'));
}

function mail_table(array $rows): string {
  $h = '<table cellpadding="8" cellspacing="0" style="border-collapse:collapse;font:14px Arial,sans-serif;color:#222">';
  foreach ($rows as $k => $v) $h .= '<tr><td style="border-bottom:1px solid #eee;color:#777;vertical-align:top;width:140px">' . esc((string) $k) . '</td><td style="border-bottom:1px solid #eee">' . nl2br(esc((string) $v)) . '</td></tr>';
  return $h . '</table>';
}
