# PostgreSQL 独有功能

以下功能在 PostgreSQL 中可用，但 MySQL 不支持或需要复杂变通

<script setup>
import CodeCompare from './.vitepress/components/CodeCompare.vue'

const arrayMysql = `-- MySQL 没有原生数组类型
-- 通常用 JSON 或逗号分隔字符串模拟

CREATE TABLE posts (
  id INT PRIMARY KEY,
  tags VARCHAR(255)  -- 'php,mysql,web'
);

-- 查询需要用 FIND_IN_SET
SELECT * FROM posts
WHERE FIND_IN_SET('mysql', tags);

-- 或用 JSON (MySQL 5.7+)
CREATE TABLE posts (
  id INT PRIMARY KEY,
  tags JSON  -- ["php","mysql","web"]
);

SELECT * FROM posts
WHERE JSON_CONTAINS(tags, '"mysql"');`

const arrayPgsql = `-- PostgreSQL 原生数组类型
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  tags TEXT[]  -- 文本数组
);

-- 插入
INSERT INTO posts (tags)
VALUES (ARRAY['php', 'mysql', 'web']);

-- 查询
SELECT * FROM posts WHERE 'mysql' = ANY(tags);

-- 数组操作符
SELECT * FROM posts
WHERE tags @> ARRAY['mysql'];  -- 包含

SELECT * FROM posts
WHERE tags && ARRAY['mysql', 'php'];  -- 交集

-- 数组函数
SELECT array_length(tags, 1) FROM posts;
SELECT array_append(tags, 'new') FROM posts;
SELECT unnest(tags) FROM posts;  -- 展开为行`

const jsonbMysql = `-- MySQL JSON 类型
-- 存储为文本, 每次查询需要解析
CREATE TABLE products (
  id INT PRIMARY KEY,
  data JSON
);

-- 无法对 JSON 内部高效索引
-- MySQL 8.0+ 多值索引有限支持

-- JSON 操作较繁琐
SELECT data->>'$.name' FROM products;`

const jsonbPgsql = `-- PostgreSQL JSONB (二进制 JSON)
-- 预解析存储, 查询更快
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  data JSONB
);

-- GIN 索引支持
CREATE INDEX idx_data
  ON products USING GIN (data);

-- 丰富的操作符
SELECT * FROM products
WHERE data @> '{"category":"book"}';  -- 包含

SELECT * FROM products
WHERE data ? 'isbn';  -- 键存在

SELECT * FROM products
WHERE data ?| ARRAY['isbn','price']; -- 任一键存在

SELECT * FROM products
WHERE data ?& ARRAY['isbn','price']; -- 所有键存在

-- JSONB 路径查询
SELECT * FROM products
WHERE data @? '$.tags[*] ? (@ == "sale")';`

const rangeMysql = `-- MySQL 没有范围类型
-- 使用两个列模拟
CREATE TABLE events (
  id INT PRIMARY KEY,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL
);

-- 检查重叠
SELECT * FROM events e1
WHERE EXISTS (
  SELECT 1 FROM events e2
  WHERE e2.start_time < e1.end_time
  AND e2.end_time > e1.start_time
);`

const rangePgsql = `-- PostgreSQL 原生范围类型
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  during TSRANGE  -- 时间戳范围
);

-- 插入
INSERT INTO events (during)
VALUES ('[2024-01-01, 2024-01-15)');

-- 内置重叠检测
SELECT * FROM events
WHERE during && TSRANGE(
  '2024-01-10', '2024-01-20'
);

-- 排除约束 (防止重叠)
ALTER TABLE events
ADD CONSTRAINT no_overlap
EXCLUDE USING GIST (
  during WITH &&
);`

const distinctOnMysql = `-- MySQL 不支持 DISTINCT ON
-- 需要使用子查询或窗口函数

-- 方式1: 子查询
SELECT u.*
FROM users u
INNER JOIN (
  SELECT department, MAX(salary) AS max_sal
  FROM users
  GROUP BY department
) d ON u.department = d.department
   AND u.salary = d.max_sal;

-- 方式2: 窗口函数 (MySQL 8.0+)
SELECT * FROM (
  SELECT *,
    ROW_NUMBER() OVER (
      PARTITION BY department
      ORDER BY salary DESC
    ) AS rn
  FROM users
) t WHERE rn = 1;`

const distinctOnPgsql = `-- DISTINCT ON: 取每组第一条
-- 简洁高效, MySQL 无此功能

SELECT DISTINCT ON (department)
  department, name, salary
FROM users
ORDER BY department, salary DESC;

-- 等效于 "每个部门薪资最高的人"
-- 比窗口函数写法更简洁`

const returningMysql = `-- MySQL 不支持 RETURNING
-- 需要额外查询获取数据

INSERT INTO users (name, email)
VALUES ('Alice', 'a@example.com');

-- 获取自增 ID
SELECT LAST_INSERT_ID();

-- 获取插入的行
SELECT * FROM users
WHERE id = LAST_INSERT_ID();`

const returningPgsql = `-- RETURNING 子句
-- 插入时直接返回数据

INSERT INTO users (name, email)
VALUES ('Alice', 'a@example.com')
RETURNING id, name, email;

-- 更新时返回
UPDATE users SET name = 'Bob'
WHERE id = 1
RETURNING *;

-- 删除时返回
DELETE FROM users WHERE id = 1
RETURNING *;`

