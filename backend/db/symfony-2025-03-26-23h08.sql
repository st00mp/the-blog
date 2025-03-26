-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Mar 26, 2025 at 11:08 PM
-- Server version: 8.0.41
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `symfony`
--

-- --------------------------------------------------------

--
-- Table structure for table `article`
--

CREATE TABLE `article` (
  `id` int NOT NULL,
  `author_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `article`
--

INSERT INTO `article` (`id`, `author_id`, `title`, `excerpt`, `content`, `created_at`, `updated_at`) VALUES
(1, 6, 'Laboriosam sed aut ex. Eum unde cumque molestias architecto quia sit quis. Nam iure excepturi necessitatibus nesciunt voluptas qui omnis optio. Error unde aut dolores recusandae.', 'Rerum aspernatur rerum dignissimos explicabo hic aut cum aut. Necessitatibus doloribus porro quo ea harum. Occaecati beatae et libero eius est iure.', 'Non velit rerum laboriosam doloremque. Itaque beatae aut recusandae doloribus inventore voluptatem cum et. Vel molestiae inventore facilis.', '1974-01-15 04:25:22', '2017-01-10 21:46:58'),
(2, 7, 'Quia repellendus tempore voluptas qui. Totam vel minus adipisci est. Incidunt qui id quibusdam voluptatem necessitatibus id temporibus. Ut ut qui ipsam.', 'Nihil impedit quia deleniti provident est commodi. Et debitis voluptatibus incidunt deserunt nisi ut vel. Veritatis dolor laboriosam eos ducimus voluptatem.', 'Accusamus aut dolorem accusantium iusto id cumque voluptas exercitationem. Aliquam culpa inventore veniam ratione neque expedita cupiditate.', '2012-11-24 16:56:32', '1974-08-14 19:12:02'),
(3, 8, 'Autem eum eius adipisci eveniet ut qui maxime quam. Placeat itaque voluptas est odit sed adipisci ut soluta. Corrupti vel corrupti magni quo. Dolores velit velit omnis iusto fuga quidem.', 'Est modi vel voluptas ipsum quia qui ducimus. In mollitia optio nisi unde corporis laudantium aut. Rerum sed iure consectetur enim quos. Doloremque corporis non facilis consequatur ea maxime cum.', 'Ea sit necessitatibus et numquam. Debitis et consectetur voluptas possimus eligendi.', '2004-08-10 14:25:23', '2005-08-25 08:27:36'),
(4, 9, 'Illum consequatur laborum dolor rem ipsa. Eos non aut corrupti maxime impedit aut. Quisquam saepe aliquam sed dicta dolore corporis.', 'Et ipsum et autem voluptatem soluta aut et natus. Ut beatae qui aut officia totam in praesentium beatae. Consequatur error quia sequi est nulla. Voluptatem ratione non laudantium ut et aut est.', 'Rem et et voluptas. Esse quibusdam aut perferendis. Deleniti velit accusamus aut earum impedit quia laudantium animi. Reprehenderit et dolores ipsam voluptatem delectus quas aut.', '1978-04-05 18:14:14', '2016-04-08 15:05:10'),
(5, 10, 'Et est voluptas excepturi non esse. Suscipit praesentium saepe qui explicabo ipsa. Explicabo quia nobis nulla qui ea accusantium dolores qui. Repellendus minima voluptates at aut.', 'Quidem aspernatur amet sit id. Voluptas sunt maiores accusantium omnis. Ullam mollitia ratione ad aut neque cumque optio.', 'Perspiciatis voluptate iure ratione. Numquam consequatur earum non ut. Magni quidem dolor sit quod enim quas facere.', '2007-02-10 06:28:14', '1986-08-18 01:59:56'),
(6, 11, 'Ratione voluptas inventore minima recusandae eos animi consequatur. Iusto eaque mollitia eius in eligendi. Sed eum odit dolorem autem.', 'Repellat corporis corporis impedit. Sapiente voluptatem totam debitis quod voluptate. Dignissimos aut rerum recusandae nobis explicabo earum odit. Accusantium blanditiis et nulla in.', 'Temporibus dolorum sit eum quas eos voluptas. Praesentium eius cumque quis numquam praesentium. Quis quos delectus id laboriosam dolorum dolor ut quia. Iure quas molestiae qui libero quo est quidem.', '1980-04-15 15:43:28', '2012-12-23 13:25:47'),
(7, 12, 'Eligendi molestiae vel quasi. Voluptatem vel facilis repellendus numquam. Libero ipsa dolorum amet accusamus. Atque cupiditate odio incidunt quis iusto et. Et saepe pariatur aspernatur veritatis rerum et. Eius voluptatem praesentium et illum dolores.', 'Molestiae quis et aut nisi. Voluptatem ut id optio aperiam rerum recusandae aut. Commodi qui qui porro deserunt.', 'Vero commodi et qui et. Unde consectetur officia quos rerum voluptatem facere. Ut consequatur ea unde quibusdam repellendus dolor. Ut quasi vel eveniet nulla voluptatem ipsa.', '2019-12-13 22:45:40', '1971-10-07 13:37:55'),
(8, 13, 'Assumenda et error fugiat tempore exercitationem eum dolore odio. Deleniti eos aut aut optio in explicabo tempore. Repellat debitis impedit sunt.', 'Corporis sit eius voluptatum dolorum alias ut. Impedit temporibus ut accusantium provident. Natus mollitia aut nemo magni. Architecto soluta ut illo quae est.', 'Repudiandae consectetur tenetur perspiciatis dolor impedit nam. Eius qui consequatur aperiam distinctio consequatur est aut.', '1987-12-19 06:48:33', '2005-01-24 14:12:50'),
(9, 14, 'Soluta labore atque sit non minus aut. Officiis itaque et ut temporibus quo deserunt. Tenetur reprehenderit consequatur omnis eaque natus reprehenderit. Autem omnis perferendis tenetur.', 'Amet eum quidem commodi nobis. Nulla rerum consequuntur culpa sint omnis ipsum voluptatem quo. Natus et vero error quaerat. Ducimus sit in aperiam consequuntur repudiandae.', 'Quis consequatur atque repellat. Aspernatur eos voluptatem quaerat modi dicta illum officia. Aut non ipsam omnis ipsa quibusdam voluptatem aliquam tenetur.', '1997-06-21 11:24:08', '2021-01-22 00:25:20'),
(10, 15, 'Voluptates veniam et non ducimus officia. Aut ullam qui illum voluptatem. Repudiandae qui eveniet porro. Temporibus est doloremque id qui fugiat odio modi facilis. Possimus eos eveniet sit consequatur unde. Vero dolorum molestiae sit saepe ab.', 'Tempora sequi minus est in laudantium nulla. Temporibus deleniti enim cupiditate necessitatibus et odit suscipit. Possimus et dolore cumque.', 'Qui perferendis voluptatem excepturi consequatur et error et. Nemo asperiores esse magnam quia quis omnis nemo hic. Qui magnam reprehenderit officia ut. Ex maxime quia quod porro.', '2003-03-06 07:44:48', '2012-04-15 04:35:50');

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `id` int NOT NULL,
  `author_id` int NOT NULL,
  `article_id` int NOT NULL,
  `parent_id` int DEFAULT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`id`, `author_id`, `article_id`, `parent_id`, `content`, `created_at`, `updated_at`) VALUES
(1, 16, 7, NULL, 'Adipisci odio ut quia sapiente. Perferendis dignissimos perspiciatis perspiciatis omnis rerum sint vel. Corrupti asperiores omnis quia esse commodi temporibus fuga.', '2022-01-25 13:32:46', '2025-02-16 12:37:41'),
(2, 17, 6, NULL, 'Quae fugiat quidem dolores. Possimus doloremque sit repudiandae aut et vel autem. Distinctio quibusdam pariatur et.', '2015-11-28 15:25:23', '2025-01-20 04:17:50'),
(3, 18, 9, NULL, 'Laboriosam ullam quae iste ratione minima. Possimus dolores aut est dolor fugiat. Corrupti et rem ipsum qui possimus adipisci temporibus.', '2020-01-28 05:54:05', '2025-02-14 07:44:34'),
(4, 19, 6, NULL, 'Nam amet non quas quisquam sapiente. Aut harum fugiat quia in. Recusandae quam odio exercitationem dolorem dolore. Consequatur dolor mollitia quia dolores molestias eligendi a repudiandae.', '2021-04-03 23:56:28', '2025-02-20 11:24:37'),
(5, 20, 2, NULL, 'Cumque qui et est libero sit commodi temporibus. Molestiae voluptatem placeat dolor adipisci itaque voluptate voluptatibus. Cum et id eos repellat.', '2018-12-06 11:59:29', '2025-03-13 15:20:25'),
(6, 21, 5, NULL, 'Qui ut fugit eos dolore. Sed expedita dolores commodi vel deleniti quia quo ducimus. Commodi quia est eaque omnis voluptatum. Aut eos sit iusto excepturi sapiente et numquam.', '2017-09-20 22:49:05', '2025-01-06 08:01:42'),
(7, 22, 2, NULL, 'Corrupti alias at sint veniam quas qui. Est vitae et quod laboriosam ut voluptate necessitatibus. Excepturi eum aut non rerum ut sunt sint id.', '2023-03-10 16:48:38', '2025-02-13 08:47:12'),
(8, 23, 5, NULL, 'Molestiae reiciendis voluptatem autem aut officia blanditiis eveniet. Vel quasi ratione est tempore voluptas velit enim omnis. At numquam autem veniam labore aut cum. Autem voluptates autem et distinctio impedit ut dolore.', '2020-07-17 11:05:07', '2025-03-12 06:02:22'),
(9, 24, 1, NULL, 'Aut voluptas repellendus ut quos ut. Aliquam voluptate omnis corrupti dolorem. Neque ad ut iure nisi. Velit quae et alias illo velit cum dicta. Necessitatibus delectus repellat dolor nihil sit aliquid quos.', '2020-09-24 11:12:36', '2025-02-08 11:32:56'),
(10, 25, 10, NULL, 'Tempore ut illum soluta dolorum odio. Facere qui rerum cupiditate qui. Optio et autem ea voluptatibus velit error sint. Quos repellat in voluptatem illo fugit.', '2020-07-07 17:47:53', '2025-01-27 07:51:03'),
(11, 26, 6, 6, 'Voluptates impedit laborum dolor ducimus quisquam enim reiciendis. Voluptatum voluptas ut voluptatibus cumque voluptas. Repellat quia et temporibus et. Vitae ut officiis eum quis laudantium.', '2015-08-01 17:24:46', '2025-01-10 12:50:21'),
(12, 27, 10, 2, 'Molestiae delectus vel ad dolorem. Rerum id consequatur voluptatum cum quis est. Enim voluptates officia eaque repellendus minima et et. Omnis in possimus quis quia officiis.', '2018-09-16 07:43:37', '2025-03-24 05:15:39'),
(13, 28, 3, 6, 'Facere eos ut quibusdam qui. Est libero delectus eos omnis. Libero est iure ipsam voluptatem quasi et. Eos aut unde molestiae.', '2018-12-07 19:19:27', '2025-02-12 16:43:36'),
(14, 29, 7, 10, 'Voluptatem eaque sit eum odit. Voluptates provident nisi repellat voluptas. Ut ea et reprehenderit tenetur consequatur adipisci quam. Odio enim molestiae commodi aut sit.', '2021-04-18 12:40:57', '2025-01-01 19:04:02'),
(15, 30, 3, 9, 'Adipisci maxime voluptas maiores est. Ad velit expedita quo. Quo quisquam non consectetur praesentium eius repudiandae voluptas. Laudantium recusandae magni odio dolores autem. Cum quia qui minus repellat fugit.', '2025-01-16 23:15:27', '2025-03-20 18:23:22'),
(16, 31, 8, 1, 'Qui vitae et qui velit quae. Quae labore illum natus asperiores doloremque ullam distinctio maiores.', '2020-03-24 18:09:27', '2025-03-24 22:37:52'),
(17, 32, 2, 3, 'Voluptatem nesciunt suscipit voluptates. Dolorem consequatur modi voluptatem atque tempore. Vel aut et commodi culpa. Quas voluptatem qui quasi adipisci non.', '2022-08-16 19:32:33', '2025-01-15 07:55:46'),
(18, 33, 6, 1, 'Tempore expedita ut quia sunt fugit. Dolore fugiat ipsum quia cupiditate facilis enim. Quaerat quasi nulla eos officiis laudantium. Quisquam corrupti consectetur ipsam.', '2024-03-26 08:01:00', '2025-01-27 03:24:32'),
(19, 34, 1, 10, 'Et asperiores quo mollitia sint beatae et perferendis. Molestiae et qui modi veritatis quae enim deleniti. Quis voluptatem velit perferendis ut aut. Deserunt sequi eum cumque ut voluptatem minus dolorem.', '2018-07-19 02:15:08', '2025-03-07 10:43:23'),
(20, 35, 8, 6, 'Repellat dicta dicta et libero et optio minima id. Molestias delectus aut voluptatem sit quae cumque. Necessitatibus sit et quod illum.', '2024-07-09 11:00:16', '2025-02-08 09:21:07'),
(21, 36, 9, 11, 'Consequatur ullam impedit in non maxime repellendus. Delectus molestiae enim blanditiis molestiae doloremque recusandae. Blanditiis vero aut nostrum ut. Officia recusandae dolore harum quibusdam nemo nemo in.', '2016-09-16 09:15:07', '2025-01-25 14:01:49'),
(22, 37, 6, 17, 'Dignissimos dicta mollitia sit a. Et ipsa debitis in ducimus deleniti adipisci.', '2023-03-17 00:59:58', '2025-02-09 11:39:11'),
(23, 38, 9, 13, 'Et cumque ut numquam nisi rem nemo omnis nesciunt. Sequi est unde et id ratione mollitia. Vitae deserunt ut ex rem eos non voluptatem quasi. Ut enim totam aut est quis nobis.', '2021-11-08 01:48:27', '2025-03-10 21:31:34'),
(24, 39, 5, 12, 'Et et rerum nesciunt optio fuga sit. Labore in tempore unde itaque amet. Qui quia libero ullam architecto vitae rerum. Est nihil aliquam quia dolorum iusto non.', '2021-11-03 18:19:15', '2025-03-03 17:21:20'),
(25, 40, 3, 15, 'Qui facere debitis dolorem repellat voluptatibus. Libero dolor nemo eos. Omnis veniam cumque placeat minus voluptatem iure dolor. Placeat unde ut ea.', '2017-10-17 12:36:39', '2025-02-10 00:49:12'),
(26, 41, 4, 23, 'Voluptates quis voluptates dicta impedit pariatur nam. Perspiciatis molestias accusamus ratione. Corporis natus explicabo corporis voluptas aut iure.', '2020-12-03 12:31:55', '2025-01-22 09:43:50'),
(27, 42, 8, 22, 'Recusandae error nostrum quis. Accusamus fuga quia qui in accusamus. Eligendi et in dolor. Commodi ut quia beatae corrupti necessitatibus consequatur nam veritatis.', '2024-09-18 09:48:29', '2025-01-19 00:41:19'),
(28, 43, 2, 24, 'Aut quod harum dolorem consectetur fugit nesciunt esse. Id reiciendis dolores labore voluptate temporibus non dolorem. Et quia quasi ab nemo dolorum.', '2019-08-19 06:24:11', '2025-03-21 06:05:49');

-- --------------------------------------------------------

--
-- Table structure for table `doctrine_migration_versions`
--

CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) COLLATE utf8mb3_unicode_ci NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `doctrine_migration_versions`
--

INSERT INTO `doctrine_migration_versions` (`version`, `executed_at`, `execution_time`) VALUES
('DoctrineMigrations\\Version20250325184400', '2025-03-25 19:14:03', 176);

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `id` int NOT NULL,
  `article_id` int NOT NULL,
  `url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uploaded_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `media`
--

INSERT INTO `media` (`id`, `article_id`, `url`, `type`, `uploaded_at`) VALUES
(1, 3, 'https://via.placeholder.com/640x480.png/00bb66?text=molestiae', 'image', '2018-02-08 13:19:18'),
(2, 5, 'https://example.com/video.mp4', 'video', '2018-03-05 04:08:49'),
(3, 2, 'https://via.placeholder.com/640x480.png/00dd66?text=atque', 'image', '2020-12-19 18:10:15'),
(4, 3, 'https://example.com/audio.mp3', 'audio', '2015-07-05 14:51:07'),
(5, 8, 'https://example.com/audio.mp3', 'audio', '2020-10-03 07:31:40'),
(6, 4, 'https://via.placeholder.com/640x480.png/007711?text=accusamus', 'image', '2020-10-28 19:18:17'),
(7, 6, 'https://example.com/audio.mp3', 'audio', '2022-05-11 16:10:16'),
(8, 5, 'https://via.placeholder.com/640x480.png/000022?text=atque', 'image', '2021-02-23 00:22:47');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`, `updated_at`) VALUES
(1, 'Katheryn Cummings', 'treutel.janiya@example.com', 'test', 'user', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(2, 'Ada McGlynn', 'keeling.arlo@example.com', 'test', 'user', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(3, 'Tina McKenzie', 'marcel.koepp@example.org', 'test', 'editor', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(4, 'Bertram Steuber', 'mayert.jamaal@example.org', 'test', 'editor', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(5, 'Jaleel Fisher', 'damon97@example.org', 'test', 'editor', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(6, 'Nicholas Wilkinson', 'bednar.merlin@example.net', 'test', 'admin', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(7, 'Joany Hilpert', 'amertz@example.org', 'test', 'user', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(8, 'Gregoria Medhurst', 'fconsidine@example.org', 'test', 'user', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(9, 'Dolly Keeling', 'lia.pacocha@example.net', 'test', 'editor', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(10, 'Prof. Alba Weissnat', 'feeney.conrad@example.org', 'test', 'user', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(11, 'Miss Mina Veum I', 'batz.david@example.com', 'test', 'editor', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(12, 'Raoul Kris', 'saige.bruen@example.org', 'test', 'admin', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(13, 'Jaylin Beahan', 'reilly.lolita@example.net', 'test', 'admin', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(14, 'Alejandra Nader', 'prohaska.joseph@example.org', 'test', 'admin', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(15, 'Elsie Monahan', 'winfield.armstrong@example.net', 'test', 'admin', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(16, 'Willy Corwin', 'yasmin19@example.net', 'test', 'editor', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(17, 'Dayna Blanda', 'utoy@example.net', 'test', 'user', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(18, 'Juana Ratke', 'marks.reece@example.net', 'test', 'admin', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(19, 'Miss Laura Douglas', 'kshlerin.tommie@example.com', 'test', 'user', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(20, 'Tristian Willms', 'kenyon89@example.com', 'test', 'editor', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(21, 'Dianna Barton', 'lennie.king@example.org', 'test', 'admin', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(22, 'Dr. Keenan Von II', 'karlee.kilback@example.org', 'test', 'editor', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(23, 'Gerard Franecki', 'brandy.jaskolski@example.com', 'test', 'user', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(24, 'Chris Heidenreich', 'aniyah39@example.net', 'test', 'user', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(25, 'Ola Beier', 'ahettinger@example.net', 'test', 'admin', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(26, 'Mozell Mertz', 'modesta02@example.com', 'test', 'user', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(27, 'Andre Kiehn', 'everette00@example.org', 'test', 'user', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(28, 'Ms. Myrtice Kozey III', 'amiya99@example.net', 'test', 'user', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(29, 'Jefferey Parisian', 'nikki.koepp@example.com', 'test', 'editor', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(30, 'Bettie Raynor', 'rodriguez.priscilla@example.org', 'test', 'admin', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(31, 'Willa Marks', 'jasper81@example.net', 'test', 'editor', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(32, 'Ms. Thelma Kub V', 'jamil66@example.net', 'test', 'admin', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(33, 'Carley Hills', 'fstehr@example.net', 'test', 'editor', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(34, 'Mrs. Savanna Kemmer', 'sallie.beer@example.net', 'test', 'user', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(35, 'Mrs. Katelyn Hills Sr.', 'kling.hilario@example.net', 'test', 'editor', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(36, 'Lexie Prohaska', 'glenda.bahringer@example.com', 'test', 'admin', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(37, 'Reyna Grimes', 'kulas.naomie@example.org', 'test', 'admin', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(38, 'Napoleon Legros', 'monserrate24@example.net', 'test', 'admin', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(39, 'Deondre Anderson IV', 'heathcote.maria@example.net', 'test', 'admin', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(40, 'Dandre Lehner', 'vbarton@example.com', 'test', 'user', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(41, 'Mr. Gustave Hand Jr.', 'aemmerich@example.org', 'test', 'admin', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(42, 'Jace Williamson MD', 'mconsidine@example.com', 'test', 'user', '2025-03-25 19:14:05', '2025-03-25 19:14:05'),
(43, 'Elvis Kautzer', 'atillman@example.org', 'test', 'admin', '2025-03-25 19:14:05', '2025-03-25 19:14:05');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `article`
--
ALTER TABLE `article`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_23A0E66F675F31B` (`author_id`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_9474526CF675F31B` (`author_id`),
  ADD KEY `IDX_9474526C7294869C` (`article_id`),
  ADD KEY `IDX_9474526C727ACA70` (`parent_id`);

--
-- Indexes for table `doctrine_migration_versions`
--
ALTER TABLE `doctrine_migration_versions`
  ADD PRIMARY KEY (`version`);

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_6A2CA10C7294869C` (`article_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_8D93D649E7927C74` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `article`
--
ALTER TABLE `article`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `article`
--
ALTER TABLE `article`
  ADD CONSTRAINT `FK_23A0E66F675F31B` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `FK_9474526C727ACA70` FOREIGN KEY (`parent_id`) REFERENCES `comment` (`id`),
  ADD CONSTRAINT `FK_9474526C7294869C` FOREIGN KEY (`article_id`) REFERENCES `article` (`id`),
  ADD CONSTRAINT `FK_9474526CF675F31B` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `FK_6A2CA10C7294869C` FOREIGN KEY (`article_id`) REFERENCES `article` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
