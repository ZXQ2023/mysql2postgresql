import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'MySQL → PostgreSQL',
  description: 'MySQL 到 PostgreSQL 迁移速查手册',
  lang: 'zh-CN',
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap', rel: 'stylesheet' }],
  ],
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
    ],
    sidebar: [
      {
        text: '速查手册',
        items: [
          { text: '数据类型对比', link: '/data-types' },
          { text: '基本查询语法差异', link: '/query-syntax' },
          { text: '字符串操作', link: '/string-ops' },
          { text: '日期/时间函数', link: '/datetime' },
          { text: 'JSON 操作', link: '/json-ops' },
          { text: '分页查询', link: '/pagination' },
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
