# JSON 操作

MySQL 与 PostgreSQL JSON 处理能力的对比

<script setup>
import CodeCompare from './.vitepress/components/CodeCompare.vue'

const defMysql = `CREATE TABLE products (
    id INT PRIMARY KEY,
    data JSON,
    attrs JSON
);`

const defPgsql = `CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  data JSONB,    -- 推荐使用 JSONB
  attrs JSONB    -- 二进制存储, 支持索引
);`

const extractMysql = `-- -> 返回 JSON 类型
SELECT data->>'$.name' FROM products;

-- ->> 返回文本类型
SELECT data->>'$.price' FROM products;

-- JSON_EXTRACT 函数
SELECT JSON_EXTRACT(data, '$.name')
FROM products;`

const extractPgsql = `-- -> 返回 JSON 类型
SELECT data->'name' FROM products;

-- ->> 返回文本类型
SELECT data->>'name' FROM products;

-- 路径语法不同!
SELECT data#>'{address,city}'
FROM products;`

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

const modifyMysql = `-- JSON_SET: 设置值
SELECT JSON_SET(data, '$.price', 99.99)
FROM products;

-- JSON_INSERT: 插入 (不覆盖)
SELECT JSON_INSERT(data, '$.new_field', 'value')
FROM products;

-- JSON_REMOVE: 删除
SELECT JSON_REMOVE(data, '$.temp')
FROM products;`

const modifyPgsql = `-- JSONB_SET: 设置值
SELECT JSONB_SET(data, '{price}', '99.99')
FROM products;

-- || 合并运算符
SELECT data || '{"new_field": "value"}'
FROM products;

-- - 删除键
SELECT data - 'temp'
FROM products;`

const indexMysql = `-- MySQL 8.0+ 多值索引
CREATE INDEX idx_tags
ON products (
  (CAST(data->'$.tags' AS CHAR ARRAY))
);`

const indexPgsql = `-- GIN 索引 (推荐)
CREATE INDEX idx_data
ON products USING GIN (data);

-- 特定路径索引
CREATE INDEX idx_category
ON products ((data->>'category'));`
</script>

<CodeCompare title="JSON 列定义" :mysql="defMysql" :postgresql="defPgsql">
::: tip 优先使用 JSONB 而非 JSON
PostgreSQL 的 `JSONB` 以二进制格式存储，查询时不需要重新解析，支持 GIN 索引，性能远优于 `JSON` 类型。除非有特殊需求（如保留键顺序），迁移时一律建议使用 `JSONB`。
:::
</CodeCompare>

<CodeCompare title="提取 JSON 字段" :mysql="extractMysql" :postgresql="extractPgsql">
::: warning JSON 路径语法不同
- MySQL 使用 `$.name` 的 dollar 符号路径语法
- PostgreSQL 直接使用 `'name'` 或 `'{key1,key2}'` 的路径语法

这是 JSON 操作迁移中最容易出错的地方。
:::
</CodeCompare>

<CodeCompare title="JSON 查询条件" :mysql="queryMysql" :postgresql="queryPgsql" />

<CodeCompare title="修改 JSON" :mysql="modifyMysql" :postgresql="modifyPgsql" />

<CodeCompare title="JSON 索引" :mysql="indexMysql" :postgresql="indexPgsql">
::: info GIN 索引让 JSONB 查询飞起来
在 PostgreSQL 中为 `JSONB` 列创建 GIN 索引后，`@>`（包含）、`?`（键存在）等操作符可以走索引扫描，查询性能可提升数十倍。MySQL 的 JSON 索引支持相对有限。
:::
</CodeCompare>
