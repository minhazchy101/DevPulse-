import type { Request, Response } from "express";
import { response } from "../../utilities/sendRes";
import { issuesService } from "./Issues.service";

const {
    createIssueIntoDB, getAllIssuesIntoDB, getSingleIssueIntoDB, deleteIssueIntoDB
}= issuesService

const createIssue =async (req: Request, res: Response)=>{
        try{
            const result = await createIssueIntoDB(req.body)
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

const getAllIssues = async (req: Request, res: Response)=>{
    try {
         const queries = req.query;
      const result = await getAllIssuesIntoDB(queries);
        // console.log("getAllIssues result: ", result)
      response(res, 200,{
         success: true,
         data: result
      })
    } catch (error: any) {
           response(res,404,{   
        success: false,
        message: error.message,
           }) 
        }
}

const getSingleIssue =async (req: Request, res: Response)=>{
try {
    const {id} = req.params
      const result = await getSingleIssueIntoDB(id as string);
       
      response(res, 200,{
         success: true,
         data: result
      })
    } 
catch (error: any) {
           response(res,404,{   
        success: false,
        message: error.message,
           }) 
        }
}
const deleteIssue =async (req: Request, res: Response)=>{
try {
    const {id} = req.params
      const result = await deleteIssueIntoDB(id as string);
       if(result.rows.length===0){
         response(res, 404,{
         success: false,
         message : "Issue not found"
      })
      return;
       }
      response(res, 200,{
         success: true,
         message : "Issue deleted successfully"
      })
    } 
catch (error: any) {
           response(res,404,{   
        success: false,
        message: error.message,
           }) 
        }
}

export const issuesController ={
    createIssue,
    getAllIssues,
    getSingleIssue,
    deleteIssue
}