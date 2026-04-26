import mysql from 'mysql2/promise';
import { readFileSync, writeFileSync } from 'fs';
import { config } from 'dotenv';
config();

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Get actual table names from DB
  const [tableRows] = await conn.query('SHOW TABLES');
  const tables = tableRows.map(r => Object.values(r)[0]);
  console.log('Tables found:', tables.join(', '));
  
  let sql = '-- Mareb Insurance DB Export v11\n';
  sql += 'SET NAMES utf8mb4;\n\n';
  
  for (const t of tables) {
    const [rows] = await conn.query(`SELECT * FROM \`${t}\``);
    if (rows.length === 0) continue;
    const cols = Object.keys(rows[0]).map(c => `\`${c}\``).join(',');
    sql += `-- Table: ${t} (${rows.length} rows)\n`;
    for (const row of rows) {
      const vals = Object.values(row).map(v => {
        if (v === null) return 'NULL';
        if (v instanceof Date) return conn.escape(v);
        return conn.escape(v);
      }).join(',');
      sql += `INSERT IGNORE INTO \`${t}\` (${cols}) VALUES (${vals});\n`;
    }
    sql += '\n';
  }
  
  writeFileSync('/tmp/mareb-deploy-v11/mareb-db-export-v11.sql', sql);
  console.log('DB export done:', sql.length, 'chars');
  await conn.end();
}

main().catch(console.error);
