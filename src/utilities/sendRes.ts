import type { Response } from "express";

type TResponse<T>={
    statusCode : number;
    success: boolean;
    message: string;
    data? : any;
    error? : any;
}

export const response=<T>(res: Response, data: any)=>{
    const {statusCode,success, message, data: resultData , error} = data;
    res.status(statusCode).json({
         
    statusCode ,
    success,
    message,
   data: resultData,
    error
    })
    return;
          
}