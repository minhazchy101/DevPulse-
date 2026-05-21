import config from "../../config";
import { pool } from "../../db";
import bcrypt from "bcrypt";

const userSignUpIntoDB = async (payload: any)=>{
        const { name, email, password, role} = payload;
        const hashPass = bcrypt.hashSync(password, config.hashKey) 
        const res = await pool.query(`
        INSERT INTO users( name, email, password, role) 
        VALUES($1,$2,$3,COALESCE($4,'contributor')) RETURNING *
      `, [ name, email, hashPass, role]);

      delete res.rows[0].password;
      return res;
}


export const userService ={
    userSignUpIntoDB,
}