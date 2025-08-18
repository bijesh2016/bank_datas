const mysql = require('mysql2/promise');
const kumariBranches = require('./kumari.js');

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',      // Change as per your MySQL configuration
  password: '',       // Change as per your MySQL configuration
  database: 'bank_db' // Change to your database name
};

async function createKumariTable() {
  const connection = await mysql.createConnection(dbConfig);
  
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS kumari_branches (
      id INT AUTO_INCREMENT PRIMARY KEY,
      branch_id INT,
      title VARCHAR(255),
      slug VARCHAR(100),
      address TEXT,
      ward_no VARCHAR(20),
      email VARCHAR(255),
      phone VARCHAR(100),
      fax VARCHAR(100),
      province_id INT,
      province_name VARCHAR(100),
      district_id INT,
      district_name VARCHAR(100),
      inside_valley ENUM('inside', 'outside', 'extension counter'),
      map_url VARCHAR(500),
      latitude DECIMAL(10, 8),
      longitude DECIMAL(11, 8),
      fullname VARCHAR(255),
      url VARCHAR(500),
      created_at DATE,
      created_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_branch_id (branch_id),
      INDEX idx_district (district_name),
      INDEX idx_province (province_name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;

  await connection.execute(createTableSQL);
  console.log('Table created or already exists');
  await connection.end();
}

async function insertKumariBranches() {
  const connection = await mysql.createConnection(dbConfig);
  
  try {
    await connection.beginTransaction();
    
    // Optional: Clear existing data
    await connection.execute('TRUNCATE TABLE kumari_branches');
    
    // Prepare the insert statement
    const insertSQL = `
      INSERT INTO kumari_branches (
        branch_id, title, slug, address, ward_no, email, phone, fax,
        province_id, province_name, district_id, district_name,
        inside_valley, map_url, latitude, longitude, fullname, url, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    // Process each branch
    for (const branch of kumariBranches) {
      const values = [
        branch.id,
        branch.title,
        branch.slug,
        branch.address,
        branch.ward_no,
        branch.email,
        branch.phone,
        branch.fax,
        branch.province?.id || null,
        branch.province?.title || null,
        branch.district?.id || null,
        branch.district?.title || null,
        branch.inside_valley,
        branch.map_url,
        parseFloat(branch.lat) || null,
        parseFloat(branch.lng) || null,
        branch.fullname,
        branch.url,
        branch.created_at ? new Date(branch.created_at) : null
      ];
      
      await connection.execute(insertSQL, values);
    }
    
    await connection.commit();
    console.log(`Successfully inserted ${kumariBranches.length} branches`);
    
  } catch (error) {
    await connection.rollback();
    console.error('Error inserting branches:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

async function main() {
  try {
    await createKumariTable();
    await insertKumariBranches();
    console.log('Data import completed successfully');
  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  }
}

// Run the main function
main();
