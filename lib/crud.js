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
