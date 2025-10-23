import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "3129106Mitan",
  database: process.env.DB_NAME || "nutriperformance1",
  waitForConnections: true,
  connectionLimit: 10
});

// Loguea un ping al arrancar
(async () => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log("✅ Conectado a MySQL");
  } catch (e) {
    console.error("❌ Error MySQL:", e.message);
  }
})();

export default pool;
