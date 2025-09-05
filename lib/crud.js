export async function CreateRow(db, table_name, rows) {
        const { data, error } = await db.from(table_name).insert(rows).select();
        if (error) {
            console.error("InsertRow error:", error.message);
            throw new Error("Error creating row");
        }
        return data;
}

export async function GetAll(db, table_name) {
  try {
    const { data, error } = await db.from(table_name).select('*');
    if (error) {
      console.error("GetAll error:", error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error("GetAll error:", err.message);
    return null;
  }
}

export async function GetByID(db, table_name, id) {
    try {
        const { data, error } = await db.from(table_name).select("*").eq("id", id).single();
        if (error) {
            console.error(error.message);
            return null;
        }
        return data;
    } catch (error) {
        console.error("Error fetching note by ID:", error);
        return null;
    }
    
}

export async function UpdateRow(db, table_name, id, updatedFields) {
    try {
        const { data, error } = await db.from(table_name).update(updatedFields).eq("id", id).select();
        if (error) {
            console.error("UpdateRow error:", error.message);
            throw new Error("Error updating row");
        }
        return data;
    } catch (error) {
        console.error("Error updating row:", error);
        throw new Error("Error updating row");
    }
}

export async function DeleteRow(db, table_name, id) {
    try {
        const { data, error } = await db.from(table_name).delete().eq("id", id).select();
        if (error) {
            console.error("DeleteRow error:", error.message);
            throw new Error("Error deleting row");
        }
        return data;
    } catch (error) {
        console.error("Error deleting row:", error);
        throw new Error("Error deleting row");
    }
}
