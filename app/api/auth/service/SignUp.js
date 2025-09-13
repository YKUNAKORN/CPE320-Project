import { createRouteHandlerClient } from "../../../../lib/supabase/server";
import { Create } from "../../../../lib/supabase/crud";
// import { NextResponse } from 'next/server'

export async function SignUp(InsertUserModel, password) {
  try {
    const supabase = await createRouteHandlerClient()
    const { data, error } = await supabase.auth.signUp({
      email: InsertUserModel.email,
      password,
      options: {
        emailRedirectTo: `http://localhost:3000/auth/callback`,
      },
    });

    if (error) {
      console.error("SignUp failed: ", error);
      return { user: null, error: error };
    }
    InsertUserModel.id = data.user.id;
    const Profile = await Create(supabase, "user", InsertUserModel)
    return Profile
  } catch (error) {
    console.error("SignUp failed: Internal server error: ", error.message);
    return { user: null, error: "Internal server error: " + error.message };
  }
}
