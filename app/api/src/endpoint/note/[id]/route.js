import { fetchByID } from "../../../service/note_service";
import { InitializeSupabase } from "../../../../../../lib/database";
import { ResponseModel } from "../../../../../../lib/models/response";
const db = InitializeSupabase();


export async function GET(req, { params }) {
   const { id } = await params;
    if (!id) {
      ResponseModel.status = '400';
      ResponseModel.message = 'ID parameter is required';
      return new Response(JSON.stringify(ResponseModel), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  
    const note = await fetchByID(db, id);
    if (!note || note == null) {
      ResponseModel.status = '404';
      ResponseModel.message = 'Note not found';
      return new Response(JSON.stringify(ResponseModel), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    ResponseModel.status = '200';
    ResponseModel.message = 'Note retrieved successfully';
    ResponseModel.data = note;
    return new Response(JSON.stringify(ResponseModel), {
      headers: { 'Content-Type': 'application/json' },
    });
}
