import { GetAll , GetByID, CreateRow } from "../../../lib/crud";
import { ResponseNote } from "../../../lib/models/note_model";

export async function CreateNote(db, rows) {
    try {
        const data = await CreateRow(db, "note", rows);
        if(data == null) {
            return null;
        }
        ResponseNote.id = data[0].id
        ResponseNote.method = data[0].method
        ResponseNote.createdAt = data[0].created_at
        return ResponseNote;
    } catch (error) {
        console.error('Error creating note:', error);
        return null;
    }
}
export async function GetAllNotes(db) {
    try {
        const data = await GetAll(db, "note");
        if(data == null) {
            return null;
        }
        const response = data.map(item => ({
            ...ResponseNote,
            id: item.id,
            method: item.method,
            createdAt: item.created_at,
        }));
        return response;
    } catch (error) {
        console.error('Error fetching all notes:', error);
        return null;
    }
}

export async function GetNoteByID(db, id) {
    try {
        const item = await GetByID(db, "note", id);
        if(item == null) {
            return null;
        }
        ResponseNote.id = item.id
        ResponseNote.method = item.method
        ResponseNote.createdAt = item.created_at
        return ResponseNote
    } catch (error) {
        console.error('Error fetching note by ID:', error);
        return null;
    }
}