const upsertMysql = `-- MySQL: ON DUPLICATE KEY UPDATE
INSERT INTO users (id, name, email)
VALUES (1, 'Alice', 'a@new.com')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  email = VALUES(email);`

const upsertPgsql = `-- PostgreSQL: INSERT ... ON CONFLICT
INSERT INTO users (id, name, email)
VALUES (1, 'Alice', 'a@new.com')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email;

-- 或忽略冲突
INSERT INTO users (id, name, email)
VALUES (1, 'Alice', 'a@new.com')
ON CONFLICT (id) DO NOTHING;

-- RETURNING 组合使用
INSERT INTO users (id, name)
VALUES (1, 'Alice')
ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name
RETURNING id, name, xmax = 0 AS inserted;`

const materializedViewMysql = `-- MySQL 不支持物化视图
-- 需要手动创建缓存表 + 定时刷新

CREATE TABLE mv_order_stats AS
SELECT
  user_id,
  COUNT(*) AS order_count,
  SUM(amount) AS total_amount
FROM orders
GROUP BY user_id;

-- 需要手动刷新
TRUNCATE TABLE mv_order_stats;
INSERT INTO mv_order_stats
SELECT user_id, COUNT(*), SUM(amount)
FROM orders GROUP BY user_id;`

const materializedViewPgsql = `-- 物化视图
CREATE MATERIALIZED VIEW mv_order_stats AS
SELECT
  user_id,
  COUNT(*) AS order_count,
  SUM(amount) AS total_amount
FROM orders
GROUP BY user_id;

-- 刷新数据
REFRESH MATERIALIZED VIEW mv_order_stats;

-- 并发刷新 (不锁表)
REFRESH MATERIALIZED VIEW
  CONCURRENTLY mv_order_stats;

-- 可在物化视图上建索引
CREATE INDEX ON mv_order_stats (user_id);`

const extensionMysql = `-- MySQL 没有扩展系统
-- 功能通过插件和存储引擎实现

-- 查看插件
SHOW PLUGINS;

-- 安装插件 (需重启)
INSTALL PLUGIN plugin_name
  SONAME 'plugin_name.so';`

const extensionPgsql = `-- PostgreSQL 扩展系统
-- 查看已安装扩展
SELECT * FROM pg_available_extensions;

-- 安装扩展
CREATE EXTENSION IF NOT EXISTS postgis;    -- 地理空间
CREATE EXTENSION IF NOT EXISTS pg_trgm;   -- 模糊搜索
CREATE EXTENSION IF NOT EXISTS btree_gin; -- GIN+B-tree
CREATE EXTENSION IF NOT EXISTS hstore;    -- 键值存储
CREATE EXTENSION IF NOT EXISTS uuid-ossp; -- UUID 生成
CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- 加密函数

-- 不需要重启! 大多数扩展热加载`

const customTypeMysql = `-- MySQL 不支持自定义复合类型
-- 需要用 JSON 或多列模拟

CREATE TABLE addresses (
  id INT PRIMARY KEY,
  street VARCHAR(255),
  city VARCHAR(100),
  zip VARCHAR(20)
);

-- 或用 JSON
CREATE TABLE users (
  id INT PRIMARY KEY,
  address JSON  -- {"street":"...","city":"..."}
);`

const customTypePgsql = `-- PostgreSQL 支持自定义类型

-- 复合类型
CREATE TYPE address AS (
  street VARCHAR(255),
  city VARCHAR(100),
  zip VARCHAR(20)
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  addr address
);

-- 插入
INSERT INTO users (addr) VALUES (
  ROW('123 Main St', 'NYC', '10001')
);

-- 访问字段
SELECT (addr).city FROM users;

-- 域类型 (带约束)
CREATE DOMAIN positive_int AS INTEGER
  CHECK (VALUE > 0);`
</script>

<CodeCompare title="数组类型" description="PostgreSQL 原生数组 vs MySQL JSON 模拟" :mysql="arrayMysql" :postgresql="arrayPgsql" />

<CodeCompare title="JSONB 深度对比" description="PostgreSQL JSONB 比 MySQL JSON 更强大" :mysql="jsonbMysql" :postgresql="jsonbPgsql" />

<CodeCompare title="范围类型" description="PostgreSQL 原生范围类型及约束" :mysql="rangeMysql" :postgresql="rangePgsql" />

<CodeCompare title="DISTINCT ON" description="PostgreSQL 独有的分组取首条语法" :mysql="distinctOnMysql" :postgresql="distinctOnPgsql" />

<CodeCompare title="RETURNING 子句" description="INSERT/UPDATE/DELETE 时返回数据" :mysql="returningMysql" :postgresql="returningPgsql" />

<CodeCompare title="UPSERT" description="INSERT ON DUPLICATE KEY UPDATE vs ON CONFLICT" :mysql="upsertMysql" :postgresql="upsertPgsql" />

<CodeCompare title="物化视图" description="PostgreSQL 原生物化视图" :mysql="materializedViewMysql" :postgresql="materializedViewPgsql" />

<CodeCompare title="扩展系统" description="CREATE EXTENSION 热加载扩展" :mysql="extensionMysql" :postgresql="extensionPgsql" />

<CodeCompare title="自定义类型" description="复合类型、域类型" :mysql="customTypeMysql" :postgresql="customTypePgsql" />
