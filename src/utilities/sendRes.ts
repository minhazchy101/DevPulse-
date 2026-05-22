import type { Response } from "express";

type TResponse<T>={
    success: boolean;
    message: string;
    data? : any;
    errors? : any;
}

export const response=<T>(res: Response, statusCode : number ,data: any)=>{
    const {success, message, data: resultData , errors} = data;

    res.status(statusCode).json({
    success,
    message,
   data: resultData,
   errors
    })
    return;
          
}