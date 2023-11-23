import {
    Note, mapNote
} from '../interfaces/note.interface';

import admin from "firebase-admin";
const serviceAccount = require("../../key.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

class NotesService {
    public firestore: any
    public db

    constructor() {
        this.db = admin.firestore()
    }

    async createNote(note: Note) {
        return this.db.collection('notes').doc().set(note);

    };

    async getNotes() {
        const notesRef = this.db.collection('notes');
        const snapshot = await notesRef.get();

        return snapshot.docs.map(doc => {
            return mapNote(doc);
        });
    };

    async getNote(id: string) {
        const doc = await this.db.collection('notes').doc(id).get();
        return mapNote(doc);
    };

    async editNote(id: string, newData: Partial<Note>) {
        return this.db.collection('notes').doc(id).update(newData)
    }

    async deletNote(id: string) {
        return this.db.collection('notes').doc(id).delete()
    }

}

export default NotesService;
