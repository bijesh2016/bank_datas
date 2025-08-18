import fetch from 'node-fetch'; // npm install node-fetch
import mysql from 'mysql2/promise'; // npm install mysql2

// MySQL connection settings
const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // your DB password
  database: 'atm' // make sure this DB exists
});

// Fetch data from Kumari Bank API
async function fetchBranchData() {
  const url = 'https://www.kumaribank.com/_next/data/VFdGdAQ4-3dOhGymbhKg_/en/branch.json';
  const response = await fetch(url);
  const data = await response.json();
  return data.pageProps.map; // the 'map' array contains the branch list
}

// Save data to SQL
async function saveToDatabase(branches) {
  const insertQuery = `
    INSERT INTO kumari_branches (
      id, title, slug, address, ward_no, email, phone, fax, province, district,
      inside_valley, lat, lng, fullname, url, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      title=VALUES(title),
      address=VALUES(address),
      phone=VALUES(phone),
      fullname=VALUES(fullname)
  `;

  for (let kumari_branch of branches) {
    await db.execute(insertQuery, [
      kumari_branch.id,
      kumari_branch.title,
      kumari_branch.slug,
      kumari_branch.address,
      kumari_branch.ward_no,
      kumari_branch.email,
      kumari_branch.phone,
      kumari_branch.fax,
      kumari_branch.province?.title || null,
      kumari_branch.district?.title || null,
      kumari_branch.inside_valley,
      kumari_branch.lat,
      kumari_branch.lng,
      kumari_branch.fullname,
      kumari_branch.url,
      kumari_branch.created_at
    ]);
  }
}

(async () => {
  try {
    const kumari_branches = await fetchBranchData();
    await saveToDatabase(kumari_branches);
    console.log('✅ Branch data saved to MySQL successfully.');
    await db.end();
  } catch (err) {
    console.error('❌ Error:', err);
  }
})();
