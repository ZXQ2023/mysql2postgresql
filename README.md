# MySQL → PostgreSQL 迁移速查手册

一个全面的 MySQL 与 PostgreSQL 语法、函数、数据类型对照参考网站，帮助开发者快速完成数据库迁移。

## 在线预览

```bash
pnpm install
pnpm dev
```

访问 `http://localhost:5173` 即可查看。

## 内容概览

### 语法对照

- **数据类型对比** — 整数、字符串、日期、JSON、UUID、二进制等完整类型映射
- **查询语法差异** — SELECT / INSERT / UPDATE / DELETE / JOIN / UNION
- **字符串操作** — 拼接、截取、正则、搜索、大小写
- **日期/时间函数** — 获取时间、加减、格式化、差值计算
- **运算符与表达式** — 比较、逻辑、模式匹配、NULL 处理

### 高级特性

- **DDL 语句** — CREATE TABLE / ALTER TABLE / 注释 / 临时表
- **索引** — B-Tree / 全文 / 空间 / Hash / 并发索引
- **事务与锁** — 隔离级别、行锁、表锁、死锁处理
- **聚合与条件函数** — 条件聚合、FILTER、DISTINCT ON
- **窗口函数** — ROW_NUMBER / RANK / LEAD / LAG
- **子查询与 CTE** — 递归 CTE / LATERAL / 派生表
- **JSON 操作** — JSONB 提取、查询、修改、索引
- **分页查询** — OFFSET / Keyset / CTE 分页

### 独有功能

- **PostgreSQL 独有** — 数组类型、范围类型、RETURNING、物化视图、扩展系统、自定义类型
- **MySQL 独有** — 存储引擎、SQL 模式、查询提示、用户变量、ON UPDATE 时间戳

### 系统管理

- 数据库与表管理、用户权限、备份恢复、连接管理、配置管理、存储大小

## 技术栈

- [VitePress](https://vitepress.dev/) — 静态站点生成
- [Shiki](https://shiki.style/) — SQL 语法高亮（自定义 MySQL / PostgreSQL 语法规则与暗色主题）
- [Vue 3](https://vuejs.org/) — `<CodeCompare>` 并排对比组件

## 构建部署

```bash
pnpm build    # 输出到 docs/.vitepress/dist/
pnpm preview  # 本地预览构建产物
```

---

> 本项目内容由 AI 生成，仅供参考。
