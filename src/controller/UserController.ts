import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { ClientResponse } from "http";
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

export class UserController {

    private userRepository = getRepository(User);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.findOne(request.params.id);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.save(request.body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let userToRemove = await this.userRepository.findOne(request.params.id);
        await this.userRepository.remove(userToRemove);
    }

    async update(request: Request, response: Response, next: NextFunction) {
        let updatedUser = await this.userRepository.findOne(request.params.id);
        updatedUser.username = request.body.username;
        updatedUser.email = request.body.email;
        updatedUser.password = request.body.password;
        return await this.userRepository.save(updatedUser);
    }

    async register(request: Request, response: Response, next: NextFunction) {
        try {
            const { username, email, password } = request.body;

            if (!(email && password && username)) {
                 response.status(401).send("All input is required");
                 return;
            }

            const userExists = await this.userRepository.findOne({ where: { email: email } });


            if (userExists) {
                 response.status(409).send("User Already Exist. Please Login");
                 return;
            }

            const encryptedPassword = await bcrypt.hash(password, 10);

            const user = {
                username: username,
                email: email.toLowerCase(),
                password: encryptedPassword,
            };

            const newUser = this.userRepository.save(user);
            const token = jwt.sign({ email, password }, jwtSecret, { expiresIn: 5000 });

             response.status(201).send({token: token });
        } catch (err) {
            console.log(err);
        }

    }

    async login(request: Request, response: Response, next: NextFunction) {
        try {
            const { email, password } = request.body;

            if (!(email && password)) {
                response.status(401).send("All input is required");
                return;
            }

            const userExists = await this.userRepository.findOne({ where: { email: email } });

            if (userExists && (await bcrypt.compare(password, userExists.password))) {
                const token = jwt.sign({ email, password }, jwtSecret, { expiresIn: 5000 });
                response.status(201).send({token: token });
                return;
            }

            response.status(401).send("Invalid Credentials");
        } catch (err) {
            console.log(err);
        }
    }
    async getUserInfo(request:Request,response:Response,next:NextFunction){
       console.log(response);
       console.log(request);
    }

} 