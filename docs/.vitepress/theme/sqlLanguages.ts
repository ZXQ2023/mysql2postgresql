import type { LanguageInput } from 'shiki'

export function mysqlLang(): LanguageInput {
  return {
    name: 'mysql',
    scopeName: 'source.sql',
    displayName: 'MySQL',
    patterns: [
      { include: '#comments' },
      { include: '#mysql-variables' },
      {
        match: '(?i)\\b(SELECT(\\s+(DISTINCT|ALL))?|INSERT(\\s+IGNORE)?\\s+INTO|UPDATE|DELETE|FROM|SET|WHERE|GROUP\\s+BY|HAVING|ORDER\\s+BY|LIMIT|OFFSET|CROSS\\s+JOIN|JOIN|STRAIGHT_JOIN|(INNER|(LEFT|RIGHT|FULL)(\\s+OUTER)?)\\s+JOIN|NATURAL(\\s+(INNER|(LEFT|RIGHT|FULL)(\\s+OUTER)?))?\\s+JOIN|ON|UNION(\\s+ALL)?|AS|INTO|VALUES)\\b',
        name: 'keyword.control.sql',
      },
      {
        match: '(?i)\\b(CREATE(\\s+OR\\s+REPLACE)?|DROP|ALTER|TRUNCATE|RENAME|ADD|MODIFY|CHANGE|AFTER|FIRST|COLUMN|TABLE|INDEX|VIEW|DATABASE|SCHEMA|USER|TRIGGER|PROCEDURE|FUNCTION|TEMPORARY|IF\\s+(NOT\\s+)?EXISTS|CASCADE|RESTRICT)\\b',
        name: 'keyword.other.DDL.sql',
      },
      {
        match: '(?i)\\b(PRIMARY\\s+KEY|FOREIGN\\s+KEY|REFERENCES|UNIQUE|NOT\\s+NULL|NULL|DEFAULT|AUTO_INCREMENT|UNSIGNED|ZEROFILL|CONSTRAINT|CHECK|COLLATE|CHARACTER\\s+SET|ENGINE|COMMENT|ON\\s+(DELETE|UPDATE)(\\s+CASCADE|\\s+SET\\s+NULL|\\s+NO\\s+ACTION|\\s+RESTRICT)?|INPLACE|COPY|ALGORITHM|LOCK)\\b',
        name: 'storage.modifier.sql',
      },
      {
        match: '(?i)\\b(BEGIN|START\\s+TRANSACTION|COMMIT|ROLLBACK|SAVEPOINT|RELEASE\\s+SAVEPOINT|LOCK\\s+TABLES|UNLOCK\\s+TABLES|FOR\\s+UPDATE|LOCK\\s+IN\\s+SHARE\\s+MODE|SHARE\\s+MODE)\\b',
        name: 'keyword.other.LUW.sql',
      },
      {
        match: '(?i)\\b(CASE|WHEN|THEN|ELSE|END|AND|OR|NOT|IN|BETWEEN|LIKE|IS|ISNULL|EXISTS|ALL|ANY|SOME|IF|IFNULL|TRUE|FALSE|UNKNOWN|DIV|MOD)\\b',
        name: 'keyword.operator.sql',
      },
      {
        match: '(?i)\\b(ASC|DESC)\\b',
        name: 'keyword.other.order.sql',
      },
      {
        match: '(?i)\\b(TINYINT|SMALLINT|MEDIUMINT|INT|INTEGER|BIGINT|FLOAT|DOUBLE|DOUBLE\\s+PRECISION|DECIMAL|NUMERIC|BIT|BOOLEAN|BOOL|CHAR|VARCHAR|BINARY|VARBINARY|TINYBLOB|BLOB|MEDIUMBLOB|LONGBLOB|TINYTEXT|TEXT|MEDIUMTEXT|LONGTEXT|ENUM|SET|DATE|DATETIME|TIMESTAMP|TIME|YEAR|JSON|GEOMETRY|POINT|LINESTRING|POLYGON|MULTIPOINT|MULTILINESTRING|MULTIPOLYGON|GEOMETRYCOLLECTION|SERIAL)\\b',
        name: 'support.type.sql',
      },
      {
        match: '(?i)\\b(COUNT|SUM|AVG|MIN|MAX|GROUP_CONCAT|STD|STDDEV|STDDEV_POP|STDDEV_SAMP|VARIANCE|VAR_POP|VAR_SAMP|BIT_AND|BIT_OR|BIT_XOR)\\b\\s*\\(',
        captures: { '1': { name: 'support.function.aggregate.sql' } },
      },
      {
        match: '(?i)\\b(NOW|CURDATE|CURTIME|SYSDATE|CURRENT_TIMESTAMP|CURRENT_DATE|CURRENT_TIME|LOCALTIME|LOCALTIMESTAMP|DATE_ADD|DATE_SUB|ADDDATE|SUBDATE|DATE_FORMAT|STR_TO_DATE|DATEDIFF|TIMESTAMPDIFF|TIMESTAMPADD|YEAR|MONTH|DAY|HOUR|MINUTE|SECOND|QUARTER|WEEK|DAYOFYEAR|DAYOFMONTH|DAYOFWEEK|DAYNAME|MONTHNAME|LAST_DAY|DATE|TIME|SECOND\\(\\)|MICROSECOND|EXTRACT|INTERVAL|PERIOD_ADD|PERIOD_DIFF|TO_DAYS|FROM_DAYS|SEC_TO_TIME|TIME_TO_SEC|UNIX_TIMESTAMP|FROM_UNIXTIME|GET_FORMAT)\\b\\s*(?=\\()',
        name: 'support.function.datetime.sql',
      },
      {
        match: '(?i)\\b(CONCAT|CONCAT_WS|LENGTH|CHAR_LENGTH|CHARACTER_LENGTH|BIT_LENGTH|OCTET_LENGTH|SUBSTRING|SUBSTRING_INDEX|LEFT|RIGHT|TRIM|LTRIM|RTRIM|UPPER|LOWER|UCASE|LCASE|REPLACE|REVERSE|REPEAT|SPACE|LPAD|RPAD|ASCII|ORD|CHR|CHAR|ELT|FIELD|FIND_IN_SET|MAKE_SET|EXPORT_SET|INSERT|INSTR|LOCATE|POSITION|QUOTE|SOUNDEX|SOUNDS\\s+LIKE|REGEXP|RLIKE|REGEXP_REPLACE|REGEXP_INSTR|REGEXP_SUBSTR|FORMAT|HEX|UNHEX|BIN|OCT|CONV|LOAD_FILE|UUID|UUID_SHORT|UUID_TO_BIN|BIN_TO_UUID|IS_UUID)\\b\\s*(?=\\()',
        name: 'support.function.string.sql',
      },
      {
        match: '(?i)\\b(IF|IFNULL|NULLIF|COALESCE|ISNULL|GREATEST|LEAST|CAST|CONVERT|BINARY)\\b',
        name: 'support.function.flow.sql',
      },
      {
        match: '(?i)\\b(ABS|CEIL|CEILING|FLOOR|ROUND|TRUNCATE|MOD|POW|POWER|SQRT|SIGN|RAND|RAND\\(\\)|PI|EXP|LN|LOG|LOG2|LOG10|SIN|COS|TAN|ASIN|ACOS|ATAN|ATAN2|COT|RADIANS|DEGREES|CRC32|SIGN)\\b\\s*(?=\\()',
        name: 'support.function.math.sql',
      },
      {
        match: '(?i)\\b(JSON_ARRAY|JSON_OBJECT|JSON_EXTRACT|JSON_UNQUOTE|JSON_QUOTE|JSON_CONTAINS|JSON_CONTAINS_PATH|JSON_KEYS|JSON_OVERLAPS|JSON_SEARCH|JSON_SET|JSON_INSERT|JSON_REPLACE|JSON_REMOVE|JSON_MERGE|JSON_MERGE_PRESERVE|JSON_MERGE_PATCH|JSON_TABLE|JSON_SCHEMA_VALID|JSON_SCHEMA_VALIDATION_REPORT|JSON_DEPTH|JSON_LENGTH|JSON_TYPE|JSON_VALID|JSON_VALUE|MEMBER\\s+OF|CAST)\\b\\s*(?=\\()',
        name: 'support.function.json.sql',
      },
      {
        match: '(?i)\\b(WITH|RECURSIVE|CTE|OVER|PARTITION\\s+BY|ROWS\\s+BETWEEN|RANGE\\s+BETWEEN|UNBOUNDED\\s+PRECEDING|UNBOUNDED\\s+FOLLOWING|CURRENT\\s+ROW|PRECEDING|FOLLOWING|ROW_NUMBER|RANK|DENSE_RANK|NTILE|LEAD|LAG|FIRST_VALUE|LAST_VALUE|NTH_VALUE|PERCENT_RANK|CUME_DIST|PERCENTILE_CONT|PERCENTILE_DISC)\\b',
        name: 'keyword.control.window.sql',
      },
      {
        match: '(?i)\\b(EXPLAIN|DESCRIBE|DESC|SHOW|USE|GRANT|REVOKE|FLUSH|RESET|KILL|OPTIMIZE|ANALYZE|REPAIR|BACKUP|RESTORE|BINLOG|MASTER|SLAVE|REPLICATION|PURGE)\\b',
        name: 'keyword.other.admin.sql',
      },
      {
        match: '\\b\\d+\\b',
        name: 'constant.numeric.sql',
      },
      { include: '#operators' },
      { include: '#strings' },
    ],
    repository: {
      'comments': {
        patterns: [
          {
            begin: '(^[\\t ]+)?(?=--)',
            beginCaptures: { '1': { name: 'punctuation.whitespace.comment.leading.sql' } },
            end: '(?!\\G)',
            patterns: [
              {
                begin: '--',
                beginCaptures: { '0': { name: 'punctuation.definition.comment.sql' } },
                end: '\\n',
                name: 'comment.line.double-dash.sql',
              },
            ],
          },
          {
            begin: '/\\*',
            captures: { '0': { name: 'punctuation.definition.comment.sql' } },
            end: '\\*/',
            name: 'comment.block.sql',
          },
        ],
      },
      'mysql-variables': {
        patterns: [
          { match: '@\\w+', name: 'variable.other.sql' },
          { match: '@@\\w+', name: 'variable.other.system.sql' },
        ],
      },
      'operators': {
        patterns: [
          { match: '<=>|!=|<>|[!<>]?=', name: 'keyword.operator.comparison.sql' },
          { match: '\\|\\|', name: 'keyword.operator.concatenator.sql' },
          { match: '&&|\\|\\|', name: 'keyword.operator.logical.sql' },
          { match: '<<|>>', name: 'keyword.operator.bitwise.sql' },
          { match: '[-+*/%]', name: 'keyword.operator.math.sql' },
          { match: '\\*', name: 'keyword.operator.star.sql' },
        ],
      },
      'strings': {
        patterns: [
          {
            begin: "'",
            beginCaptures: { '0': { name: 'punctuation.definition.string.begin.sql' } },
            end: "'",
            endCaptures: { '0': { name: 'punctuation.definition.string.end.sql' } },
            name: 'string.quoted.single.sql',
            patterns: [{ match: "\\\\[\\\\\"'nrtbf0]", name: 'constant.character.escape.sql' }],
          },
          {
            begin: '"',
            beginCaptures: { '0': { name: 'punctuation.definition.string.begin.sql' } },
            end: '"',
            endCaptures: { '0': { name: 'punctuation.definition.string.end.sql' } },
            name: 'string.quoted.double.sql',
          },
          {
            begin: '`',
            beginCaptures: { '0': { name: 'punctuation.definition.string.begin.sql' } },
            end: '`',
            endCaptures: { '0': { name: 'punctuation.definition.string.end.sql' } },
            name: 'string.quoted.other.backtick.sql',
          },
        ],
      },
    },
  }
}

