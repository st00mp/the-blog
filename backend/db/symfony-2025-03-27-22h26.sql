-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Mar 27, 2025 at 10:26 PM
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
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `article`
--

INSERT INTO `article` (`id`, `author_id`, `title`, `excerpt`, `content`, `created_at`, `updated_at`, `slug`) VALUES
(1, 6, 'Illo eum sequi similique distinctio. Natus quo quia soluta nesciunt esse incidunt asperiores. Eos dolore perspiciatis doloribus molestiae odio. Quia nobis aperiam dolorum adipisci quas facilis asperiores.', 'Aut voluptatem exercitationem ducimus dolor voluptas nihil quis deserunt. Aut fugit rerum aut est. Quasi tenetur qui sit nobis vero vero. Et dolore animi vitae nam qui laudantium.', 'Eum amet officiis facere. Esse pariatur doloremque et recusandae nulla qui modi. Exercitationem debitis quo rerum quam nobis sunt iste. Qui dolore sed repellendus hic possimus et dolorem similique.', '1997-11-18 18:08:11', '1976-11-05 00:54:23', 'test'),
(2, 7, 'Recusandae rerum ducimus dolor est. Ut rerum impedit eligendi non. Sed modi quibusdam tempora voluptates eveniet soluta rerum adipisci. Aut qui nihil voluptas voluptatem. Ut dolor omnis sunt ut sint voluptate.', 'Sunt enim dignissimos dolores itaque. Non beatae tenetur dignissimos eum. Et aspernatur corporis est quae sapiente.', 'Aspernatur accusantium totam est vero. Culpa rerum nam similique nulla nisi est. Nobis necessitatibus animi tempora quo non. Totam quae quidem ipsa temporibus quae alias.', '2007-03-15 12:06:59', '2022-10-29 12:16:28', 'recusandae-rerum-ducimus-dolor-est-ut-rerum-impedit-eligendi-non-sed-modi-quibusdam-tempora-voluptates-eveniet-soluta-rerum-adipisci-aut-qui-nihil-voluptas-voluptatem-ut-dolor-omnis-sunt-ut-sint-voluptate'),
(3, 8, 'Nulla sequi fugit consectetur natus aliquid odit. Voluptatum velit id repellendus est voluptatibus. Ullam non optio modi eos. Tempora reprehenderit modi sint laboriosam ut architecto quo.', 'Dolores inventore quia temporibus qui. Non esse ut minima incidunt debitis. Aut unde sunt iure itaque.', 'Eveniet voluptas dolores eligendi maiores quis provident. Eius a repellendus officiis ad voluptatum. Tenetur qui voluptatem consequatur. Consequuntur in et est voluptates ea iusto.', '2008-07-19 15:15:44', '2004-05-10 20:13:38', 'nulla-sequi-fugit-consectetur-natus-aliquid-odit-voluptatum-velit-id-repellendus-est-voluptatibus-ullam-non-optio-modi-eos-tempora-reprehenderit-modi-sint-laboriosam-ut-architecto-quo'),
(4, 9, 'Aspernatur iste corporis voluptates officia. Blanditiis corrupti vel in voluptatem.', 'Numquam ut iusto possimus nam sit. Veniam id ipsam ad qui quidem velit nisi. Sit perspiciatis ad quidem natus soluta quibusdam ut.', 'Voluptatem est omnis aut ut vitae non quasi distinctio. Ratione illo est pariatur ut quo voluptates. Esse autem recusandae culpa maiores. Quo culpa et voluptatem occaecati aperiam officia laboriosam.', '2005-09-16 08:56:12', '1997-08-29 03:38:10', 'aspernatur-iste-corporis-voluptates-officia-blanditiis-corrupti-vel-in-voluptatem'),
(5, 10, 'Repellendus veniam voluptatem odio. Qui quas consequuntur sapiente error rem ea qui odio. Voluptas nostrum et qui rerum. Et quas officia non qui at et voluptatem. Eos omnis tempore ullam quia. Expedita voluptas quisquam minima praesentium velit numquam.', 'Est sed magnam unde doloribus natus esse. Nulla quis ab repellendus suscipit vel fuga quasi.', 'Sed optio repellendus aspernatur omnis quasi tenetur. Quo quasi mollitia quia sit. Perferendis autem exercitationem magni qui ut consequatur ut. Et aut et quo sed.', '1975-04-12 21:24:00', '2017-08-29 12:31:40', 'repellendus-veniam-voluptatem-odio-qui-quas-consequuntur-sapiente-error-rem-ea-qui-odio-voluptas-nostrum-et-qui-rerum-et-quas-officia-non-qui-at-et-voluptatem-eos-omnis-tempore-ullam-quia-expedita-voluptas-quisquam-minima-praesentium-velit-numquam'),
(6, 11, 'Alias qui adipisci aut hic ut suscipit molestias. Unde nihil ad sint pariatur dignissimos quia. Vel minus veniam nobis omnis placeat vero consequuntur. Eligendi error non est. Necessitatibus et et omnis.', 'Rerum possimus consequatur repellendus modi inventore. Accusantium similique illum ratione et eum. Asperiores laboriosam voluptatem vero. Sint facilis voluptas et a iure et sed et.', 'Quam qui ut quibusdam ut. Eos ea sunt consectetur commodi enim blanditiis perferendis. Sed eaque soluta doloremque repellat molestiae itaque veritatis.', '2024-09-26 03:51:40', '1975-11-25 19:19:26', 'alias-qui-adipisci-aut-hic-ut-suscipit-molestias-unde-nihil-ad-sint-pariatur-dignissimos-quia-vel-minus-veniam-nobis-omnis-placeat-vero-consequuntur-eligendi-error-non-est-necessitatibus-et-et-omnis'),
(7, 12, 'Fugit aperiam enim quasi rerum amet aut doloribus voluptas. Velit atque inventore expedita quasi reiciendis voluptatum. Accusantium nihil perspiciatis et labore.', 'Necessitatibus rerum corporis debitis deserunt consequatur. Earum voluptas laudantium nemo cumque et rem qui quos. Ea odit commodi eaque et et quod atque.', 'Officiis eos expedita laboriosam molestiae eligendi non alias. Perferendis blanditiis explicabo sed ut. Porro officiis vel inventore et odio similique officiis. Autem et voluptas fuga nisi et.', '1982-08-30 06:49:41', '1994-04-30 21:25:22', 'fugit-aperiam-enim-quasi-rerum-amet-aut-doloribus-voluptas-velit-atque-inventore-expedita-quasi-reiciendis-voluptatum-accusantium-nihil-perspiciatis-et-labore'),
(8, 13, 'Modi non necessitatibus nemo accusantium. Nesciunt modi alias inventore. Dolor accusamus porro aut consequuntur qui earum.', 'Et inventore architecto nam. Quas tenetur voluptas nemo asperiores. Non ullam repellat officia delectus. Iure autem voluptates sit animi minima blanditiis et est. Maiores assumenda aut autem.', 'Adipisci soluta quod libero nemo veritatis officiis in. Voluptas consectetur quos in laborum. Qui corrupti deleniti fugit.', '1977-07-04 20:42:49', '2005-01-31 07:58:43', 'modi-non-necessitatibus-nemo-accusantium-nesciunt-modi-alias-inventore-dolor-accusamus-porro-aut-consequuntur-qui-earum'),
(9, 14, 'Velit tempore libero et ratione. Id vitae quas ad doloremque. Facilis laboriosam culpa inventore occaecati. Ea dignissimos aperiam soluta provident necessitatibus aut minima.', 'Ut enim ducimus quia quia dolor laborum cum iste. Labore voluptatem quam mollitia voluptate voluptatem dicta. Cum et voluptas sit molestias eum laudantium.', 'Exercitationem accusantium placeat libero totam quisquam. Enim sint aut eos. Cupiditate sunt aut corrupti eos.', '2016-03-23 05:32:06', '1974-07-11 07:31:02', 'velit-tempore-libero-et-ratione-id-vitae-quas-ad-doloremque-facilis-laboriosam-culpa-inventore-occaecati-ea-dignissimos-aperiam-soluta-provident-necessitatibus-aut-minima'),
(10, 15, 'Voluptas nihil sit facere sit. Ea deserunt occaecati nihil consectetur sint dignissimos. Numquam magnam cum nostrum dolor enim delectus. Ut consequatur ullam harum vero cum.', 'Non atque vitae occaecati tempora quia laboriosam. Ad odio nulla nesciunt hic fugiat deserunt voluptatem sit. A veritatis sequi itaque laborum.', 'Nobis est vel suscipit ut nesciunt. Eius tenetur numquam est ad possimus fugiat sint. Aut aut rerum et voluptatibus rerum voluptatibus temporibus. Nobis voluptatem explicabo sequi ab eos quis.', '1971-05-13 11:47:10', '1994-07-04 21:32:01', 'voluptas-nihil-sit-facere-sit-ea-deserunt-occaecati-nihil-consectetur-sint-dignissimos-numquam-magnam-cum-nostrum-dolor-enim-delectus-ut-consequatur-ullam-harum-vero-cum');

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
(1, 16, 7, NULL, 'Blanditiis voluptatem earum rerum quasi sit delectus molestiae ea. Quae non ut laboriosam dolor. Facilis voluptatum ut magnam molestiae officia et atque.', '2016-12-17 05:22:20', '2025-02-10 11:28:06'),
(2, 17, 5, NULL, 'Necessitatibus accusamus repellendus incidunt voluptate ut aut nisi. Et ut earum et officia quae consequuntur. Numquam consequatur voluptatem eos et. Sunt consequatur sint libero corrupti vero at quo. Aperiam nobis in ut maxime vel.', '2016-07-26 18:34:02', '2025-02-19 16:01:29'),
(3, 18, 5, NULL, 'Sint distinctio maiores consectetur. Sed fugit soluta beatae sunt rerum nihil.', '2023-12-25 18:48:18', '2025-02-16 18:16:29'),
(4, 19, 2, NULL, 'Quam optio atque rerum voluptatem et sunt. Sed enim illo totam. Sint dolores quo rerum vel.', '2020-05-23 02:22:47', '2025-02-06 13:14:03'),
(5, 20, 5, NULL, 'Esse necessitatibus quas minima non omnis voluptas quia. Nisi itaque sit molestiae vel deleniti labore aut. Inventore aliquid aut commodi laudantium dicta aut aut. Sit natus sed ut accusantium aut.', '2018-06-13 07:27:03', '2025-02-22 02:21:21'),
(6, 21, 6, NULL, 'Eum voluptatibus ut maxime qui sunt fugiat ea. Modi maiores sint sunt laborum laudantium earum reiciendis. Molestiae molestias sapiente veniam non ut. Accusamus exercitationem qui dolores atque.', '2017-01-12 18:52:31', '2025-01-26 02:25:17'),
(7, 22, 7, NULL, 'Et veniam voluptas vel voluptas sed eligendi. Et quod perferendis distinctio quibusdam eum. Et pariatur suscipit asperiores magni enim itaque. Perferendis nihil repellendus consequatur.', '2023-08-26 02:20:56', '2025-01-12 01:22:39'),
(8, 23, 4, NULL, 'Odio nesciunt nostrum odit dignissimos. Ut a sit est laboriosam. Dolorum culpa dolores qui amet.', '2021-04-11 06:54:31', '2025-02-10 12:04:26'),
(9, 24, 1, NULL, 'Quod reiciendis tenetur non odio. Non voluptas minima illo praesentium minus quae. Ut quia rem est veritatis non.', '2024-02-16 01:56:08', '2025-03-17 04:13:46'),
(10, 25, 7, NULL, 'Accusantium est harum laudantium. Voluptatem voluptatum dolores illo quis.', '2017-11-24 08:12:11', '2025-01-07 18:05:19'),
(11, 26, 2, 5, 'Suscipit quibusdam tempora error minus est. Illum est repudiandae laudantium sunt sunt. Tempore necessitatibus similique sunt illum ipsa similique. Ad rerum recusandae doloremque error ut tempora nobis.', '2022-12-30 08:20:13', '2025-02-13 16:31:08'),
(12, 27, 6, 10, 'Nobis ipsam incidunt et eaque. Fugit maiores est consequuntur quae. Harum inventore ex voluptatem molestiae maxime sed eveniet voluptates. Eius est iusto quas.', '2017-07-29 07:07:55', '2025-01-29 15:11:34'),
(13, 28, 4, 1, 'Suscipit quos sit libero ut est. Harum eaque maiores dignissimos odit numquam. Magnam voluptates nulla consequuntur sequi omnis.', '2017-06-08 11:46:27', '2025-02-19 19:46:24'),
(14, 29, 6, 5, 'Quia deserunt vitae sequi vitae deleniti. Omnis laborum corporis rerum unde modi beatae. Voluptate qui laboriosam quas doloremque aut aut quia. Ea pariatur aut et nostrum eos ut ea quaerat.', '2020-11-28 01:04:48', '2025-03-26 13:16:21'),
(15, 30, 8, 6, 'Facere et et nemo quam quasi quae. Consequuntur quasi sed corrupti ut ullam ea et velit. Vitae iure ipsam deserunt et sed reiciendis.', '2017-05-27 13:39:14', '2025-03-21 17:20:39'),
(16, 31, 5, 2, 'Eveniet non omnis quia facilis dicta. Vitae vel accusantium aut commodi similique quod. Illum eius quo aspernatur voluptatem. Quia omnis sint est numquam vero omnis libero.', '2018-06-14 01:05:20', '2025-02-22 12:18:14'),
(17, 32, 6, 4, 'Repudiandae quas temporibus impedit magnam. Eum inventore accusamus voluptatem voluptatem. Et ullam id mollitia ut. Eaque eius voluptatem voluptatum in.', '2020-07-16 04:54:46', '2025-01-23 16:01:14'),
(18, 33, 4, 6, 'Repudiandae non excepturi qui voluptas aut officiis autem. Repellendus fuga aperiam assumenda consequatur quam.', '2022-12-08 03:28:56', '2025-02-12 22:24:38'),
(19, 34, 4, 8, 'Veritatis ut facilis hic enim. Veniam tempora numquam ut. Recusandae inventore enim aut voluptatem ullam.', '2016-08-25 09:59:14', '2025-02-19 16:21:29'),
(20, 35, 4, 2, 'Assumenda vel ut consequatur corrupti non fugit fuga qui. Aut rem qui amet impedit. Consequatur ex corrupti rerum. Repellat et unde aperiam rerum. Consequuntur eos dolor eum praesentium qui non.', '2023-08-16 22:30:47', '2025-02-23 07:32:06'),
(21, 36, 8, 16, 'Nesciunt fugit doloremque id sunt quos et. Autem et quia commodi perferendis tenetur eveniet sint. Consequatur eum sed eaque consequatur facilis officia. Natus minus neque dolorem ut perferendis.', '2017-05-12 10:39:39', '2025-02-02 16:05:36'),
(22, 37, 5, 19, 'Qui corrupti deserunt soluta provident unde itaque. Quam dolores aut mollitia consequatur optio qui architecto. Amet deserunt possimus et quia nobis excepturi nihil.', '2018-04-07 00:46:31', '2025-01-29 05:15:36'),
(23, 38, 3, 19, 'Consequatur fugiat est facilis aliquid. Repellat nulla aspernatur corrupti possimus et et.', '2022-12-21 12:12:32', '2025-03-24 15:25:30'),
(24, 39, 8, 17, 'Error aliquid tenetur aut assumenda in. Nam quam nam id nostrum saepe molestias.', '2021-10-24 02:25:40', '2025-03-14 10:44:14'),
(25, 40, 9, 13, 'Voluptatem sed dolorum sequi iure eos ut. Consectetur numquam explicabo quia fuga.', '2024-04-30 00:44:10', '2025-03-13 19:21:06'),
(26, 41, 6, 23, 'Inventore exercitationem ex animi dignissimos totam nobis. Quia minus provident debitis totam quasi dolor velit beatae. Cumque voluptates quis ut incidunt. Eum voluptates doloribus dolor at id voluptas.', '2023-02-25 09:09:07', '2025-02-24 06:06:55'),
(27, 42, 2, 25, 'A ut deleniti atque culpa accusamus vel deleniti incidunt. Est dolor nesciunt laborum et aut molestiae. Animi vel hic a est ut.', '2019-05-28 20:46:03', '2025-02-26 03:24:14'),
(28, 43, 5, 24, 'Dolores ipsa quas vitae libero. Doloremque fugit et alias eos nulla quibusdam. Et autem at quo non.', '2023-04-27 12:18:07', '2025-01-31 16:00:20');

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
('DoctrineMigrations\\Version20250325184400', '2025-03-27 22:16:42', 152),
('DoctrineMigrations\\Version20250327194010', '2025-03-27 22:16:42', 19),
('DoctrineMigrations\\Version20250327195130', '2025-03-27 22:16:42', 7);

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
(1, 8, 'https://example.com/video.mp4', 'video', '2025-02-03 03:14:51'),
(2, 6, 'https://example.com/video.mp4', 'video', '2018-10-31 17:25:35'),
(3, 3, 'https://example.com/audio.mp3', 'audio', '2023-06-04 10:30:45'),
(4, 2, 'https://via.placeholder.com/640x480.png/0077bb?text=dolor', 'image', '2021-05-30 12:55:47'),
(5, 7, 'https://example.com/video.mp4', 'video', '2016-11-20 10:07:59'),
(6, 1, 'https://via.placeholder.com/640x480.png/004444?text=ad', 'image', '2017-10-19 20:26:47'),
(7, 10, 'https://example.com/video.mp4', 'video', '2019-04-05 09:44:58'),
(8, 1, 'https://example.com/video.mp4', 'video', '2016-05-21 11:37:20');

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
(1, 'Prof. Sigrid Huels', 'alfreda21@example.net', 'test', 'editor', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(2, 'Xzavier Sporer MD', 'qrogahn@example.org', 'test', 'admin', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(3, 'Ladarius Volkman DDS', 'bergnaum.macie@example.com', 'test', 'editor', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(4, 'Precious Mayer', 'price.cheyenne@example.net', 'test', 'user', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(5, 'Prof. Daron Borer III', 'reanna.marvin@example.org', 'test', 'user', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(6, 'Antonetta Halvorson', 'collier.bethel@example.org', 'test', 'admin', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(7, 'Dane Hoppe', 'verda.murray@example.com', 'test', 'editor', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(8, 'Arturo Littel Sr.', 'davin67@example.org', 'test', 'editor', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(9, 'Jude Schamberger', 'douglas.mario@example.com', 'test', 'user', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(10, 'Genevieve Zulauf', 'myrtie.fahey@example.net', 'test', 'admin', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(11, 'Miss Wanda Padberg', 'vluettgen@example.net', 'test', 'admin', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(12, 'Alvina Torphy', 'rath.eleanore@example.com', 'test', 'user', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(13, 'Mr. Denis Stracke I', 'brice18@example.org', 'test', 'editor', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(14, 'Johann Dach', 'jaskolski.leann@example.org', 'test', 'editor', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(15, 'Anika Dickens DVM', 'virginia.oberbrunner@example.net', 'test', 'user', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(16, 'Kiera Lindgren', 'doyle.waino@example.com', 'test', 'editor', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(17, 'Prof. Emory Casper Jr.', 'brycen.rohan@example.com', 'test', 'user', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(18, 'Keven Orn', 'zhettinger@example.com', 'test', 'editor', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(19, 'Dr. Novella Torphy Jr.', 'roscoe.kuvalis@example.org', 'test', 'user', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(20, 'Bryana Grimes', 'hipolito.huels@example.com', 'test', 'editor', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(21, 'Diego Kemmer', 'felicity10@example.net', 'test', 'editor', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(22, 'Jalon Considine', 'vmosciski@example.net', 'test', 'editor', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(23, 'Frances Torp DDS', 'johnathan.monahan@example.com', 'test', 'user', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(24, 'Prof. Stewart Crooks', 'rstracke@example.org', 'test', 'editor', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(25, 'Josianne Cruickshank', 'ryleigh.willms@example.net', 'test', 'user', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(26, 'Herbert Champlin', 'dennis.grant@example.org', 'test', 'admin', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(27, 'Trenton Ferry DVM', 'nlubowitz@example.net', 'test', 'user', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(28, 'Damien Kirlin', 'alexane87@example.org', 'test', 'admin', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(29, 'Briana Konopelski', 'lucious.nader@example.com', 'test', 'admin', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(30, 'Prof. Aubrey Dietrich I', 'huels.emely@example.net', 'test', 'editor', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(31, 'Leanna Carroll', 'rhoda.fisher@example.net', 'test', 'admin', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(32, 'Prof. Faustino DuBuque Jr.', 'tgislason@example.com', 'test', 'user', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(33, 'Bernice Weimann', 'cryan@example.org', 'test', 'editor', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(34, 'Miss Mireille Aufderhar', 'lori96@example.com', 'test', 'user', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(35, 'Brant Aufderhar', 'trinity85@example.org', 'test', 'user', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(36, 'Liliane Welch IV', 'caesar.collier@example.org', 'test', 'user', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(37, 'Helena O\'Connell', 'andre55@example.net', 'test', 'admin', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(38, 'Beulah Wilkinson', 'tressie29@example.net', 'test', 'user', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(39, 'Tomasa Hintz', 'senger.annabelle@example.com', 'test', 'user', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(40, 'Grady Mraz DDS', 'tianna.pfeffer@example.org', 'test', 'editor', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(41, 'Cathryn Hodkiewicz', 'maria.gislason@example.com', 'test', 'user', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(42, 'Sally Bruen III', 'marlen.terry@example.net', 'test', 'editor', '2025-03-27 22:23:34', '2025-03-27 22:23:34'),
(43, 'Dr. Agustina Langosh', 'wnienow@example.net', 'test', 'user', '2025-03-27 22:23:34', '2025-03-27 22:23:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `article`
--
ALTER TABLE `article`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_23A0E66989D9B62` (`slug`),
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
