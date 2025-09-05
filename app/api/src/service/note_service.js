import { GetAllNotes, GetNoteByID, CreateNote, updateNote , DeleteNote } from "../../repository/note_repo";

export async function InsertNote(db, data) {
  const response = await CreateNote(db, data);
  return response;
}
export async function fetchAllNotes(db) {
  const data = await GetAllNotes(db);
  return data;
}

export async function fetchByID(db, id) {
  const data = await GetNoteByID(db, id);
  return data;
}

export async function updatedNote(db, id, updatedFields) {
  return await updateNote(db, id, updatedFields);
}

export async function removeNote(db, id) {
  const data = await DeleteNote(db, id);
  return data;
}
