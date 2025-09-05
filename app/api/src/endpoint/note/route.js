import { fetchAllNotes, InsertNote } from "../../service/note_service";
import { InitializeSupabase } from "../../../../../lib/database";
import { ResponseModel } from "../../../../../lib/models/response";
const db = InitializeSupabase();

export async function GET() {
  const notes = await fetchAllNotes(db);
  if (!notes || notes == null) {
    ResponseModel.status = '404';
    ResponseModel.message = 'No notes found';
    return new Response(JSON.stringify(ResponseModel), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  ResponseModel.status = '200';
  ResponseModel.message = 'Notes retrieved successfully';
  ResponseModel.data = notes;
  return new Response(JSON.stringify(ResponseModel), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(req) {
    const data = await req.json();
    if (!data.method) {
        ResponseModel.status = '400';
        ResponseModel.message = 'Method is required';
        return new Response(JSON.stringify(ResponseModel), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    try {
        const newNote = await InsertNote(db, data);
        ResponseModel.status = '201';
        ResponseModel.message = 'Note created successfully';
        ResponseModel.data = newNote;
        return new Response(JSON.stringify(ResponseModel), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        ResponseModel.status = '500';
        ResponseModel.message = 'Error creating note' + error.message; 
        return new Response(JSON.stringify(ResponseModel), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

