# 聚合与条件函数

MySQL 与 PostgreSQL 聚合函数和条件表达式的差异

<script setup>
import CodeCompare from './.vitepress/components/CodeCompare.vue'

const basicAggMysql = `SELECT
  COUNT(*) AS total,
  COUNT(email) AS has_email,
  SUM(salary) AS total_salary,
  AVG(salary) AS avg_salary,
  MAX(salary) AS max_salary,
  MIN(salary) AS min_salary
FROM employees;`

const basicAggPgsql = `SELECT
  COUNT(*) AS total,
  COUNT(email) AS has_email,
  SUM(salary) AS total_salary,
  AVG(salary) AS avg_salary,
  MAX(salary) AS max_salary,
  MIN(salary) AS min_salary
FROM employees;

-- 额外: 更精确的聚合
SELECT
  AVG(salary)::NUMERIC(10,2) AS avg_salary,
  STDDEV(salary) AS stddev,
  VARIANCE(salary) AS variance
FROM employees;`

const groupConcatMysql = `-- 基础用法
SELECT department,
  GROUP_CONCAT(name) AS names
FROM employees
GROUP BY department;

-- 自定义分隔符和排序
SELECT department,
  GROUP_CONCAT(
    name ORDER BY salary DESC
    SEPARATOR ', '
  ) AS names
FROM employees
GROUP BY department;`

const groupConcatPgsql = `-- 基础用法
SELECT department,
  STRING_AGG(name, ',') AS names
FROM employees
GROUP BY department;

-- 自定义分隔符和排序
SELECT department,
  STRING_AGG(
    name, ', '
    ORDER BY salary DESC
  ) AS names
FROM employees
GROUP BY department;`

const ifCaseMysql = `-- IF 函数 (MySQL 专有)
SELECT IF(score >= 60, 'pass', 'fail')
FROM exams;

-- CASE WHEN
SELECT CASE
  WHEN score >= 90 THEN 'A'
  WHEN score >= 80 THEN 'B'
  WHEN score >= 70 THEN 'C'
  WHEN score >= 60 THEN 'D'
  ELSE 'F'
END AS grade
FROM exams;`

const ifCasePgsql = `-- 没有 IF 函数, 使用 CASE
SELECT CASE
  WHEN score >= 60 THEN 'pass'
  ELSE 'fail'
END AS result
FROM exams;

-- CASE WHEN (相同)
SELECT CASE
  WHEN score >= 90 THEN 'A'
  WHEN score >= 80 THEN 'B'
  WHEN score >= 70 THEN 'C'
  WHEN score >= 60 THEN 'D'
  ELSE 'F'
END AS grade
FROM exams;`

const conditionAggMysql = `-- 条件计数
SELECT
  COUNT(*) AS total,
  SUM(IF(status = 'active', 1, 0))
    AS active_count,
  SUM(CASE WHEN score >= 60
    THEN 1 ELSE 0 END) AS pass_count
FROM users;`

const conditionAggPgsql = `-- 条件计数 (使用 CASE)
SELECT
  COUNT(*) AS total,
  COUNT(CASE WHEN status = 'active'
    THEN 1 END) AS active_count,
  COUNT(CASE WHEN score >= 60
    THEN 1 END) AS pass_count

-- 或使用 FILTER (PostgreSQL 专有)
SELECT
  COUNT(*) AS total,
  COUNT(*) FILTER (WHERE status = 'active')
    AS active_count,
  COUNT(*) FILTER (WHERE score >= 60)
    AS pass_count
FROM users;`

const nullHandlingMysql = `-- IFNULL
SELECT IFNULL(name, 'unknown') FROM users;

-- COALESCE
SELECT COALESCE(phone, email, 'N/A')
FROM users;

-- NULLIF
SELECT NULLIF(score, 0) FROM exams;`

const nullHandlingPgsql = `-- COALESCE (标准方式)
SELECT COALESCE(name, 'unknown') FROM users;

-- 多值 COALESCE
SELECT COALESCE(phone, email, 'N/A')
FROM users;

-- NULLIF
SELECT NULLIF(score, 0) FROM exams;

-- 额外: 找到第一个非 NULL
SELECT COALESCE(a, b, c) FROM t;`

const havingMysql = `-- HAVING 过滤聚合结果
SELECT department, COUNT(*) AS cnt
FROM employees
GROUP BY department
HAVING COUNT(*) > 5
ORDER BY cnt DESC;`

const havingPgsql = `-- HAVING 过滤聚合结果
SELECT department, COUNT(*) AS cnt
FROM employees
GROUP BY department
HAVING COUNT(*) > 5
ORDER BY cnt DESC;`

const distinctMysql = `-- 基本去重
SELECT DISTINCT city FROM users;

-- 聚合去重
SELECT department,
  COUNT(DISTINCT city) AS city_count
FROM employees
GROUP BY department;`

const distinctPgsql = `-- 基本去重
SELECT DISTINCT city FROM users;

-- 聚合去重
SELECT department,
  COUNT(DISTINCT city) AS city_count
FROM employees
GROUP BY department;

-- 额外: DISTINCT ON (PostgreSQL 专有)
SELECT DISTINCT ON (department)
  department, name, salary
FROM employees
ORDER BY department, salary DESC;
-- 取每个部门薪资最高的人`
</script>

<CodeCompare title="基本聚合函数" description="COUNT / SUM / AVG / MAX / MIN" :mysql="basicAggMysql" :postgresql="basicAggPgsql" />

<CodeCompare title="字符串聚合" description="GROUP_CONCAT vs STRING_AGG" :mysql="groupConcatMysql" :postgresql="groupConcatPgsql" />

<CodeCompare title="条件表达式" description="IF / CASE WHEN" :mysql="ifCaseMysql" :postgresql="ifCasePgsql" />

<CodeCompare title="条件聚合" description="带条件的计数/求和" :mysql="conditionAggMysql" :postgresql="conditionAggPgsql" />

<CodeCompare title="NULL 处理" description="IFNULL / COALESCE / NULLIF" :mysql="nullHandlingMysql" :postgresql="nullHandlingPgsql" />

<CodeCompare title="HAVING 子句" :mysql="havingMysql" :postgresql="havingPgsql" />

<CodeCompare title="DISTINCT" description="去重查询, PostgreSQL 额外支持 DISTINCT ON" :mysql="distinctMysql" :postgresql="distinctPgsql" />
