-- ============================================================
-- Migration Script: Upgrade Namecheap DB to match new schema
-- Run this ONCE in phpMyAdmin or via MySQL CLI
-- ============================================================

-- 1. Upgrade site_settings: add valueAr, valueEn, category columns
ALTER TABLE `site_settings`
  ADD COLUMN IF NOT EXISTS `valueAr` text AFTER `key`,
  ADD COLUMN IF NOT EXISTS `valueEn` text AFTER `valueAr`,
  ADD COLUMN IF NOT EXISTS `category` varchar(50) NOT NULL DEFAULT 'general' AFTER `valueEn`;

-- Copy existing 'value' into both valueAr and valueEn
UPDATE `site_settings` SET `valueAr` = `value`, `valueEn` = `value` WHERE `valueAr` IS NULL;

-- 2. Upgrade insurance_types: rename nameAr->titleAr, nameEn->titleEn, add missing columns
ALTER TABLE `insurance_types`
  CHANGE COLUMN IF EXISTS `nameAr` `titleAr` varchar(255) NOT NULL,
  CHANGE COLUMN IF EXISTS `nameEn` `titleEn` varchar(255) NOT NULL;

ALTER TABLE `insurance_types`
  ADD COLUMN IF NOT EXISTS `titleAr` varchar(255) NOT NULL DEFAULT '' AFTER `slug`,
  ADD COLUMN IF NOT EXISTS `titleEn` varchar(255) NOT NULL DEFAULT '' AFTER `titleAr`;

-- Copy nameAr/nameEn to titleAr/titleEn if they exist
UPDATE `insurance_types` SET `titleAr` = IFNULL(`titleAr`, ''), `titleEn` = IFNULL(`titleEn`, '');

-- Add featuresAr and featuresEn columns
ALTER TABLE `insurance_types`
  ADD COLUMN IF NOT EXISTS `featuresAr` text AFTER `imageUrl`,
  ADD COLUMN IF NOT EXISTS `featuresEn` text AFTER `featuresAr`,
  ADD COLUMN IF NOT EXISTS `icon` varchar(50) AFTER `featuresEn`;

-- Copy old features column to featuresAr and featuresEn
UPDATE `insurance_types` SET `featuresAr` = `features`, `featuresEn` = `features` WHERE `featuresAr` IS NULL AND `features` IS NOT NULL;

-- 3. Upgrade branches: add missing columns
ALTER TABLE `branches`
  ADD COLUMN IF NOT EXISTS `imageUrl` text AFTER `email`,
  ADD COLUMN IF NOT EXISTS `mapUrl` text AFTER `imageUrl`,
  ADD COLUMN IF NOT EXISTS `isMain` boolean NOT NULL DEFAULT false AFTER `mapUrl`;

-- ============================================================
-- Done! Now run seed-defaults.mjs to populate default data
-- ============================================================
