/**
 * Update branch emails to @myicyemen.com and add fax numbers
 * Run: ~/nodevenv/test.myicyemen.com/20/bin/node namecheap-update-emails.mjs
 */
import mysql from 'mysql2/promise';
import { config } from 'dotenv';
config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
console.log('✅ Connected to database');

// ─── Update branch emails ───────────────────────────────────────────────────
const branchUpdates = [
  {
    nameAr: 'المركز الرئيسي - عدن',
    email: 'info@myicyemen.com',
    phone: '+967 02 362 317 / 318 / 319',
    fax: '+967 02 362 317',
  },
  {
    nameAr: 'فرع صنعاء',
    email: 'sanaa@myicyemen.com',
    phone: '+967 1 206127 / 402049 / 402010',
    fax: '+967 1 206114 / 206118 / 474416',
  },
  {
    nameAr: 'فرع تعز',
    email: 'taiz@myicyemen.com',
    phone: '+967 4 240933 / 240934 / 240927 / 240928',
    fax: '+967 4 240922',
  },
  {
    nameAr: 'فرع الحديدة',
    email: 'hodeidah@myicyemen.com',
    phone: '+967 3 219545 / 219548 / 219547',
    fax: '+967 3 219546',
  },
  {
    nameAr: 'مكتب المكلا - حضرموت',
    email: 'mukalla@myicyemen.com',
    phone: '+967 5 314544',
    fax: '+967 5 316667',
  },
];

// Check if fax column exists
const [cols] = await conn.execute('DESCRIBE branches');
const colNames = cols.map(c => c.Field);
const hasFax = colNames.includes('fax');

if (!hasFax) {
  console.log('Adding fax column to branches table...');
  await conn.execute('ALTER TABLE branches ADD COLUMN fax VARCHAR(100) DEFAULT NULL AFTER phone');
  console.log('✅ fax column added');
}

for (const branch of branchUpdates) {
  const [rows] = await conn.execute('SELECT id FROM branches WHERE nameAr = ?', [branch.nameAr]);
  if (rows.length === 0) {
    console.log(`⚠️  Branch not found: ${branch.nameAr}`);
    continue;
  }
  const id = rows[0].id;
  await conn.execute(
    'UPDATE branches SET email = ?, phone = ?, fax = ? WHERE id = ?',
    [branch.email, branch.phone, branch.fax, id]
  );
  console.log(`✅ Updated: ${branch.nameAr} → ${branch.email} | fax: ${branch.fax}`);
}

// ─── Update main contact settings ───────────────────────────────────────────
const settingUpdates = [
  { key: 'email_main', valueAr: 'info@myicyemen.com', valueEn: 'info@myicyemen.com' },
  { key: 'email_support', valueAr: 'info@myicyemen.com', valueEn: 'info@myicyemen.com' },
  { key: 'fax_main', valueAr: '+967 02 362 317', valueEn: '+967 02 362 317' },
];

// Check if settings table has valueAr/valueEn or just value
const [settingCols] = await conn.execute('DESCRIBE site_settings');
const settingColNames = settingCols.map(c => c.Field);
const hasValueAr = settingColNames.includes('valueAr');

for (const s of settingUpdates) {
  const [existing] = await conn.execute('SELECT id FROM site_settings WHERE `key` = ?', [s.key]);
  if (existing.length > 0) {
    if (hasValueAr) {
      await conn.execute(
        'UPDATE site_settings SET valueAr = ?, valueEn = ? WHERE `key` = ?',
        [s.valueAr, s.valueEn, s.key]
      );
    } else {
      await conn.execute(
        'UPDATE site_settings SET value = ? WHERE `key` = ?',
        [s.valueAr, s.key]
      );
    }
    console.log(`✅ Setting updated: ${s.key} → ${s.valueAr}`);
  } else {
    if (hasValueAr) {
      await conn.execute(
        'INSERT INTO site_settings (`key`, valueAr, valueEn, category) VALUES (?, ?, ?, ?)',
        [s.key, s.valueAr, s.valueEn, 'contact']
      );
    } else {
      await conn.execute(
        'INSERT INTO site_settings (`key`, value, category) VALUES (?, ?, ?)',
        [s.key, s.valueAr, 'contact']
      );
    }
    console.log(`✅ Setting inserted: ${s.key} → ${s.valueAr}`);
  }
}

await conn.end();
console.log('\n🎉 Done! All emails and fax numbers updated.');
console.log('\nBranch emails:');
branchUpdates.forEach(b => console.log(`  ${b.nameAr}: ${b.email} | fax: ${b.fax}`));
