# 分页查询

MySQL 与 PostgreSQL 分页方式的对比与优化

<script setup>
import CodeCompare from './.vitepress/components/CodeCompare.vue'

const basicMysql = `-- 每页 20 条, 第 3 页
SELECT * FROM articles
ORDER BY created_at DESC
LIMIT 20 OFFSET 40;`

const basicPgsql = `-- 每页 20 条, 第 3 页
SELECT * FROM articles
ORDER BY created_at DESC
LIMIT 20 OFFSET 40;

-- SQL 标准写法
SELECT * FROM articles
ORDER BY created_at DESC
OFFSET 40 ROWS
FETCH NEXT 20 ROWS ONLY;`

const keysetMysql = `-- 第一页
SELECT * FROM articles
ORDER BY created_at DESC, id DESC
LIMIT 20;

-- 下一页 (使用上一页最后一条的值)
SELECT * FROM articles
WHERE created_at < '2024-01-15 10:00:00'
   OR (created_at = '2024-01-15 10:00:00'
       AND id < 42)
ORDER BY created_at DESC, id DESC
LIMIT 20;`

const keysetPgsql = `-- 第一页
SELECT * FROM articles
ORDER BY created_at DESC, id DESC
LIMIT 20;

-- 下一页 (row 构造器比较)
SELECT * FROM articles
WHERE (created_at, id) < (
  '2024-01-15 10:00:00', 42
)
ORDER BY created_at DESC, id DESC
LIMIT 20;`

const countMysql = `-- 使用 SQL_CALC_FOUND_ROWS (已废弃)
SELECT SQL_CALC_FOUND_ROWS *
FROM articles LIMIT 20;
SELECT FOUND_ROWS();

-- 推荐方式: 窗口函数
SELECT *, COUNT(*) OVER() AS total
FROM articles
LIMIT 20;`

const countPgsql = `-- 窗口函数
SELECT *, COUNT(*) OVER() AS total
FROM articles
LIMIT 20;

-- 或单独查询
SELECT COUNT(*) FROM articles;`

const cteMysql = `-- MySQL 8.0+ 支持 CTE
WITH filtered AS (
  SELECT * FROM articles
  WHERE status = 'published'
),
paged AS (
  SELECT *, COUNT(*) OVER() AS total
  FROM filtered
  ORDER BY created_at DESC
  LIMIT 20 OFFSET 40
)
SELECT * FROM paged;`

const ctePgsql = `WITH filtered AS (
  SELECT * FROM articles
  WHERE status = 'published'
),
paged AS (
  SELECT *, COUNT(*) OVER() AS total
  FROM filtered
  ORDER BY created_at DESC
  LIMIT 20 OFFSET 40
)
SELECT * FROM paged;`
</script>

<CodeCompare title="基础分页" description="LIMIT + OFFSET 分页" :mysql="basicMysql" :postgresql="basicPgsql">
::: warning OFFSET 分页在大数据量时性能差
`LIMIT 20 OFFSET 1000000` 需要先扫描 1000020 行再丢弃前 1000000 行，数据量越大越慢。生产环境建议使用游标分页（Keyset Pagination）。
:::
</CodeCompare>

<CodeCompare title="游标分页 (Keyset)" description="基于上一页最后一条记录的分页, 性能更好" :mysql="keysetMysql" :postgresql="keysetPgsql">
::: tip PostgreSQL 的 row 构造器比较更简洁
`WHERE (created_at, id) < ('2024-01-15', 42)` 是 PostgreSQL 特有的 row 构造器比较语法，比 MySQL 的多条件 OR 写法简洁得多，且能利用索引。
:::
</CodeCompare>

<CodeCompare title="分页总数统计" :mysql="countMysql" :postgresql="countPgsql">
::: warning SQL_CALC_FOUND_ROWS 已废弃
MySQL 的 `SQL_CALC_FOUND_ROWS` + `FOUND_ROWS()` 在 MySQL 8.0.17 中已被标记为废弃，官方推荐使用 `COUNT(*) OVER()` 窗口函数替代。
:::
</CodeCompare>

<CodeCompare title="高级: 分页 WITH CTE" description="使用 CTE 优化复杂分页查询" :mysql="cteMysql" :postgresql="ctePgsql" />
