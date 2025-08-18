import axios from 'axios';
import mysql from 'mysql2/promise';

function sanitizeValue(value) {
    return value === undefined ? null : value;
}

async function insertBranches() {
    try {
        const connection = await mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "atm"
        });

        const response = await axios.get("https://cms.sanimabank.com/framework/api/frontend/branch/list");
        const branchInitials = response.data.data.branchInitials;

        for (const group of branchInitials) {
            for (const sanima_branch of group.branches) {
                const province = sanima_branch.province || {};
                const district = sanima_branch.district || {};
                const extendedHour = sanima_branch.extended_hour || {};
                const branchCategory = sanima_branch.branch_category || {};
                const category = sanima_branch.category || {};
                const branchManager = sanima_branch.branch_manager || {};

                const query = `
                    INSERT INTO sanima_branch (
                        id, title, title_np, telephone, fax, code, latitude, longitude, plusCode, address, address_np, 
                        hide_in_website, province_id, province_title, province_title_np, province_code, district_id, district_title, district_title_np, district_code, 
                        email, extended_hour_system_name, extended_hour_display_name, opening_time, closing_time, description, description_np, status, cash_counter, upcoming_branch, 
                        branch_category_id, branch_category_system_name, branch_category_display_name, 
                        category_id, category_name, category_name_np, 
                        branch_manager_name, branch_manager_name_np, branch_manager_email, branch_manager_phone
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        title=VALUES(title), title_np=VALUES(title_np), telephone=VALUES(telephone),
                        latitude=VALUES(latitude), longitude=VALUES(longitude), address=VALUES(address), 
                        branch_manager_name=VALUES(branch_manager_name), branch_manager_phone=VALUES(branch_manager_phone)
                `;

                const values = [
                    sanima_branch.id, 
                    sanitizeValue(sanima_branch.title),
                    sanitizeValue(sanima_branch.title_np),
                    sanitizeValue(sanima_branch.telephone),
                    sanitizeValue(sanima_branch.fax),
                    sanitizeValue(sanima_branch.code),
                    sanitizeValue(sanima_branch.latitude),
                    sanitizeValue(sanima_branch.longitude),
                    sanitizeValue(sanima_branch.plusCode),
                    sanitizeValue(sanima_branch.address),
                    sanitizeValue(sanima_branch.address_np),
                    sanitizeValue(sanima_branch.hide_in_website),
                    sanitizeValue(province.id),
                    sanitizeValue(province.title),
                    sanitizeValue(province.titleNp),
                    sanitizeValue(province.code),
                    sanitizeValue(district.id),
                    sanitizeValue(district.title),
                    sanitizeValue(district.titleNp),
                    sanitizeValue(district.code),
                    sanitizeValue(sanima_branch.email),
                    sanitizeValue(extendedHour.system_name),
                    sanitizeValue(extendedHour.display_name),
                    sanitizeValue(sanima_branch.opening_time),
                    sanitizeValue(sanima_branch.closing_time),
                    sanitizeValue(sanima_branch.description),
                    sanitizeValue(sanima_branch.description_np),
                    sanitizeValue(sanima_branch.status),
                    sanitizeValue(sanima_branch.cash_counter),
                    sanitizeValue(sanima_branch.upcoming_branch),
                    sanitizeValue(branchCategory.id),
                    sanitizeValue(branchCategory.systemName),
                    sanitizeValue(branchCategory.displayName),
                    sanitizeValue(category.id),
                    sanitizeValue(category.name),
                    sanitizeValue(category.nameNp),
                    sanitizeValue(branchManager.name),
                    sanitizeValue(branchManager.nameNp),
                    sanitizeValue(branchManager.email),
                    sanitizeValue(branchManager.phone)
                ];

                try {
                    await connection.execute(query, values);
                } catch (error) {
                    console.error('Error inserting branch:', sanima_branch.id, error.message);
                }
            }
        }

        console.log("Branches inserted/updated successfully.");
        await connection.end();
    } catch (error) {
        console.error("Error in insertBranches:", error);
    }
}

insertBranches();