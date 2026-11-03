-- GAA Group website database (MySQL 5.7+ / MariaDB 10.3+)

CREATE TABLE IF NOT EXISTS admin_users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','editor') NOT NULL DEFAULT 'editor',
  last_login DATETIME NULL,
  created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS posts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  excerpt VARCHAR(300) NOT NULL DEFAULT '',
  content_html MEDIUMTEXT NOT NULL,
  cover_image VARCHAR(255) NOT NULL DEFAULT '',
  company VARCHAR(30) NOT NULL DEFAULT 'gaa-group',
  category VARCHAR(60) NOT NULL DEFAULT '',
  author_name VARCHAR(100) NOT NULL DEFAULT '',
  status ENUM('draft','published') NOT NULL DEFAULT 'draft',
  published_at DATETIME NULL,
  seo_title VARCHAR(70) NOT NULL DEFAULT '',
  seo_description VARCHAR(170) NOT NULL DEFAULT '',
  read_minutes SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  created_by INT UNSIGNED NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  KEY posts_live (status, published_at),
  KEY posts_company (company)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS enquiries (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(20) NOT NULL DEFAULT 'client_lead',
  service VARCHAR(40) NOT NULL,
  service_label VARCHAR(100) NOT NULL,
  company VARCHAR(30) NOT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  phone VARCHAR(40) NOT NULL DEFAULT '',
  company_name VARCHAR(160) NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  page_url VARCHAR(255) NOT NULL DEFAULT '',
  consent TINYINT(1) NOT NULL DEFAULT 0,
  ip VARCHAR(45) NOT NULL DEFAULT '',
  user_agent VARCHAR(255) NOT NULL DEFAULT '',
  cv_path VARCHAR(255) NULL,
  cv_name VARCHAR(120) NULL,
  cv_type VARCHAR(120) NULL,
  cv_size INT UNSIGNED NULL,
  status ENUM('new','in_progress','closed','spam') NOT NULL DEFAULT 'new',
  notes TEXT NULL,
  mailed TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  KEY enq_status (status),
  KEY enq_company (company),
  KEY enq_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS subscribers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(160) NOT NULL UNIQUE,
  source VARCHAR(255) NOT NULL DEFAULT '',
  ip VARCHAR(45) NOT NULL DEFAULT '',
  created_at DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS rate_limits (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  action VARCHAR(20) NOT NULL,
  ip VARCHAR(45) NOT NULL,
  created_at DATETIME NOT NULL,
  KEY rl_lookup (action, ip, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
