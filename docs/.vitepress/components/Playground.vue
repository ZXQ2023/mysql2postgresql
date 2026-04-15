<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted } from 'vue'
import { EditorView, keymap } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { sql, PostgreSQL } from '@codemirror/lang-sql'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'

// ---- Types ----
interface TableResult {
  type: 'table'
  fields: { name: string }[]
  rows: Record<string, any>[]
}
interface StatusResult {
  type: 'status'
  message: string
}
interface ErrorResult {
  type: 'error'
  message: string
}
type QueryResult = TableResult | StatusResult | ErrorResult

// ---- Sample data ----
const INIT_SQL = `
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL,
  age INTEGER CHECK (age >= 0 AND age <= 150),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  bio TEXT
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  stock INTEGER DEFAULT 0
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL,
  status VARCHAR(20) CHECK (status IN ('pending', 'shipped', 'delivered', 'cancelled')),
  ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, email, age, is_active, bio) VALUES
  ('alice', 'alice@example.com', 28, true, 'Full-stack developer'),
  ('bob', 'bob@example.com', 35, true, 'Database administrator'),
  ('charlie', 'charlie@example.com', 22, true, 'Junior developer'),
  ('diana', 'diana@example.com', 31, false, 'DevOps engineer'),
  ('eve', 'eve@example.com', 27, true, 'Frontend developer'),
  ('frank', 'frank@example.com', 42, true, 'Senior architect'),
  ('grace', 'grace@example.com', 29, true, 'Data analyst'),
  ('henry', 'henry@example.com', 25, false, 'Backend developer');

INSERT INTO products (name, price, description, tags, metadata, stock) VALUES
  ('PostgreSQL Guide', 49.99, 'Comprehensive PostgreSQL reference',
   ARRAY['book', 'database', 'reference'], '{"pages": 450, "edition": 3}', 100),
  ('Laptop Stand', 29.99, 'Ergonomic aluminum stand',
   ARRAY['accessory', 'ergonomic'], '{"color": "silver", "weight_kg": 0.8}', 250),
  ('Mechanical Keyboard', 129.99, 'Cherry MX Brown switches',
   ARRAY['peripheral', 'mechanical'], '{"layout": "ANSI", "backlight": true}', 75),
  ('USB-C Hub', 59.99, '7-in-1 multiport adapter',
   ARRAY['accessory', 'usb'], '{"ports": 7, "supports_hdmi": true}', 180),
  ('Monitor Light', 79.99, 'Screen bar with adjustable temperature',
   ARRAY['accessory', 'lighting'], '{"color_temp_range": [2700, 6500]}', 120),
  ('Webcam HD', 89.99, '1080p with auto-focus',
   ARRAY['peripheral', 'camera'], '{"resolution": "1080p", "fps": 60}', 90);

INSERT INTO orders (user_id, product_id, quantity, unit_price, status) VALUES
  (1, 1, 1, 49.99, 'delivered'),
  (1, 3, 1, 129.99, 'shipped'),
  (2, 2, 2, 29.99, 'delivered'),
  (3, 4, 1, 59.99, 'pending'),
  (4, 5, 1, 79.99, 'shipped'),
  (5, 6, 1, 89.99, 'delivered'),
  (6, 1, 3, 49.99, 'delivered'),
  (7, 2, 1, 29.99, 'cancelled'),
  (8, 3, 1, 129.99, 'pending'),
  (2, 5, 2, 79.99, 'shipped');
`

