import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.DBPORT
});

export default pool;