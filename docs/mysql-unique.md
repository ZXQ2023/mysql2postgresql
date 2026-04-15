# MySQL 独有功能

以下功能在 MySQL 中可用，但 PostgreSQL 不支持或需要复杂变通

<script setup>
import CodeCompare from './.vitepress/components/CodeCompare.vue'

const autoIncMysql = `-- AUTO_INCREMENT: 简单自增
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100)
);

-- 设置起始值
ALTER TABLE users AUTO_INCREMENT = 1000;

-- 获取最后插入的 ID
SELECT LAST_INSERT_ID();

-- 多列自增 (MyISAM)
CREATE TABLE myisam_table (
  group_id INT,
  id INT AUTO_INCREMENT,
  PRIMARY KEY (group_id, id)
) ENGINE=MyISAM;`

const autoIncPgsql = `-- SERIAL: 等价于 INTEGER + SEQUENCE
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100)
);

-- 设置序列起始值
ALTER SEQUENCE users_id_seq
  RESTART WITH 1000;

-- 获取最后插入的 ID
-- 使用 RETURNING 更好:
INSERT INTO users (name)
VALUES ('Alice') RETURNING id;

-- 不支持多列自增
-- 需要手动用序列或触发器实现`

const storageEngineMysql = `-- MySQL 支持多种存储引擎
-- 每张表可以不同引擎

-- InnoDB (默认, 事务支持)
CREATE TABLE orders (
  id INT PRIMARY KEY,
  data JSON
) ENGINE=InnoDB;

-- MyISAM (全文索引, 无事务)
CREATE TABLE logs (
  id INT PRIMARY KEY,
  msg TEXT
) ENGINE=MyISAM;

-- Memory (内存表)
CREATE TABLE cache (
  k VARCHAR(100) PRIMARY KEY,
  v TEXT
) ENGINE=MEMORY;

-- 查看表引擎
SHOW TABLE STATUS LIKE 'users';`

const storageEnginePgsql = `-- PostgreSQL 只有单一存储引擎
-- 所有表使用相同的存储层

-- 没有 ENGINE 选项
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  data JSONB
);

-- 模拟不同特性的方式:
-- 1. UNLOGGED 表 (类似 Memory, 崩溃后丢失)
CREATE UNLOGGED TABLE cache (
  k VARCHAR(100) PRIMARY KEY,
  v TEXT
);

-- 2. 临时表 (会话级别)
CREATE TEMP TABLE temp_data (
  id SERIAL PRIMARY KEY,
  val TEXT
);`

const sqlModeMysql = `-- SQL 模式: 控制 SQL 行为
-- 查看
SELECT @@sql_mode;

-- 设置
SET sql_mode = 'STRICT_TRANS_TABLES';

-- 常用模式:
-- STRICT_TRANS_TABLES    严格事务表
-- ONLY_FULL_GROUP_BY     完整 GROUP BY
-- NO_ZERO_IN_DATE        日期不允许零值
-- ANSI_QUOTES            双引号为标识符
-- PIPES_AS_CONCAT        || 为拼接

-- 组合设置
SET sql_mode =
  'STRICT_TRANS_TABLES,ONLY_FULL_GROUP_BY';`

const sqlModePgsql = `-- PostgreSQL 没有 SQL 模式
-- SQL 行为通过配置参数控制

-- 查看 GUC 参数
SHOW standard_conforming_strings;
SHOW server_version;

-- 行为调整示例:
-- 严格日期: 始终严格
-- GROUP BY: 始终要求完整
-- 双引号: 始终为标识符
-- || 运算符: 始终为字符串拼接

-- PostgreSQL 行为更统一
-- 不需要模式切换`

const insertDelayedMysql = `-- INSERT DELAYED (仅 MyISAM)
INSERT DELAYED INTO logs
  (message, created_at)
VALUES ('log entry', NOW());

-- LOW_PRIORITY / HIGH_PRIORITY
INSERT LOW_PRIORITY INTO logs
  (message) VALUES ('low priority');

SELECT HIGH_PRIORITY * FROM users
WHERE id = 1;`

const insertDelayedPgsql = `-- PostgreSQL 没有延迟插入
-- 使用标准 INSERT
INSERT INTO logs (message, created_at)
VALUES ('log entry', NOW());

-- 没有优先级概念
-- 可用 NOTIFY/LISTEN 实现异步处理

-- 使用队列扩展 (如 pg_queue)
-- 或应用层消息队列代替`

const onUpdateMysql = `-- ON UPDATE CURRENT_TIMESTAMP
-- MySQL 特有的自动更新时间戳

CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  created_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
    DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

-- 任何 UPDATE 自动更新 updated_at
UPDATE users SET name = 'Bob' WHERE id = 1;
-- updated_at 自动变为当前时间`

