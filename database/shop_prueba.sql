-- Shop: base de datos de prueba con datos inventados.
-- Cuentas: admin@shop.test (administración), clara@shop.test, tomas@shop.test
-- Contraseña de todas: Usuario123*
-- Incluye la tabla migrations, así que php artisan migrate no vuelve a crear las tablas.
-- Importar en MySQL o MariaDB. No borra nada: si las tablas ya existen, la importación se detiene con un error.

CREATE DATABASE IF NOT EXISTS `shop_demo` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `shop_demo`;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE `basket_product` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `basket_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `basket_product_basket_id_product_id_unique` (`basket_id`,`product_id`),
  KEY `basket_product_product_id_foreign` (`product_id`),
  CONSTRAINT `basket_product_basket_id_foreign` FOREIGN KEY (`basket_id`) REFERENCES `baskets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `basket_product_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `baskets` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `finished` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `baskets_user_id_foreign` (`user_id`),
  KEY `baskets_finished_index` (`finished`),
  CONSTRAINT `baskets_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categories_user_id_foreign` (`user_id`),
  CONSTRAINT `categories_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `from` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imageable_id` bigint unsigned NOT NULL,
  `imageable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `basket_id` bigint unsigned NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `direction` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `zip` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payments_basket_id_foreign` (`basket_id`),
  KEY `payments_user_id_foreign` (`user_id`),
  CONSTRAINT `payments_basket_id_foreign` FOREIGN KEY (`basket_id`) REFERENCES `baskets` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `category_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `products_user_id_foreign` (`user_id`),
  KEY `products_category_id_foreign` (`category_id`),
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `products_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `subname` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prefix` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1);
INSERT INTO `migrations` VALUES (2,'0001_01_01_000001_create_cache_table',1);
INSERT INTO `migrations` VALUES (3,'0001_01_01_000002_create_jobs_table',1);
INSERT INTO `migrations` VALUES (4,'2025_08_30_141708_add_fields_to_users_table',1);
INSERT INTO `migrations` VALUES (5,'2025_08_30_143604_create_categories_table',1);
INSERT INTO `migrations` VALUES (6,'2025_08_30_143812_create_products_table',1);
INSERT INTO `migrations` VALUES (7,'2025_08_30_144118_create_images_table',1);
INSERT INTO `migrations` VALUES (8,'2025_08_30_150323_create_basket_table',1);
INSERT INTO `migrations` VALUES (9,'2025_08_30_150404_create_backet_product_table',1);
INSERT INTO `migrations` VALUES (10,'2025_08_30_150823_create_payments_table',1);
INSERT INTO `migrations` VALUES (11,'2025_09_02_095245_add_fields_to_basket_product_table',1);
INSERT INTO `migrations` VALUES (12,'2025_09_02_101750_add_fields_to_payments_table',1);
INSERT INTO `migrations` VALUES (13,'2025_09_08_150125_add_fields_to_users_table',1);
INSERT INTO `migrations` VALUES (14,'2025_09_11_185812_create_personal_access_tokens_table',1);
INSERT INTO `users` (`id`, `name`, `subname`, `email`, `password`, `phone`, `prefix`, `active`, `type`, `created_at`, `updated_at`) VALUES
  (1, 'Admin', 'Tienda', 'admin@shop.test', '$2y$10$dYQeE7/N.xEjUk439Kh...0BOhgobPv3z.Epf.PnkxzVKxUP.Jb3G', '600000010', '+34', 1, 'admin', '2026-10-10 12:00:00', '2026-10-10 12:00:00'),
  (2, 'Clara', 'Molina', 'clara@shop.test', '$2y$10$dYQeE7/N.xEjUk439Kh...0BOhgobPv3z.Epf.PnkxzVKxUP.Jb3G', '600000011', '+34', 1, 'user', '2026-10-10 12:00:00', '2026-10-10 12:00:00'),
  (3, 'Tomás', 'Herrero', 'tomas@shop.test', '$2y$10$dYQeE7/N.xEjUk439Kh...0BOhgobPv3z.Epf.PnkxzVKxUP.Jb3G', '600000012', '+34', 1, 'user', '2026-10-10 12:00:00', '2026-10-10 12:00:00');
INSERT INTO `categories` (`id`, `name`, `user_id`, `description`, `created_at`, `updated_at`) VALUES
  (1, 'Hogar', 1, 'Objetos para la casa.', '2026-10-10 12:00:00', '2026-10-10 12:00:00'),
  (2, 'Papelería', 1, 'Cuadernos y material de escritura.', '2026-10-10 12:00:00', '2026-10-10 12:00:00'),
  (3, 'Textil', 1, 'Bolsas y ropa sencilla.', '2026-10-10 12:00:00', '2026-10-10 12:00:00');
