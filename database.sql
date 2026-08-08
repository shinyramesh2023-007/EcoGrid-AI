-- =============================================================
-- EcoGrid AI — MySQL schema
-- Optional: the app uses SQLite by default and needs no setup.
-- Run this only if you want to deploy against MySQL instead.
--
-- Usage:
--   mysql -u root -p < database.sql
--   Then set DATABASE_URL=mysql+pymysql://ecogrid_user:password@localhost/ecogrid_db in .env
-- =============================================================

CREATE DATABASE IF NOT EXISTS ecogrid_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecogrid_db;

CREATE USER IF NOT EXISTS 'ecogrid_user'@'localhost' IDENTIFIED BY 'change_this_password';
GRANT ALL PRIVILEGES ON ecogrid_db.* TO 'ecogrid_user'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  company VARCHAR(160),
  phone VARCHAR(30),
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  company VARCHAR(160),
  email VARCHAR(160) NOT NULL,
  phone VARCHAR(30),
  message TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS energy_usage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  day_label VARCHAR(10) NOT NULL,
  kwh FLOAT NOT NULL,
  recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS machine_status (
  id INT AUTO_INCREMENT PRIMARY KEY,
  machine_name VARCHAR(120) NOT NULL,
  status VARCHAR(10) NOT NULL,
  note VARCHAR(120),
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS renewable_energy (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE DEFAULT (CURRENT_DATE),
  solar_kwh_today FLOAT DEFAULT 0,
  wind_contribution_pct FLOAT DEFAULT 0,
  co2_avoided_tonnes FLOAT DEFAULT 0,
  trees_equivalent INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  description VARCHAR(255),
  severity VARCHAR(10) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  report_type VARCHAR(40) DEFAULT 'weekly',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed demo rows (same defaults the SQLite auto-seed uses)
INSERT INTO machine_status (machine_name, status, note) VALUES
  ('CNC Lathe 01', 'ok', 'Normal'),
  ('Compressor B', 'warn', 'Watch'),
  ('Conveyor 3', 'ok', 'Normal'),
  ('Motor Bay 2', 'crit', 'Alert'),
  ('Chiller Unit', 'ok', 'Normal');

INSERT INTO energy_usage (day_label, kwh) VALUES
  ('Mon', 420), ('Tue', 460), ('Wed', 402), ('Thu', 480), ('Fri', 512), ('Sat', 300), ('Sun', 260);

INSERT INTO renewable_energy (solar_kwh_today, wind_contribution_pct, co2_avoided_tonnes, trees_equivalent) VALUES
  (142, 6, 1.8, 82);

INSERT INTO alerts (title, description, severity) VALUES
  ('Motor Bay 2', 'Vibration 34% above safe threshold — inspect within 48 hrs.', 'crit'),
  ('Compressor B', 'Idle draw for 42 minutes with no production load.', 'warn'),
  ('Grid Peak Demand', 'Approaching contracted demand limit between 6-7pm.', 'info');

INSERT INTO reports (title, report_type) VALUES
  ('Weekly report generated - Jul 28', 'weekly'),
  ('June Carbon Report ready', 'carbon');
