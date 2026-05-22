import { pool } from "../../db"
import { allowedQuery, validate, type QueryParams } from "../../types/queries";
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

const getAllIssuesIntoDB = async (queries: QueryParams) => {

   validate("type", queries.type);
   validate("status", queries.status);
   validate("sort", queries.sort);
  
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


 const issuesData = issues.map((issue) => {

  const {
    reporter_id,
    created_at,
    updated_at,
    ...rest
  } = issue;

  return {
    ...rest,
    reporter: reporterMap.get(reporter_id),
    created_at,
    updated_at,
  };
});

  return issuesData;
};

const getSingleIssueIntoDB = async (id : string) =>{
  const result = await pool.query(`
     SELECT * FROM issues
     WHERE id = $1
      `, [id]);
        const issue = result.rows[0];
  if (!issue) {
    throw new Error("Issue not found");
  }
      
      const reporterIds = issue.reporter_id;

     const reporterData = await pool.query(
    `
    SELECT id, name, role
    FROM users
    WHERE id = $1
    `,
    [reporterIds]
  );

  const reporter = reporterData.rows[0];
  delete issue.reporter_id
  issue.reporter = reporter;
  const {
  created_at,
  updated_at,
  ...rest
} = issue;

return {
  ...rest,
  created_at,
  updated_at,
};
}

const deleteIssueIntoDB = async (id: string)=>{
       const result = await pool.query(`
     DELETE FROM issues 
     WHERE id=$1
     RETURNING *
      `,[id])

      return result;
}

export const issuesService ={
    createIssueIntoDB,
    getAllIssuesIntoDB,
    getSingleIssueIntoDB,
    deleteIssueIntoDB
}