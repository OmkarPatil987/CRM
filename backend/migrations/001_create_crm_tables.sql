-- Migration: create CRM tables based on GORM models
-- Generated for MySQL

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `uuid` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `mobile` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `user_type` VARCHAR(255) NOT NULL,
  `is_active` TINYINT(1) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `contacts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `contact_uuid` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `mobile` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `company` VARCHAR(255) NOT NULL,
  `designation` VARCHAR(255) NOT NULL,
  `status` VARCHAR(255) NOT NULL,
  `vip` TINYINT(1) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `leads` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `lead_uuid` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `mobile_number` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `enquiry_text` VARCHAR(255) NOT NULL,
  `unique_lead_id` VARCHAR(255) NOT NULL,
  `lead_status` VARCHAR(255) NOT NULL,
  `services` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `lead_comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `lead_uuid` VARCHAR(255) NOT NULL,
  `remark` VARCHAR(255) NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `user_name` VARCHAR(255) NOT NULL,
  `assigned_to` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `lead_followups` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `uuid` VARCHAR(255) NOT NULL,
  `status` VARCHAR(255) NOT NULL,
  `remark` VARCHAR(255) NOT NULL,
  `follow_up_date` DATETIME NOT NULL,
  `follow_up_time` VARCHAR(255) NOT NULL,
  `next_follow_up_date` DATETIME NULL,
  `next_follow_up_time` VARCHAR(255) NOT NULL,
  `lead_status` VARCHAR(255) NOT NULL,
  `customer_name` VARCHAR(255) NOT NULL,
  `lead_uuid` VARCHAR(255) NOT NULL,
  `lead_mobile_number` VARCHAR(255) NOT NULL,
  `lead_unique_id` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `updated_by` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `lead_activities` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `lead_uuid` VARCHAR(255) NOT NULL,
  `user_id` INT NOT NULL,
  `user_name` VARCHAR(255) NOT NULL,
  `remarks` VARCHAR(255) NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `assigned_to` VARCHAR(255) NOT NULL,
  `assigned_from` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `deleted_at` DATETIME NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
