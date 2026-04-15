import type { ThemeInput } from 'shiki'

/**
 * SQL 优化主题 — 基于 vitesse-dark，专为 SQL 阅读体验定制
 *
 * 配色设计理念：
 * - DML 关键字 (SELECT/INSERT/UPDATE/DELETE): 亮绿 — 最高优先级，语句骨架
 * - DDL 关键字 (CREATE/ALTER/DROP): 翠绿 — 结构定义，与 DML 同族但可区分
 * - 约束/修饰符 (PRIMARY KEY/NOT NULL): 玫红 — 数据完整性约束
 * - 逻辑运算符 (AND/OR/IN/BETWEEN): 淡紫 — 控制流，视觉上弱于关键字
 * - 数据类型 (INT/VARCHAR/TEXT): 暖橙 — 类型标记
 * - 聚合/窗口函数 (COUNT/SUM/ROW_NUMBER): 亮黄 — 函数调用醒目
 * - 日期函数 (NOW/DATE_ADD): 粉橘 — 时序类函数
 * - 字符串函数 (CONCAT/REPLACE): 淡蓝绿 — 文本处理
 * - JSON 函数 (JSON_EXTRACT/->): 紫罗兰 — JSON 特有色彩
 * - 流程函数 (IF/COALESCE/CAST): 淡金 — 流程控制
 * - 数学函数 (ABS/ROUND): 灰蓝 — 数值计算
 * - 字符串字面量: 暖珊瑚 — 数据内容
 * - 数值: 亮青 — 字面量醒目
 * - 注释: 灰绿 — 低视觉权重
 * - 管理命令 (EXPLAIN/SHOW): 灰色 — 辅助信息
 * - 窗口子句 (OVER/PARTITION BY): 薰衣草 — 窗口函数语法
 */
export const sqlTheme: ThemeInput = {
  name: 'sql-dark',
  displayName: 'SQL Dark',
  type: 'dark',
  colors: {
    'editor.background': '#121212',
    'editor.foreground': '#dbd7caee',
  },
  tokenColors: [
    // ── 注释 ──
    {
      scope: ['comment', 'punctuation.definition.comment', 'string.comment'],
      settings: { foreground: '#636f6299' },
    },

    // ── DML 关键字: SELECT / INSERT / UPDATE / DELETE / FROM / WHERE / JOIN ──
    {
      scope: ['keyword.control.sql', 'keyword.control.DML.sql'],
      settings: { foreground: '#4dd0a8', fontStyle: 'bold' },
    },

    // ── DDL 关键字: CREATE / ALTER / DROP / TRUNCATE ──
    {
      scope: ['keyword.other.DDL.sql'],
      settings: { foreground: '#5ebd7a' },
    },

    // ── 约束/修饰符: PRIMARY KEY / NOT NULL / DEFAULT / AUTO_INCREMENT ──
    {
      scope: ['storage.modifier.sql'],
      settings: { foreground: '#e06c75' },
    },

    // ── 事务关键字: BEGIN / COMMIT / ROLLBACK ──
    {
      scope: ['keyword.other.LUW.sql'],
      settings: { foreground: '#c678dd' },
    },

    // ── 逻辑运算符: AND / OR / NOT / IN / BETWEEN / LIKE / IS ──
    {
      scope: ['keyword.operator.sql'],
      settings: { foreground: '#c678ddcc' },
    },

    // ── 排序: ASC / DESC / NULLS FIRST/LAST ──
    {
      scope: ['keyword.other.order.sql'],
      settings: { foreground: '#56b6c2' },
    },

    // ── 数据类型: INT / VARCHAR / TEXT / BOOLEAN / TIMESTAMP ──
    {
      scope: ['support.type.sql'],
      settings: { foreground: '#e5a07a' },
    },

    // ── 聚合函数: COUNT / SUM / AVG / MIN / MAX ──
    {
      scope: ['support.function.aggregate.sql'],
      settings: { foreground: '#e6cc77' },
    },

    // ── 日期时间函数: NOW / DATE_ADD / EXTRACT ──
    {
      scope: ['support.function.datetime.sql'],
      settings: { foreground: '#f0a0a0' },
    },

    // ── 字符串函数: CONCAT / REPLACE / SUBSTRING ──
    {
      scope: ['support.function.string.sql'],
      settings: { foreground: '#6eb4b4' },
    },

    // ── 流程函数: IF / COALESCE / NULLIF / CAST ──
    {
      scope: ['support.function.flow.sql'],
      settings: { foreground: '#d4b36a' },
    },

    // ── 数学函数: ABS / ROUND / FLOOR ──
    {
      scope: ['support.function.math.sql'],
      settings: { foreground: '#7a9ec6' },
    },

    // ── JSON 函数: JSON_EXTRACT / jsonb_set ──
    {
      scope: ['support.function.json.sql'],
      settings: { foreground: '#b07fd8' },
    },

    // ── 窗口函数子句: OVER / PARTITION BY / ROWS BETWEEN ──
    {
      scope: ['keyword.control.window.sql'],
      settings: { foreground: '#a78bda' },
    },

    // ── 管理命令: EXPLAIN / SHOW / GRANT ──
    {
      scope: ['keyword.other.admin.sql'],
      settings: { foreground: '#7a7e80' },
    },

    // ── PL/pgSQL 关键字 ──
    {
      scope: ['keyword.other.plpgsql.sql'],
      settings: { foreground: '#c678dd99' },
    },

    // ── 类型修饰符: ARRAY / ROW / SETOF ──
    {
      scope: ['keyword.other.type-modifier.sql'],
      settings: { foreground: '#d19a66' },
    },

    // ── 游标关键字 ──
    {
      scope: ['keyword.control.cursor.sql'],
      settings: { foreground: '#56b6c2' },
    },

    // ── 字符串字面量 ──
    {
      scope: [
        'string.quoted.single.sql',
        'string.quoted.double.sql',
        'string.quoted.other.backtick.sql',
        'string.quoted.dollar.sql',
        'string.quoted.single.escape.sql',
        'punctuation.definition.string.begin.sql',
        'punctuation.definition.string.end.sql',
      ],
      settings: { foreground: '#c98a7d' },
    },

    // ── 转义字符 ──
    {
      scope: ['constant.character.escape.sql'],
      settings: { foreground: '#e6cc77' },
    },

    // ── 数值 ──
    {
      scope: ['constant.numeric.sql'],
      settings: { foreground: '#4CC9B0' },
    },

    // ── 运算符 ──
    {
      scope: [
        'keyword.operator.comparison.sql',
        'keyword.operator.math.sql',
        'keyword.operator.star.sql',
        'keyword.operator.logical.sql',
        'keyword.operator.bitwise.sql',
        'keyword.operator.concatenator.sql',
        'keyword.operator.cast.sql',
        'keyword.operator.json.sql',
        'keyword.operator.json-path.sql',
        'keyword.operator.json-containment.sql',
        'keyword.operator.regex.sql',
      ],
      settings: { foreground: '#cb7676' },
    },

    // ── 变量 ──
    {
      scope: ['variable.other.sql', 'variable.other.system.sql'],
      settings: { foreground: '#e06c75cc' },
    },

    // ── 标点/分隔符 ──
    {
      scope: ['punctuation', 'delimiter'],
      settings: { foreground: '#666666' },
    },
  ],
}