// ---- Preset queries ----
const PRESET_QUERIES = [
  {
    label: '基本 SELECT',
    sql: `-- \u57FA\u672C\u67E5\u8BE2\uFF0C\u6D4B\u8BD5 PostgreSQL \u7279\u6709\u8BED\u6CD5\nSELECT u.username, u.email, u.is_active\nFROM users u\nWHERE u.is_active = true\nORDER BY u.created_at DESC\nLIMIT 5;`,
  },
  {
    label: 'JSONB \u64CD\u4F5C',
    sql: `-- PostgreSQL JSONB \u67E5\u8BE2\nSELECT name, price,\n  metadata->>'pages' AS pages,\n  metadata->>'color' AS color\nFROM products\nWHERE metadata ? 'pages'\nORDER BY (metadata->>'pages')::int DESC;`,
  },
  {
    label: '\u6570\u7EC4\u64CD\u4F5C',
    sql: `-- PostgreSQL \u6570\u7EC4\u8FD0\u7B97\u7B26\u548C\u51FD\u6570\nSELECT name, tags\nFROM products\nWHERE 'database' = ANY(tags)\nORDER BY name;\n\n-- \u5C55\u5F00\u6570\u7EC4\u4E3A\u884C\nSELECT name, unnest(tags) AS tag\nFROM products;`,
  },
  {
    label: '\u7A97\u53E3\u51FD\u6570',
    sql: `-- \u7A97\u53E3\u51FD\u6570\u5206\u6790\nSELECT\n  u.username,\n  o.unit_price,\n  SUM(o.unit_price * o.quantity)\n    OVER (PARTITION BY u.id) AS user_total,\n  RANK() OVER (\n    ORDER BY SUM(o.unit_price * o.quantity) DESC\n  ) AS spend_rank\nFROM users u\nJOIN orders o ON u.id = o.user_id\nWHERE o.status != 'cancelled';`,
  },
  {
    label: 'CTE / WITH',
    sql: `-- \u516C\u5171\u8868\u8FBE\u5F0F\nWITH user_spending AS (\n  SELECT\n    u.id,\n    u.username,\n    SUM(o.unit_price * o.quantity) AS total_spent\n  FROM users u\n  JOIN orders o ON u.id = o.user_id\n  WHERE o.status != 'cancelled'\n  GROUP BY u.id, u.username\n)\nSELECT\n  username,\n  total_spent,\n  ROUND(\n    total_spent * 100.0 / SUM(total_spent) OVER (), 2\n  ) AS pct_of_total\nFROM user_spending\nORDER BY total_spent DESC;`,
  },
  {
    label: '\u5B57\u7B26\u4E32\u4E0E\u6A21\u5F0F\u5339\u914D',
    sql: `-- ILIKE \u5927\u5C0F\u5199\u4E0D\u654F\u611F\u5339\u914D\nSELECT username, email\nFROM users\nWHERE email ILIKE '%EXAMPLE%';\n\n-- POSIX \u6B63\u5219\u8868\u8FBE\u5F0F\nSELECT username, bio\nFROM users\nWHERE bio ~ 'developer$';\n\n-- \u5168\u6587\u641C\u7D22\nSELECT name, description\nFROM products\nWHERE to_tsvector('english', description)\n  @@ to_tsquery('english', 'reference & database');`,
  },
  {
    label: 'DDL: ALTER TABLE',
    sql: `-- \u6DFB\u52A0\u5217\nALTER TABLE users\n  ADD COLUMN phone VARCHAR(20);\n\n-- \u6DFB\u52A0\u7EA6\u675F\nALTER TABLE products\n  ADD CONSTRAINT positive_price\n  CHECK (price > 0);\n\n-- \u67E5\u770B\u8868\u7ED3\u6784\nSELECT column_name, data_type, is_nullable\nFROM information_schema.columns\nWHERE table_name = 'users'\nORDER BY ordinal_position;`,
  },
  {
    label: '\u805A\u5408 + FILTER',
    sql: `-- FILTER \u5B50\u53E5\uFF08PostgreSQL \u7279\u6709\uFF09\nSELECT\n  status,\n  COUNT(*) AS order_count,\n  SUM(unit_price * quantity)\n    FILTER (WHERE status = 'delivered') AS delivered_total,\n  SUM(unit_price * quantity)\n    FILTER (WHERE status = 'pending') AS pending_total\nFROM orders\nGROUP BY status\nORDER BY order_count DESC;`,
  },
]

// ---- State ----
const db = shallowRef<any>(null)
const dbReady = ref(false)
const dbError = ref<string | null>(null)
const editorView = shallowRef<EditorView | null>(null)
const results = ref<QueryResult[]>([])
const isRunning = ref(false)
const initProgress = ref('')
const selectedPreset = ref('')

const editorRef = ref<HTMLDivElement>()
let runQueryFn: (() => void) | null = null

// ---- Editor theme ----
const pgTheme = EditorView.theme({
  '&': {
    backgroundColor: '#121212',
    color: '#dbd7caee',
    fontSize: '13px',
    fontFamily: "'IBM Plex Mono', 'SF Mono', monospace",
  },
  '.cm-content': {
    caretColor: '#42b883',
    lineHeight: '1.7',
    padding: '12px 0',
  },
  '.cm-cursor': {
    borderLeftColor: '#42b883',
  },
  '.cm-gutters': {
    backgroundColor: '#0e0e0e',
    color: '#71717a',
    border: 'none',
    borderRight: '1px solid rgba(255,255,255,0.06)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  '.cm-activeLine': {
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
    backgroundColor: 'rgba(66, 184, 131, 0.2) !important',
  },
  '.cm-matchingBracket': {
    backgroundColor: 'rgba(66, 184, 131, 0.3)',
    outline: '1px solid rgba(66, 184, 131, 0.5)',
  },
  '.cm-selectionMatch': {
    backgroundColor: 'rgba(66, 184, 131, 0.15)',
  },
})

