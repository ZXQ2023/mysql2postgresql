# 子查询与 CTE

MySQL 与 PostgreSQL 子查询和公用表表达式的差异

<script setup>
import CodeCompare from './.vitepress/components/CodeCompare.vue'

const scalarMysql = `-- 标量子查询
SELECT name,
  (SELECT COUNT(*) FROM orders
   WHERE orders.user_id = users.id)
  AS order_count
FROM users;`

const scalarPgsql = `-- 标量子查询
SELECT name,
  (SELECT COUNT(*) FROM orders
   WHERE orders.user_id = users.id)
  AS order_count
FROM users;`

const inSubMysql = `-- IN 子查询
SELECT * FROM users
WHERE id IN (
  SELECT user_id FROM orders
  WHERE amount > 1000
);

-- EXISTS 子查询
SELECT * FROM users u
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.user_id = u.id
);`

const inSubPgsql = `-- IN 子查询
SELECT * FROM users
WHERE id IN (
  SELECT user_id FROM orders
  WHERE amount > 1000
);

-- EXISTS 子查询
SELECT * FROM users u
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.user_id = u.id
);`

const basicCteMysql = `-- CTE (MySQL 8.0+)
WITH active_users AS (
  SELECT * FROM users
  WHERE status = 'active'
)
SELECT * FROM active_users
WHERE age > 18;`

const basicCtePgsql = `-- CTE
WITH active_users AS (
  SELECT * FROM users
  WHERE status = 'active'
)
SELECT * FROM active_users
WHERE age > 18;`

const multiCteMysql = `-- 多个 CTE
WITH
  active_users AS (
    SELECT * FROM users WHERE status = 'active'
  ),
  user_orders AS (
    SELECT user_id, COUNT(*) AS cnt
    FROM orders
    GROUP BY user_id
  )
SELECT u.name, o.cnt
FROM active_users u
LEFT JOIN user_orders o ON u.id = o.user_id;`

const multiCtePgsql = `-- 多个 CTE
WITH
  active_users AS (
    SELECT * FROM users WHERE status = 'active'
  ),
  user_orders AS (
    SELECT user_id, COUNT(*) AS cnt
    FROM orders
    GROUP BY user_id
  )
SELECT u.name, o.cnt
FROM active_users u
LEFT JOIN user_orders o ON u.id = o.user_id;`

const recursiveCteMysql = `-- 递归 CTE (MySQL 8.0+)
WITH RECURSIVE org_tree AS (
  -- 锚点查询
  SELECT id, name, manager_id, 1 AS level
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  -- 递归查询
  SELECT e.id, e.name, e.manager_id,
    t.level + 1
  FROM employees e
  JOIN org_tree t ON e.manager_id = t.id
)
SELECT * FROM org_tree ORDER BY level;`

const recursiveCtePgsql = `-- 递归 CTE
WITH RECURSIVE org_tree AS (
  -- 锚点查询
  SELECT id, name, manager_id, 1 AS level
  FROM employees
  WHERE manager_id IS NULL

  UNION ALL

  -- 递归查询
  SELECT e.id, e.name, e.manager_id,
    t.level + 1
  FROM employees e
  JOIN org_tree t ON e.manager_id = t.id
)
SELECT * FROM org_tree ORDER BY level;

-- 可选: 深度限制 (PostgreSQL 专有)
-- SET max_recursion = 100;`

const lateralMysql = `-- LATERAL (MySQL 8.0.14+)
SELECT u.name, top_orders.amount
FROM users u,
  LATERAL (
    SELECT amount FROM orders o
    WHERE o.user_id = u.id
    ORDER BY amount DESC
    LIMIT 3
  ) AS top_orders;`

const lateralPgsql = `-- LATERAL
SELECT u.name, top_orders.amount
FROM users u,
  LATERAL (
    SELECT amount FROM orders o
    WHERE o.user_id = u.id
    ORDER BY amount DESC
    LIMIT 3
  ) AS top_orders;`

const fromSubMysql = `-- FROM 子查询 (派生表)
SELECT dept_avg.department,
  dept_avg.avg_salary
FROM (
  SELECT department,
    AVG(salary) AS avg_salary
  FROM employees
  GROUP BY department
) AS dept_avg
WHERE dept_avg.avg_salary > 50000;`

const fromSubPgsql = `-- FROM 子查询
SELECT dept_avg.department,
  dept_avg.avg_salary
FROM (
  SELECT department,
    AVG(salary) AS avg_salary
  FROM employees
  GROUP BY department
) AS dept_avg
WHERE dept_avg.avg_salary > 50000;`
</script>

<CodeCompare title="标量子查询" description="在 SELECT 中使用子查询" :mysql="scalarMysql" :postgresql="scalarPgsql" />

<CodeCompare title="IN / EXISTS 子查询" :mysql="inSubMysql" :postgresql="inSubPgsql" />

<CodeCompare title="基本 CTE" description="WITH 子句公用表表达式" :mysql="basicCteMysql" :postgresql="basicCtePgsql">
::: info CTE 优化行为不同
MySQL 8.0 的 CTE 总是物化（先计算后存储为临时表）。PostgreSQL 12+ 默认将 CTE 内联优化（像子查询一样处理），除非被引用多次或使用 `MATERIALIZED` 关键字。如果需要物化，使用 `WITH cte AS MATERIALIZED (...)`。
:::
</CodeCompare>

<CodeCompare title="多个 CTE" description="WITH 多个命名查询" :mysql="multiCteMysql" :postgresql="multiCtePgsql" />

<CodeCompare title="递归 CTE" description="WITH RECURSIVE 实现树形查询" :mysql="recursiveCteMysql" :postgresql="recursiveCtePgsql">
::: tip 递归 CTE 是处理树形数据的利器
递归 CTE 可以优雅地处理组织架构、评论树、文件目录等层级数据。PostgreSQL 还支持在递归 CTE 中使用 `CYCLE` 检测循环引用（PostgreSQL 14+），避免无限递归。
:::
</CodeCompare>

<CodeCompare title="LATERAL" description="横向关联子查询" :mysql="lateralMysql" :postgresql="lateralPgsql" />

<CodeCompare title="FROM 子查询" description="派生表的使用" :mysql="fromSubMysql" :postgresql="fromSubPgsql" />
