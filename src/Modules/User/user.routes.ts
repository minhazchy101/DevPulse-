import { Router } from "express";
import { userController } from "./user.controller";

const route = Router()

const {userSignUp} = userController;

route.post('/signup', userSignUp)

export const userRoutes = route;