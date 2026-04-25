import mysql from 'mysql2/promise';
import https from 'https';
import http from 'http';
import 'dotenv/config';

// Professional Unsplash images for each insurance type
const insuranceImages = {
  'car-comprehensive': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
  'car-third-party': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  'fire-theft': 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
  'loss-of-profit': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
  'marine': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
  'home': 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
  'contractors': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
  'erection': 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
  'machinery': 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80',
  'workmen-compensation': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
  'personal-accident': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
  'group-life': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
  'health': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80',
  'cash': 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&q=80',
  'fidelity': 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
  'borrowers': 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80',
};

const boardImage = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80';
const teamImage = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80';

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadBuffer(response.headers.location).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`HTTP ${response.statusCode}`));
      }
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

async function uploadToStorage(buffer, relKey, contentType) {
  const baseUrl = process.env.BUILT_IN_FORGE_API_URL.replace(/\/+$/, '');
  const apiKey = process.env.BUILT_IN_FORGE_API_KEY;
  const key = relKey.replace(/^\/+/, '');
  const uploadUrl = `${baseUrl}/v1/storage/upload?path=${encodeURIComponent(key)}`;
  
  // Use FormData like storage.ts does
  const blob = new Blob([buffer], { type: contentType });
  const form = new FormData();
  const filename = key.split('/').pop() || 'file';
  form.append('file', blob, filename);
  
  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body: form,
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Upload failed: ${response.status} ${text}`);
  }
  
  const data = await response.json();
  return data.url;
}

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  console.log('Connected. Starting image uploads...\n');

  // Upload insurance type images
  for (const [slug, imageUrl] of Object.entries(insuranceImages)) {
    try {
      console.log(`Downloading ${slug}...`);
      const buffer = await downloadBuffer(imageUrl);
      const filename = `insurance-types/${slug}-${Date.now()}.jpg`;
      const url = await uploadToStorage(buffer, filename, 'image/jpeg');
      await conn.query('UPDATE insurance_types SET imageUrl=? WHERE slug=?', [url, slug]);
      console.log(`✓ ${slug}`);
    } catch (err) {
      console.error(`✗ Failed ${slug}:`, err.message);
    }
  }

  // Upload board of directors image
  try {
    console.log('\nDownloading board of directors image...');
    const buffer = await downloadBuffer(boardImage);
    const url = await uploadToStorage(buffer, `pages/board-${Date.now()}.jpg`, 'image/jpeg');
    await conn.query("UPDATE dynamic_pages SET imageUrl=? WHERE slug='about/chairman'", [url]);
    console.log(`✓ Chairman page image`);
  } catch (err) {
    console.error('✗ Failed board image:', err.message);
  }

  // Upload team member placeholder
  try {
    console.log('\nDownloading team member placeholder...');
    const buffer = await downloadBuffer(teamImage);
    const url = await uploadToStorage(buffer, `team/manager-${Date.now()}.jpg`, 'image/jpeg');
    const [teamMembers] = await conn.query("SELECT id FROM team_members WHERE imageUrl='' OR imageUrl IS NULL");
    for (const member of teamMembers) {
      await conn.query("UPDATE team_members SET imageUrl=? WHERE id=?", [url, member.id]);
    }
    console.log(`✓ Updated ${teamMembers.length} team members`);
  } catch (err) {
    console.error('✗ Failed team image:', err.message);
  }

  await conn.end();
  console.log('\n✅ Done!');
}

main().catch(console.error);
