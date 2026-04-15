<script setup lang="ts">
import CodeCompare from '../components/CodeCompare.vue'

const queryMysql = `SELECT * FROM products
WHERE data->>'$.category' = 'electronics';

SELECT * FROM products
WHERE JSON_CONTAINS(data->'$.tags', '"sale"');`

const queryPgsql = `SELECT * FROM products
WHERE data->>'category' = 'electronics';

SELECT * FROM products
WHERE data->'tags' ? 'sale';

-- @> 包含运算符 (可用索引)
SELECT * FROM products
WHERE data @> '{"category": "electronics"}';`

const modifyPgsql = `-- JSONB_SET: 设置值
SELECT JSONB_SET(data, '{price}', '99.99')
FROM products;

-- || 合并运算符
SELECT data || '{"new_field": "value"}'
FROM products;

-- - 删除键
SELECT data - 'temp'
FROM products;`
</script>

<template>
  <div class="space-y-5">
    <div class="pb-5 border-b border-white/[0.06] mb-2">
      <h2 class="text-xl font-bold text-white tracking-tight">JSON 操作</h2>
      <p class="text-sm text-zinc-400 mt-1.5">MySQL 与 PostgreSQL JSON 处理能力的对比</p>
    </div>

    <CodeCompare
      title="JSON 列定义"
      mysql="CREATE TABLE products (
  id INT PRIMARY KEY,
  data JSON,
  attrs JSON
);"
      postgresql="CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  data JSONB,    -- 推荐使用 JSONB
  attrs JSONB    -- 二进制存储, 支持索引
);"
    />

    <CodeCompare
      title="提取 JSON 字段"
      mysql="-- -> 返回 JSON 类型
SELECT data->>'$.name' FROM products;

-- ->> 返回文本类型
SELECT data->>'$.price' FROM products;

-- JSON_EXTRACT 函数
SELECT JSON_EXTRACT(data, '$.name')
FROM products;"
      postgresql="-- -> 返回 JSON 类型
SELECT data->'name' FROM products;

-- ->> 返回文本类型
SELECT data->>'name' FROM products;

-- 路径语法不同!
SELECT data#>'{address,city}'
FROM products;"
    />

    <CodeCompare
      title="JSON 查询条件"
      :mysql="queryMysql"
      :postgresql="queryPgsql"
    />

    <CodeCompare
      title="修改 JSON"
      mysql="-- JSON_SET: 设置值
SELECT JSON_SET(data, '$.price', 99.99)
FROM products;

-- JSON_INSERT: 插入 (不覆盖)
SELECT JSON_INSERT(data, '$.new_field', 'value')
FROM products;

-- JSON_REMOVE: 删除
SELECT JSON_REMOVE(data, '$.temp')
FROM products;"
      :postgresql="modifyPgsql"
    />

    <CodeCompare
      title="JSON 索引"
      mysql="-- MySQL 8.0+ 多值索引
CREATE INDEX idx_tags
ON products (
  (CAST(data->'$.tags' AS CHAR ARRAY))
);"
      postgresql="-- GIN 索引 (推荐)
CREATE INDEX idx_data
ON products USING GIN (data);

-- 特定路径索引
CREATE INDEX idx_category
ON products ((data->>'category'));"
    />
  </div>
</template>
