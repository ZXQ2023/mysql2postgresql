# 基本查询语法差异

MySQL 与 PostgreSQL 在查询语法上的主要区别

<script setup>
import CodeCompare from './.vitepress/components/CodeCompare.vue'

const quotesMysql = `-- 单引号: 字符串
SELECT 'hello';

-- 双引号: 也可用于字符串
SELECT "hello";

-- 反引号: 标识符
SELECT \`name\` FROM \`users\`;`

const quotesPgsql = `-- 单引号: 字符串 (唯一正确方式)
SELECT 'hello';

-- 双引号: 标识符 (保留大小写)
SELECT "name" FROM "Users";

-- 不用引号: 自动转小写
SELECT name FROM users;`

const limitMysql = `-- LIMIT OFFSET 写法
SELECT * FROM users
LIMIT 10 OFFSET 20;

-- 简写形式
SELECT * FROM users LIMIT 10, 20;`

const limitPgsql = `-- LIMIT OFFSET 写法 (相同)
SELECT * FROM users
LIMIT 10 OFFSET 20;

-- 标准写法
SELECT * FROM users
OFFSET 20 ROWS
FETCH NEXT 10 ROWS ONLY;`

const ifnullMysql = `-- MySQL 专用
SELECT IFNULL(name, 'N/A') FROM users;

-- 也支持 COALESCE
SELECT COALESCE(name, 'N/A') FROM users;`

const ifnullPgsql = `-- 使用 COALESCE (标准 SQL)
SELECT COALESCE(name, 'N/A') FROM users;

-- 也可以用 CASE
SELECT CASE
  WHEN name IS NULL THEN 'N/A'
  ELSE name
END FROM users;`

const groupConcatMysql = `SELECT
  department,
  GROUP_CONCAT(name SEPARATOR ', ') AS names
FROM employees
GROUP BY department;`

const groupConcatPgsql = `SELECT
  department,
  STRING_AGG(name, ', ') AS names
FROM employees
GROUP BY department;

-- 注意参数顺序不同!`

const castMysql = `-- CAST 函数
SELECT CAST('123' AS SIGNED);
SELECT CAST('2024-01-01' AS DATE);

-- 隐式转换较宽松
SELECT '123' + 0;  -- 结果: 123`

const castPgsql = `-- CAST 函数
SELECT CAST('123' AS INTEGER);
SELECT '2024-01-01'::DATE;

-- :: 是 PostgreSQL 专有简写
SELECT '123'::INTEGER;

-- 隐式转换更严格
SELECT '123'::INTEGER + 0;  -- 必须显式转换`
</script>

<CodeCompare title="字符串引号" description="MySQL 支持单引号和双引号, PostgreSQL 严格区分" :mysql="quotesMysql" :postgresql="quotesPgsql" />

<CodeCompare title="LIMIT 与 OFFSET" description="分页语法的差异" :mysql="limitMysql" :postgresql="limitPgsql" />

<CodeCompare title="IFNULL vs COALESCE" description="空值处理函数" :mysql="ifnullMysql" :postgresql="ifnullPgsql" />

<CodeCompare title="GROUP_CONCAT vs STRING_AGG" description="行转字符串聚合" :mysql="groupConcatMysql" :postgresql="groupConcatPgsql" />

<CodeCompare title="类型转换" :mysql="castMysql" :postgresql="castPgsql" />
