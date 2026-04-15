# 系统管理

MySQL 与 PostgreSQL 常用管理命令的对比

<script setup>
import CodeCompare from './.vitepress/components/CodeCompare.vue'

const showDbMysql = `-- 查看数据库
SHOW DATABASES;

-- 切换数据库
USE mydb;

-- 查看当前数据库
SELECT DATABASE();`

const showDbPgsql = `-- 查看数据库
\\l
-- 或
SELECT datname FROM pg_database;

-- 切换数据库
\\c mydb

-- 查看当前数据库
SELECT current_database();`

const showTableMysql = `-- 查看所有表
SHOW TABLES;

-- 查看表结构
DESCRIBE users;
DESC users;
SHOW CREATE TABLE users;

-- 查看列信息
SHOW COLUMNS FROM users;`

const showTablePgsql = `-- 查看所有表
\\dt
-- 或
SELECT tablename FROM pg_tables
  WHERE schemaname = 'public';

-- 查看表结构
\\d users

-- 查看建表语句
-- PostgreSQL 没有直接等价命令
-- 可用 pg_dump --schema-only

-- 查看列信息
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users';`

const createDbMysql = `-- 创建数据库
CREATE DATABASE mydb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 删除数据库
DROP DATABASE mydb;`

const createDbPgsql = `-- 创建数据库
CREATE DATABASE mydb
  WITH ENCODING = 'UTF8'
  LC_COLLATE = 'en_US.utf8'
  LC_CTYPE = 'en_US.utf8'
  TEMPLATE = template0;

-- 删除数据库
DROP DATABASE mydb;

-- 不能删除正在连接的数据库
-- 需要先断开连接`

const userMysql = `-- 创建用户
CREATE USER 'appuser'@'%' IDENTIFIED BY 'password';

-- 授权
GRANT ALL PRIVILEGES ON mydb.*
  TO 'appuser'@'%';

-- 刷新权限
FLUSH PRIVILEGES;

-- 查看权限
SHOW GRANTS FOR 'appuser'@'%';

-- 修改密码
ALTER USER 'appuser'@'%'
  IDENTIFIED BY 'new_password';`

const userPgsql = `-- 创建用户 (角色)
CREATE ROLE appuser
  WITH LOGIN PASSWORD 'password';

-- 授权
GRANT ALL PRIVILEGES
  ON DATABASE mydb TO appuser;
GRANT ALL PRIVILEGES
  ON ALL TABLES IN SCHEMA public
  TO appuser;

-- 查看权限
\\du appuser
-- 或
SELECT * FROM pg_roles
  WHERE rolname = 'appuser';

-- 修改密码
ALTER ROLE appuser
  WITH PASSWORD 'new_password';`

const backupMysql = `-- 逻辑备份 (整个数据库)
mysqldump -u root -p mydb > mydb.sql

-- 仅备份表结构
mysqldump -u root -p --no-data mydb > schema.sql

-- 仅备份数据
mysqldump -u root -p --no-create-info mydb > data.sql

-- 恢复
mysql -u root -p mydb < mydb.sql`

const backupPgsql = `-- 逻辑备份 (整个数据库)
pg_dump mydb > mydb.sql

-- 仅备份表结构
pg_dump --schema-only mydb > schema.sql

-- 仅备份数据
pg_dump --data-only mydb > data.sql

-- 所有数据库
pg_dumpall > all.sql

-- 恢复
psql mydb < mydb.sql
-- 或
pg_restore -d mydb mydb.dump`

const processMysql = `-- 查看连接
SHOW PROCESSLIST;

-- 详细连接信息
SHOW FULL PROCESSLIST;

-- 杀掉连接
KILL 12345;

-- 查看状态
SHOW STATUS;
SHOW GLOBAL STATUS;`

const processPgsql = `-- 查看连接
SELECT * FROM pg_stat_activity;

-- 查看当前活动查询
SELECT pid, query, state,
  now() - query_start AS duration
FROM pg_stat_activity
WHERE state = 'active';

-- 杀掉连接
SELECT pg_terminate_backend(12345);

-- 取消查询 (不断开连接)
SELECT pg_cancel_backend(12345);`

const configMysql = `-- 查看配置
SHOW VARIABLES LIKE 'max_connections';
SHOW VARIABLES LIKE 'innodb%';

-- 运行时修改 (不需要重启)
SET GLOBAL max_connections = 200;

-- 配置文件
-- /etc/mysql/my.cnf
-- /etc/mysql/conf.d/*.cnf`

const configPgsql = `-- 查看配置
SHOW max_connections;
SHOW all;  -- 显示所有参数

-- 运行时修改 (不需要重启)
ALTER SYSTEM SET max_connections = 200;
SELECT pg_reload_conf();

-- 配置文件
-- postgresql.conf
-- postgresql.auto.conf (ALTER SYSTEM 写入)`

const sizeMysql = `-- 数据库大小
SELECT table_schema AS db_name,
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2)
  AS size_mb
FROM information_schema.tables
GROUP BY table_schema;

-- 表大小
SELECT table_name,
  ROUND(data_length / 1024 / 1024, 2) AS data_mb,
  ROUND(index_length / 1024 / 1024, 2) AS index_mb
FROM information_schema.tables
WHERE table_schema = 'mydb';`

const sizePgsql = `-- 数据库大小
SELECT pg_database_size('mydb');
SELECT pg_size_pretty(pg_database_size('mydb'));

-- 表大小
SELECT relname AS table_name,
  pg_size_pretty(pg_total_relation_size(relid))
  AS total_size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;

-- 索引大小
SELECT indexrelname AS index_name,
  pg_size_pretty(pg_relation_size(indexrelid))
  AS index_size
FROM pg_stat_user_indexes;`
</script>

<CodeCompare title="数据库管理" description="查看、创建、切换数据库" :mysql="showDbMysql" :postgresql="showDbPgsql" />

<CodeCompare title="查看表结构" description="查看表和列的信息" :mysql="showTableMysql" :postgresql="showTablePgsql" />

<CodeCompare title="创建数据库" description="CREATE DATABASE 的编码和排序设置" :mysql="createDbMysql" :postgresql="createDbPgsql" />

<CodeCompare title="用户与权限" description="创建用户、授权、修改密码" :mysql="userMysql" :postgresql="userPgsql" />

<CodeCompare title="备份与恢复" description="mysqldump vs pg_dump" :mysql="backupMysql" :postgresql="backupPgsql" />

<CodeCompare title="连接管理" description="查看和终止数据库连接" :mysql="processMysql" :postgresql="processPgsql" />

<CodeCompare title="配置管理" description="查看和修改数据库配置" :mysql="configMysql" :postgresql="configPgsql" />

<CodeCompare title="存储大小" description="查看数据库和表的存储大小" :mysql="sizeMysql" :postgresql="sizePgsql" />
