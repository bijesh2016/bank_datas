import axios from "axios";
import * as cheerio from "cheerio";
import mysql from "mysql2/promise";

async function scrapeAndStore() {
  const conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "atm"
  });

  try {
    const { data: html } = await axios.get("https://www.siddharthabank.com/pages/filter_branch");
    const $ = cheerio.load(html);

    const branches = [];

    $("h5").each((_, el) => {
      const branchName = $(el).text().trim();
      const lines = $(el).nextUntil("h5").text().split("\n").map(l => l.trim()).filter(l => l);

      const [manager = "", phone = "", address = "", email = "", fax = ""] = lines;

      branches.push({ branchName, manager, phone, address, email, fax });
    });

    for (const b of branches) {
      await conn.execute(`
        INSERT INTO siddhartha_branches
          (branch_name, manager_name, phone, address, email, fax)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          manager_name = VALUES(manager_name),
          phone = VALUES(phone),
          address = VALUES(address),
          email = VALUES(email),
          fax = VALUES(fax)
      `, [b.branchName, b.manager, b.phone, b.address, b.email, b.fax]);

      console.log(`Inserted/Updated: ${b.branchName}`);
    }

    console.log("All branches stored successfully.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await conn.end();
  }
}

scrapeAndStore();
