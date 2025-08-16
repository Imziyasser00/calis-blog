import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
export async function POST(req: NextRequest) {
    const secret = req.nextUrl.searchParams.get('secret')
    if (secret !== process.env.REVALIDATE_SECRET) return NextResponse.json({ ok:false, message:'Invalid secret' }, { status: 401 })
    try { const body = await req.json().catch(() => ({})); revalidatePath('/'); (body?.slugs||[]).forEach((s:string)=> revalidatePath(`/blog/${s}`)); return NextResponse.json({ revalidated:true }) } catch (e:any) { return NextResponse.json({ ok:false, message:e.message }, { status:500 }) }
}
