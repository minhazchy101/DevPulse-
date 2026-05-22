import type { UserRoles } from "../types/roles";
import type { NextFunction, Request, Response } from "express";
import { response } from "../utilities/sendRes";
import  jwt, {  type JwtPayload }  from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";


export const auth =(...roles: UserRoles[])=>{
    return async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const {authorization} = req.headers;
            
            if(!authorization){
               response(res, 401,{
               success: false,
               message: "Unauthorized access."
            })
            }

             const decoded = jwt.verify(
                authorization as string,
                config.accessToken_key as string
            ) as JwtPayload;

             const userData = await pool.query(`
             
            SELECT * FROM users WHERE id=$1
            `,[decoded.id],) 

             const user =  userData.rows[0];
            
            if(!user ){
    response(res, 404,{
         success: false,
      message: "User Not Found decoded.!"
    })
            }
        
            if(roles.length && !roles.includes(user.role)){
                response(res, 403,{
                    success: false,
                   message: "Access denied"
                })
            }
           req.body = req.body || {};
           req.body.reporter_id = decoded.id;
         
            next();
    
        } catch (error: any) {
           response(res, 401, {
             success: false,
        message: error.message,
      }) 
        }

    }
}

// const authMaintainer =()=>{
//     try{

//     }catch (error) {
//            response(res, 401, {
//              success: false,
//         message: "Invalid or expired token.",
//       }) 
//         }
// }