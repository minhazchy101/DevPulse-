import type { Request, Response } from "express";
import { response } from "../../utilities/sendRes";
import { userService } from "./user.service";

const {userSignUpIntoDB, userLoginIntoDB} = userService;

const userSignUp = async (req: Request, res: Response)=>{

    try {
    
     const result = await userSignUpIntoDB(req.body)
    response(res, 201,{
   
    success: true,
    message: "User registered successfully",
    data : result.rows[0]
    })
    } catch (errors: any) {
       response(res,400,{   
    success: false,
    message: errors.message,
    errors
       }) 
    }
   
}

const userLogin =async (req: Request, res: Response)=>{
    try {
        const result = await userLoginIntoDB(req.body)
    response(res, 200, {
    success: true,
    message: "Login successful",
    data : result
    })
    } catch (errors: any) {
       response(res,400,{
   
    success: false,
    message: errors.message,
    errors
       }) 
    }
}

export const userController ={
    userSignUp,
    userLogin,
}