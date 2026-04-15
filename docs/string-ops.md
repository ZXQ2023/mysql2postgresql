# 字符串操作

MySQL 与 PostgreSQL 字符串函数的对比

<script setup>
import CodeCompare from './.vitepress/components/CodeCompare.vue'

const concatMysql = `SELECT CONCAT(first_name, ' ', last_name)
FROM users;

SELECT CONCAT_WS(', ', city, country)
FROM locations;`

const concatPgsql = `SELECT first_name || ' ' || last_name
FROM users;

-- 也支持 CONCAT
SELECT CONCAT(first_name, ' ', last_name)
FROM users;

-- CONCAT_WS 在 PostgreSQL 13+ 可用
SELECT CONCAT_WS(', ', city, country)
FROM locations;`

const substrMysql = `-- SUBSTRING 函数
SELECT SUBSTRING('Hello World', 1, 5);
-- 结果: Hello

-- LEFT / RIGHT
SELECT LEFT('Hello World', 5);  -- Hello
SELECT RIGHT('Hello World', 5); -- World`

const substrPgsql = `-- SUBSTRING 函数
SELECT SUBSTRING('Hello World', 1, 5);
-- 结果: Hello

-- LEFT / RIGHT
SELECT LEFT('Hello World', 5);  -- Hello
SELECT RIGHT('Hello World', 5); -- World

-- 也可用简写
SELECT 'Hello World'[:5];`

const regexMysql = `-- REGEXP
SELECT * FROM users
WHERE email REGEXP '^[a-z]+@';

-- REGEXP_REPLACE (MySQL 8.0+)
SELECT REGEXP_REPLACE('abc123', '[0-9]', 'X');`

const regexPgsql = `-- ~ 运算符 (匹配正则)
SELECT * FROM users
WHERE email ~ '^[a-z]+@';

-- ~* 不区分大小写
SELECT * FROM users WHERE name ~* 'john';

-- REGEXP_REPLACE
SELECT REGEXP_REPLACE('abc123', '[0-9]', 'X', 'g');`

const searchMysql = `-- LOCATE 函数
SELECT LOCATE('World', 'Hello World');
-- 结果: 7

-- INSTR 函数
SELECT INSTR('Hello World', 'World');
-- 结果: 7`

const searchPgsql = `-- POSITION 函数
SELECT POSITION('World' IN 'Hello World');
-- 结果: 7

-- STRPOS 函数
SELECT STRPOS('Hello World', 'World');
-- 结果: 7`

const caseMysql = `SELECT UPPER('hello');  -- HELLO
SELECT LOWER('HELLO');  -- hello
SELECT UCASE('hello');  -- HELLO (别名)
SELECT LCASE('HELLO');  -- hello (别名)`

const casePgsql = `SELECT UPPER('hello');  -- HELLO
SELECT LOWER('HELLO');  -- hello
-- PostgreSQL 没有 UCASE/LCASE
-- 统一使用 UPPER/LOWER

-- INITCAP: 首字母大写
SELECT INITCAP('hello world'); -- Hello World`
</script>

<CodeCompare title="字符串拼接" :mysql="concatMysql" :postgresql="concatPgsql" />

<CodeCompare title="字符串截取" :mysql="substrMysql" :postgresql="substrPgsql" />

<CodeCompare title="正则表达式" :mysql="regexMysql" :postgresql="regexPgsql" />

<CodeCompare title="字符串搜索" :mysql="searchMysql" :postgresql="searchPgsql" />

<CodeCompare title="大小写转换" :mysql="caseMysql" :postgresql="casePgsql" />
