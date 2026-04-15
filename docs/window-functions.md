# 窗口函数

MySQL 与 PostgreSQL 窗口函数的对比

<script setup>
import CodeCompare from './.vitepress/components/CodeCompare.vue'

const rowNumberMysql = `-- ROW_NUMBER (MySQL 8.0+)
SELECT name, department, salary,
  ROW_NUMBER() OVER (
    PARTITION BY department
    ORDER BY salary DESC
  ) AS rn
FROM employees;`

const rowNumberPgsql = `-- ROW_NUMBER
SELECT name, department, salary,
  ROW_NUMBER() OVER (
    PARTITION BY department
    ORDER BY salary DESC
  ) AS rn
FROM employees;`

const rankMysql = `SELECT name, salary,
  RANK() OVER (ORDER BY salary DESC) AS rnk,
  DENSE_RANK() OVER (ORDER BY salary DESC)
    AS dense_rnk
FROM employees;`

const rankPgsql = `SELECT name, salary,
  RANK() OVER (ORDER BY salary DESC) AS rnk,
  DENSE_RANK() OVER (ORDER BY salary DESC)
    AS dense_rnk,
  PERCENT_RANK() OVER (ORDER BY salary DESC)
    AS pct_rnk
FROM employees;`

const aggregateMysql = `-- 累计求和
SELECT date, amount,
  SUM(amount) OVER (
    ORDER BY date
    ROWS BETWEEN UNBOUNDED PRECEDING
    AND CURRENT ROW
  ) AS running_total
FROM sales;

-- 移动平均
SELECT date, amount,
  AVG(amount) OVER (
    ORDER BY date
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
  ) AS moving_avg
FROM sales;`

const aggregatePgsql = `-- 累计求和
SELECT date, amount,
  SUM(amount) OVER (
    ORDER BY date
    ROWS BETWEEN UNBOUNDED PRECEDING
    AND CURRENT ROW
  ) AS running_total
FROM sales;

-- 移动平均
SELECT date, amount,
  AVG(amount) OVER (
    ORDER BY date
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
  ) AS moving_avg
FROM sales;`

const leadLagMysql = `-- LEAD / LAG (MySQL 8.0+)
SELECT date, amount,
  LAG(amount, 1) OVER (
    ORDER BY date
  ) AS prev_amount,
  LEAD(amount, 1) OVER (
    ORDER BY date
  ) AS next_amount
FROM sales;

-- 带默认值
SELECT date, amount,
  LAG(amount, 1, 0) OVER (
    ORDER BY date
  ) AS prev_amount
FROM sales;`

const leadLagPgsql = `-- LEAD / LAG
SELECT date, amount,
  LAG(amount, 1) OVER (
    ORDER BY date
  ) AS prev_amount,
  LEAD(amount, 1) OVER (
    ORDER BY date
  ) AS next_amount
FROM sales;

-- 带默认值
SELECT date, amount,
  LAG(amount, 1, 0) OVER (
    ORDER BY date
  ) AS prev_amount
FROM sales;`

const firstLastMysql = `-- FIRST_VALUE / LAST_VALUE (MySQL 8.0+)
SELECT name, department, salary,
  FIRST_VALUE(salary) OVER (
    PARTITION BY department
    ORDER BY salary DESC
  ) AS highest,
  LAST_VALUE(salary) OVER (
    PARTITION BY department
    ORDER BY salary DESC
    ROWS BETWEEN UNBOUNDED PRECEDING
    AND UNBOUNDED FOLLOWING
  ) AS lowest
FROM employees;`

const firstLastPgsql = `-- FIRST_VALUE / LAST_VALUE
SELECT name, department, salary,
  FIRST_VALUE(salary) OVER (
    PARTITION BY department
    ORDER BY salary DESC
  ) AS highest,
  LAST_VALUE(salary) OVER (
    PARTITION BY department
    ORDER BY salary DESC
    ROWS BETWEEN UNBOUNDED PRECEDING
    AND UNBOUNDED FOLLOWING
  ) AS lowest
FROM employees;

-- NTH_VALUE (取第 N 个值)
SELECT name, salary,
  NTH_VALUE(salary, 2) OVER (
    ORDER BY salary DESC
  ) AS second_salary
FROM employees;`

const namedWindowMysql = `-- 命名窗口 (MySQL 8.0+)
SELECT name, department, salary,
  ROW_NUMBER() OVER w AS rn,
  SUM(salary) OVER w AS dept_total
FROM employees
WINDOW w AS (
  PARTITION BY department
  ORDER BY salary DESC
);`

const namedWindowPgsql = `-- 命名窗口
SELECT name, department, salary,
  ROW_NUMBER() OVER w AS rn,
  SUM(salary) OVER w AS dept_total
FROM employees
WINDOW w AS (
  PARTITION BY department
  ORDER BY salary DESC
);`
</script>

<CodeCompare title="ROW_NUMBER" description="窗口内排序编号" :mysql="rowNumberMysql" :postgresql="rowNumberPgsql">
::: warning MySQL 8.0+ 才支持窗口函数
MySQL 8.0 之前的版本不支持窗口函数（`ROW_NUMBER`、`RANK`、`LAG` 等），需要用变量或自连接模拟。如果你的 MySQL 版本低于 8.0，迁移到 PostgreSQL 后窗口函数是最大的收益之一。
:::
</CodeCompare>

<CodeCompare title="RANK / DENSE_RANK" description="排名函数" :mysql="rankMysql" :postgresql="rankPgsql" />

<CodeCompare title="聚合窗口函数" description="SUM / AVG 累计和移动平均" :mysql="aggregateMysql" :postgresql="aggregatePgsql" />

<CodeCompare title="LEAD / LAG" description="访问前后行的值" :mysql="leadLagMysql" :postgresql="leadLagPgsql" />

<CodeCompare title="FIRST_VALUE / LAST_VALUE" description="窗口内首尾值" :mysql="firstLastMysql" :postgresql="firstLastPgsql">
::: warning LAST_VALUE 的窗口帧陷阱
`LAST_VALUE()` 默认的窗口帧是 `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`，这意味着它只取"到当前行为止"的最后一条，而非整个分区的最后一条。需要显式指定 `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` 才能得到正确结果。
:::
</CodeCompare>

<CodeCompare title="命名窗口" description="WINDOW 子句复用窗口定义" :mysql="namedWindowMysql" :postgresql="namedWindowPgsql" />
