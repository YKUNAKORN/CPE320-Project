import { NextResponse } from 'next/server'
import { ResponseModel } from '../../../../lib/model/Response'
import { createRouteHandlerClient } from '../../../../lib/supabase/server'

export async function Login(email, password) {
  const supabase = await createRouteHandlerClient()
  try {
    let response = NextResponse.json(ResponseModel)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      ResponseModel.status = '500'
      ResponseModel.message = 'Login failed: ' + error.message
      ResponseModel.data = null
      return NextResponse.json(ResponseModel, { status: 500 })
    }
    
    if (data.session) {
      ResponseModel.status = '200'
      ResponseModel.message = 'Login successful'
      ResponseModel.data = data.user
      response = NextResponse.json(ResponseModel)
      return response
    }
    return NextResponse.json({ data, error })
  } catch (error) {
    ResponseModel.status = '500'
    ResponseModel.message = 'Login failed: Internal server error:  ' + error.message
    ResponseModel.data = null
    console.error(process.env.NODE_ENV === 'development' ? error.message : undefined ,error)
    return NextResponse.json(ResponseModel, { status: 500 })
  }
}