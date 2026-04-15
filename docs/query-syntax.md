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

const joinMysql = `-- 标准连接 (相同)
SELECT u.name, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

LEFT JOIN / RIGHT JOIN / CROSS JOIN
-- 与标准 SQL 相同

-- STRAIGHT_JOIN (MySQL 专有)
SELECT * FROM users
STRAIGHT_JOIN orders ON users.id = orders.user_id;`

const joinPgsql = `-- 标准连接 (相同)
SELECT u.name, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

LEFT JOIN / RIGHT JOIN / CROSS JOIN
-- 与标准 SQL 相同

-- NATURAL JOIN
SELECT * FROM users
NATURAL JOIN orders;

-- PostgreSQL 没有 STRAIGHT_JOIN`

const unionMysql = `-- UNION / UNION ALL
SELECT name FROM users
UNION
SELECT name FROM admins;

-- UNION ALL (不去重, 更快)
SELECT name FROM users
UNION ALL
SELECT name FROM admins;`

const unionPgsql = `-- UNION / UNION ALL
SELECT name FROM users
UNION
SELECT name FROM admins;

-- UNION ALL (不去重, 更快)
SELECT name FROM users
UNION ALL
SELECT name FROM admins;

-- INTERSECT (交集)
SELECT name FROM users
INTERSECT
SELECT name FROM admins;

-- EXCEPT (差集)
SELECT name FROM users
EXCEPT
SELECT name FROM admins;`

const insertMysql = `-- 单行插入
INSERT INTO users (name, email)
VALUES ('Alice', 'a@example.com');

-- 批量插入
INSERT INTO users (name, email)
VALUES
  ('Alice', 'a@example.com'),
  ('Bob', 'b@example.com');

-- 插入查询结果
INSERT INTO user_backup
SELECT * FROM users WHERE status = 'active';`

const insertPgsql = `-- 单行插入
INSERT INTO users (name, email)
VALUES ('Alice', 'a@example.com');

-- 批量插入
INSERT INTO users (name, email)
VALUES
  ('Alice', 'a@example.com'),
  ('Bob', 'b@example.com');

-- 插入查询结果
INSERT INTO user_backup
SELECT * FROM users WHERE status = 'active';

-- 带 RETURNING
INSERT INTO users (name)
VALUES ('Alice')
RETURNING id;`

const updateMysql = `-- 基本更新
UPDATE users SET name = 'Bob'
WHERE id = 1;

-- 多表更新
UPDATE users u
JOIN orders o ON u.id = o.user_id
SET u.status = 'active'
WHERE o.amount > 100;`

const updatePgsql = `-- 基本更新
UPDATE users SET name = 'Bob'
WHERE id = 1;

-- 多表更新 (用 FROM)
UPDATE users SET status = 'active'
FROM orders o
WHERE users.id = o.user_id
  AND o.amount > 100;

-- 带 RETURNING
UPDATE users SET name = 'Bob'
WHERE id = 1
RETURNING *;`

const deleteMysql = `-- 基本删除
DELETE FROM users WHERE id = 1;

-- 多表删除
DELETE u, o FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.status = 'banned';

-- 清空表
TRUNCATE TABLE users;`

const deletePgsql = `-- 基本删除
DELETE FROM users WHERE id = 1;

-- 使用 USING 多表删除
DELETE FROM users
USING orders o
WHERE users.id = o.user_id
  AND users.status = 'banned';

-- 带 RETURNING
DELETE FROM users WHERE id = 1
RETURNING *;

-- 清空表
TRUNCATE TABLE users;`

const explainMysql = `-- 查看执行计划
EXPLAIN SELECT * FROM users
WHERE email = 'a@example.com';

-- 详细执行计划
EXPLAIN ANALYZE SELECT * FROM users
WHERE email = 'a@example.com';

-- FORMAT=JSON (MySQL 5.7+)
EXPLAIN FORMAT=JSON
SELECT * FROM users WHERE id = 1;`

