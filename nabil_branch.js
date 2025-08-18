// const axios = require("axios");
// const mysql = require("mysql2/promise");

// const API_URL = "https://siteapi.nabilbank.com/networks/get_branches_list/all/all/inside";

// async function insertBranches() {
//   // 1. Connect to MySQL
//   const connection = await mysql.createConnection({
//     host: "localhost",
//     user: "root", // change if needed
//     password: "", // change if needed
//     database: "atm" // change to your DB name
//   });

//   try {
//     // 2. Fetch API data
//     const response = await axios.get(API_URL);
//     const branches = response.data.data;

//     // 3. Loop through and insert
//     for (let nabil_branch of branches) {
//       // Join phone array into a comma-separated string
//       const phoneStr = nabil_branch.phone ? nabil_branch.phone.join(", ") : "";

//       await connection.execute(
//         `INSERT INTO nabil_branch (
//           branch_id,
//           branch_name,
//           branch_name_np,
//           detail,
//           detail_np,
//           address,
//           address_np,
//           email_address,
//           latitude,
//           longitude,
//           fax,
//           is_upcoming_branch,
//           phone,
//           extended_hours,
//           opening_time,
//           closing_time,
//           long_description,
//           long_description_np,
//           branch_manager_name,
//           branch_manager_name_np,
//           branch_manager_email,
//           branch_manager_phone,
//           branch_manager_hide_in_website,
//           branch_manager_landline,
//           operation_incharge_title,
//           operation_incharge_title_np,
//           operation_incharge_email,
//           operation_incharge_phone,
//           operation_incharge_hide_in_website,
//           operation_incharge_landline,
//           branch_manager_status,
//           operation_incharge_status
//         ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
//         [
//           nabil_branch.branch_id,
//           nabil_branch.branch_name,
//           nabil_branch.branch_name_np,
//           nabil_branch.detail,
//           nabil_branch.detail_np,
//           nabil_branch.address,
//           nabil_branch.address_np,
//           nabil_branch.email_address,
//           nabil_branch.latitude,
//           nabil_branch.longitude,
//           nabil_branch.fax,
//           nabil_branch.is_upcoming_branch,
//           phoneStr,
//           nabil_branch.extended_hours,
//           nabil_branch.opening_time,
//           nabil_branch.closing_time,
//           nabil_branch.long_description,
//           nabil_branch.long_description_np,
//           nabil_branch.branch_manager_name,
//           nabil_branch.branch_manager_name_np,
//           nabil_branch.branch_manager_email,
//           nabil_branch.branch_manager_phone,
//           nabil_branch.branch_manager_hide_in_website,
//           nabil_branch.branch_manager_landline,
//           nabil_branch.operation_incharge_title,
//           nabil_branch.operation_incharge_title_np,
//           nabil_branch.operation_incharge_email,
//           nabil_branch.operation_incharge_phone,
//           nabil_branch.operation_incharge_hide_in_website,
//           nabil_branch.operation_incharge_landline,
//           nabil_branch.branch_manager_status,
//           nabil_branch.operation_incharge_status
//         ]
//       );
//     }

//     console.log("✅ Branch data inserted successfully!");
//   } catch (err) {
//     console.error("❌ Error inserting branches:", err);
//   } finally {
//     await connection.end();
//   }
// }

// insertBranches();









// npm install axios mysql2

const axios = require("axios");
const mysql = require("mysql2/promise");

const API_URLS = [
  "https://siteapi.nabilbank.com/networks/get_branches_list/all/all/inside",
  "https://siteapi.nabilbank.com/networks/get_branches_list/3/all/outside"
];

async function insertBranches() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root", // change if needed
    password: "", // change if needed
    database: "atm" // change to your DB
  });

  try {
    for (const url of API_URLS) {
      console.log(`📡 Fetching data from: ${url}`);
      const response = await axios.get(url);
      const branches = response.data.data;

      for (let nabil_branch of branches) {
        const phoneStr = nabil_branch.phone ? nabil_branch.phone.join(", ") : "";

        await connection.execute(   
          `INSERT INTO nabil_branch (
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
          ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
          ON DUPLICATE KEY UPDATE
            branch_name = VALUES(branch_name),
            branch_name_np = VALUES(branch_name_np),
            detail = VALUES(detail),
            detail_np = VALUES(detail_np),
            address = VALUES(address),
            address_np = VALUES(address_np),
            email_address = VALUES(email_address),
            latitude = VALUES(latitude),
            longitude = VALUES(longitude),
            fax = VALUES(fax),
            is_upcoming_branch = VALUES(is_upcoming_branch),
            phone = VALUES(phone),
            extended_hours = VALUES(extended_hours),
            opening_time = VALUES(opening_time),
            closing_time = VALUES(closing_time),
            long_description = VALUES(long_description),
            long_description_np = VALUES(long_description_np),
            branch_manager_name = VALUES(branch_manager_name),
            branch_manager_name_np = VALUES(branch_manager_name_np),
            branch_manager_email = VALUES(branch_manager_email),
            branch_manager_phone = VALUES(branch_manager_phone),
            branch_manager_hide_in_website = VALUES(branch_manager_hide_in_website),
            branch_manager_landline = VALUES(branch_manager_landline),
            operation_incharge_title = VALUES(operation_incharge_title),
            operation_incharge_title_np = VALUES(operation_incharge_title_np),
            operation_incharge_email = VALUES(operation_incharge_email),
            operation_incharge_phone = VALUES(operation_incharge_phone),
            operation_incharge_hide_in_website = VALUES(operation_incharge_hide_in_website),
            operation_incharge_landline = VALUES(operation_incharge_landline),
            branch_manager_status = VALUES(branch_manager_status),
            operation_incharge_status = VALUES(operation_incharge_status)`,
          [
            nabil_branch.branch_id,
            nabil_branch.branch_name,
            nabil_branch.branch_name_np,
            nabil_branch.detail,
            nabil_branch.detail_np,
            nabil_branch.address,
            nabil_branch.address_np,
            nabil_branch.email_address,
            nabil_branch.latitude,
            nabil_branch.longitude,
            nabil_branch.fax,
            nabil_branch.is_upcoming_branch,
            phoneStr,
            nabil_branch.extended_hours,
            nabil_branch.opening_time,
            nabil_branch.closing_time,
            nabil_branch.long_description,
            nabil_branch.long_description_np,
            nabil_branch.branch_manager_name,
            nabil_branch.branch_manager_name_np,
            nabil_branch.branch_manager_email,
            nabil_branch.branch_manager_phone,
            nabil_branch.branch_manager_hide_in_website,
            nabil_branch.branch_manager_landline,
            nabil_branch.operation_incharge_title,
            nabil_branch.operation_incharge_title_np,
            nabil_branch.operation_incharge_email,
            nabil_branch.operation_incharge_phone,
            nabil_branch.operation_incharge_hide_in_website,
            nabil_branch.operation_incharge_landline,
            nabil_branch.branch_manager_status,
            nabil_branch.operation_incharge_status
          ]
        );
      }
    }

    console.log("✅ All branches inserted/updated successfully!");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await connection.end();
  }
}

insertBranches();
