import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import Controller from './interfaces/controller.interface';
import AuthController from './controllers/auth.controller';
import NotesController from './controllers/note.controller';

const { SERVER_PORT } = process.env;

class App {
    public app: express.Application;
    public controllers: Controller[];

    constructor() {
        this.app = express();
        this.controllers = [new NotesController(), new AuthController()];

        this.initializeMiddleware();
        this.initializeControllers();
    }

    private initializeMiddleware() {
        this.app.use(bodyParser.json());
        this.app.use(cors()).use(express.json()).options('*', cors());
    }

    private initializeControllers() {
        this.controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    listen() {
        this.app.listen(SERVER_PORT, () => {
            console.log(`[server]: running at http://localhost:${SERVER_PORT}`);
        });
    }
}

export default App;
