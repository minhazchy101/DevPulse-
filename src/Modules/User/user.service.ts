import config from "../../config";
import { pool } from "../../db";
import bcrypt from "bcrypt";
import type { IUser } from "./user.interface";
import jwt from "jsonwebtoken"

const userSignUpIntoDB = async (payload: IUser)=>{
        const { name, email, password, role} = payload;
        const hashPass = bcrypt.hashSync(password, config.hashKey) 
        const res = await pool.query(`
        INSERT INTO users( name, email, password, role) 
        VALUES($1,$2,$3,COALESCE($4,'contributor')) RETURNING *
      `, [ name, email, hashPass, role]);

      delete res.rows[0].password;
      return res;
}

const userLoginIntoDB = async (payload: {
    email: string,
    password: string
})=>{
    const {email, password}= payload;

    const isUser = await pool.query(`
       SELECT * FROM users WHERE email=$1 
        `,[email])     
      
        if(isUser.rows.length === 0){
              throw new Error("User Not FOUND.!!")
        }
        
         const exitsUser = isUser.rows[0];
         const matchPass = await bcrypt.compare(password, exitsUser.password)
        if(!matchPass){
              throw new Error("Something went Wrong")
        }
        const jwtPayload ={
            id: exitsUser.id,
            role: exitsUser.role,
            name: exitsUser.name,
        }
        const accessToken = jwt.sign(jwtPayload, config.accessToken_key as string,{
            expiresIn: "1d"
        })
        delete exitsUser.password;
        
        return { token:accessToken , user : exitsUser};
}


export const userService ={
    userSignUpIntoDB,
    userLoginIntoDB
}