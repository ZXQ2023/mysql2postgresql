# 日期/时间函数

MySQL 与 PostgreSQL 日期时间处理的差异

<script setup>
import CodeCompare from './.vitepress/components/CodeCompare.vue'

const nowMysql = `SELECT NOW();          -- 2024-01-15 10:30:00
SELECT CURDATE();      -- 2024-01-15
SELECT CURTIME();      -- 10:30:00
SELECT SYSDATE();      -- 实时时间`

const nowPgsql = `SELECT NOW();          -- 2024-01-15 10:30:00+08
SELECT CURRENT_DATE;   -- 2024-01-15
SELECT CURRENT_TIME;   -- 10:30:00+08
SELECT CLOCK_TIMESTAMP(); -- 实时时间`

const addMysql = `-- DATE_ADD / DATE_SUB
SELECT DATE_ADD(NOW(), INTERVAL 7 DAY);
SELECT DATE_SUB(NOW(), INTERVAL 1 MONTH);

-- 简写
SELECT NOW() + INTERVAL 7 DAY;`

const addPgsql = `-- INTERVAL 语法
SELECT NOW() + INTERVAL '7 days';
SELECT NOW() - INTERVAL '1 month';

-- 更灵活的写法
SELECT NOW() + INTERVAL '1 year 2 months 3 days';`

const formatMysql = `SELECT DATE_FORMAT(NOW(), '%Y-%m-%d');
-- 2024-01-15

SELECT DATE_FORMAT(NOW(), '%Y年%m月%d日');
-- 2024年01月15日`

const formatPgsql = `SELECT TO_CHAR(NOW(), 'YYYY-MM-DD');
-- 2024-01-15

SELECT TO_CHAR(NOW(), 'YYYY年MM月DD日');
-- 2024年01月15日

-- 注意: 格式符完全不同!`

const extractMysql = `SELECT YEAR(NOW());     -- 2024
SELECT MONTH(NOW());    -- 1
SELECT DAY(NOW());      -- 15
SELECT HOUR(NOW());     -- 10
SELECT EXTRACT(YEAR FROM NOW());`

const extractPgsql = `SELECT EXTRACT(YEAR FROM NOW());   -- 2024
SELECT EXTRACT(MONTH FROM NOW());  -- 1
SELECT EXTRACT(DAY FROM NOW());    -- 15
SELECT EXTRACT(HOUR FROM NOW());   -- 10

-- 也支持简写
SELECT DATE_PART('year', NOW());`

const diffMysql = `-- DATEDIFF (天数差)
SELECT DATEDIFF('2024-12-31', '2024-01-01');
-- 365

-- TIMESTAMPDIFF (指定单位)
SELECT TIMESTAMPDIFF(MONTH, '2024-01-01', '2024-12-31');`

const diffPgsql = `-- 直接减法 (天数)
SELECT '2024-12-31'::DATE - '2024-01-01'::DATE;
-- 365

-- AGE 函数
SELECT AGE('2024-12-31', '2024-01-01');
-- 11 mons 30 days

-- EXTRACT + EPOCH
SELECT EXTRACT(
  DAY FROM '2024-12-31' - '2024-01-01'
);`
</script>

<CodeCompare title="获取当前时间" :mysql="nowMysql" :postgresql="nowPgsql">
::: warning PostgreSQL 时间函数带时区
PostgreSQL 的 `NOW()` 返回值带时区偏移（如 `+08`），而 MySQL 不带。如果应用不处理时区，迁移后可能出现时间解析问题。建议统一使用 `TIMESTAMPTZ` 类型。
:::
</CodeCompare>

<CodeCompare title="日期加减" :mysql="addMysql" :postgresql="addPgsql" />

<CodeCompare title="日期格式化" :mysql="formatMysql" :postgresql="formatPgsql">
::: danger 格式符完全不同
MySQL 使用 `%Y-%m-%d` 风格（% 前缀），PostgreSQL 使用 `YYYY-MM-DD` 风格。这是迁移中最容易出错的地方之一，必须逐一对照转换。

| 含义 | MySQL | PostgreSQL |
|------|-------|------------|
| 年 | `%Y` | `YYYY` |
| 月 | `%m` | `MM` |
| 日 | `%d` | `DD` |
| 时 | `%H` | `HH24` |
| 分 | `%i` | `MI` |
| 秒 | `%s` | `SS` |
:::
</CodeCompare>

<CodeCompare title="日期提取" :mysql="extractMysql" :postgresql="extractPgsql" />

<CodeCompare title="日期差值" :mysql="diffMysql" :postgresql="diffPgsql">
::: tip PostgreSQL 的 AGE 函数更直观
`AGE('2024-12-31', '2024-01-01')` 返回 `11 mons 30 days`，直接以人类可读的间隔形式展示日期差。MySQL 没有类似函数，只能用 `DATEDIFF` 获取天数差。
:::
</CodeCompare>