INSERT INTO `products` (`id`, `name`, `description`, `price`, `user_id`, `category_id`, `created_at`, `updated_at`) VALUES
  (1, 'Taza de cerámica', 'Taza artesanal de 300 ml.', 12.5, 1, 1, '2026-10-10 12:00:00', '2026-10-10 12:00:00'),
  (2, 'Vela aromática', 'Vela de soja con aroma a lavanda.', 9.9, 1, 1, '2026-10-10 12:00:00', '2026-10-10 12:00:00'),
  (3, 'Cuaderno punteado', 'Cuaderno A5 de 120 páginas.', 7.5, 1, 2, '2026-10-10 12:00:00', '2026-10-10 12:00:00'),
  (4, 'Juego de bolígrafos', 'Cinco bolígrafos de colores.', 6, 1, 2, '2026-10-10 12:00:00', '2026-10-10 12:00:00'),
  (5, 'Bolsa de algodón', 'Bolsa reutilizable de algodón.', 8, 1, 3, '2026-10-10 12:00:00', '2026-10-10 12:00:00'),
  (6, 'Camiseta básica', 'Camiseta de algodón, talla única.', 15, 1, 3, '2026-10-10 12:00:00', '2026-10-10 12:00:00');
INSERT INTO `images` (`id`, `path`, `from`, `imageable_id`, `imageable_type`, `created_at`, `updated_at`) VALUES
  (1, 'data:image/svg+xml,%3Csvg xmlns=''http://www.w3.org/2000/svg'' viewBox=''0 0 4 3''%3E%3Crect width=''4'' height=''3'' fill=''%23d8b4a0''/%3E%3C/svg%3E', 'cover', 1, 'App\\Models\\Product', '2026-10-10 12:00:00', '2026-10-10 12:00:00'),
  (2, 'data:image/svg+xml,%3Csvg xmlns=''http://www.w3.org/2000/svg'' viewBox=''0 0 4 3''%3E%3Crect width=''4'' height=''3'' fill=''%23c9b6e4''/%3E%3C/svg%3E', 'cover', 2, 'App\\Models\\Product', '2026-10-10 12:00:00', '2026-10-10 12:00:00'),
  (3, 'data:image/svg+xml,%3Csvg xmlns=''http://www.w3.org/2000/svg'' viewBox=''0 0 4 3''%3E%3Crect width=''4'' height=''3'' fill=''%23a9c7b8''/%3E%3C/svg%3E', 'cover', 3, 'App\\Models\\Product', '2026-10-10 12:00:00', '2026-10-10 12:00:00'),
  (4, 'data:image/svg+xml,%3Csvg xmlns=''http://www.w3.org/2000/svg'' viewBox=''0 0 4 3''%3E%3Crect width=''4'' height=''3'' fill=''%239db4e8''/%3E%3C/svg%3E', 'cover', 4, 'App\\Models\\Product', '2026-10-10 12:00:00', '2026-10-10 12:00:00'),
  (5, 'data:image/svg+xml,%3Csvg xmlns=''http://www.w3.org/2000/svg'' viewBox=''0 0 4 3''%3E%3Crect width=''4'' height=''3'' fill=''%23e6d39a''/%3E%3C/svg%3E', 'cover', 5, 'App\\Models\\Product', '2026-10-10 12:00:00', '2026-10-10 12:00:00'),
  (6, 'data:image/svg+xml,%3Csvg xmlns=''http://www.w3.org/2000/svg'' viewBox=''0 0 4 3''%3E%3Crect width=''4'' height=''3'' fill=''%23b5c7de''/%3E%3C/svg%3E', 'cover', 6, 'App\\Models\\Product', '2026-10-10 12:00:00', '2026-10-10 12:00:00');
INSERT INTO `baskets` (`id`, `user_id`, `finished`, `created_at`, `updated_at`) VALUES
  (1, 2, 1, '2026-10-10 12:00:00', '2026-10-10 12:00:00'),
  (2, 3, 0, '2026-10-10 12:00:00', '2026-10-10 12:00:00');
INSERT INTO `basket_product` (`id`, `basket_id`, `product_id`, `quantity`, `created_at`, `updated_at`) VALUES
  (1, 1, 1, 2, '2026-10-10 12:00:00', '2026-10-10 12:00:00'),
  (2, 1, 3, 1, '2026-10-10 12:00:00', '2026-10-10 12:00:00'),
  (3, 2, 5, 1, '2026-10-10 12:00:00', '2026-10-10 12:00:00');
INSERT INTO `payments` (`id`, `basket_id`, `total`, `status`, `name`, `email`, `direction`, `city`, `zip`, `country`, `user_id`, `created_at`, `updated_at`) VALUES
  (1, 1, 32.5, 'paid', 'Clara Molina', 'clara@shop.test', 'Calle de Ejemplo 1', 'Villaprueba', '00000', 'España', 2, '2026-10-10 12:00:00', '2026-10-10 12:00:00');

SET FOREIGN_KEY_CHECKS = 1;
