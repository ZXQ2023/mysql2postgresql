import type { ThemeInput } from 'shiki'

export const sqlTheme: ThemeInput = {
  name: 'sql-dark',
  displayName: 'SQL Dark',
  type: 'dark',
  colors: {
    'editor.background': '#121212',
    'editor.foreground': '#dbd7caee',
  },
  tokenColors: [
    {
      scope: ['comment', 'punctuation.definition.comment', 'string.comment'],
      settings: { foreground: '#ffffff', fontStyle: 'bold' },
    },
    {
      scope: ['keyword.control.sql', 'keyword.control.DML.sql'],
      settings: { foreground: '#4dd0a8', fontStyle: 'bold' },
    },
    {
      scope: ['keyword.other.DDL.sql'],
      settings: { foreground: '#5ebd7a' },
    },
    {
      scope: ['storage.modifier.sql'],
      settings: { foreground: '#e06c75' },
    },
    {
      scope: ['keyword.other.LUW.sql'],
      settings: { foreground: '#c678dd' },
    },
    {
      scope: ['keyword.operator.sql'],
      settings: { foreground: '#c678ddcc' },
    },
    {
      scope: ['keyword.other.order.sql'],
      settings: { foreground: '#56b6c2' },
    },
    {
      scope: ['support.type.sql'],
      settings: { foreground: '#e5a07a' },
    },
    {
      scope: ['support.function.aggregate.sql'],
      settings: { foreground: '#e6cc77' },
    },
    {
      scope: ['support.function.datetime.sql'],
      settings: { foreground: '#f0a0a0' },
    },
    {
      scope: ['support.function.string.sql'],
      settings: { foreground: '#6eb4b4' },
    },
    {
      scope: ['support.function.flow.sql'],
      settings: { foreground: '#d4b36a' },
    },
    {
      scope: ['support.function.math.sql'],
      settings: { foreground: '#7a9ec6' },
    },
    {
      scope: ['support.function.json.sql'],
      settings: { foreground: '#b07fd8' },
    },
    {
      scope: ['keyword.control.window.sql'],
      settings: { foreground: '#a78bda' },
    },
    {
      scope: ['keyword.other.admin.sql'],
      settings: { foreground: '#7a7e80' },
    },
    {
      scope: ['keyword.other.plpgsql.sql'],
      settings: { foreground: '#c678dd99' },
    },
    {
      scope: ['keyword.other.type-modifier.sql'],
      settings: { foreground: '#d19a66' },
    },
    {
      scope: ['keyword.control.cursor.sql'],
      settings: { foreground: '#56b6c2' },
    },
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
    {
      scope: ['constant.character.escape.sql'],
      settings: { foreground: '#e6cc77' },
    },
    {
      scope: ['constant.numeric.sql'],
      settings: { foreground: '#4CC9B0' },
    },
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
    {
      scope: ['variable.other.sql', 'variable.other.system.sql'],
      settings: { foreground: '#e06c75cc' },
    },
    {
      scope: ['punctuation', 'delimiter'],
      settings: { foreground: '#666666' },
    },
  ],
}
