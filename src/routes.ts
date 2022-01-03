import verifyToken from "../middleware/auth";
import { UserController } from "./controller/UserController";
import { AI_Tensorflow } from "./controller/AI_Tensorflow";

export const Routes = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all",
    middleware: verifyToken,
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one",
    middleware: verifyToken,
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save",
    middleware: verifyToken,
}, {
    method: "put",
    route: "/users/update/:id",
    controller: UserController,
    action: "update",
    middleware: verifyToken,
}, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove",
    middleware: verifyToken,
}, {
    method: "post",
    route: "/users/login",
    controller: UserController,
    action: "login"
}, {
    method: "post",
    route: "/users/register",
    controller: UserController,
    action: "register"
},
{
    method: "get",
    route: "/users/info",
    controller: UserController,
    middleware: verifyToken,
    action: "getUserInfo"
},
{
    method: "post",
    route: "/images/evaluate",
    controller: AI_Tensorflow,
    action: "evaluateAndSave"
},
{
    method: "get",
    route: "/images",
    controller: AI_Tensorflow,
    action: "readImages"
},
];