<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { createHighlighter, type Highlighter } from 'shiki'
import { sqlTheme } from '../theme/sqlTheme'
import { mysqlLang, pgsqlLang } from '../theme/sqlLanguages'

const props = defineProps<{
  title: string
  description?: string
  mysql: string
  postgresql: string
}>()

const mysqlHtml = ref('')
const pgsqlHtml = ref('')
let highlighter: Highlighter | null = null

async function getHighlighter() {
  if (highlighter) return highlighter
  highlighter = await createHighlighter({
    themes: [sqlTheme],
    langs: [mysqlLang(), pgsqlLang()],
  })
  return highlighter
}

async function highlight() {
  const h = await getHighlighter()
  mysqlHtml.value = h.codeToHtml(props.mysql, { lang: 'mysql', theme: 'sql-dark' })
  pgsqlHtml.value = h.codeToHtml(props.postgresql, { lang: 'pgsql', theme: 'sql-dark' })
}

onMounted(highlight)
watch(() => [props.mysql, props.postgresql], highlight)
</script>

<template>
  <div class="compare-block">
    <div class="compare-header">
      <h3 class="compare-title">{{ title }}</h3>
      <p v-if="description" class="compare-desc">{{ description }}</p>
    </div>
    <div class="compare-grid">
      <div class="compare-col">
        <div class="compare-label">
          <span class="dot dot-mysql" />
          <span class="label-text">MySQL</span>
        </div>
        <div class="code-wrapper" v-html="mysqlHtml" />
      </div>
      <div class="compare-col">
        <div class="compare-label">
          <span class="dot dot-pgsql" />
          <span class="label-text">PostgreSQL</span>
        </div>
        <div class="code-wrapper" v-html="pgsqlHtml" />
      </div>
    </div>
    <div v-if="$slots.default" class="compare-note">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.compare-block {
  margin: 24px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 24px;
}
.compare-header {
  margin-bottom: 12px;
}
.compare-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  letter-spacing: -0.01em;
}
.compare-desc {
  font-size: 13px;
  color: var(--vp-c-text-3);
  margin-top: 4px;
  line-height: 1.6;
}
.compare-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 768px) {
  .compare-grid {
    grid-template-columns: 1fr;
  }
}
.compare-col {
  min-width: 0;
}
.compare-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.dot-mysql {
  background: #ff7b72;
}
.dot-pgsql {
  background: #58e1f7;
}
.label-text {
  font-size: 11px;
  font-family: 'IBM Plex Mono', 'SF Mono', monospace;
  font-weight: 500;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.code-wrapper {
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: #121212;
}
.code-wrapper :deep(pre) {
  margin: 0;
  padding: 0;
  background: transparent !important;
  font-family: 'IBM Plex Mono', 'SF Mono', monospace;
  font-size: 13px;
  line-height: 1.7;
}
.code-wrapper :deep(code) {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}
.compare-note {
  margin-top: 12px;
  font-size: 14px;
  line-height: 1.7;
}
.compare-note :deep(.custom-block) {
  margin-top: 0;
}
</style>
