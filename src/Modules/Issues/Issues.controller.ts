import type { Request, Response } from "express";
import { response } from "../../utilities/sendRes";
import { issuesService } from "./Issues.service";

const {
    createIssueIntoDB
}= issuesService

const createIssue =async (req: Request, res: Response)=>{
        try{
           const issueData = {
      ...req.body
    };
            const result = await createIssueIntoDB(issueData)
             response(res, 201,{
                success: true,
                message:  "Issue created successfully",
                data : result.rows[0]
                })
        }
    catch (error: any) {
           response(res,400,{   
        success: false,
        message: error.message,
        error
           }) 
        }
}

export const issuesController ={
    createIssue
}