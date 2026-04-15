# DDL 语句

MySQL 与 PostgreSQL 建表、修改表结构等 DDL 操作的差异

<script setup>
import CodeCompare from './.vitepress/components/CodeCompare.vue'

const createTableMysql = `CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

const createTablePgsql = `CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    status VARCHAR(20) DEFAULT 'active'
      CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 自动更新需要触发器:
CREATE OR REPLACE FUNCTION
  update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();`

const addColumnMysql = `ALTER TABLE users
  ADD COLUMN age INT AFTER name;

ALTER TABLE users
  ADD COLUMN phone VARCHAR(20) FIRST;`

const addColumnPgsql = `ALTER TABLE users
  ADD COLUMN age INT;

-- PostgreSQL 不支持 AFTER/FIRST
-- 列总是添加到表的末尾
-- 如需调整顺序, 需重建表或创建视图`

const modifyColumnMysql = `-- 修改列类型
ALTER TABLE users
  MODIFY COLUMN name VARCHAR(200) NOT NULL;

-- 修改列名
ALTER TABLE users
  CHANGE COLUMN name username VARCHAR(200);`

const modifyColumnPgsql = `-- 修改列类型
ALTER TABLE users
  ALTER COLUMN name TYPE VARCHAR(200),
  ALTER COLUMN name SET NOT NULL;

-- 修改列名
ALTER TABLE users
  RENAME COLUMN name TO username;`

const dropColumnMysql = `ALTER TABLE users DROP COLUMN age;`

const dropColumnPgsql = `ALTER TABLE users DROP COLUMN age;`

const renameTableMysql = `RENAME TABLE users TO members;

-- 或
ALTER TABLE users RENAME TO members;`

const renameTablePgsql = `ALTER TABLE users RENAME TO members;`

const addConstraintMysql = `-- 添加主键
ALTER TABLE users
  ADD PRIMARY KEY (id);

-- 添加外键
ALTER TABLE orders
  ADD CONSTRAINT fk_user
  FOREIGN KEY (user_id) REFERENCES users(id)
  ON DELETE CASCADE;

-- 添加唯一约束
ALTER TABLE users
  ADD UNIQUE INDEX idx_email (email);`

const addConstraintPgsql = `-- 添加主键
ALTER TABLE users
  ADD PRIMARY KEY (id);

-- 添加外键
ALTER TABLE orders
  ADD CONSTRAINT fk_user
  FOREIGN KEY (user_id) REFERENCES users(id)
  ON DELETE CASCADE;

-- 添加唯一约束
ALTER TABLE users
  ADD CONSTRAINT idx_email UNIQUE (email);`

const commentMysql = `-- 表注释
CREATE TABLE users (
  id INT PRIMARY KEY
) COMMENT = '用户表';

-- 列注释
ALTER TABLE users
  MODIFY COLUMN name VARCHAR(100)
  COMMENT '用户姓名';

-- 查看注释
SHOW CREATE TABLE users;`

const commentPgsql = `-- 表注释
COMMENT ON TABLE users IS '用户表';

-- 列注释
COMMENT ON COLUMN users.name IS '用户姓名';

-- 查看注释
SELECT obj_description('users'::regclass);`

const truncateMysql = `-- 清空表 (重置 AUTO_INCREMENT)
TRUNCATE TABLE users;

-- 清空表 (不重置 AUTO_INCREMENT)
TRUNCATE TABLE users;
-- MySQL 的 TRUNCATE 总是重置自增值`

const truncatePgsql = `-- 清空表 (重置序列)
TRUNCATE TABLE users RESTART IDENTITY;

-- 清空表 (不重置序列)
TRUNCATE TABLE users CONTINUE IDENTITY;

-- 级联清空 (外键关联的表一起清空)
TRUNCATE TABLE users CASCADE;`

const tempTableMysql = `-- 临时表 (连接关闭后自动删除)
CREATE TEMPORARY TABLE temp_users (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- 查看临时表
SHOW TABLES;`

const tempTablePgsql = `-- 临时表 (会话结束后自动删除)
CREATE TEMPORARY TABLE temp_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

-- 可选: ON COMMIT 选项
CREATE TEMPORARY TABLE temp_users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
) ON COMMIT DROP;  -- 事务结束删除`
</script>

<CodeCompare title="创建表" description="建表语法的差异, 包括自增、默认值、枚举等" :mysql="createTableMysql" :postgresql="createTablePgsql" />

<CodeCompare title="添加列" description="ALTER TABLE ADD COLUMN 的差异" :mysql="addColumnMysql" :postgresql="addColumnPgsql" />

<CodeCompare title="修改列" description="修改列类型和列名" :mysql="modifyColumnMysql" :postgresql="modifyColumnPgsql" />

<CodeCompare title="删除列" description="ALTER TABLE DROP COLUMN" :mysql="dropColumnMysql" :postgresql="dropColumnPgsql" />

<CodeCompare title="重命名表" :mysql="renameTableMysql" :postgresql="renameTablePgsql" />

<CodeCompare title="添加约束" description="主键、外键、唯一约束" :mysql="addConstraintMysql" :postgresql="addConstraintPgsql" />

<CodeCompare title="表/列注释" description="COMMENT 语法的差异" :mysql="commentMysql" :postgresql="commentPgsql" />

<CodeCompare title="清空表" description="TRUNCATE 的差异" :mysql="truncateMysql" :postgresql="truncatePgsql" />

<CodeCompare title="临时表" :mysql="tempTableMysql" :postgresql="tempTablePgsql" />
