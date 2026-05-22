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
  const conditions: string[] = [];

  // filters
  if (queries.type) {
    values.push(queries.type);
    conditions.push(`type = $${values.length}`);
  }

  if (queries.status) {
    values.push(queries.status);
    conditions.push(`status = $${values.length}`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  // sorting
  let sortOrder = "DESC";

  if (queries.sort === "oldest") {
    sortOrder = "ASC";
  }

  query += ` ORDER BY created_at ${sortOrder}`;


  const issuesResult = await pool.query(query, values);

  const issues = issuesResult.rows;

  
  const reporterIds = [
    ...new Set(
      issues.map((issue) => issue.reporter_id)
    ),
  ];

 
  if (reporterIds.length === 0) {
    return issues;
  }

  // fetch reporters
  const reportersResult = await pool.query(
    `
    SELECT id, name, role
    FROM users
    WHERE id = ANY($1)
    `,
    [reporterIds]
  );

  const reporters = reportersResult.rows;

 
  const reporterMap = new Map();

  reporters.forEach((reporter) => {
    reporterMap.set(reporter.id, reporter);
  });

  // attach reporter data
  const issuesData = issues.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,

    reporter: reporterMap.get(issue.reporter_id),

    created_at: issue.created_at,
    updated_at: issue.updated_at,
  }));

  return issuesData;
};

export const issuesService ={
    createIssueIntoDB,
    getAllIssuesIntoDB
}