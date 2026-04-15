# 事务与锁

MySQL 与 PostgreSQL 事务处理和锁机制的差异

<script setup>
import CodeCompare from './.vitepress/components/CodeCompare.vue'

const basicMysql = `-- 开始事务
START TRANSACTION;
-- 或
BEGIN;

-- 提交
COMMIT;

-- 回滚
ROLLBACK;

-- 设置保存点
SAVEPOINT sp1;
ROLLBACK TO SAVEPOINT sp1;
RELEASE SAVEPOINT sp1;`

const basicPgsql = `-- 开始事务
START TRANSACTION;
-- 或
BEGIN;

-- 提交
COMMIT;

-- 回滚
ROLLBACK;

-- 设置保存点
SAVEPOINT sp1;
ROLLBACK TO SAVEPOINT sp1;
RELEASE SAVEPOINT sp1;`

const isolationMysql = `-- 查看隔离级别
SELECT @@transaction_isolation;

-- 设置隔离级别
SET TRANSACTION ISOLATION LEVEL
  READ COMMITTED;

-- 全局设置
SET GLOBAL transaction_isolation =
  'READ-COMMITTED';

-- MySQL 支持的隔离级别:
-- READ UNCOMMITTED
-- READ COMMITTED
-- REPEATABLE READ (默认)
-- SERIALIZABLE`

const isolationPgsql = `-- 查看隔离级别
SHOW transaction_isolation;

-- 设置隔离级别
SET TRANSACTION ISOLATION LEVEL
  READ COMMITTED;

-- 当前会话设置
SET SESSION transaction_isolation =
  'read committed';

-- PostgreSQL 支持的隔离级别:
-- READ COMMITTED (默认)
-- REPEATABLE READ
-- SERIALIZABLE`

const lockMysql = `-- 行锁 (排他锁)
SELECT * FROM users WHERE id = 1
  FOR UPDATE;

-- 行锁 (共享锁)
SELECT * FROM users WHERE id = 1
  FOR SHARE;

-- NOWAIT (MySQL 8.0+)
SELECT * FROM users WHERE id = 1
  FOR UPDATE NOWAIT;

-- SKIP LOCKED (MySQL 8.0+)
SELECT * FROM users WHERE id = 1
  FOR UPDATE SKIP LOCKED;`

const lockPgsql = `-- 行锁 (排他锁)
SELECT * FROM users WHERE id = 1
  FOR UPDATE;

-- 行锁 (共享锁)
SELECT * FROM users WHERE id = 1
  FOR SHARE;

-- NOWAIT
SELECT * FROM users WHERE id = 1
  FOR UPDATE NOWAIT;

-- SKIP LOCKED
SELECT * FROM users WHERE id = 1
  FOR UPDATE SKIP LOCKED;

-- FOR NO KEY UPDATE (更轻量的锁)
SELECT * FROM users WHERE id = 1
  FOR NO KEY UPDATE;`

const tableLockMysql = `-- 表锁
LOCK TABLES users READ;
LOCK TABLES users WRITE;
UNLOCK TABLES;

-- 全局读锁
FLUSH TABLES WITH READ LOCK;
UNLOCK TABLES;`

const tableLockPgsql = `-- 表锁
LOCK TABLE users IN SHARE MODE;
LOCK TABLE users IN EXCLUSIVE MODE;
LOCK TABLE users IN ACCESS EXCLUSIVE MODE;

-- PostgreSQL 没有全局读锁
-- 通常用 pg_dump --consistent 实现

-- 咨询锁 (应用级锁)
SELECT pg_advisory_lock(12345);
SELECT pg_advisory_unlock(12345);`

const autoCommitMysql = `-- 查看自动提交
SELECT @@autocommit;

-- 关闭自动提交
SET autocommit = 0;

-- 开启自动提交
SET autocommit = 1;`

const autoCommitPgsql = `-- 查看自动提交
SHOW autocommit;

-- 关闭自动提交
SET autocommit = off;

-- 开启自动提交
SET autocommit = on;`

const deadlockMysql = `-- 查看最近死锁
SHOW ENGINE INNODB STATUS;

-- 死锁检测
SET GLOBAL innodb_deadlock_detect = ON;

-- 锁等待超时 (秒)
SET innodb_lock_wait_timeout = 50;`

const deadlockPgsql = `-- 查看最近死锁 (需设置)
SET log_lock_waits = on;

-- 查看锁等待
SELECT * FROM pg_locks
WHERE NOT granted;

-- 死锁超时 (毫秒)
SET deadlock_timeout = '1s';

-- 锁等待超时
SET lock_timeout = '10s';`
</script>

<CodeCompare title="基本事务" description="BEGIN / COMMIT / ROLLBACK / SAVEPOINT" :mysql="basicMysql" :postgresql="basicPgsql" />

<CodeCompare title="隔离级别" description="事务隔离级别的查看和设置" :mysql="isolationMysql" :postgresql="isolationPgsql" />

<CodeCompare title="行锁" description="FOR UPDATE / FOR SHARE 等行级锁" :mysql="lockMysql" :postgresql="lockPgsql" />

<CodeCompare title="表锁" description="表级别的锁定机制" :mysql="tableLockMysql" :postgresql="tableLockPgsql" />

<CodeCompare title="自动提交" :mysql="autoCommitMysql" :postgresql="autoCommitPgsql" />

<CodeCompare title="死锁处理" description="死锁检测与锁等待超时" :mysql="deadlockMysql" :postgresql="deadlockPgsql" />
