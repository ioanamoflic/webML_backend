import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {Routes} from "./routes";
import * as cors from 'cors';
import * as fileUpload from "express-fileupload";

createConnection().then(async connection => {

    const allowedOrigins = ['http://localhost:3000', 'http://localhost'];

    const options: cors.CorsOptions = {
      origin: allowedOrigins
    };
    const app = express(); 
    app.use(cors(options));
    app.use(bodyParser.json());
    app.use(fileUpload({
        useTempFiles : false,
        tempFileDir : '/tmp/'
    }));

    Routes.forEach(route => {
        if(route.middleware){
            (app as any)[route.method](route.route, route.middleware);
        }
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });

    app.listen(3001);

    // await connection.manager.save(connection.manager.create(User, {
    //     email: "ioana@yahoo.com",
    //     username: "ioana",
    //     password: "password"
    // }));

    console.log("Express server has started on port 3001. Open http://localhost:3001/users to see results");

}).catch(error => console.log(error));
