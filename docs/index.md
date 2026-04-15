---
layout: home

hero:
  name: MySQL → PostgreSQL
  text: 迁移速查手册
  tagline: 全面的语法、函数、数据类型、特性快速对照参考
  actions:
    - theme: brand
      text: 数据类型对比
      link: /data-types
    - theme: alt
      text: PostgreSQL 独有功能
      link: /pgsql-unique
    - theme: alt
      text: MySQL 独有功能
      link: /mysql-unique

features:
  - icon: 📊
    title: 数据类型
    details: 数值、字符串、日期、JSON、UUID、二进制等完整类型映射
    link: /data-types
  - icon: 🔍
    title: 查询语法
    details: SELECT / INSERT / UPDATE / DELETE / JOIN / UNION 等语法差异
    link: /query-syntax
  - icon: 📝
    title: 字符串与日期
    details: 字符串函数、日期时间函数、正则表达式的全面对比
    link: /string-ops
  - icon: 🏗️
    title: DDL 语句
    details: CREATE TABLE / ALTER TABLE / 索引 / 约束的语法差异
    link: /ddl
  - icon: 📑
    title: 索引
    details: B-Tree / 全文 / 空间 / Hash 索引的创建与管理
    link: /indexes
  - icon: 🔒
    title: 事务与锁
    details: 事务隔离级别、行锁、表锁、死锁处理
    link: /transactions
  - icon: 🧩
    title: 聚合与窗口
    details: 聚合函数、条件表达式、窗口函数的完整对比
    link: /aggregate
  - icon: 🔗
    title: 子查询与 CTE
    details: WITH / RECURSIVE / LATERAL 等高级查询
    link: /cte-subquery
  - icon: ⚡
    title: JSON 操作
    details: JSON / JSONB 提取、查询、修改、索引的对比
    link: /json-ops
  - icon: 🚀
    title: PostgreSQL 独有
    details: 数组、范围类型、RETURNING、物化视图、扩展系统等
    link: /pgsql-unique
  - icon: 🐬
    title: MySQL 独有
    details: 存储引擎、SQL 模式、查询提示、用户变量等
    link: /mysql-unique
  - icon: ⚙️
    title: 运算符
    details: 比较、逻辑、模式匹配等运算符的差异
    link: /operators
---
