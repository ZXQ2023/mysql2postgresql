# 索引

MySQL 与 PostgreSQL 索引创建和管理的差异

<script setup>
import CodeCompare from './.vitepress/components/CodeCompare.vue'

const btreeMysql = `-- B-Tree 索引 (默认)
CREATE INDEX idx_name ON users (name);

-- 唯一索引
CREATE UNIQUE INDEX idx_email ON users (email);

-- 前缀索引 (仅 MySQL)
CREATE INDEX idx_name ON users (name(10));`

const btreePgsql = `-- B-Tree 索引 (默认)
CREATE INDEX idx_name ON users (name);

-- 唯一索引
CREATE UNIQUE INDEX idx_email ON users (email);

-- 表达式索引 (仅 PostgreSQL)
CREATE INDEX idx_lower_email
  ON users (LOWER(email));`

const compositeMysql = `-- 复合索引
CREATE INDEX idx_name_age
  ON users (name, age);

-- 函数索引 (MySQL 8.0+)
CREATE INDEX idx_lower_name
  ON users ((LOWER(name)));`

const compositePgsql = `-- 复合索引
CREATE INDEX idx_name_age
  ON users (name, age);

-- 表达式索引
CREATE INDEX idx_lower_name
  ON users (LOWER(name));`

const fulltextMysql = `-- 全文索引
CREATE FULLTEXT INDEX idx_content
  ON articles (title, content);

-- 全文搜索
SELECT * FROM articles
WHERE MATCH(title, content)
  AGAINST('database');

-- 布尔模式
SELECT * FROM articles
WHERE MATCH(title, content)
  AGAINST('+MySQL -Oracle' IN BOOLEAN MODE);`

const fulltextPgsql = `-- GIN 全文索引
ALTER TABLE articles ADD COLUMN
  search_vector TSVECTOR
  GENERATED ALWAYS AS (
    SETWEIGHT(TO_TSVECTOR('simple', COALESCE(title,'')), 'A') ||
    SETWEIGHT(TO_TSVECTOR('simple', COALESCE(content,'')), 'B')
  ) STORED;

CREATE INDEX idx_search
  ON articles USING GIN (search_vector);

-- 全文搜索
SELECT * FROM articles
WHERE search_vector @@ TO_TSQUERY('database');

-- 布尔模式
SELECT * FROM articles
WHERE search_vector @@
  TO_TSQUERY('MySQL & !Oracle');`

const spatialMysql = `-- 空间索引 (仅 MyISAM/InnoDB)
CREATE SPATIAL INDEX idx_location
  ON stores (location);

-- 创建空间列
CREATE TABLE stores (
    id INT PRIMARY KEY,
    location POINT NOT NULL,
    SPATIAL INDEX idx_location (location)
);`

const spatialPgsql = `-- GiST 空间索引 (需 PostGIS 扩展)
CREATE INDEX idx_location
  ON stores USING GIST (location);

-- 创建空间列 (需 PostGIS)
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    location GEOGRAPHY(POINT, 4326) NOT NULL
);

CREATE INDEX idx_location
  ON stores USING GIST (location);`

const hashMysql = `-- Hash 索引 (仅 Memory 引擎)
CREATE TABLE sessions (
    id INT PRIMARY KEY,
    token VARCHAR(255),
    INDEX idx_token USING HASH (token)
) ENGINE=MEMORY;`

const hashPgsql = `-- Hash 索引
CREATE INDEX idx_token
  ON sessions USING HASH (token);

-- 注意: Hash 索引不支持范围查询`

const showIndexMysql = `-- 查看索引
SHOW INDEX FROM users;

-- 查看表结构
DESCRIBE users;
SHOW CREATE TABLE users;`

const showIndexPgsql = `-- 查看索引
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'users';

-- 或
\\d users  -- psql 客户端命令`

const dropIndexMysql = `-- 删除索引
DROP INDEX idx_name ON users;

-- 或
ALTER TABLE users DROP INDEX idx_name;`

const dropIndexPgsql = `-- 删除索引
DROP INDEX idx_name;

-- 或指定 schema
DROP INDEX public.idx_name;`

const concurrentMysql = `-- MySQL 不支持在线创建索引
-- 但 InnoDB 支持 Online DDL:
ALTER TABLE users
  ADD INDEX idx_name (name),
  ALGORITHM=INPLACE, LOCK=NONE;`

const concurrentPgsql = `-- 并发创建索引 (不锁表)
CREATE INDEX CONCURRENTLY idx_name
  ON users (name);

-- 并发删除索引
DROP INDEX CONCURRENTLY idx_name;`
</script>

<CodeCompare title="B-Tree 索引" description="最基本的索引类型" :mysql="btreeMysql" :postgresql="btreePgsql" />

<CodeCompare title="复合索引与函数索引" :mysql="compositeMysql" :postgresql="compositePgsql" />

<CodeCompare title="全文索引" description="全文搜索索引的创建与查询" :mysql="fulltextMysql" :postgresql="fulltextPgsql" />

<CodeCompare title="空间索引" description="地理空间数据的索引" :mysql="spatialMysql" :postgresql="spatialPgsql" />

<CodeCompare title="Hash 索引" :mysql="hashMysql" :postgresql="hashPgsql" />

<CodeCompare title="查看索引" description="查看表中已有索引的方式" :mysql="showIndexMysql" :postgresql="showIndexPgsql" />

<CodeCompare title="删除索引" :mysql="dropIndexMysql" :postgresql="dropIndexPgsql" />

<CodeCompare title="并发索引操作" description="不锁表的索引创建与删除" :mysql="concurrentMysql" :postgresql="concurrentPgsql" />
