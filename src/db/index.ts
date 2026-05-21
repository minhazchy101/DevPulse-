import { Pool } from "pg"
import config from "../config"


export const pool = new Pool({
    connectionString : config.connection_string
});



export const initDB = async ()=>{
    try {
       await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(158) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, 
  role VARCHAR(25) DEFAULT 'contributor', 

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
      )
            `)



        console.log("DATABASE CONNECT SUCCESSFULLY")
 

        // console.log("DATABASE CONNECT SUCCESSFULLY")
    } catch (error) {
    console.log("database connection error : ", error)
  }
}