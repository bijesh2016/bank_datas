// const axios = require("axios");
// const mysql = require("mysql2/promise");

// const API_URL = "https://www.nimb.com.np/framework/api/frontend/branch/list?branchCategoryId=41b97fbb-e252-4210-9ab4-8ac9eaa1f299&categoryId=all";

// // MySQL connection config
// const dbConfig = {
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "nimb_branch",
// };

// async function insertIfNotExists(conn, table, id, data) {
//   const [rows] = await conn.query(`SELECT id FROM ${table} WHERE id = ?`, [id]);
//   if (rows.length === 0) {
//     const fields = Object.keys(data);
//     const placeholders = fields.map(() => "?").join(",");
//     await conn.query(
//       `INSERT INTO ${table} (${fields.join(",")}) VALUES (${placeholders})`,
//       Object.values(data)
//     );
//   }
// }

// async function run() {
//   const conn = await mysql.createConnection(dbConfig);

//   try {
//     const { data } = await axios.get(API_URL);
//     const branches = data.data.branch;

//     for (const b of branches) {
//       // Province
//       if (b.province) {
//         await insertIfNotExists(conn, "province", b.province.id, {
//           id: b.province.id,
//           title: b.province.title,
//           title_np: b.province.title_np,
//           code: b.province.code,
//         });
//       }

//       // District
//       if (b.district) {
//         await insertIfNotExists(conn, "district", b.district.id, {
//           id: b.district.id,
//           title: b.district.title,
//           title_np: b.district.title_np,
//           code: b.district.code,
//           category_id: null, // API doesn't seem to give this
//         });
//       }

//       // Extended Hour
//       if (b.extended_hour) {
//         await insertIfNotExists(conn, "extended_hour", b.extended_hour.id, {
//           id: b.extended_hour.id,
//           system_name: b.extended_hour.system_name,
//           display_name: b.extended_hour.display_name,
//         });
//       }

//       // Branch Category
//       if (b.branch_category) {
//         await insertIfNotExists(conn, "branch_category", b.branch_category.id, {
//           id: b.branch_category.id,
//           system_name: b.branch_category.system_name,
//           display_name: b.branch_category.display_name,
//           display_name_np: b.branch_category.display_name_np,
//           display_order: b.branch_category.display_order,
//         });
//       }

//       // Category
//       if (b.category) {
//         await insertIfNotExists(conn, "category", b.category.id, {
//           id: b.category.id,
//           name: b.category.name,
//           name_np: b.category.name_np,
//           slug: b.category.slug,
//           type_id: null, // category_type link skipped here
//           image: b.category.image,
//           display_order: b.category.display_order,
//           status: b.category.status,
//         });
//       }

//       // Insert into branch
//       await insertIfNotExists(conn, "branch", b.id, {
//         id: b.id,
//         title: b.title,
//         title_np: b.title_np,
//         telephone: b.telephone,
//         fax: b.fax,
//         code: b.code,
//         latitude: b.latitude,
//         longitude: b.longitude,
//         plus_code: b.plus_code,
//         address: b.address,
//         address_np: b.address_np,
//         hide_in_website: b.hide_in_website,
//         province_id: b.province?.id || null,
//         district_id: b.district?.id || null,
//         email: b.email,
//         extended_hour_id: b.extended_hour?.id || null,
//         opening_time: b.opening_time,
//         closing_time: b.closing_time,
//         description: b.description,
//         description_np: b.description_np,
//         status: b.status,
//         qos: b.qos,
//         cash_counter: b.cash_counter,
//         upcoming_branch: b.upcoming_branch,
//         branch_category_id: b.branch_category?.id || null,
//         category_id: b.category?.id || null,
//         iframe: b.iframe,
//       });
//     }

//     console.log("✅ Data inserted successfully");
//   } catch (err) {
//     console.error("❌ Error:", err);
//   } finally {
//     await conn.end();
//   }
// }

// run();





import axios from 'axios';
import mysql from 'mysql2/promise';

const API_URL = 'https://www.nimb.com.np/framework/api/frontend/branch/list?branchCategoryId=e142aa7f-d275-43cf-87a7-503872a9274a&categoryId=e142aa7f-d275-43cf-87a7-503872a9274a&provinceId=b7cae820-199a-4713-b6e5-7975b7b59010';

async function main() {
    // MySQL connection
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'atm'
    });

    try {
        // Fetch data
        const { data } = await axios.get(API_URL);

        if (data.resCod !== "200") {
            console.error('API returned an error:', data.resDesc);
            return;
        }

        // Loop through branchInitials and branches
        for (const group of data.data.branchInitials) {
            for (const nimb_branch of group.branches) {
                const query = `
                    INSERT INTO nimb_branch (
                        id, title, title_np, telephone, fax, code, latitude, longitude,
                        plus_code, address, address_np, hide_in_website, province_id,
                        province_title, province_title_np, province_code, district_id,
                        district_title, district_title_np, district_code, email,
                        extended_hour_id, extended_hour_system_name, extended_hour_display_name,
                        opening_time, closing_time, description, description_np, status,
                        qos, cash_counter, upcoming_branch, branch_category_id,
                        branch_category_system_name, branch_category_display_name,
                        branch_category_display_name_np, category_id, category_name,
                        category_name_np, category_slug, branch_manager_id,
                        branch_manager_name, branch_manager_name_np, branch_manager_email,
                        branch_manager_phone
                    ) VALUES ?
                    ON DUPLICATE KEY UPDATE 
                        title = VALUES(title), 
                        telephone = VALUES(telephone),
                        address = VALUES(address),
                        email = VALUES(email)
                `;

                const values = [
                    [
                        nimb_branch.id, nimb_branch.title, nimb_branch.title_np, nimb_branch.telephone, nimb_branch.fax, nimb_branch.code,
                        nimb_branch.latitude, nimb_branch.longitude, nimb_branch.plusCode, nimb_branch.address, nimb_branch.address_np,
                        nimb_branch.hide_in_website, nimb_branch.province?.id, nimb_branch.province?.title, nimb_branch.province?.titleNp,
                        nimb_branch.province?.code, nimb_branch.district?.id, nimb_branch.district?.title, nimb_branch.district?.titleNp,
                        nimb_branch.district?.code, nimb_branch.email, nimb_branch.extended_hour?.id, nimb_branch.extended_hour?.system_name,
                        nimb_branch.extended_hour?.display_name, nimb_branch.opening_time, nimb_branch.closing_time,
                        nimb_branch.description, nimb_branch.description_np, nimb_branch.status, nimb_branch.qos,
                        nimb_branch.cash_counter, nimb_branch.upcoming_branch, nimb_branch.branch_category?.id,
                        nimb_branch.branch_category?.systemName, nimb_branch.branch_category?.displayName,
                        nimb_branch.branch_category?.displayNameNp, nimb_branch.category?.id, nimb_branch.category?.name,
                        nimb_branch.category?.nameNp, nimb_branch.category?.slug, nimb_branch.branch_manager?.id,
                        nimb_branch.branch_manager?.name, nimb_branch.branch_manager?.nameNp,
                        nimb_branch.branch_manager?.email, nimb_branch.branch_manager?.phone
                    ]
                ];

                await connection.query(query, [values]);
                console.log(`Inserted/Updated branch: ${nimb_branch.title}`);
            }
        }

        console.log('Data inserted successfully.');
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await connection.end();         
    }
}

main();