export function pgsqlLang(): LanguageInput {
  return {
    name: 'pgsql',
    scopeName: 'source.sql.pgsql',
    displayName: 'PostgreSQL',
    patterns: [
      { include: '#comments' },
      {
        match: '(?i)\\b(SELECT(\\s+(DISTINCT|ALL))?|INSERT\\s+INTO|UPDATE|DELETE\\s+FROM|FROM|SET|WHERE|GROUP\\s+BY|HAVING|ORDER\\s+BY|LIMIT|OFFSET|CROSS\\s+JOIN|JOIN|(INNER|(LEFT|RIGHT|FULL)(\\s+OUTER)?)\\s+JOIN|NATURAL(\\s+(INNER|(LEFT|RIGHT|FULL)(\\s+OUTER)?))?\\s+JOIN|ON|USING|UNION(\\s+ALL)?|INTERSECT(\\s+ALL)?|EXCEPT(\\s+ALL)?|LATERAL|TABLESAMPLE|TABLE|ONLY|AS|INTO|VALUES|RETURNING)\\b',
        name: 'keyword.control.sql',
      },
      {
        match: '(?i)\\b(CREATE(\\s+OR\\s+REPLACE)?|DROP|ALTER|TRUNCATE|RENAME|ADD|MODIFY|COLUMN|TABLE|INDEX|VIEW|MATERIALIZED\\s+VIEW|DATABASE|SCHEMA|USER|ROLE|GROUP|TRIGGER|PROCEDURE|FUNCTION|AGGREGATE|DOMAIN|TYPE|SEQUENCE|TABLESPACE|EXTENSION|TEMPORARY|TEMP|IF\\s+(NOT\\s+)?EXISTS|CASCADE|RESTRICT|REPLACE|OWNER\\s+TO|SET\\s+SCHEMA)\\b',
        name: 'keyword.other.DDL.sql',
      },
      {
        match: '(?i)\\b(PRIMARY\\s+KEY|FOREIGN\\s+KEY|REFERENCES|UNIQUE|NOT\\s+NULL|NULL|DEFAULT|CHECK|CONSTRAINT|DEFERRABLE|INITIALLY\\s+(DEFERRED|IMMEDIATE)|EXCLUDE\\s+USING|GENERATED\\s+(ALWAYS|BY\\s+DEFAULT)\\s+AS\\s+IDENTITY|ON\\s+(DELETE|UPDATE)(\\s+CASCADE|\\s+SET\\s+NULL|\\s+SET\\s+DEFAULT|\\s+NO\\s+ACTION|\\s+RESTRICT)?|ENCRYPTION|WITH\\s+\\(|COMPRESSION)\\b',
        name: 'storage.modifier.sql',
      },
      {
        match: '(?i)\\b(BEGIN|START\\s+TRANSACTION|COMMIT|ROLLBACK|SAVEPOINT|RELEASE\\s+SAVEPOINT|PREPARE\\s+TRANSACTION|COMMIT\\s+PREPARED|ROLLBACK\\s+PREPARED|LOCK\\s+TABLE|FOR\\s+(UPDATE|NO\\s+KEY\\s+UPDATE|SHARE|KEY\\s+SHARE)|NOWAIT|SKIP\\s+LOCKED)\\b',
        name: 'keyword.other.LUW.sql',
      },
      {
        match: '(?i)\\b(CASE|WHEN|THEN|ELSE|END|AND|OR|NOT|IN|BETWEEN|LIKE|ILIKE|SIMILAR\\s+TO|IS|ISNULL|NOTNULL|IS\\s+DISTINCT\\s+FROM|IS\\s+NOT\\s+DISTINCT\\s+FROM|EXISTS|ALL|ANY|SOME|TRUE|FALSE|NULL)\\b',
        name: 'keyword.operator.sql',
      },
      {
        match: '(?i)\\b(ASC|DESC|NULLS\\s+(FIRST|LAST))\\b',
        name: 'keyword.other.order.sql',
      },
      {
        match: '(?i)\\b(SMALLINT|INTEGER|INT|BIGINT|SERIAL|BIGSERIAL|SMALLSERIAL|INT2|INT4|INT8|FLOAT4|FLOAT8|REAL|DOUBLE\\s+PRECISION|NUMERIC|DECIMAL|MONEY|CHARACTER\\s+VARYING|VARCHAR|CHARACTER|CHAR|TEXT|BYTEA|BIT\\s+VARYING|VARBIT|BIT|BOOLEAN|BOOL|DATE|TIMESTAMP(\\s+WITH(OUT)?\\s+TIME\\s+ZONE)?|TIME(\\s+WITH(OUT)?\\s+TIME\\s+ZONE)?|INTERVAL|UUID|JSON|JSONB|XML|POINT|LINE|LSeg|BOX|PATH|POLYGON|CIRCLE|CIDR|INET|MACADDR|MACADDR8|TSVECTOR|TSQUERY|OID|REGCLASS|REGTYPE|REGPROC|REGNAMESPACE|NAME|OIDVECTOR|INT2VECTOR|PG_LSN|PG_SNAPSHOT|TXID_SNAPSHOT|CID|XID|TID|ANYARRAY|ANYELEMENT|ANYENUM|ANYRANGE|ANYNONARRAY|UNKNOWN|INTERNAL|RECORD|TRIGGER|EVTTRIGGER|LANGUAGE_HANDLER|FDW_HANDLER|INDEX_AM_HANDLER|TSM_HANDLER|INTERNAL|OPAQUE|PG_DDL_COMMAND|VOID)\\b',
        name: 'support.type.sql',
      },
      {
        match: '(?i)\\b(COUNT|SUM|AVG|MIN|MAX|ARRAY_AGG|STRING_AGG|BIT_AND|BIT_OR|BOOL_AND|BOOL_OR|EVERY|JSON_AGG|JSONB_AGG|JSON_OBJECT_AGG|JSONB_OBJECT_AGG|XMLAGG|PERCENTILE_CONT|PERCENTILE_DISC|MODE|RANK|DENSE_RANK|PERCENT_RANK|CUME_DIST|NTILE|LAG|LEAD|FIRST_VALUE|LAST_VALUE|NTH_VALUE|ROW_NUMBER|GROUPING)\\b\\s*(?=\\()',
        name: 'support.function.aggregate.sql',
      },
      {
        match: '(?i)\\b(NOW|CURRENT_TIMESTAMP|CURRENT_DATE|CURRENT_TIME|LOCALTIMESTAMP|LOCALTIME|CLOCK_TIMESTAMP|STATEMENT_TIMESTAMP|TRANSACTION_TIMESTAMP|TODAY|AGE|DATE_TRUNC|DATE_PART|EXTRACT|TO_CHAR|TO_DATE|TO_TIMESTAMP|MAKE_DATE|MAKE_TIME|MAKE_TIMESTAMPTZ|MAKE_TIMESTAMP|JUSTIFY_DAYS|JUSTIFY_HOURS|JUSTIFY_INTERVAL|ISFINITE|AT\\s+TIME\\s+ZONE|OVERLAPS|INTERVAL)\\b\\s*(?=\\()',
        name: 'support.function.datetime.sql',
      },
      {
        match: '(?i)\\b(CONCAT|CONCAT_WS|LENGTH|CHAR_LENGTH|CHARACTER_LENGTH|BIT_LENGTH|OCTET_LENGTH|SUBSTRING|TRIM|LEADING|TRAILING|BOTH|UPPER|LOWER|INITCAP|REPLACE|REVERSE|REPEAT|LPAD|RPAD|ASCII|CHR|LEFT|RIGHT|QUOTE_IDENT|QUOTE_LITERAL|QUOTE_NULLABLE|FORMAT|MD5|SHA224|SHA256|SHA384|SHA512|ENCODE|DECODE|TO_HEX|TO_ASCII|BTRIM|LTRIM|RTRIM|OVERLAY|POSITION|SPLIT_PART|STRPOS|TRANSLATE|REGEXP_REPLACE|REGEXP_MATCHES|REGEXP_SPLIT_TO_TABLE|REGEXP_SPLIT_TO_ARRAY|SIMILAR\\s+ESCAPE)\\b\\s*(?=\\()',
        name: 'support.function.string.sql',
      },
      {
        match: '(?i)\\b(COALESCE|NULLIF|GREATEST|LEAST|CAST)\\b',
        name: 'support.function.flow.sql',
      },
      {
        match: '(?i)\\b(ABS|CEIL|CEILING|FLOOR|ROUND|TRUNC|MOD|POWER|SQRT|CBRT|SIGN|RANDOM|SETSEED|PI|EXP|LN|LOG|LOG10|SIN|COS|TAN|ASIN|ACOS|ATAN|ATAN2|COT|RADIANS|DEGREES|WIDTH_BUCKET|MIN_SCALE|MAX_SCALE|SCALE|TRUNC|DIV)\\b\\s*(?=\\()',
        name: 'support.function.math.sql',
      },
      {
        match: '(?i)\\b(JSON_ARRAY|JSON_OBJECT|JSON_BUILD_ARRAY|JSON_BUILD_OBJECT|TO_JSON|TO_JSONB|JSONB_BUILD_ARRAY|JSONB_BUILD_OBJECT|JSON_ARRAY_ELEMENTS|JSON_ARRAY_ELEMENTS_TEXT|JSONB_ARRAY_ELEMENTS|JSONB_ARRAY_ELEMENTS_TEXT|JSON_EACH|JSON_EACH_TEXT|JSONB_EACH|JSONB_EACH_TEXT|JSON_EXTRACT_PATH|JSON_EXTRACT_PATH_TEXT|JSONB_EXTRACT_PATH|JSONB_EXTRACT_PATH_TEXT|JSON_INSERT|JSON_REPLACE|JSON_SET|JSONB_SET|JSONB_SET_LAX|JSONB_INSERT|JSON_STRIP_NULLS|JSONB_STRIP_NULLS|JSON_TYPEOF|JSONB_TYPEOF|JSON_TO_RECORD|JSONB_TO_RECORD|JSON_TO_RECORDSET|JSONB_TO_RECORDSET|JSON_POPULATE_RECORD|JSONB_POPULATE_RECORD|JSON_POPULATE_RECORDSET|JSONB_POPULATE_RECORDSET|JSONB_PRETTY|ROW_TO_JSON|JSON_AGG|JSONB_AGG|JSON_OBJECT_AGG|JSONB_OBJECT_AGG|JSONB_PATH_EXISTS|JSONB_PATH_MATCH|JSONB_PATH_QUERY|JSONB_PATH_QUERY_ARRAY|JSONB_PATH_QUERY_FIRST|JSONB_PATH_EXISTS_TZ|JSONB_PATH_MATCH_TZ|JSONB_PATH_QUERY_TZ|JSONB_PATH_QUERY_ARRAY_TZ|JSONB_PATH_QUERY_FIRST_TZ)\\b\\s*(?=\\()',
        name: 'support.function.json.sql',
      },
      {
        match: '(?i)\\b(WITH|RECURSIVE|OVER|PARTITION\\s+BY|ROWS\\s+BETWEEN|RANGE\\s+BETWEEN|UNBOUNDED\\s+PRECEDING|UNBOUNDED\\s+FOLLOWING|CURRENT\\s+ROW|PRECEDING|FOLLOWING)\\b',
        name: 'keyword.control.window.sql',
      },
      {
        match: '(?i)\\b(EXPLAIN|ANALYZE|VERBOSE|DESCRIBE|SHOW|GRANT|REVOKE|VACUUM|REINDEX|CLUSTER|DISCARD|LISTEN|NOTIFY|UNLISTEN|LOAD|COPY|DO|RAISE|NOTICE|EXCEPTION|DEBUG|LOG|INFO|WARNING|ASSERT|PERFORM|EXECUTE|DEALLOCATE|PREPARE|DISCARD\\s+PLANS|DISCARD\\s+SEQUENCES|DISCARD\\s+TEMP)\\b',
        name: 'keyword.other.admin.sql',
      },
      {
        match: '(?i)\\b(RETURN|RETURNS|LANGUAGE|PLPGSQL|VOLATILE|STABLE|IMMUTABLE|STRICT|CALLED\\s+ON\\s+NULL\\s+INPUT|RETURNS\\s+NULL\\s+ON\\s+NULL\\s+INPUT|SECURITY\\s+(DEFINER|INVOKER)|COST|ROWS|PARALLEL|LEAKPROOF)\\b',
        name: 'keyword.other.plpgsql.sql',
      },
      {
        match: '(?i)\\b(ARRAY|ROW|RECORD|SETOF|VARIADIC|INOUT|OUT|INOUT|VARIADIC)\\b',
        name: 'keyword.other.type-modifier.sql',
      },
      {
        match: '(?i)\\b(SELECT|INSERT|UPDATE|DELETE)\\b',
        name: 'keyword.control.DML.sql',
      },
      {
        match: '(?i)\\b(FETCH|NEXT|PRIOR|FIRST|LAST|ABSOLUTE|RELATIVE|FROM|IN|CLOSE|OPEN|MOVE|DECLARE|SCROLL|NO\\s+SCROLL|WITH\\s+HOLD|WITHOUT\\s+HOLD|CURSOR|FOR)\\b',
        name: 'keyword.control.cursor.sql',
      },
      {
        match: '\\b\\d+\\b',
        name: 'constant.numeric.sql',
      },
      { include: '#operators' },
      { include: '#strings' },
    ],
    repository: {
      'comments': {
        patterns: [
          {
            begin: '(^[\\t ]+)?(?=--)',
            beginCaptures: { '1': { name: 'punctuation.whitespace.comment.leading.sql' } },
            end: '(?!\\G)',
            patterns: [
              {
                begin: '--',
                beginCaptures: { '0': { name: 'punctuation.definition.comment.sql' } },
                end: '\\n',
                name: 'comment.line.double-dash.sql',
              },
            ],
          },
          {
            begin: '/\\*',
            captures: { '0': { name: 'punctuation.definition.comment.sql' } },
            end: '\\*/',
            name: 'comment.block.sql',
          },
        ],
      },
      'operators': {
        patterns: [
          { match: '::', name: 'keyword.operator.cast.sql' },
          { match: '->>|->', name: 'keyword.operator.json.sql' },
          { match: '#>|#>>', name: 'keyword.operator.json-path.sql' },
          { match: '\\?|\\?\\||\\?&|@>', name: 'keyword.operator.json-containment.sql' },
          { match: '\\|\\|', name: 'keyword.operator.concatenator.sql' },
          { match: '!=|<>|[!<>]?=', name: 'keyword.operator.comparison.sql' },
          { match: '[-+*/%]', name: 'keyword.operator.math.sql' },
          { match: '~(~\\*)?|!~(!~\\*)?', name: 'keyword.operator.regex.sql' },
          { match: '\\*', name: 'keyword.operator.star.sql' },
        ],
      },
      'strings': {
        patterns: [
          {
            begin: "'",
            beginCaptures: { '0': { name: 'punctuation.definition.string.begin.sql' } },
            end: "'",
            endCaptures: { '0': { name: 'punctuation.definition.string.end.sql' } },
            name: 'string.quoted.single.sql',
            patterns: [{ match: "''", name: 'constant.character.escape.sql' }],
          },
          {
            begin: '"',
            beginCaptures: { '0': { name: 'punctuation.definition.string.begin.sql' } },
            end: '"',
            endCaptures: { '0': { name: 'punctuation.definition.string.end.sql' } },
            name: 'string.quoted.double.sql',
          },
          {
            begin: "(?i)E'",
            beginCaptures: { '0': { name: 'punctuation.definition.string.begin.sql' } },
            end: "'",
            endCaptures: { '0': { name: 'punctuation.definition.string.end.sql' } },
            name: 'string.quoted.single.escape.sql',
          },
          {
            begin: '(?i)\\$\\$',
            beginCaptures: { '0': { name: 'punctuation.definition.string.begin.sql' } },
            end: '\\$\\$',
            endCaptures: { '0': { name: 'punctuation.definition.string.end.sql' } },
            name: 'string.quoted.dollar.sql',
          },
          {
            begin: '(?i)\\$[a-zA-Z_]+\\$',
            beginCaptures: { '0': { name: 'punctuation.definition.string.begin.sql' } },
            end: '\\$[a-zA-Z_]+\\$',
            endCaptures: { '0': { name: 'punctuation.definition.string.end.sql' } },
            name: 'string.quoted.dollar.sql',
          },
        ],
      },
    },
  }
}