// ---- DB init ----
async function initDB() {
  initProgress.value = '\u52A0\u8F7D PostgreSQL WASM...'
  try {
    const { PGlite } = await import('@electric-sql/pglite')
    initProgress.value = '\u521D\u59CB\u5316\u6570\u636E\u5E93...'
    const pg = await PGlite.create()
    initProgress.value = '\u521B\u5EFA\u793A\u4F8B\u6570\u636E...'
    await pg.exec(INIT_SQL)
    db.value = pg
    dbReady.value = true
    initProgress.value = ''
  } catch (e: any) {
    dbError.value = e.message || '\u65E0\u6CD5\u521D\u59CB\u5316 PostgreSQL'
    initProgress.value = ''
  }
}

// ---- Run query ----
async function runQuery() {
  if (!db.value || isRunning.value) return
  const sqlText = editorView.value?.state.doc.toString().trim()
  if (!sqlText) {
    results.value = [{ type: 'status', message: '\u8BF7\u8F93\u5165 SQL \u67E5\u8BE2' }]
    return
  }
  isRunning.value = true
  results.value = []
  try {
    const raw: any[] = await db.value.exec(sqlText)
    const output: QueryResult[] = []
    for (const r of raw) {
      if (r.rows && r.rows.length > 0) {
        output.push({
          type: 'table',
          fields: r.fields || [],
          rows: r.rows.slice(0, 100),
        })
        if (r.rows.length > 100) {
          output.push({
            type: 'status',
            message: `\u663E\u793A\u524D 100 \u884C\uFF0C\u5171 ${r.rows.length} \u884C`,
          })
        }
      } else if (r.affectedRows !== undefined && r.affectedRows !== null) {
        output.push({
          type: 'status',
          message: `\u5F71\u54CD ${r.affectedRows} \u884C`,
        })
      }
    }
    if (output.length === 0) {
      output.push({ type: 'status', message: '\u67E5\u8BE2\u6267\u884C\u6210\u529F' })
    }
    results.value = output
  } catch (e: any) {
    results.value = [{ type: 'error', message: e.message || '\u67E5\u8BE2\u6267\u884C\u5931\u8D25' }]
  } finally {
    isRunning.value = false
  }
}

runQueryFn = runQuery

// ---- Reset DB ----
async function resetDB() {
  if (!db.value) return
  results.value = []
  await db.value.close()
  db.value = null
  dbReady.value = false
  await initDB()
}

// ---- Load preset ----
function loadPreset(idx: number) {
  const preset = PRESET_QUERIES[idx]
  if (!preset || !editorView.value) return
  selectedPreset.value = String(idx)
  const tr = editorView.value.state.update({
    changes: {
      from: 0,
      to: editorView.value.state.doc.length,
      insert: preset.sql,
    },
  })
  editorView.value.dispatch(tr)
  editorView.value.focus()
}

// ---- Format cell value ----
function formatCell(val: any): string {
  if (val === null || val === undefined) return 'NULL'
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

// ---- Lifecycle ----
onMounted(() => {
  if (!editorRef.value) return
  const state = EditorState.create({
    doc: '-- \u5728\u8FD9\u91CC\u7F16\u5199 PostgreSQL \u67E5\u8BE2\nSELECT * FROM users LIMIT 5;',
    extensions: [
      sql({ dialect: PostgreSQL }),
      pgTheme,
      history(),
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        {
          key: 'Mod-Enter',
          run: () => {
            runQuery()
            return true
          },
        },
      ]),
      EditorView.lineWrapping,
    ],
  })
  editorView.value = new EditorView({
    state,
    parent: editorRef.value,
  })
  initDB()
})

onUnmounted(() => {
  editorView.value?.destroy()
  db.value?.close()
})
</script>

