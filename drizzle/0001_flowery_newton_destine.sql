CREATE TABLE `about_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titleAr` varchar(255) NOT NULL,
	`titleEn` varchar(255) NOT NULL,
	`contentAr` text NOT NULL,
	`contentEn` text NOT NULL,
	`imageUrl` text,
	`section` varchar(50) NOT NULL DEFAULT 'main',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `about_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `branches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameAr` varchar(255) NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`addressAr` text NOT NULL,
	`addressEn` text NOT NULL,
	`phone` varchar(50) NOT NULL,
	`email` varchar(320),
	`imageUrl` text,
	`latitude` varchar(50),
	`longitude` varchar(50),
	`mapUrl` text,
	`displayOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `branches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contact_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(50) NOT NULL,
	`subject` varchar(500) NOT NULL,
	`messageType` enum('inquiry','quote','complaint','suggestion') NOT NULL,
	`message` text NOT NULL,
	`status` enum('new','read','replied','archived') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contact_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hero_slides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titleAr` text NOT NULL,
	`titleEn` text NOT NULL,
	`subtitleAr` text,
	`subtitleEn` text,
	`imageUrl` text NOT NULL,
	`ctaTextAr` varchar(100),
	`ctaTextEn` varchar(100),
	`ctaLink` varchar(255),
	`displayOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `hero_slides_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `insurance_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(100) NOT NULL,
	`titleAr` varchar(255) NOT NULL,
	`titleEn` varchar(255) NOT NULL,
	`descriptionAr` text NOT NULL,
	`descriptionEn` text NOT NULL,
	`imageUrl` text NOT NULL,
	`icon` varchar(50),
	`featuresAr` text,
	`featuresEn` text,
	`displayOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `insurance_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `insurance_types_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `news` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titleAr` text NOT NULL,
	`titleEn` text NOT NULL,
	`summaryAr` text NOT NULL,
	`summaryEn` text NOT NULL,
	`contentAr` text,
	`contentEn` text,
	`imageUrl` text NOT NULL,
	`category` enum('news','event','announcement') NOT NULL DEFAULT 'news',
	`publishDate` timestamp NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `news_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nameAr` varchar(255) NOT NULL,
	`nameEn` varchar(255) NOT NULL,
	`logoUrl` text NOT NULL,
	`websiteUrl` varchar(500),
	`descriptionAr` text,
	`descriptionEn` text,
	`category` enum('reinsurer','broker','medical','other') NOT NULL DEFAULT 'other',
	`displayOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `partners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`valueAr` text,
	`valueEn` text,
	`category` varchar(50) NOT NULL DEFAULT 'general',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `statistics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`labelAr` varchar(255) NOT NULL,
	`labelEn` varchar(255) NOT NULL,
	`value` int NOT NULL,
	`suffix` varchar(10),
	`prefix` varchar(10),
	`displayOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `statistics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `why_us_features` (
	`id` int AUTO_INCREMENT NOT NULL,
	`titleAr` varchar(255) NOT NULL,
	`titleEn` varchar(255) NOT NULL,
	`descriptionAr` text NOT NULL,
	`descriptionEn` text NOT NULL,
	`icon` varchar(50) NOT NULL,
	`displayOrder` int NOT NULL DEFAULT 0,
	`isActive` boolean NOT NULL DEFAULT true,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `why_us_features_id` PRIMARY KEY(`id`)
);
