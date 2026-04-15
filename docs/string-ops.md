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

<CodeCompare title="字符串拼接" :mysql="concatMysql" :postgresql="concatPgsql">
::: tip PostgreSQL 推荐使用 || 拼接
PostgreSQL 中 `||` 是标准的字符串拼接运算符。MySQL 中 `||` 默认是逻辑 OR（需设置 `PIPES_AS_CONCAT` 模式才变为拼接）。迁移时建议统一使用 `||` 或 `CONCAT()` 函数。
:::
</CodeCompare>

<CodeCompare title="字符串截取" :mysql="substrMysql" :postgresql="substrPgsql" />

<CodeCompare title="正则表达式" :mysql="regexMysql" :postgresql="regexPgsql">
::: info 正则语法差异
PostgreSQL 使用 `~` 运算符进行正则匹配（`~` 区分大小写，`~*` 不区分），MySQL 使用 `REGEXP` 关键字。此外，PostgreSQL 的 `REGEXP_REPLACE` 默认只替换第一个匹配，需要加 `'g'` 标志才能全局替换。
:::
</CodeCompare>

<CodeCompare title="字符串搜索" :mysql="searchMysql" :postgresql="searchPgsql" />

<CodeCompare title="大小写转换" :mysql="caseMysql" :postgresql="casePgsql">
::: tip PostgreSQL 独有的 INITCAP
`INITCAP('hello world')` 返回 `Hello World`，将每个单词首字母大写。MySQL 没有对应函数，需要用 `CONCAT(UPPER(SUBSTRING(...))), ...)` 组合实现。
:::
</CodeCompare>
