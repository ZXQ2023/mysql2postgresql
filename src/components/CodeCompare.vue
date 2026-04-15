<script setup lang="ts">
import { watchEffect } from 'vue'
import { useShiki } from '../composables/useShiki'

const props = defineProps<{
  mysql: string
  postgresql: string
  title: string
  description?: string
}>()

const { highlightedMySQL, highlightedPostgreSQL, highlight } = useShiki()

watchEffect(() => {
  highlight(props.mysql, props.postgresql)
})
</script>

<template>
  <div class="border-b border-white/[0.06] pt-5 pb-0">
    <!-- Header -->
    <div class="mb-3">
      <h3 class="text-[15px] font-semibold text-zinc-100 tracking-tight">{{ title }}</h3>
      <p v-if="description" class="text-[13px] text-zinc-400 mt-1 leading-relaxed">{{ description }}</p>
    </div>

    <!-- Code blocks -->
    <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
      <div class="py-3 md:py-0 md:pr-4">
        <div class="flex items-center gap-2 mb-2.5">
          <span class="w-1.5 h-1.5 rounded-full bg-mysql" />
          <span class="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-widest">MySQL</span>
        </div>
        <div class="shiki-wrapper p-4 rounded-md overflow-x-auto border border-white/[0.06]" style="background:lab(11.724% 0 0)" v-html="highlightedMySQL" />
      </div>
      <div class="py-3 md:py-0 md:pl-4">
        <div class="flex items-center gap-2 mb-2.5">
          <span class="w-1.5 h-1.5 rounded-full bg-pgsql" />
          <span class="text-[11px] font-mono font-medium text-zinc-400 uppercase tracking-widest">PostgreSQL</span>
        </div>
        <div class="shiki-wrapper p-4 rounded-md overflow-x-auto border border-white/[0.06]" style="background:lab(11.724% 0 0)" v-html="highlightedPostgreSQL" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.shiki-wrapper :deep(pre) {
  margin: 0;
  padding: 0;
  background: transparent !important;
  font-family: "IBM Plex Mono", "SF Mono", "Fira Code", monospace;
  font-size: 13px;
  line-height: 1.7;
}
.shiki-wrapper :deep(code) {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}
</style>
