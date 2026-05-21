import { Router } from "express";
import { userController } from "./user.controller";

const route = Router()

const {userSignUp, userLogin} = userController;

route.post('/signup', userSignUp)
route.post('/login', userLogin)

export const userRoutes = route;