const explainPgsql = `-- 查看执行计划
EXPLAIN SELECT * FROM users
WHERE email = 'a@example.com';

-- 详细执行计划 (含实际执行时间)
EXPLAIN ANALYZE SELECT * FROM users
WHERE email = 'a@example.com';

-- JSON 格式
EXPLAIN (FORMAT JSON) SELECT * FROM users
WHERE id = 1;

-- 更多选项
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT * FROM users WHERE id = 1;`
</script>

<CodeCompare title="字符串引号" description="MySQL 支持单引号和双引号, PostgreSQL 严格区分" :mysql="quotesMysql" :postgresql="quotesPgsql">
::: danger 引号差异是迁移最常见的坑
- MySQL 中双引号 `"hello"` 可以用于字符串，但 PostgreSQL 中双引号是**标识符**引用（表名、列名）
- PostgreSQL 中字符串**必须**用单引号 `'hello'`
- 如果表名/列名是保留字或含大写，PostgreSQL 中用双引号 `"TableName"` 包裹
:::
</CodeCompare>

<CodeCompare title="LIMIT 与 OFFSET" description="分页语法的差异" :mysql="limitMysql" :postgresql="limitPgsql" />

<CodeCompare title="IFNULL vs COALESCE" description="空值处理函数" :mysql="ifnullMysql" :postgresql="ifnullPgsql" />

<CodeCompare title="GROUP_CONCAT vs STRING_AGG" description="行转字符串聚合" :mysql="groupConcatMysql" :postgresql="groupConcatPgsql">
::: warning 注意参数顺序不同
MySQL 的 `GROUP_CONCAT(name SEPARATOR ', ')` vs PostgreSQL 的 `STRING_AGG(name, ', ')`。PostgreSQL 中分隔符是第二个参数，且 `ORDER BY` 写在 `STRING_AGG` 内部。
:::
</CodeCompare>

<CodeCompare title="类型转换" :mysql="castMysql" :postgresql="castPgsql">
::: tip PostgreSQL 的 :: 简写
`'123'::INTEGER` 是 PostgreSQL 特有的类型转换简写，等价于 `CAST('123' AS INTEGER)`。PostgreSQL 的类型转换比 MySQL 严格得多，隐式转换较少，建议养成显式转换的习惯。
:::
</CodeCompare>

<CodeCompare title="JOIN 连接" description="连接查询语法的差异" :mysql="joinMysql" :postgresql="joinPgsql" />

<CodeCompare title="集合操作" description="UNION / INTERSECT / EXCEPT" :mysql="unionMysql" :postgresql="unionPgsql" />

<CodeCompare title="INSERT 语句" description="插入数据的语法差异" :mysql="insertMysql" :postgresql="insertPgsql">
::: info PostgreSQL 的 RETURNING 子句
PostgreSQL 支持 `RETURNING` 子句，可以在 `INSERT`/`UPDATE`/`DELETE` 后直接返回受影响的行数据，无需额外查询。这是 MySQL 不具备的便利功能。
:::
</CodeCompare>

<CodeCompare title="UPDATE 语句" description="更新数据的语法差异" :mysql="updateMysql" :postgresql="updatePgsql">
::: warning 多表 UPDATE 语法不同
MySQL 的 `UPDATE ... JOIN ... SET` 在 PostgreSQL 中要改写为 `UPDATE ... FROM ... WHERE`。注意 PostgreSQL 中 WHERE 条件不能遗漏，否则会更新所有行。
:::
</CodeCompare>

<CodeCompare title="DELETE 语句" description="删除数据的语法差异" :mysql="deleteMysql" :postgresql="deletePgsql">
::: warning 多表 DELETE 用 USING 代替 JOIN
MySQL 的 `DELETE u, o FROM users u JOIN orders o ...` 在 PostgreSQL 中要改写为 `DELETE FROM users USING orders o WHERE ...`。注意 PostgreSQL 不支持同时删除多张表的数据。
:::
</CodeCompare>

<CodeCompare title="EXPLAIN 执行计划" description="查看查询执行计划" :mysql="explainMysql" :postgresql="explainPgsql" />
