import fetch from 'node-fetch'; 
import mysql from 'mysql2/promise'; 

// MySQL connection
const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'atm' 
});

// Fetch data from NMB Bank API
async function fetchBranchData() {
  const url = 'https://nmb.com.np/_next/data/2Q9JVX_AwGGgFJ0WCK2zJ/en/branch.json';
  const response = await fetch(url);
  const json = await response.json();
  return json.pageProps.data.data; 
}

// Save branches to MySQL
async function saveToDatabase(branches) {
  const insertQuery = `
    INSERT INTO nmb_branches (
      id, lang_id, branch_title, slug, address, ward_no, email, phone, mobile, fax,
      province, district, inside_valley, map_url, lat, lng, fullname, url, qr_code, created_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      branch_title = VALUES(branch_title),
      address = VALUES(address),
      phone = VALUES(phone),
      mobile = VALUES(mobile),
      fullname = VALUES(fullname)
  `;

  for (let nmb_branches of branches) {
    await db.execute(insertQuery, [
      nmb_branches.id,
      nmb_branches.lang_id,
      nmb_branches.branch_title,
      nmb_branches.slug,
      nmb_branches.address,
      nmb_branches.ward_no,
      nmb_branches.email,
      nmb_branches.phone,
      nmb_branches.mobile,
      nmb_branches.fax,
      nmb_branches.province?.title || null,
      nmb_branches.district?.dist_title || null,
      nmb_branches.inside_valley,
      nmb_branches.map_url,
      nmb_branches.lat,
      nmb_branches.lng,
      nmb_branches.fullname,
      nmb_branches.url,
      nmb_branches.qr_code,
      nmb_branches.created_date
    ]);
  }
}

(async () => {
  try {
    const nmb_branches = await fetchBranchData();
    await saveToDatabase(nmb_branches);
    console.log('✅ NMB Bank branches saved to MySQL.');
    await db.end();
  } catch (err) {   
    console.error('❌ Error:', err);
  }
})();
