import * as express from 'express';
import { HTTP_STATUS } from '../utils/httpStatuses';
import Controller from '../interfaces/controller.interface';
import NotesService from '../services/note.service';
import { isNoteValid, isPartialNoteValid } from '../interfaces/note.interface';
import { ERROR_TYPES } from '../utils/errorTypes';
import { zodErrorMessage } from '../utils/errorMessages';

class NotesController implements Controller {
    public path: string;
    public router: express.Router;
    public service: NotesService;

    constructor() {
        this.path = '/notes';
        this.router = express.Router();
        this.service = new NotesService();

        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(this.path, this.getNotes);
        this.router.post(this.path, this.createNote);
        this.router.get(`${this.path}/:id`, this.getNote);
        this.router.patch(`${this.path}/:id`, this.editNote);
        this.router.delete(`${this.path}/:id`, this.deleteNote);
    }

    createNote = async (req: express.Request, res: express.Response) => {
        try {
            const notesData = req.body;
            const noteData = {
                ...notesData,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            isNoteValid(noteData);

            const newNote = await this.service.createNote(noteData);
            res.status(HTTP_STATUS.CREATED).send(newNote);
        } catch (e) {
            if (e.name === ERROR_TYPES.ZOD_ERROR) {
                const message = zodErrorMessage(e);

                res.status(HTTP_STATUS.BAD_REQUEST).send({ message });
            } else {
                res.status(HTTP_STATUS.SERVER_ERROR).send(e.message);
            }
        }
    };

    getNotes = async (req: express.Request, res: express.Response) => {
        try {
            const notes = await this.service.getNotes();

            res.status(HTTP_STATUS.OK).send(notes);
        } catch (e) {
            res.send(e.message).status(HTTP_STATUS.SERVER_ERROR);
        }
    };

    getNote = async (req: express.Request, res: express.Response) => {
        try {
            const { id } = req.params;

            const note = await this.service.getNote(id);

            if (!note) {
                res.status(HTTP_STATUS.NOT_FOUND).send();
            } else {
                res.send(note).status(HTTP_STATUS.OK);
            }
        } catch (e) {
            res.send(e.message).status(HTTP_STATUS.SERVER_ERROR);
        }
    };


    editNote = async (req: express.Request, res: express.Response) => {
        try {
            const noteData = req.body;
            const { id } = req.params;

            isPartialNoteValid(noteData);

            const editedNote = await this.service.editNote(id, req.body);

            if (!editedNote) {
                res.status(HTTP_STATUS.NOT_FOUND).send();
            } else {
                res.status(HTTP_STATUS.CREATED).send(editedNote);
            }
        } catch (e) {
            if (e.name === ERROR_TYPES.ZOD_ERROR) {
                const message = zodErrorMessage(e);

                res.status(HTTP_STATUS.BAD_REQUEST).send({ message });
            } else {
                res.status(HTTP_STATUS.SERVER_ERROR).send(e.message);
            }
        }
    };

    deleteNote = async (req: express.Request, res: express.Response) => {
        try {
            const { id } = req.params;

            const note = await this.service.deletNote(id);

            if (!note) {
                res.status(HTTP_STATUS.NOT_FOUND).send();
            } else {
                res.send(note).status(HTTP_STATUS.OK);
            }
        } catch (e) {
            res.send(e.message).status(HTTP_STATUS.SERVER_ERROR);
        }
    };
}

export default NotesController;
