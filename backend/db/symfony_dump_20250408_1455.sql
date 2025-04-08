-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Apr 08, 2025 at 08:31 PM
-- Server version: 8.0.41
-- PHP Version: 8.2.28

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
  `category_id` int NOT NULL,
  `author_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `meta_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_description` longtext COLLATE utf8mb4_unicode_ci,
  `intro` longtext COLLATE utf8mb4_unicode_ci,
  `steps` json NOT NULL,
  `quote` longtext COLLATE utf8mb4_unicode_ci,
  `conclusion_title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `conclusion_description` json DEFAULT NULL,
  `cta_description` longtext COLLATE utf8mb4_unicode_ci,
  `cta_button` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slug` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `article`
--

INSERT INTO `article` (`id`, `category_id`, `author_id`, `title`, `meta_title`, `meta_description`, `intro`, `steps`, `quote`, `conclusion_title`, `conclusion_description`, `cta_description`, `cta_button`, `slug`, `created_at`, `updated_at`) VALUES
(1, 2, 2, 'Voluptatem iure quod est et quaerat.', 'Et aut consequuntur ea ut distinctio facere eveniet.', 'Qui sit quae mollitia enim. In non aliquid ipsam. Vel eius recusandae ut inventore ea ducimus excepturi.', 'Placeat et similique iste aut aut accusamus. Nemo ex maiores velit impedit sequi rem magnam. Commodi ipsa possimus hic quia consequatur qui.', '[{\"title\": \"Eligendi omnis doloremque.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Fugiat repellendus qui quis magnam et voluptatum. Suscipit harum ea dolor nam. Similique suscipit dolorem et eius perferendis.\", \"type\": \"text\"}]}]}}, {\"title\": \"Corporis eos quo illum ut quisquam.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Officia accusamus eveniet quia voluptas reprehenderit labore. Tempore maxime molestias ut minima.\", \"type\": \"text\"}]}]}}, {\"title\": \"Rerum ipsum sunt consequatur ipsum.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Illo iure eaque recusandae accusamus odit quae. Nemo rem vel non dolorem inventore consequatur delectus id.\", \"type\": \"text\"}]}]}}]', 'Et voluptatum voluptatem quis.', 'Qui nemo omnis hic illo labore.', '{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Qui rerum quibusdam et minima dicta consequatur possimus ipsum optio mollitia a.\", \"type\": \"text\"}]}]}', 'Qui dolorum asperiores rerum dolorem aliquam et.', 'totam', 'voluptatem-iure-quod-est-et-quaerat', '2009-01-25 07:03:54', '2007-04-27 21:05:26'),
(2, 4, 2, 'Expedita possimus quisquam similique et assumenda quia.', 'Aspernatur consequatur amet ratione delectus.', 'Nihil ut laboriosam praesentium rerum modi quaerat magni. Amet rerum deserunt alias magni. Ut fugit aut pariatur. Reiciendis explicabo mollitia ipsam nesciunt.', 'Dolore maxime nemo omnis error voluptas consequuntur sunt. Veritatis et architecto reprehenderit impedit.', '[{\"title\": \"Magnam eos earum consequatur.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Architecto mollitia sunt distinctio ut. Nesciunt asperiores assumenda eos eum placeat rerum et. Ut omnis adipisci occaecati aut libero hic et.\", \"type\": \"text\"}]}]}}, {\"title\": \"Nulla consequatur dolorum.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Ullam rerum fugit ullam dolor autem sunt veritatis. Perferendis inventore accusamus ea veritatis ut voluptatibus tenetur.\", \"type\": \"text\"}]}]}}, {\"title\": \"Quia iure enim architecto eveniet.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Voluptatem iure unde in quod amet voluptas et. Aperiam doloribus fugiat aut beatae maiores vel.\", \"type\": \"text\"}]}]}}]', 'Minima recusandae culpa unde assumenda in.', 'Odio aut ad maiores incidunt.', '{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Maxime aut ducimus commodi labore quaerat enim alias ullam aliquam consequuntur.\", \"type\": \"text\"}]}]}', 'Maiores sit quas sint quam consequatur ut rerum vel.', 'voluptatibus', 'expedita-possimus-quisquam-similique-et-assumenda-quia', '1992-10-26 17:26:11', '2003-02-14 22:38:35'),
(3, 4, 4, 'Dolores optio repudiandae omnis odit itaque.', 'Ea sint in repellendus.', 'Voluptatem magni illum non iusto sed inventore quis repellendus. A facilis aut perferendis sequi quae at.', 'Aut velit laborum quas aut. Quidem molestiae ex rem quod.', '[{\"title\": \"Et cumque facilis ea aut.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Est veniam sit expedita incidunt cumque molestiae. Dolorem sit commodi amet quia. Et dolores fuga autem quis dolore aut.\", \"type\": \"text\"}]}]}}, {\"title\": \"Doloremque dolorem saepe ea sint.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Harum veniam placeat minus ut consequatur suscipit quam nemo. Omnis autem saepe rerum molestias tempore quia dolorem.\", \"type\": \"text\"}]}]}}, {\"title\": \"Natus aliquam ut accusamus dolor vitae.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Qui vitae molestias illo corrupti beatae qui. Cupiditate debitis explicabo fuga.\", \"type\": \"text\"}]}]}}]', 'Dolores voluptatem molestias repellendus quibusdam.', 'Doloremque alias temporibus quisquam.', '{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Minima officia iure similique totam voluptate aspernatur ullam corporis libero.\", \"type\": \"text\"}]}]}', 'Repellendus tempora aut explicabo cum qui libero saepe itaque maxime totam eligendi velit sunt.', 'dolore', 'dolores-optio-repudiandae-omnis-odit-itaque', '2012-02-16 11:08:51', '2005-10-30 15:00:51'),
(4, 2, 4, 'Velit ea eius tempora necessitatibus necessitatibus quod quia.', 'Quia id distinctio sint est voluptatem.', 'Nam et ad nisi. Reprehenderit quia similique est velit qui corrupti nihil aliquid.', 'Sunt consequatur quasi quibusdam sint ex. Eos molestiae asperiores ut voluptates qui sit.', '[{\"title\": \"Quas temporibus vel voluptatem.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Dignissimos accusamus accusantium nulla dolor. Sit tempore rerum quia culpa est. Ratione repellat facere sunt corporis voluptatem est.\", \"type\": \"text\"}]}]}}, {\"title\": \"Consequuntur mollitia et sed.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Quisquam dolor alias pariatur iure et aut odit. A ea officiis id temporibus.\", \"type\": \"text\"}]}]}}, {\"title\": \"Aut recusandae ut.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Minima vero iste officia eos ipsam consequatur. Voluptatibus et eius tempore illum suscipit corporis.\", \"type\": \"text\"}]}]}}]', 'Officia hic nostrum perspiciatis.', 'Non quisquam qui sunt.', '{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Reiciendis sit harum ullam consequatur molestias aspernatur culpa perspiciatis commodi quos et reprehenderit.\", \"type\": \"text\"}]}]}', 'Sint incidunt ea voluptatum fugit sit consequatur modi aut hic.', 'est', 'velit-ea-eius-tempora-necessitatibus-necessitatibus-quod-quia', '1993-12-25 19:33:13', '1982-11-02 06:34:48'),
(5, 5, 4, 'Amet esse ad magnam.', 'Ipsa sint quo optio quo.', 'Distinctio ea perspiciatis veniam delectus ut molestiae. Voluptate voluptate a assumenda animi quo ea. Impedit et cumque consequatur sequi est.', 'Ad rerum excepturi commodi ut optio odit iste molestiae. Numquam animi sit est asperiores ut fugit nesciunt numquam.', '[{\"title\": \"Officia reprehenderit debitis qui dolorem.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Eligendi est minima sed laudantium. Incidunt et magni debitis qui.\", \"type\": \"text\"}]}]}}, {\"title\": \"Exercitationem eius deleniti.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Occaecati nesciunt adipisci aut eligendi totam deserunt quidem. Harum consequatur maiores ex minus minima.\", \"type\": \"text\"}]}]}}, {\"title\": \"Neque molestias tempora sunt.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Sit architecto aperiam enim quod autem. Beatae sit nisi ea consequuntur est consequatur et. Praesentium quia eveniet repellat accusantium.\", \"type\": \"text\"}]}]}}]', 'Sit praesentium asperiores consequatur totam.', 'Possimus culpa illo beatae saepe.', '{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Et ipsa illo inventore numquam neque ad nobis cum totam ut.\", \"type\": \"text\"}]}]}', 'Impedit quos quae saepe est fugit dolore expedita.', 'consequatur', 'amet-esse-ad-magnam', '2002-11-15 03:56:59', '2019-05-28 03:26:21'),
(6, 1, 2, 'Quis reiciendis aut quo adipisci recusandae rem.', 'Cumque temporibus minus laboriosam voluptatem excepturi qui.', 'Eos exercitationem architecto suscipit ipsum eius est. Nisi eos asperiores tenetur. Amet esse hic esse alias eos id molestiae. Ut libero et ut.', 'Vitae provident officiis rem qui cumque numquam. Dolorem magnam voluptas quia eum explicabo minima inventore. Totam repudiandae mollitia libero eum.', '[{\"title\": \"Ducimus ab qui voluptates omnis.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Expedita quia id at. Maiores voluptatem voluptatem veritatis ipsa rerum.\", \"type\": \"text\"}]}]}}, {\"title\": \"Voluptatem id dolor enim doloribus consequuntur.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Dolores laudantium assumenda eligendi eius. Quibusdam autem adipisci ullam quod repellat voluptatem. Officiis qui commodi impedit.\", \"type\": \"text\"}]}]}}, {\"title\": \"Perspiciatis ut quaerat.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Aliquam quibusdam repellendus qui. Distinctio aut neque saepe neque enim.\", \"type\": \"text\"}]}]}}]', 'Ut tempora aut aperiam qui eius sit eum.', 'Totam aperiam sed.', '{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Distinctio illo velit neque architecto doloremque et sapiente temporibus voluptatibus earum ut possimus.\", \"type\": \"text\"}]}]}', 'Sequi totam eos nam quasi beatae veniam est labore.', 'consequatur', 'quis-reiciendis-aut-quo-adipisci-recusandae-rem', '1982-12-02 04:28:48', '1989-05-26 09:07:15'),
(7, 2, 3, 'Et eligendi ab earum aut debitis.', 'Fuga est et et perspiciatis.', 'Quidem ut mollitia alias soluta et. Non cum et beatae qui facilis. Eveniet a ipsa qui quam error voluptas aut.', 'Quo sunt ab explicabo. Corrupti est voluptas consequuntur esse perspiciatis et veniam. Ut dicta voluptatem qui ab fugiat sed dolor.', '[{\"title\": \"Enim quas repellendus ut.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Et et inventore ullam cum quia magni officia. Voluptatibus cupiditate est ea ut. Minus eos perspiciatis et ut voluptates quia.\", \"type\": \"text\"}]}]}}, {\"title\": \"Blanditiis voluptas consequatur nisi et.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Voluptatem doloribus dolorem sed quia fugit ut voluptatem sed. Earum nesciunt aut et error.\", \"type\": \"text\"}]}]}}, {\"title\": \"Iusto similique adipisci sit.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Dolores error atque non est eaque quo. Natus blanditiis maxime dolorum.\", \"type\": \"text\"}]}]}}]', 'A et debitis esse qui rem.', 'Ea quasi consequuntur nam.', '{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Eveniet maiores aut rerum in dolor aut sequi non illo quae reprehenderit ducimus sit.\", \"type\": \"text\"}]}]}', 'Aut magni magnam esse rerum accusamus deserunt saepe nostrum sed consequatur dolorem quo quae.', 'eum', 'et-eligendi-ab-earum-aut-debitis', '2019-03-29 09:08:32', '1990-03-18 18:30:06'),
(8, 4, 1, 'Odit sequi dolorum aspernatur est nihil exercitationem.', 'Iure saepe quia aut deserunt.', 'Sint accusantium et non. Incidunt accusantium consequatur voluptatem blanditiis eum beatae sint. Veniam tenetur dolorem aut rerum vero.', 'Quam ipsum adipisci minima soluta ratione accusantium quia. Vel incidunt qui id voluptate consequuntur delectus dolor.', '[{\"title\": \"Id quia fugit id dolores sit.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Quae ipsa fuga non iure consequatur excepturi. Praesentium ut autem unde. Et provident doloremque dolor omnis.\", \"type\": \"text\"}]}]}}, {\"title\": \"Dolores laborum cumque cumque accusamus nulla.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Provident voluptas minima enim nobis. Sit omnis doloribus vitae maxime explicabo ex cupiditate.\", \"type\": \"text\"}]}]}}, {\"title\": \"Magni repellendus recusandae.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Molestiae commodi inventore qui. Voluptas explicabo perspiciatis consequatur et hic. Dolor velit et impedit.\", \"type\": \"text\"}]}]}}]', 'Sed rerum ipsam et nobis ut dolorem ad.', 'Id eos assumenda quasi quam rerum.', '{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Sequi veritatis asperiores eos officiis non aspernatur provident ad maiores vitae nesciunt.\", \"type\": \"text\"}]}]}', 'Quia ad beatae qui nisi odit perferendis quam sed quis delectus.', 'ad', 'odit-sequi-dolorum-aspernatur-est-nihil-exercitationem', '2023-03-23 13:52:13', '1991-01-24 23:04:10'),
(9, 5, 1, 'Nihil velit eaque exercitationem nihil omnis.', 'Aperiam ut numquam veniam laborum aut.', 'Quod quae ea commodi et qui. Natus quidem maiores quaerat. Eveniet provident officiis ex. Quo nihil et quo accusamus.', 'Nulla ut veniam ut saepe veritatis minus et aut. Neque laudantium sed a et accusantium omnis harum qui.', '[{\"title\": \"Aperiam vel autem quo.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Et quisquam a quia non at. Facilis suscipit fuga modi reprehenderit dicta et.\", \"type\": \"text\"}]}]}}, {\"title\": \"Facilis velit facilis.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Excepturi alias ut quisquam esse non est ea. Et necessitatibus vero repellendus illo. Ut iusto magnam modi vitae est.\", \"type\": \"text\"}]}]}}, {\"title\": \"Minus dolorum dolores ea dignissimos.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Mollitia omnis quis ipsa quis doloremque. Aut vel sequi omnis corporis sapiente.\", \"type\": \"text\"}]}]}}]', 'Sit dolores quia molestiae recusandae veritatis.', 'Error ducimus laudantium dolores officia.', '{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Saepe sit aliquam quam nihil saepe unde qui consequatur saepe commodi.\", \"type\": \"text\"}]}]}', 'Odit iusto reprehenderit magnam inventore sed aspernatur accusamus sint eligendi nulla dolorem.', 'iste', 'nihil-velit-eaque-exercitationem-nihil-omnis', '2005-08-19 20:39:34', '1978-08-23 22:17:30'),
(10, 4, 1, 'Sunt tempora quia quidem voluptatem quos.', 'Et ratione ipsam nam aliquid.', 'Enim cumque illo qui soluta autem perspiciatis nisi. Sapiente quo nulla voluptates aut. Velit enim suscipit modi quibusdam dolore laborum similique.', 'Voluptatem soluta dolorem voluptatem inventore qui consequatur voluptatum. Ipsam quo aspernatur magnam iure omnis veniam quia. Expedita quia velit nostrum.', '[{\"title\": \"Sed magni delectus doloremque nostrum.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Quaerat aut qui tenetur eum sit assumenda nemo vitae. Fugit qui praesentium aut consequatur qui ut dolores.\", \"type\": \"text\"}]}]}}, {\"title\": \"Mollitia quo voluptatem.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Reiciendis animi provident commodi nostrum. Similique placeat ea deserunt laudantium modi voluptatem nostrum cupiditate.\", \"type\": \"text\"}]}]}}, {\"title\": \"Maxime sunt saepe.\", \"content\": {\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Dicta ipsam quo quidem at. Distinctio est vitae aliquid odio.\", \"type\": \"text\"}]}]}}]', 'Vel ab quae eos non.', 'Voluptatem beatae assumenda dolor.', '{\"type\": \"doc\", \"content\": [{\"type\": \"paragraph\", \"content\": [{\"text\": \"Earum et asperiores eligendi omnis voluptatem asperiores sit iste vel.\", \"type\": \"text\"}]}]}', 'Vero itaque consequatur nulla repellendus earum molestiae enim veritatis.', 'et', 'sunt-tempora-quia-quidem-voluptatem-quos', '1998-09-03 05:42:37', '1975-07-30 11:08:08');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
(1, 'Agents IA'),
(2, 'Grands modèles de langage'),
(3, 'Prompt Engineering'),
(4, 'Autonomie des IA'),
(5, 'Infra & orchestration'),
(6, 'Veille et innovations'),
(7, 'Tutos & démos');

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
(1, 6, 8, NULL, 'Facilis vitae tenetur non voluptates sit beatae. Dignissimos sequi ipsam et quia. Ut fugiat sint sequi et fugiat sapiente et.', '2022-09-09 16:00:43', '2025-02-28 02:54:43'),
(2, 7, 1, NULL, 'Molestiae incidunt accusamus numquam odit provident molestiae eligendi natus. Accusantium consequatur perspiciatis debitis. Est itaque enim eligendi quasi enim. Non ipsa aut non distinctio odit quasi dolores fugit.', '2016-01-23 21:33:47', '2025-04-05 12:42:19'),
(3, 8, 7, NULL, 'Consectetur debitis velit eaque eaque. Autem ea doloribus corrupti incidunt sapiente natus et. Rerum magni et quo aut. Officia aut animi sit hic.', '2022-09-12 23:16:21', '2025-02-05 03:36:09'),
(4, 9, 7, NULL, 'Molestias et ea est aut ex et. Autem accusamus asperiores sed atque qui tempora sit error. Magni doloremque et quos est debitis. Eum cupiditate ut suscipit aliquid accusamus explicabo dolorem magnam.', '2018-04-25 08:59:40', '2025-03-18 04:56:03'),
(5, 10, 2, NULL, 'Aperiam nulla iure nesciunt molestiae rerum voluptatibus. Voluptatem non et tenetur ducimus omnis vero.', '2023-03-27 22:15:17', '2025-03-31 08:15:56'),
(6, 11, 6, NULL, 'Quia fuga expedita corrupti id aut unde autem. Maxime quasi omnis dignissimos qui eveniet at.', '2020-03-31 18:51:16', '2025-02-18 14:08:35'),
(7, 12, 5, NULL, 'Omnis aliquam quo doloremque eum at. Qui molestiae quas ea et. Et ea in accusamus voluptatibus sit culpa. Aspernatur necessitatibus tempore error et itaque reiciendis nemo.', '2022-07-27 04:46:22', '2025-04-07 02:15:34'),
(8, 13, 6, NULL, 'Et earum dolorum id et. Suscipit officiis itaque laboriosam sunt libero neque qui et. Recusandae atque perferendis ea voluptates omnis facilis fugit voluptatum.', '2020-11-22 18:25:00', '2025-03-19 09:50:20'),
(9, 14, 6, NULL, 'Iusto laboriosam qui qui. Deserunt doloribus eveniet voluptas fugiat dolores velit. Quibusdam et quia nulla. Maxime amet vero occaecati sed doloribus quasi.', '2017-08-16 11:02:31', '2025-01-24 16:51:39'),
(10, 15, 4, NULL, 'Fugit sapiente dolorum placeat voluptatem perspiciatis eligendi. Voluptates neque ut rerum veritatis id minus cupiditate sed. Vero eius mollitia dolores eveniet. Delectus numquam id earum.', '2024-08-18 09:28:44', '2025-04-07 16:17:58'),
(11, 16, 4, 5, 'Omnis aut nihil sit et facilis ea esse totam. Molestias sunt corporis ducimus. Reprehenderit tempora dolorem molestias blanditiis. Modi et amet laudantium dolores dolor perferendis eum.', '2021-02-16 05:32:10', '2025-01-20 17:05:51'),
(12, 17, 1, 3, 'Eum aut aut deleniti excepturi iste. Id veritatis libero ut deleniti optio laborum. Ut sunt optio velit. Adipisci ut saepe maxime deleniti occaecati ullam id distinctio.', '2016-05-06 23:06:01', '2025-03-16 19:22:49'),
(13, 18, 10, 6, 'Itaque sed provident nemo eum ut sed fugit. Possimus magnam qui facilis aut. Culpa quisquam quo debitis aspernatur similique eum sed. Ut sit quae debitis voluptas beatae.', '2016-08-28 03:07:44', '2025-01-23 21:59:30'),
(14, 19, 8, 3, 'Qui non odio sed placeat tempore tempora. Repellendus vero dolorem itaque. Voluptatibus accusantium nesciunt eos ut.', '2021-11-13 05:52:28', '2025-01-03 00:06:46'),
(15, 20, 2, 10, 'Quo laboriosam blanditiis eius nostrum sunt. Ab eum sequi rerum enim deleniti modi. Tempora dolorum ut quibusdam et. Officia commodi ut itaque ut reiciendis.', '2017-01-14 21:27:46', '2025-01-22 08:14:17'),
(16, 21, 8, 9, 'Et modi vero architecto omnis aut distinctio. Voluptas et aut nihil a inventore sunt.', '2015-11-20 09:44:16', '2025-03-24 08:32:09'),
(17, 22, 1, 10, 'Itaque non nesciunt impedit exercitationem error aut ducimus. Vel nemo sapiente aspernatur voluptatem. Hic ducimus ex facere officiis. Sed et quas amet exercitationem magnam dolorum consequatur.', '2022-03-17 07:42:55', '2025-03-10 16:43:29'),
(18, 23, 10, 8, 'Sunt vero explicabo culpa autem velit. Eum eos odit sed maxime reprehenderit dolore accusantium.', '2018-03-17 16:06:26', '2025-04-04 21:18:35'),
(19, 24, 2, 2, 'Nisi quo quam ut. Ea dolorem quo doloribus amet. Ut adipisci quia itaque eius excepturi sed voluptate quia. Quo quidem corrupti nisi omnis ratione ea velit.', '2017-10-18 23:34:56', '2025-02-23 03:39:06'),
(20, 25, 7, 5, 'Nesciunt consequatur labore perferendis debitis molestias et. Voluptas ex perferendis quia.', '2017-10-31 07:15:45', '2025-01-28 08:47:36'),
(21, 26, 9, 14, 'Officia nobis voluptatem debitis esse nam quos. Nobis ipsam possimus culpa sit doloribus consectetur. Accusantium molestiae laborum quo. Nemo corrupti quasi et placeat iusto aut.', '2016-08-13 21:38:11', '2025-01-12 14:26:46'),
(22, 27, 3, 12, 'Neque harum voluptates ea voluptate sed velit repellendus. Explicabo ut vitae facilis error porro sint. Quia nulla quo et illo deleniti illum. Omnis iure et aspernatur.', '2020-11-25 18:22:10', '2025-02-06 06:02:22'),
(23, 28, 2, 17, 'Corporis natus reiciendis cupiditate omnis temporibus quaerat. Non ad qui aut rem enim eligendi assumenda. Autem vel et rerum laborum aut maxime.', '2018-04-03 02:53:19', '2025-01-24 18:30:37'),
(24, 29, 4, 17, 'Suscipit vitae eum velit quibusdam. Earum accusamus ut nihil cum enim unde aut. Et ab incidunt et dolor tenetur illum quia. Perferendis et sunt voluptatem alias quis.', '2023-05-21 01:19:30', '2025-03-12 18:40:09'),
(25, 30, 5, 11, 'Aut aut impedit illum sunt voluptatem. Quis commodi dicta ut est. Libero voluptatem non iusto odio sunt aut. Hic recusandae eius fugit dolore magnam sint deserunt. Quia optio voluptatem eveniet velit iure iusto eum.', '2018-04-30 12:33:04', '2025-03-16 16:54:49'),
(26, 31, 5, 25, 'Voluptates ipsum voluptatem esse qui quis. Doloremque quos dolorem iste sint iure. Nemo dolorum hic accusantium quia.', '2016-05-11 01:07:16', '2025-01-16 00:02:56'),
(27, 32, 8, 22, 'Quia autem qui possimus eos. Atque atque quos et aut et dolore ipsam placeat. Laborum atque repudiandae occaecati occaecati est ut beatae. Dolorem dolorum ut officiis recusandae necessitatibus ut et molestiae.', '2020-01-14 23:34:31', '2025-02-21 03:23:09'),
(28, 33, 3, 21, 'Repudiandae est corporis consequatur quae voluptatum aut soluta magni. Consequatur distinctio qui repudiandae possimus eum earum incidunt est. Consequatur qui consequatur recusandae ut. Et quod nostrum veritatis quia.', '2017-07-19 11:32:10', '2025-03-21 17:27:10');

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
('DoctrineMigrations\\Version20250408202806', '2025-04-08 20:28:21', 133);

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
(1, 1, 'https://via.placeholder.com/640x480.png/006600?text=enim', 'image', '2020-11-02 02:18:01'),
(2, 4, 'https://example.com/audio.mp3', 'audio', '2023-08-04 18:09:23'),
(3, 7, 'https://example.com/audio.mp3', 'audio', '2024-05-24 18:59:18'),
(4, 2, 'https://example.com/audio.mp3', 'audio', '2018-01-28 04:35:17'),
(5, 6, 'https://example.com/video.mp4', 'video', '2016-11-29 15:41:42'),
(6, 9, 'https://example.com/video.mp4', 'video', '2017-11-26 17:58:21'),
(7, 3, 'https://example.com/video.mp4', 'video', '2018-04-30 23:12:43'),
(8, 1, 'https://via.placeholder.com/640x480.png/000022?text=quisquam', 'image', '2023-11-16 09:02:29');

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
(1, 'Abelardo Hermiston', 'haven.murray@example.net', 'test', 'admin', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(2, 'Virgie Cummings', 'kthiel@example.net', 'test', 'user', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(3, 'Dr. Cicero Schinner', 'alden90@example.com', 'test', 'admin', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(4, 'Rhoda Kreiger', 'rpacocha@example.com', 'test', 'user', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(5, 'Lindsey Ferry', 'jovanny.renner@example.org', 'test', 'user', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(6, 'Jewel Sporer PhD', 'tyra.schmitt@example.org', 'test', 'user', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(7, 'Mr. Sammy Johns III', 'drew.jerde@example.net', 'test', 'admin', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(8, 'Marlene Haley', 'mtoy@example.org', 'test', 'user', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(9, 'Dr. Arnold Hermann', 'sylvester.nader@example.net', 'test', 'user', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(10, 'Prof. Norwood Mills', 'maxime.kautzer@example.org', 'test', 'admin', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(11, 'Allison Rutherford', 'dorothy98@example.net', 'test', 'editor', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(12, 'Jade Gorczany', 'ajast@example.net', 'test', 'user', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(13, 'Alexys Gleichner', 'destany86@example.com', 'test', 'editor', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(14, 'Mr. Jonatan Keebler II', 'marietta.lubowitz@example.com', 'test', 'user', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(15, 'Torrance Bechtelar', 'ettie.rodriguez@example.net', 'test', 'admin', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(16, 'Katrine Olson', 'shad74@example.org', 'test', 'admin', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(17, 'Tessie Greenfelder', 'harber.manley@example.com', 'test', 'editor', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(18, 'Carley Stark', 'friesen.ivy@example.org', 'test', 'admin', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(19, 'Prof. Nikita Keeling', 'bode.julia@example.net', 'test', 'user', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(20, 'Lester Beatty', 'renner.winfield@example.com', 'test', 'admin', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(21, 'Dr. Jerod Auer', 'johanna76@example.com', 'test', 'admin', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(22, 'Francesca Greenfelder', 'wilderman.ervin@example.com', 'test', 'admin', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(23, 'Briana Cartwright II', 'meagan03@example.org', 'test', 'user', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(24, 'Mrs. Stefanie Welch PhD', 'jamison.kozey@example.net', 'test', 'editor', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(25, 'Antonia Rogahn', 'jaren17@example.net', 'test', 'admin', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(26, 'Fritz Hand I', 'wolf.mable@example.org', 'test', 'user', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(27, 'Kip Gerhold', 'alycia22@example.com', 'test', 'user', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(28, 'Duncan Yost', 'christa.corkery@example.org', 'test', 'editor', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(29, 'Tyrell Bosco V', 'tyrique.ruecker@example.net', 'test', 'editor', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(30, 'Jayne Runolfsson', 'brittany.daniel@example.net', 'test', 'editor', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(31, 'Dr. Nannie Mertz', 'durward41@example.net', 'test', 'user', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(32, 'Dominique Reinger', 'qanderson@example.net', 'test', 'editor', '2025-04-08 20:28:48', '2025-04-08 20:28:48'),
(33, 'Dr. Eleanora Bauch', 'vlangworth@example.org', 'test', 'admin', '2025-04-08 20:28:48', '2025-04-08 20:28:48');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `article`
--
ALTER TABLE `article`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_23A0E66989D9B62` (`slug`),
  ADD KEY `IDX_23A0E6612469DE2` (`category_id`),
  ADD KEY `IDX_23A0E66F675F31B` (`author_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

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
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

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
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `article`
--
ALTER TABLE `article`
  ADD CONSTRAINT `FK_23A0E6612469DE2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
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
