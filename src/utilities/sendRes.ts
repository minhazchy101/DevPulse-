import type { Response } from "express";

type TResponse<T>={
    success: boolean;
    message: string;
    data? : any;
    error? : any;
}

export const response=<T>(res: Response, statusCode : number ,data: any)=>{
    const {success, message, data: resultData , error} = data;

    res.status(statusCode).json({
    success,
    message,
   data: resultData,
    error
    })
    return;
          
}