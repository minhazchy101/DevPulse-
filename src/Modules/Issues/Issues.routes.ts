import { Router } from "express";
import { issuesController } from "./Issues.controller";
import { auth } from "../../middleware/auth";
import { USER_ROLES } from "../../types/roles";

const router = Router();

const {createIssue, getAllIssues, getSingleIssue, deleteIssue} = issuesController;

router.post('/', auth(USER_ROLES.contributor, USER_ROLES.maintainer), createIssue)
router.get('/', getAllIssues)
router.get('/:id', getSingleIssue)
router.delete('/:id', deleteIssue)

export const issuesRoutes = router