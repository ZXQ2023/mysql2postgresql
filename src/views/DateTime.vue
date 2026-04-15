<script setup lang="ts">
import CodeCompare from '../components/CodeCompare.vue'
</script>

<template>
  <div class="space-y-5">
    <div class="pb-5 border-b border-white/[0.06] mb-2">
      <h2 class="text-xl font-bold text-white tracking-tight">日期/时间函数</h2>
      <p class="text-sm text-zinc-400 mt-1.5">MySQL 与 PostgreSQL 日期时间处理的差异</p>
    </div>

    <CodeCompare
      title="获取当前时间"
      mysql="SELECT NOW();          -- 2024-01-15 10:30:00
SELECT CURDATE();      -- 2024-01-15
SELECT CURTIME();      -- 10:30:00
SELECT SYSDATE();      -- 实时时间"
      postgresql="SELECT NOW();          -- 2024-01-15 10:30:00+08
SELECT CURRENT_DATE;   -- 2024-01-15
SELECT CURRENT_TIME;   -- 10:30:00+08
SELECT CLOCK_TIMESTAMP(); -- 实时时间"
    />

    <CodeCompare
      title="日期加减"
      mysql="-- DATE_ADD / DATE_SUB
SELECT DATE_ADD(NOW(), INTERVAL 7 DAY);
SELECT DATE_SUB(NOW(), INTERVAL 1 MONTH);

-- 简写
SELECT NOW() + INTERVAL 7 DAY;"
      postgresql="-- INTERVAL 语法
SELECT NOW() + INTERVAL '7 days';
SELECT NOW() - INTERVAL '1 month';

-- 更灵活的写法
SELECT NOW() + INTERVAL '1 year 2 months 3 days';"
    />

    <CodeCompare
      title="日期格式化"
      mysql="SELECT DATE_FORMAT(NOW(), '%Y-%m-%d');
-- 2024-01-15

SELECT DATE_FORMAT(NOW(), '%Y年%m月%d日');
-- 2024年01月15日"
      postgresql="SELECT TO_CHAR(NOW(), 'YYYY-MM-DD');
-- 2024-01-15

SELECT TO_CHAR(NOW(), 'YYYY年MM月DD日');
-- 2024年01月15日

-- 注意: 格式符完全不同!"
    />

    <CodeCompare
      title="日期提取"
      mysql="SELECT YEAR(NOW());     -- 2024
SELECT MONTH(NOW());    -- 1
SELECT DAY(NOW());      -- 15
SELECT HOUR(NOW());     -- 10
SELECT EXTRACT(YEAR FROM NOW());"
      postgresql="SELECT EXTRACT(YEAR FROM NOW());   -- 2024
SELECT EXTRACT(MONTH FROM NOW());  -- 1
SELECT EXTRACT(DAY FROM NOW());    -- 15
SELECT EXTRACT(HOUR FROM NOW());   -- 10

-- 也支持简写
SELECT DATE_PART('year', NOW());"
    />

    <CodeCompare
      title="日期差值"
      mysql="-- DATEDIFF (天数差)
SELECT DATEDIFF('2024-12-31', '2024-01-01');
-- 365

-- TIMESTAMPDIFF (指定单位)
SELECT TIMESTAMPDIFF(MONTH, '2024-01-01', '2024-12-31');"
      postgresql="-- 直接减法 (天数)
SELECT '2024-12-31'::DATE - '2024-01-01'::DATE;
-- 365

-- AGE 函数
SELECT AGE('2024-12-31', '2024-01-01');
-- 11 mons 30 days

-- EXTRACT + EPOCH
SELECT EXTRACT(
  DAY FROM '2024-12-31' - '2024-01-01'
);"
    />
  </div>
</template>
