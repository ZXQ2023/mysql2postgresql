# 运算符与表达式

MySQL 与 PostgreSQL 运算符的差异

<script setup>
import CodeCompare from './.vitepress/components/CodeCompare.vue'

const comparisonMysql = `-- 等于 / 不等于
SELECT * FROM users WHERE age = 18;
SELECT * FROM users WHERE age != 18;
SELECT * FROM users WHERE age <> 18;

-- 安全等于 (NULL 安全)
SELECT NULL <=> NULL;  -- 1
SELECT 1 <=> 1;        -- 1`

const comparisonPgsql = `-- 等于 / 不等于
SELECT * FROM users WHERE age = 18;
SELECT * FROM users WHERE age != 18;
SELECT * FROM users WHERE age <> 18;

-- NULL 安全比较 (IS NOT DISTINCT FROM)
SELECT NULL IS NOT DISTINCT FROM NULL; -- true
SELECT 1 IS NOT DISTINCT FROM 1;       -- true`

const logicalMysql = `-- AND / OR / NOT
SELECT * FROM users
WHERE age > 18 AND status = 'active';

SELECT * FROM users
WHERE age > 18 OR age < 10;

-- 运算符别名
SELECT * FROM users WHERE NOT (age > 18);`

const logicalPgsql = `-- AND / OR / NOT
SELECT * FROM users
WHERE age > 18 AND status = 'active';

SELECT * FROM users
WHERE age > 18 OR age < 10;

-- PostgreSQL 不支持 && || ! 作为逻辑运算符
-- 必须使用 AND OR NOT 关键字`

const betweenMysql = `-- BETWEEN (包含边界)
SELECT * FROM users
WHERE age BETWEEN 18 AND 30;

-- NOT BETWEEN
SELECT * FROM users
WHERE age NOT BETWEEN 18 AND 30;`

const betweenPgsql = `-- BETWEEN (包含边界)
SELECT * FROM users
WHERE age BETWEEN 18 AND 30;

-- NOT BETWEEN
SELECT * FROM users
WHERE age NOT BETWEEN 18 AND 30;

-- BETWEEN SYMMETRIC (自动排序)
SELECT * FROM users
WHERE age BETWEEN SYMMETRIC 30 AND 18;`

const inOpMysql = `-- IN 列表
SELECT * FROM users
WHERE status IN ('active', 'pending');

-- NOT IN
SELECT * FROM users
WHERE status NOT IN ('banned');

-- 子查询
SELECT * FROM users
WHERE id IN (SELECT user_id FROM orders);`

const inOpPgsql = `-- IN 列表
SELECT * FROM users
WHERE status IN ('active', 'pending');

-- NOT IN
SELECT * FROM users
WHERE status NOT IN ('banned');

-- 子查询
SELECT * FROM users
WHERE id IN (SELECT user_id FROM orders);`

const likeMysql = `-- LIKE 模糊匹配
SELECT * FROM users
WHERE name LIKE 'John%';

-- 不区分大小写
SELECT * FROM users
WHERE name ILIKE 'john%';

-- 注意: MySQL 不原生支持 ILIKE
-- 可用 LOWER() 变通:
SELECT * FROM users
WHERE LOWER(name) LIKE LOWER('John%');`

const likePgsql = `-- LIKE 区分大小写
SELECT * FROM users
WHERE name LIKE 'John%';

-- ILIKE 不区分大小写
SELECT * FROM users
WHERE name ILIKE 'john%';

-- SIMILAR TO (正则模式匹配)
SELECT * FROM users
WHERE name SIMILAR TO 'John(B|n)%';`

const isMysql = `-- IS NULL / IS NOT NULL
SELECT * FROM users WHERE email IS NULL;
SELECT * FROM users WHERE email IS NOT NULL;`

const isPgsql = `-- IS NULL / IS NOT NULL
SELECT * FROM users WHERE email IS NULL;
SELECT * FROM users WHERE email IS NOT NULL;

-- IS DISTINCT FROM
SELECT * FROM users
WHERE age IS DISTINCT FROM 18;

-- IS NOT DISTINCT FROM
SELECT * FROM users
WHERE age IS NOT DISTINCT FROM 18;`

const concatOpMysql = `-- 字符串拼接运算符
SELECT 'Hello' || ' World';
-- MySQL: 结果为 0 (|| 是 OR)
-- 需要设置 PIPES_AS_CONCAT SQL 模式

-- 用 CONCAT 函数
SELECT CONCAT('Hello', ' World');`

const concatOpPgsql = `-- 字符串拼接运算符
SELECT 'Hello' || ' World';
-- PostgreSQL: 'Hello World'

-- 也支持 CONCAT
SELECT CONCAT('Hello', ' World');`

const divisionMysql = `-- 整数除法
SELECT 7 / 2;     -- 3 (整数)
SELECT 7.0 / 2;   -- 3.5000 (浮点)

-- 取模
SELECT 7 % 2;     -- 1
SELECT MOD(7, 2);  -- 1`

const divisionPgsql = `-- 整数除法
SELECT 7 / 2;     -- 3 (截断为整数)
SELECT 7.0 / 2;   -- 3.5 (浮点)

-- 取模
SELECT 7 % 2;     -- 1
SELECT MOD(7, 2);  -- 1`
</script>

<CodeCompare title="比较运算符" description="等于、不等于、NULL 安全比较" :mysql="comparisonMysql" :postgresql="comparisonPgsql" />

<CodeCompare title="逻辑运算符" :mysql="logicalMysql" :postgresql="logicalPgsql" />

<CodeCompare title="BETWEEN" :mysql="betweenMysql" :postgresql="betweenPgsql" />

<CodeCompare title="IN / NOT IN" :mysql="inOpMysql" :postgresql="inOpPgsql" />

<CodeCompare title="LIKE / 模式匹配" description="模糊匹配及大小写敏感" :mysql="likeMysql" :postgresql="likePgsql" />

<CodeCompare title="IS 运算符" description="IS NULL / IS DISTINCT FROM" :mysql="isMysql" :postgresql="isPgsql" />

<CodeCompare title="字符串拼接运算符" description="|| 运算符的行为差异" :mysql="concatOpMysql" :postgresql="concatOpPgsql" />

<CodeCompare title="算术运算符" description="除法和取模" :mysql="divisionMysql" :postgresql="divisionPgsql" />