const onUpdatePgsql = `-- PostgreSQL 没有内置 ON UPDATE
-- 需要触发器实现

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建触发器函数
CREATE OR REPLACE FUNCTION
  update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 绑定触发器
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp();`

const queryHintMysql = `-- MySQL 支持查询提示
-- 强制使用索引
SELECT * FROM users
FORCE INDEX (idx_email)
WHERE email = 'a@example.com';

-- 忽略索引
SELECT * FROM users
IGNORE INDEX (idx_email)
WHERE email = 'a@example.com';

-- 优化器提示 (MySQL 5.7+)
SELECT /*+ MAX_EXECUTION_TIME(1000) */
  * FROM users;`

const queryHintPgsql = `-- PostgreSQL 不支持查询提示
-- 使用规划器配置

-- 关闭特定优化器
SET enable_seqscan = off;

-- 为会话设置
SET LOCAL enable_nestloop = off;

-- 使用 pg_hint_plan 扩展
/*+ SeqScan(users) */
SELECT * FROM users
WHERE email = 'a@example.com';

-- 查看执行计划
EXPLAIN ANALYZE
SELECT * FROM users
WHERE email = 'a@example.com';`

const splitPrivilegeMysql = `-- MySQL 细粒度权限控制
-- 列级别权限
GRANT SELECT (name, email)
  ON mydb.users TO 'reader'@'%';

-- 存储过程权限
GRANT EXECUTE ON PROCEDURE
  mydb.calc_stats TO 'app_user'@'%';

-- 代理用户
GRANT PROXY ON 'admin'@'%'
  TO 'app_user'@'%';`

const splitPrivilegePgsql = `-- PostgreSQL 不支持列级别权限
-- 需要视图或行安全策略代替

-- 表级别权限
GRANT SELECT ON users TO reader;

-- 使用视图模拟列级权限
CREATE VIEW user_public AS
  SELECT name, email FROM users;
GRANT SELECT ON user_public TO reader;

-- 函数执行权限
GRANT EXECUTE ON FUNCTION
  calc_stats() TO app_user;

-- 行安全策略 (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY user_policy ON users
  USING (tenant_id = current_user_id());`

const userVarMysql = `-- MySQL 用户变量
SET @rank = 0;
SELECT name, @rank := @rank + 1 AS rn
FROM users ORDER BY name;

-- 会话变量
SET @min_price = 100;
SELECT * FROM products
WHERE price > @min_price;

-- PreparedStatement 变量
PREPARE stmt FROM
  'SELECT * FROM users WHERE id = ?';
SET @uid = 1;
EXECUTE stmt USING @uid;
DEALLOCATE PREPARE stmt;`

const userVarPgsql = `-- PostgreSQL 没有用户变量
-- 使用 CTE 或子查询代替

-- 方式1: 窗口函数
SELECT name,
  ROW_NUMBER() OVER (ORDER BY name) AS rn
FROM users;

-- 方式2: 自定义配置参数
SET myapp.min_price = '100';
SELECT * FROM products
WHERE price >
  current_setting('myapp.min_price')::INT;

-- 方式3: DO 块中的变量
DO $$
DECLARE
  v_min_price INTEGER := 100;
BEGIN
  -- 在 PL/pgSQL 中使用变量
END;
$$;`
</script>

<CodeCompare title="AUTO_INCREMENT 高级用法" description="MySQL 更灵活的自增控制" :mysql="autoIncMysql" :postgresql="autoIncPgsql" />

<CodeCompare title="存储引擎" description="MySQL 多引擎 vs PostgreSQL 单一存储" :mysql="storageEngineMysql" :postgresql="storageEnginePgsql" />

<CodeCompare title="SQL 模式" description="MySQL 可配置的 SQL 行为" :mysql="sqlModeMysql" :postgresql="sqlModePgsql" />

<CodeCompare title="延迟/优先级写入" description="INSERT DELAYED / LOW_PRIORITY" :mysql="insertDelayedMysql" :postgresql="insertDelayedPgsql" />

<CodeCompare title="ON UPDATE 时间戳" description="MySQL 自动更新时间戳" :mysql="onUpdateMysql" :postgresql="onUpdatePgsql" />

<CodeCompare title="查询提示" description="FORCE INDEX / IGNORE INDEX" :mysql="queryHintMysql" :postgresql="queryHintPgsql" />

<CodeCompare title="细粒度权限" description="列级权限和代理用户" :mysql="splitPrivilegeMysql" :postgresql="splitPrivilegePgsql" />

<CodeCompare title="用户变量" description="@变量 vs 替代方案" :mysql="userVarMysql" :postgresql="userVarPgsql" />
