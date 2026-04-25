import mysql from "mysql2/promise";
import { readFileSync } from "fs";
import { writeFileSync } from "fs";
import dotenv from "dotenv";
dotenv.config();

async function exportDB() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  console.log("Connected to database");

  let sql = `-- Mareb Insurance Database Export
-- Generated: ${new Date().toISOString()}
-- Import this file into your Namecheap MySQL database via phpMyAdmin

SET FOREIGN_KEY_CHECKS=0;
SET NAMES utf8mb4;

`;

  const tables = [
    "site_settings",
    "insurance_types",
    "branches",
    "hero_slides",
    "statistics",
    "partners",
    "news",
    "contact_submissions",
    "dynamic_pages",
    "team_members",
    "why_us_items",
  ];

  for (const table of tables) {
    try {
      // Check if table exists
      const [rows] = await conn.execute(`SELECT * FROM \`${table}\``);
      
      if (rows.length === 0) {
        sql += `-- Table \`${table}\` is empty\n\n`;
        continue;
      }

      sql += `-- --------------------------------------------------------\n`;
      sql += `-- Data for table \`${table}\`\n`;
      sql += `-- --------------------------------------------------------\n\n`;
      sql += `DELETE FROM \`${table}\`;\n`;

      for (const row of rows) {
        const cols = Object.keys(row).map(c => `\`${c}\``).join(", ");
        const vals = Object.values(row).map(v => {
          if (v === null) return "NULL";
          if (typeof v === "number") return v;
          if (typeof v === "boolean") return v ? 1 : 0;
          if (v instanceof Date) return `'${v.toISOString().slice(0, 19).replace("T", " ")}'`;
          return `'${String(v).replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\n/g, "\\n").replace(/\r/g, "\\r")}'`;
        }).join(", ");
        sql += `INSERT INTO \`${table}\` (${cols}) VALUES (${vals});\n`;
      }
      sql += `\n`;
      console.log(`✓ Exported ${rows.length} rows from ${table}`);
    } catch (e) {
      if (e.code === "ER_NO_SUCH_TABLE") {
        sql += `-- Table \`${table}\` does not exist (skipped)\n\n`;
        console.log(`⚠ Table ${table} does not exist, skipped`);
      } else {
        console.error(`✗ Error exporting ${table}:`, e.message);
      }
    }
  }

  sql += `SET FOREIGN_KEY_CHECKS=1;\n`;
  sql += `\n-- Export complete\n`;

  writeFileSync("/home/ubuntu/mareb-db-export.sql", sql, "utf8");
  console.log("\n✅ Export saved to: /home/ubuntu/mareb-db-export.sql");
  
  await conn.end();
}

exportDB().catch(e => {
  console.error("Export failed:", e.message);
  process.exit(1);
});
