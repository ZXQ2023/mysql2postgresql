<script setup lang="ts">
defineProps<{
  open: boolean
}>()
defineEmits<{
  toggle: []
}>()

const menuItems = [
  { name: '数据类型对比', path: '/data-types', icon: 'i-carbon-data-table' },
  { name: '基本查询语法差异', path: '/query-syntax', icon: 'i-carbon-query' },
  { name: '字符串操作', path: '/string-ops', icon: 'i-carbon-string-text' },
  { name: '日期/时间函数', path: '/datetime', icon: 'i-carbon-time' },
  { name: 'JSON 操作', path: '/json-ops', icon: 'i-carbon-json' },
  { name: '分页查询', path: '/pagination', icon: 'i-carbon-page-scroll' },
]
</script>

<template>
  <aside
    :class="[
      'h-screen bg-surface-1 flex flex-col transition-all duration-300 overflow-hidden border-r border-white/[0.06]',
      open ? 'w-60' : 'w-16',
    ]"
  >
    <!-- Header -->
    <div class="h-14 flex items-center justify-between px-4 border-b border-white/[0.06]">
      <h1 v-if="open" class="text-xs font-mono font-semibold tracking-wide text-zinc-300 whitespace-nowrap uppercase">
        MySQL <span class="text-accent">→</span> PostgreSQL
      </h1>
      <button
        @click="$emit('toggle')"
        class="p-1.5 rounded-md hover:bg-surface-3 text-zinc-500 hover:text-zinc-200 transition-colors duration-200"
      >
        <span class="i-carbon-menu text-base" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 py-3 space-y-0.5 px-2">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="group flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-zinc-400 hover:text-zinc-100 rounded-md transition-all duration-200 hover:bg-surface-3"
        active-class="!text-accent !bg-accent-dim"
      >
        <span :class="[item.icon, 'text-base shrink-0']" />
        <span v-if="open" class="whitespace-nowrap truncate">{{ item.name }}</span>
      </router-link>
    </nav>

    <!-- Footer -->
    <div v-if="open" class="px-4 py-3 border-t border-white/[0.06]">
      <p class="text-[11px] font-mono text-zinc-500 leading-relaxed">
        迁移速查手册
      </p>
    </div>
  </aside>
</template>
