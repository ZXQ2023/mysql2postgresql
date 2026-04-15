import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'MySQL → PostgreSQL',
  description: 'MySQL 到 PostgreSQL 迁移速查手册',
  lang: 'zh-CN',
  vite: {
    optimizeDeps: {
      exclude: ['@electric-sql/pglite'],
    },
  },
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap', rel: 'stylesheet' }],
  ],
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      {
        text: '语法对照',
        items: [
          { text: '数据类型对比', link: '/data-types' },
          { text: '查询语法差异', link: '/query-syntax' },
          { text: '字符串操作', link: '/string-ops' },
          { text: '日期/时间函数', link: '/datetime' },
          { text: '运算符与表达式', link: '/operators' },
        ],
      },
      {
        text: '高级特性',
        items: [
          { text: 'DDL 语句', link: '/ddl' },
          { text: '索引', link: '/indexes' },
          { text: '事务与锁', link: '/transactions' },
          { text: '聚合与条件函数', link: '/aggregate' },
          { text: '窗口函数', link: '/window-functions' },
          { text: '子查询与 CTE', link: '/cte-subquery' },
          { text: 'JSON 操作', link: '/json-ops' },
          { text: '分页查询', link: '/pagination' },
        ],
      },
      {
        text: '独有功能',
        items: [
          { text: 'PostgreSQL 独有', link: '/pgsql-unique' },
          { text: 'MySQL 独有', link: '/mysql-unique' },
        ],
      },
      {
        text: '管理',
        items: [
          { text: '系统管理', link: '/admin' },
        ],
      },
      { text: 'Playground', link: '/playground' },
    ],
    sidebar: [
      {
        text: '入门',
        items: [
          { text: '首页', link: '/' },
        ],
      },
      {
        text: '语法对照',
        collapsed: false,
        items: [
          { text: '数据类型对比', link: '/data-types' },
          { text: '查询语法差异', link: '/query-syntax' },
          { text: '字符串操作', link: '/string-ops' },
          { text: '日期/时间函数', link: '/datetime' },
          { text: '运算符与表达式', link: '/operators' },
        ],
      },
      {
        text: '高级特性',
        collapsed: false,
        items: [
          { text: 'DDL 语句', link: '/ddl' },
          { text: '索引', link: '/indexes' },
          { text: '事务与锁', link: '/transactions' },
          { text: '聚合与条件函数', link: '/aggregate' },
          { text: '窗口函数', link: '/window-functions' },
          { text: '子查询与 CTE', link: '/cte-subquery' },
          { text: 'JSON 操作', link: '/json-ops' },
          { text: '分页查询', link: '/pagination' },
        ],
      },
      {
        text: '独有功能',
        collapsed: false,
        items: [
          { text: 'PostgreSQL 独有', link: '/pgsql-unique' },
          { text: 'MySQL 独有', link: '/mysql-unique' },
        ],
      },
      {
        text: '管理',
        collapsed: false,
        items: [
          { text: '系统管理', link: '/admin' },
        ],
      },
      {
        text: '实验',
        collapsed: false,
        items: [
          { text: 'Playground', link: '/playground' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com' },
    ],
    footer: {
      message: 'MySQL → PostgreSQL 迁移速查手册',
    },
    search: {
      provider: 'local',
    },
  },
})
