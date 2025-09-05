import { GetAllNotes, GetNoteByID, CreateNote } from "../../repository/note_repo";

export async function InsertNote(db, data) {
    const response = await CreateNote(db, data);
    return response;
}
export async function fetchAllNotes(db) {
  return await GetAllNotes(db);
}

export async function fetchByID(db, id) {
  return await GetNoteByID(db, id);
}