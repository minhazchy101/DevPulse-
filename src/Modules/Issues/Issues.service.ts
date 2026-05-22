import { pool } from "../../db"
import type { QueryParams } from "../../types/queries";
import type { IIssue } from "./Issues.interface";

const createIssueIntoDB =async(payload: IIssue)=>{
        // console.log(payload)
        const {title, description, type, reporter_id} = payload;

        const result = await pool.query(
  `
    INSERT INTO issues
    (title, description, type, reporter_id)

    VALUES
    ($1, $2, $3, $4)

    RETURNING *
  `,
  [title, description, type, reporter_id]
);

    return result;
}

const getAllIssuesIntoDB = async(queries: QueryParams)=>{
  const result = await pool.query(`
     SELECT * FROM issues
    `)
    return result;
}

export const issuesService ={
    createIssueIntoDB,
    getAllIssuesIntoDB
}