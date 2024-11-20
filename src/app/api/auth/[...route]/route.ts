import { NextResponse } from 'next/server';
import { account } from '@/lib/appwrite/client';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const session = await account.createEmailPasswordSession(email, password);
    
    return NextResponse.json({ 
      session,
      success: true 
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  try {
    await account.deleteSession('current');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}