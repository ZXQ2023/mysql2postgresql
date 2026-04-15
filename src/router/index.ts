import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/data-types',
  },
  {
    path: '/data-types',
    name: 'data-types',
    component: () => import('../views/DataTypes.vue'),
    meta: { title: '数据类型对比' },
  },
  {
    path: '/query-syntax',
    name: 'query-syntax',
    component: () => import('../views/QuerySyntax.vue'),
    meta: { title: '基本查询语法差异' },
  },
  {
    path: '/string-ops',
    name: 'string-ops',
    component: () => import('../views/StringOps.vue'),
    meta: { title: '字符串操作' },
  },
  {
    path: '/datetime',
    name: 'datetime',
    component: () => import('../views/DateTime.vue'),
    meta: { title: '日期/时间函数' },
  },
  {
    path: '/json-ops',
    name: 'json-ops',
    component: () => import('../views/JsonOps.vue'),
    meta: { title: 'JSON 操作' },
  },
  {
    path: '/pagination',
    name: 'pagination',
    component: () => import('../views/Pagination.vue'),
    meta: { title: '分页查询' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
