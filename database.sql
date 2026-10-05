CREATE DATABASE IF NOT EXISTS narrowcasting
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE narrowcasting;

CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE classes (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(100) NULL
) ENGINE=InnoDB;

CREATE TABLE announcements (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  priority ENUM('urgent', 'reminder', 'info') NOT NULL DEFAULT 'info',
  author VARCHAR(150) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  expires_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE announcement_classes (
  announcement_id INT UNSIGNED NOT NULL,
  class_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (announcement_id, class_id),
  CONSTRAINT fk_announcement_classes_announcement
    FOREIGN KEY (announcement_id) REFERENCES announcements(id) ON DELETE CASCADE,
  CONSTRAINT fk_announcement_classes_class
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE schedules (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  class_id INT UNSIGNED NOT NULL,
  lesson_date DATE NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  subject VARCHAR(150) NOT NULL,
  room VARCHAR(50) NOT NULL,
  teacher VARCHAR(150) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_schedules_class
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE bus_stops (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE bus_departures (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  stop_id INT UNSIGNED NOT NULL,
  line VARCHAR(20) NOT NULL,
  destination VARCHAR(150) NOT NULL,
  departure_time TIME NULL,
  minutes_until SMALLINT UNSIGNED NULL,
  CONSTRAINT fk_bus_departures_stop
    FOREIGN KEY (stop_id) REFERENCES bus_stops(id) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO classes (code, name) VALUES
  ('3WDV1', 'Webdesign vormgeving 1'),
  ('3WDV2', 'Webdesign vormgeving 2');

INSERT INTO bus_stops (name) VALUES
  ('Koningin Wilhelminalaan'),
  ('Croeselaan'),
  ('Churchilllaan');

INSERT INTO users (username, password_hash)
VALUES ('admin', '$2y$10$kjUu.603pTeOVe/TsLnYC.G3eF1DCx24tHKkLwFuV.wlDR1X1yL6i');
