import { describe, expect, test } from '@jest/globals';
import { isNoteValid } from '../../src/interfaces/note.interface';
import { ERROR_TYPES } from '../../src/utils/errorTypes';

describe('Note Data', () => {
    describe('Zod validation works properly', () => {
        test('noteData validation happy path', () => {
            const noteData = {
                title: "title",
                content: "content",
                owner: "owner_id",
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const character = isNoteValid(noteData);
            expect(character.title).toEqual(noteData.title);
        });

        test('noteData validation missing required param', () => {
            const noteData = {
                title: "title"
            };

            try {
                isNoteValid(noteData);
            } catch (e) {
                expect(e.name).toEqual(ERROR_TYPES.ZOD_ERROR);
                expect(e.issues[0].message).toEqual('Required');
            }
        });

        test('noteData validation wrong type', () => {
            const noteData = {
                title: 111,
                content: "content"
            };

            try {
                isNoteValid(noteData);
            } catch (e) {
                expect(e.name).toEqual(ERROR_TYPES.ZOD_ERROR);
                expect(e.issues[0].message).toEqual('Expected string, received number');
            }
        });
    });
});
