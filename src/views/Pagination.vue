<script setup lang="ts">
import CodeCompare from '../components/CodeCompare.vue'
</script>

<template>
  <div class="space-y-5">
    <div class="pb-5 border-b border-white/[0.06] mb-2">
      <h2 class="text-xl font-bold text-white tracking-tight">分页查询</h2>
      <p class="text-sm text-zinc-400 mt-1.5">MySQL 与 PostgreSQL 分页方式的对比与优化</p>
    </div>

    <CodeCompare
      title="基础分页"
      description="LIMIT + OFFSET 分页"
      mysql="-- 每页 20 条, 第 3 页
SELECT * FROM articles
ORDER BY created_at DESC
LIMIT 20 OFFSET 40;"
      postgresql="-- 每页 20 条, 第 3 页
SELECT * FROM articles
ORDER BY created_at DESC
LIMIT 20 OFFSET 40;

-- SQL 标准写法
SELECT * FROM articles
ORDER BY created_at DESC
OFFSET 40 ROWS
FETCH NEXT 20 ROWS ONLY;"
    />

    <CodeCompare
      title="游标分页 (Keyset)"
      description="基于上一页最后一条记录的分页, 性能更好"
      mysql="-- 第一页
SELECT * FROM articles
ORDER BY created_at DESC, id DESC
LIMIT 20;

-- 下一页 (使用上一页最后一条的值)
SELECT * FROM articles
WHERE created_at < '2024-01-15 10:00:00'
   OR (created_at = '2024-01-15 10:00:00'
       AND id < 42)
ORDER BY created_at DESC, id DESC
LIMIT 20;"
      postgresql="-- 第一页
SELECT * FROM articles
ORDER BY created_at DESC, id DESC
LIMIT 20;

-- 下一页 (row 构造器比较)
SELECT * FROM articles
WHERE (created_at, id) < (
  '2024-01-15 10:00:00', 42
)
ORDER BY created_at DESC, id DESC
LIMIT 20;"
    />

    <CodeCompare
      title="分页总数统计"
      mysql="-- 使用 SQL_CALC_FOUND_ROWS (已废弃)
SELECT SQL_CALC_FOUND_ROWS *
FROM articles LIMIT 20;
SELECT FOUND_ROWS();

-- 推荐方式: 窗口函数
SELECT *, COUNT(*) OVER() AS total
FROM articles
LIMIT 20;"
      postgresql="-- 窗口函数
SELECT *, COUNT(*) OVER() AS total
FROM articles
LIMIT 20;

-- 或单独查询
SELECT COUNT(*) FROM articles;"
    />

    <CodeCompare
      title="高级: 分页 WITH CTE"
      description="使用 CTE 优化复杂分页查询"
      mysql="-- MySQL 8.0+ 支持 CTE
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
SELECT * FROM paged;"
      postgresql="WITH filtered AS (
  SELECT * FROM articles
  WHERE status = 'published'
),
paged AS (
  SELECT *, COUNT(*) OVER() AS total
  FROM filtered
  ORDER BY created_at DESC
  LIMIT 20 OFFSET 40
)
SELECT * FROM paged;"
    />
  </div>
</template>
