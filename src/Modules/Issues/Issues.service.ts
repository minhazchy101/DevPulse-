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

const getAllIssuesIntoDB = async (queries: any) => {
  let query = `SELECT * FROM issues`;
  const values: string[] = [];

  // FILTERS
  const conditions: string[] = [];

  // type filter
  if (queries.type) {
    values.push(queries.type);
    conditions.push(`type = $${values.length}`);
  }

  // status filter
  if (queries.status) {
    values.push(queries.status);
    conditions.push(`status = $${values.length}`);
  }

  // add WHERE if conditions exist
  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  // SORTING
  let sortOrder = "DESC";

  if (queries.sort === "oldest") {
    sortOrder = "ASC";
  }

  query += ` ORDER BY created_at ${sortOrder}`;

  const result = await pool.query(query, values);

  return result;
};

export const issuesService ={
    createIssueIntoDB,
    getAllIssuesIntoDB
}