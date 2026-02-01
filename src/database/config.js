import "dotenv/config";
import pkg from 'pg';


const { Pool } = pkg;

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

(async () => {
    try {
        const client = await pool.connect();
        console.log("✅ Conectado ao banco de dados com sucesso!");
        client.release();
    } catch (error) {
        console.error("❌ Erro ao conectar ao banco de dados:", error);
    }
})();

export default pool;