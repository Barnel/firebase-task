import { z } from 'zod';
import { Timestamp } from 'firebase/firestore'

export interface Note {
    title: string;
    content: string;
    owner: string;
    createdAt: Date;
    updatedAt: Date;
}

export const mapNote = (doc: any) => {
    const data = doc.data()

    if (!data) {
        throw new Error("No data")
    }

    return {
        id: doc.id,
        title: data.title,
        content: data.content,
        owner: data.owner,
        createdAt: getDate(data.createdAt),
        updatedAt: getDate(data.modifiedAt ?? data.updatedAt),
    }
}

const note = z.object({
    title: z.string(),
    content: z.string(),
    owner: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

const partialNote = note.partial();

export const isNoteValid = (inputs: unknown) => note.parse(inputs);
export const isPartialNoteValid = (inputs: unknown) => partialNote.parse(inputs)


const getDate = (firestoreTimestamp: { _seconds: number, _nanoseconds: number }) => {
    return firestoreTimestamp ? new Timestamp(firestoreTimestamp._seconds, firestoreTimestamp._nanoseconds).toDate() : undefined
}
