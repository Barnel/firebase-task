import * as express from 'express';
import { HTTP_STATUS } from '../utils/httpStatuses';
import Controller from '../interfaces/controller.interface';
import admin from "firebase-admin";

class AuthController implements Controller {
    public path: string;
    public router: express.Router;

    constructor() {
        this.path = '/auth';
        this.router = express.Router();

        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.post(`${this.path}/signup`, this.signup);
    }

    signup = async (req: express.Request, res: express.Response) => {
        try {
            const response = await admin.auth().createUser({
                email: req.body.email,
                password: req.body.password,
                emailVerified: false,
                disabled: false
            })
            res.status(HTTP_STATUS.OK).send(response);
        } catch (e) {
            res.send(e.message).status(HTTP_STATUS.SERVER_ERROR);
        }
    }
}

export default AuthController;