<template>
  <div class="playground-container">
    <!-- Toolbar -->
    <div class="toolbar">
      <div class="toolbar-left">
        <button
          class="run-btn"
          :disabled="!dbReady || isRunning"
          @click="runQuery"
        >
          <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
          {{ isRunning ? '执行中...' : '运行' }}
        </button>
        <span class="shortcut-hint">Ctrl + Enter</span>
      </div>
      <div class="toolbar-right">
        <select
          class="preset-select"
          :value="selectedPreset"
          @change="loadPreset(Number(($event.target as HTMLSelectElement).value))"
        >
          <option value="" disabled>选择示例...</option>
          <option v-for="(p, i) in PRESET_QUERIES" :key="i" :value="i">{{ p.label }}</option>
        </select>
        <button class="reset-btn" :disabled="!dbReady" @click="resetDB">
          <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          重置
        </button>
      </div>
    </div>

    <!-- Editor (always rendered) -->
    <div ref="editorRef" class="editor-wrapper" />

    <!-- Results / Loading / Error -->
    <div class="results-panel">
      <!-- Loading -->
      <div v-if="!dbReady && !dbError" class="loading-overlay">
        <div class="loading-spinner" />
        <p class="loading-text">{{ initProgress || '准备中...' }}</p>
      </div>
      <!-- Init error -->
      <div v-else-if="dbError" class="error-init">
        <span class="error-icon">!</span>
        <span>{{ dbError }}</span>
      </div>
      <!-- Query results -->
      <template v-else>
        <div v-if="results.length === 0" class="results-empty">运行查询查看结果</div>
        <template v-for="(r, i) in results" :key="i">
          <div v-if="r.type === 'table'" class="results-table-wrapper">
            <table class="results-table">
              <thead>
                <tr>
                  <th v-for="f in r.fields" :key="f.name">{{ f.name }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, ri) in r.rows" :key="ri">
                  <td v-for="f in r.fields" :key="f.name">{{ formatCell(row[f.name]) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else-if="r.type === 'status'" class="status-message">{{ r.message }}</div>
          <div v-else-if="r.type === 'error'" class="error-message">{{ r.message }}</div>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.playground-container {
  margin: 24px 0;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  overflow: hidden;
  background: #0e0e0e;
}

/* Loading */
.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}
.loading-spinner {
  width: 28px;
  height: 28px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: #42b883;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.loading-text {
  font-size: 13px;
  color: #a1a1aa;
  font-family: 'IBM Plex Mono', 'SF Mono', monospace;
}
.error-init {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background: rgba(255, 85, 85, 0.1);
  color: #ff6b6b;
  font-size: 13px;
  font-family: 'IBM Plex Mono', 'SF Mono', monospace;
}
.error-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ff6b6b;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

/* Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: #0a0a0a;
  flex-wrap: wrap;
  gap: 8px;
}
.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.run-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border: none;
  border-radius: 6px;
  background: #42b883;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  font-family: 'IBM Plex Sans', sans-serif;
  cursor: pointer;
  transition: background 0.15s;
}
.run-btn:hover:not(:disabled) {
  background: #3aa874;
}
.run-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-icon {
  width: 14px;
  height: 14px;
}
.shortcut-hint {
  font-size: 11px;
  color: #71717a;
  font-family: 'IBM Plex Mono', monospace;
}
.preset-select {
  padding: 6px 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background: #141414;
  color: #e4e4e7;
  font-size: 12px;
  font-family: 'IBM Plex Sans', sans-serif;
  cursor: pointer;
  outline: none;
}
.preset-select:focus {
  border-color: #42b883;
}
.preset-select option {
  background: #141414;
  color: #e4e4e7;
}
.reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background: transparent;
  color: #a1a1aa;
  font-size: 13px;
  font-family: 'IBM Plex Sans', sans-serif;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.reset-btn:hover {
  border-color: rgba(255, 255, 255, 0.2);
  color: #e4e4e7;
}

/* Editor */
.editor-wrapper {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.editor-wrapper :deep(.cm-editor) {
  height: 250px;
}
.editor-wrapper :deep(.cm-scroller) {
  overflow: auto;
  font-family: 'IBM Plex Mono', 'SF Mono', monospace;
}

/* Results */
.results-panel {
  min-height: 60px;
}
.results-empty {
  padding: 30px 20px;
  text-align: center;
  font-size: 13px;
  color: #71717a;
  font-family: 'IBM Plex Mono', monospace;
}
.results-table-wrapper {
  overflow-x: auto;
}
.results-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  font-family: 'IBM Plex Mono', 'SF Mono', monospace;
}
.results-table th {
  text-align: left;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.04);
  color: #a1a1aa;
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  white-space: nowrap;
}
.results-table td {
  padding: 7px 14px;
  color: #dbd7ca;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  white-space: nowrap;
}
.results-table tbody tr:nth-child(even) {
  background: rgba(255, 255, 255, 0.02);
}
.results-table tbody tr:hover {
  background: rgba(66, 184, 131, 0.06);
}
.status-message {
  padding: 10px 16px;
  font-size: 13px;
  color: #42b883;
  font-family: 'IBM Plex Mono', monospace;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}
.error-message {
  padding: 12px 16px;
  font-size: 13px;
  color: #ff6b6b;
  background: rgba(255, 85, 85, 0.06);
  font-family: 'IBM Plex Mono', monospace;
  border-top: 1px solid rgba(255, 85, 85, 0.15);
}
</style>
