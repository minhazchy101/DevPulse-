

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  

// src/app.ts
import express from "express";

// src/Modules/User/user.routes.ts
import { Router } from "express";

// src/utilities/sendRes.ts
var response = (res, statusCode, data) => {
  const { success, message, data: resultData, errors } = data;
  res.status(statusCode).json({
    success,
    message,
    data: resultData,
    errors
  });
  return;
};

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env")
});
var config = {
  connection_string: process.env.CONNECTION,
  port: Number(process.env.PORT),
  hashKey: Number(process.env.KEY_HASH),
  accessToken_key: process.env.ACCESS_KEY_JWT
};
var config_default = config;

// src/db/index.ts
import { Pool } from "pg";
var pool = new Pool({
  connectionString: config_default.connection_string
});
var initDB = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(158) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, 
  role VARCHAR(25) DEFAULT 'contributor', 

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
      )
            `);
    await pool.query(`
    CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,

        title VARCHAR(150) NOT NULL,

        description TEXT NOT NULL
        CHECK (LENGTH(description) >= 20),

        type VARCHAR(20) NOT NULL
        CHECK (type IN ('bug', 'feature_request')),

        status VARCHAR(25) DEFAULT 'open',
        reporter_id INT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    )
`);
    console.log("DATABASE CONNECT SUCCESSFULLY");
  } catch (error) {
    console.log("database connection error : ", error);
  }
};

// src/Modules/User/user.service.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
var userSignUpIntoDB = async (payload) => {
  const { name, email, password, role } = payload;
  const hashPass = bcrypt.hashSync(password, config_default.hashKey);
  const res = await pool.query(`
        INSERT INTO users( name, email, password, role) 
        VALUES($1,$2,$3,COALESCE($4,'contributor')) RETURNING *
      `, [name, email, hashPass, role]);
  delete res.rows[0].password;
  return res;
};
var userLoginIntoDB = async (payload) => {
  const { email, password } = payload;
  const isUser = await pool.query(`
       SELECT * FROM users WHERE email=$1 
        `, [email]);
  if (isUser.rows.length === 0) {
    throw new Error("User Not FOUND.!!");
  }
  const exitsUser = isUser.rows[0];
  const matchPass = await bcrypt.compare(password, exitsUser.password);
  if (!matchPass) {
    throw new Error("Something went Wrong");
  }
  const jwtPayload = {
    id: exitsUser.id,
    role: exitsUser.role,
    name: exitsUser.name
  };
  const accessToken = jwt.sign(jwtPayload, config_default.accessToken_key, {
    expiresIn: "1d"
  });
  delete exitsUser.password;
  return { token: accessToken, user: exitsUser };
};
var userService = {
  userSignUpIntoDB,
  userLoginIntoDB
};

// src/Modules/User/user.controller.ts
var { userSignUpIntoDB: userSignUpIntoDB2, userLoginIntoDB: userLoginIntoDB2 } = userService;
var userSignUp = async (req, res) => {
  try {
    const result = await userSignUpIntoDB2(req.body);
    response(res, 201, {
      success: true,
      message: "User registered successfully",
      data: result.rows[0]
    });
  } catch (errors) {
    response(res, 400, {
      success: false,
      message: errors.message,
      errors
    });
  }
};
var userLogin = async (req, res) => {
  try {
    const result = await userLoginIntoDB2(req.body);
    response(res, 200, {
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (errors) {
    response(res, 400, {
      success: false,
      message: errors.message,
      errors
    });
  }
};
var userController = {
  userSignUp,
  userLogin
};

// src/Modules/User/user.routes.ts
var route = Router();
var { userSignUp: userSignUp2, userLogin: userLogin2 } = userController;
route.post("/signup", userSignUp2);
route.post("/login", userLogin2);
var userRoutes = route;

// src/Modules/Issues/Issues.routes.ts
import { Router as Router2 } from "express";

// src/types/queries.ts
var allowedQuery = {
  sort: ["newest", "oldest"],
  type: ["bug", "feature_request"],
  status: ["open", "in_progress", "resolved"]
};
var validate = (key, value) => {
  const allowedValues = allowedQuery[key];
  if (value && !allowedValues.includes(value)) {
    throw new Error(`Invalid ${key} value`);
  }
};

// src/types/roles.ts
var USER_ROLES = {
  contributor: "contributor",
  maintainer: "maintainer"
};

// src/Modules/Issues/Issues.service.ts
var createIssueIntoDB = async (payload) => {
  const { title, description, type, reporter_id } = payload;
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
};
var getAllIssuesIntoDB = async (queries) => {
  validate("type", queries.type);
  validate("status", queries.status);
  validate("sort", queries.sort);
  let query = `SELECT * FROM issues`;
  const values = [];
  const conditions = [];
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
    )
  ];
  if (reporterIds.length === 0) {
    return issues;
  }
  const reportersResult = await pool.query(
    `
    SELECT id, name, role
    FROM users
    WHERE id = ANY($1)
    `,
    [reporterIds]
  );
  const reporters = reportersResult.rows;
  const reporterMap = /* @__PURE__ */ new Map();
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
      updated_at
    };
  });
  return issuesData;
};
var getSingleIssueIntoDB = async (id) => {
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
  delete issue.reporter_id;
  issue.reporter = reporter;
  const {
    created_at,
    updated_at,
    ...rest
  } = issue;
  return {
    ...rest,
    created_at,
    updated_at
  };
};
var updateIssueIntoDB = async (payload, id, user) => {
  const issueResult = await pool.query(
    `SELECT * FROM issues WHERE id = $1`,
    [id]
  );
  const issue = issueResult.rows[0];
  if (issueResult.rows.length === 0) {
    throw new Error("Issue not found");
  }
  if (user.role !== USER_ROLES.maintainer) {
    if (issue.reporter_id !== user.id) {
      throw new Error("Forbidden");
    }
    if (issue.status !== "open") {
      throw new Error("Cannot update closed issue");
    }
  }
  const { title, description, type, status } = payload;
  const result = await pool.query(`
     UPDATE issues 
     SET title=COALESCE($1,title),
         description=COALESCE($2,description),
         type=COALESCE($3,type),
         status=COALESCE($4,status)
     WHERE id=$5
     RETURNING *
      `, [title, description, type, status, id]);
  return result;
};
var deleteIssueIntoDB = async (id) => {
  const result = await pool.query(`
     DELETE FROM issues 
     WHERE id=$1
     RETURNING *
      `, [id]);
  return result;
};
var issuesService = {
  createIssueIntoDB,
  getAllIssuesIntoDB,
  getSingleIssueIntoDB,
  updateIssueIntoDB,
  deleteIssueIntoDB
};

// src/Modules/Issues/Issues.controller.ts
var {
  createIssueIntoDB: createIssueIntoDB2,
  getAllIssuesIntoDB: getAllIssuesIntoDB2,
  getSingleIssueIntoDB: getSingleIssueIntoDB2,
  updateIssueIntoDB: updateIssueIntoDB2,
  deleteIssueIntoDB: deleteIssueIntoDB2
} = issuesService;
var createIssue = async (req, res) => {
  try {
    const result = await createIssueIntoDB2(req.body);
    response(res, 201, {
      success: true,
      message: "Issue created successfully",
      data: result.rows[0]
    });
  } catch (errors) {
    response(res, 400, {
      success: false,
      message: errors.message,
      errors
    });
  }
};
var getAllIssues = async (req, res) => {
  try {
    const queries = req.query;
    const result = await getAllIssuesIntoDB2(queries);
    response(res, 200, {
      success: true,
      data: result
    });
  } catch (errors) {
    response(res, 404, {
      success: false,
      message: errors.message,
      errors
    });
  }
};
var getSingleIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getSingleIssueIntoDB2(id);
    response(res, 200, {
      success: true,
      data: result
    });
  } catch (errors) {
    response(res, 404, {
      success: false,
      message: errors.message,
      errors
    });
  }
};
var updateIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.body.user;
    const result = await updateIssueIntoDB2(req.body, id, user);
    if (result.rows.length === 0) {
      response(res, 404, {
        success: false,
        message: "Issue not found",
        errors: {}
      });
      return;
    }
    response(res, 200, {
      success: true,
      data: result.rows[0]
    });
  } catch (errors) {
    response(res, 404, {
      success: false,
      message: errors.message,
      errors
    });
  }
};
var deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteIssueIntoDB2(id);
    if (result.rows.length === 0) {
      response(res, 404, {
        success: false,
        message: "Issue not found",
        errors: {}
      });
      return;
    }
    response(res, 200, {
      success: true,
      message: "Issue deleted successfully"
    });
  } catch (errors) {
    response(res, 404, {
      success: false,
      message: errors.message,
      errors
    });
  }
};
var issuesController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  deleteIssue,
  updateIssue
};

// src/middleware/auth.ts
import jwt2 from "jsonwebtoken";
var auth = (...roles) => {
  return async (req, res, next) => {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        response(res, 401, {
          success: false,
          message: "Unauthorized access."
        });
        return;
      }
      const decoded = jwt2.verify(
        authorization,
        config_default.accessToken_key
      );
      const userData = await pool.query(`
             
            SELECT * FROM users WHERE id=$1
            `, [decoded.id]);
      const user = userData.rows[0];
      if (!user) {
        response(res, 404, {
          success: false,
          message: "User Not Found decoded.!"
        });
        return;
      }
      if (roles.length && !roles.includes(user.role)) {
        response(res, 403, {
          success: false,
          message: "Access denied"
        });
        return;
      }
      req.body = req.body || {};
      req.body.reporter_id = decoded.id;
      req.body.user = decoded;
      next();
    } catch (error) {
      response(res, 401, {
        success: false,
        message: error.message
      });
    }
  };
};

// src/Modules/Issues/Issues.routes.ts
var router = Router2();
var { createIssue: createIssue2, getAllIssues: getAllIssues2, getSingleIssue: getSingleIssue2, deleteIssue: deleteIssue2, updateIssue: updateIssue2 } = issuesController;
router.post("/", auth(USER_ROLES.contributor, USER_ROLES.maintainer), createIssue2);
router.get("/", getAllIssues2);
router.get("/:id", getSingleIssue2);
router.put("/:id", auth(USER_ROLES.contributor, USER_ROLES.maintainer), updateIssue2);
router.delete("/:id", auth(USER_ROLES.maintainer), deleteIssue2);
var issuesRoutes = router;

// src/app.ts
var app = express();
app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/issues", issuesRoutes);
app.get("/", (req, res) => {
  res.send("DevPulse Server");
});
var app_default = app;

// src/server.ts
var port = config_default.port;
var main = () => {
  initDB();
  app_default.listen(port, () => {
    console.log(`DevPulse app listening on  http://localhost:${port}`);
  });
};
main();
//# sourceMappingURL=server.js.map