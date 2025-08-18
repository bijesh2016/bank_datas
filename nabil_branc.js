const axios = require("axios");
const mysql = require("mysql2/promise");

const API_URL = "https://siteapi.nabilbank.com/networks/get_branches_list/3/all/outside";

async function insertBranches() {
  // 1. Connect to MySQL
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root", // change if needed
    password: "", // change if needed
    database: "your_database" // change to your DB name
  });

  try {
    // 2. Fetch API data
    const response = await axios.get(API_URL);
    const branches = response.data.data;

    // 3. Loop through and insert
    for (let branch of branches) {
      // Join phone array into a comma-separated string
      const phoneStr = branch.phone ? branch.phone.join(", ") : "";

      await connection.execute(
        `INSERT INTO branch (
          branch_id,
          branch_name,
          branch_name_np,
          detail,
          detail_np,
          address,
          address_np,
          email_address,
          latitude,
          longitude,
          fax,
          is_upcoming_branch,
          phone,
          extended_hours,
          opening_time,
          closing_time,
          long_description,
          long_description_np,
          branch_manager_name,
          branch_manager_name_np,
          branch_manager_email,
          branch_manager_phone,
          branch_manager_hide_in_website,
          branch_manager_landline,
          operation_incharge_title,
          operation_incharge_title_np,
          operation_incharge_email,
          operation_incharge_phone,
          operation_incharge_hide_in_website,
          operation_incharge_landline,
          branch_manager_status,
          operation_incharge_status
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          branch.branch_id,
          branch.branch_name,
          branch.branch_name_np,
          branch.detail,
          branch.detail_np,
          branch.address,
          branch.address_np,
          branch.email_address,
          branch.latitude,
          branch.longitude,
          branch.fax,
          branch.is_upcoming_branch,
          phoneStr,
          branch.extended_hours,
          branch.opening_time,
          branch.closing_time,
          branch.long_description,
          branch.long_description_np,
          branch.branch_manager_name,
          branch.branch_manager_name_np,
          branch.branch_manager_email,
          branch.branch_manager_phone,
          branch.branch_manager_hide_in_website,
          branch.branch_manager_landline,
          branch.operation_incharge_title,
          branch.operation_incharge_title_np,
          branch.operation_incharge_email,
          branch.operation_incharge_phone,
          branch.operation_incharge_hide_in_website,
          branch.operation_incharge_landline,
          branch.branch_manager_status,
          branch.operation_incharge_status
        ]
      );
    }

    console.log("✅ Branch data inserted successfully!");
  } catch (err) {
    console.error("❌ Error inserting branches:", err);
  } finally {
    await connection.end();
  }
}

insertBranches();