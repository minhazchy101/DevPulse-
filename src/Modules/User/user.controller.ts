import type { Request, Response } from "express";
import { response } from "../../utilities/sendRes";
import { userService } from "./user.service";

const {userSignUpIntoDB} = userService;

const userSignUp = async (req: Request, res: Response)=>{

    try {
    
     const result = await userSignUpIntoDB(req.body)
    response(res, {
    statusCode : 201,
    success: true,
    message: "User registered successfully",
    data : result.rows[0]
    })
    } catch (error: any) {
       response(res,{
    statusCode : 400,
    success: false,
    message: error.message,
    error
       }) 
    }
   
}

export const userController ={
    userSignUp,
}