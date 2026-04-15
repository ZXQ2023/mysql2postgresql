<script setup lang="ts">
import CodeCompare from '../components/CodeCompare.vue'
</script>

<template>
  <div class="space-y-5">
    <div class="pb-5 border-b border-white/[0.06] mb-2">
      <h2 class="text-xl font-bold text-white tracking-tight">字符串操作</h2>
      <p class="text-sm text-zinc-400 mt-1.5">MySQL 与 PostgreSQL 字符串函数的对比</p>
    </div>

    <CodeCompare
      title="字符串拼接"
      mysql="SELECT CONCAT(first_name, ' ', last_name)
FROM users;

SELECT CONCAT_WS(', ', city, country)
FROM locations;"
      postgresql="SELECT first_name || ' ' || last_name
FROM users;

-- 也支持 CONCAT
SELECT CONCAT(first_name, ' ', last_name)
FROM users;

-- CONCAT_WS 在 PostgreSQL 13+ 可用
SELECT CONCAT_WS(', ', city, country)
FROM locations;"
    />

    <CodeCompare
      title="字符串截取"
      mysql="-- SUBSTRING 函数
SELECT SUBSTRING('Hello World', 1, 5);
-- 结果: Hello

-- LEFT / RIGHT
SELECT LEFT('Hello World', 5);  -- Hello
SELECT RIGHT('Hello World', 5); -- World"
      postgresql="-- SUBSTRING 函数
SELECT SUBSTRING('Hello World', 1, 5);
-- 结果: Hello

-- LEFT / RIGHT
SELECT LEFT('Hello World', 5);  -- Hello
SELECT RIGHT('Hello World', 5); -- World

-- 也可用简写
SELECT 'Hello World'[:5];"
    />

    <CodeCompare
      title="正则表达式"
      mysql="-- REGEXP
SELECT * FROM users
WHERE email REGEXP '^[a-z]+@';

-- REGEXP_REPLACE (MySQL 8.0+)
SELECT REGEXP_REPLACE('abc123', '[0-9]', 'X');"
      postgresql="-- ~ 运算符 (匹配正则)
SELECT * FROM users
WHERE email ~ '^[a-z]+@';

-- ~* 不区分大小写
SELECT * FROM users WHERE name ~* 'john';

-- REGEXP_REPLACE
SELECT REGEXP_REPLACE('abc123', '[0-9]', 'X', 'g');"
    />

    <CodeCompare
      title="字符串搜索"
      mysql="-- LOCATE 函数
SELECT LOCATE('World', 'Hello World');
-- 结果: 7

-- INSTR 函数
SELECT INSTR('Hello World', 'World');
-- 结果: 7"
      postgresql="-- POSITION 函数
SELECT POSITION('World' IN 'Hello World');
-- 结果: 7

-- STRPOS 函数
SELECT STRPOS('Hello World', 'World');
-- 结果: 7"
    />

    <CodeCompare
      title="大小写转换"
      mysql="SELECT UPPER('hello');  -- HELLO
SELECT LOWER('HELLO');  -- hello
SELECT UCASE('hello');  -- HELLO (别名)
SELECT LCASE('HELLO');  -- hello (别名)"
      postgresql="SELECT UPPER('hello');  -- HELLO
SELECT LOWER('HELLO');  -- hello
-- PostgreSQL 没有 UCASE/LCASE
-- 统一使用 UPPER/LOWER

-- INITCAP: 首字母大写
SELECT INITCAP('hello world'); -- Hello World"
    />
  </div>
</template>
