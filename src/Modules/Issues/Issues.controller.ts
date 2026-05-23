import type { Request, Response } from "express";
import { response } from "../../utilities/sendRes";
import { issuesService } from "./Issues.service";

const {
    createIssueIntoDB,
     getAllIssuesIntoDB, 
     getSingleIssueIntoDB,
     updateIssueIntoDB,
      deleteIssueIntoDB,
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
    catch (errors: any) {
           response(res,400,{   
        success: false,
        message: errors.message,
        errors
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
    } catch (errors: any) {
           response(res,404,{   
        success: false,
        message: errors.message,
        errors
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
catch (errors: any) {
           response(res,404,{   
        success: false,
        message: errors.message,
        errors
           }) 
        }
}
const updateIssue =async (req: Request, res: Response)=>{
try {
    const {id} = req.params
   //  console.log(req.body.role)
   const user = req.body.user;
      const result = await updateIssueIntoDB(req.body, id as string, user);
       if(result.rows.length===0){
         response(res, 404,{
         success: false,
         message : "Issue not found",
         errors: {}
      })
      return;
       }
      response(res, 200,{
         success: true,
         data: result.rows[0]
      })
    } 
catch (errors: any) {
           response(res,404,{   
        success: false,
        message: errors.message,
        errors
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
         message : "Issue not found",
         errors: {}
      })
      return;
       }
      response(res, 200,{
         success: true,
         message : "Issue deleted successfully"
      })
    } 
catch (errors: any) {
           response(res,404,{   
        success: false,
        message: errors.message,
       errors
           }) 
        }
}



export const issuesController ={
    createIssue,
    getAllIssues,
    getSingleIssue,
    deleteIssue,
    updateIssue
}