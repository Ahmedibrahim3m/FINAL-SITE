import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';
export const runtime='nodejs';
export async function POST(_:Request,{params}:{params:{id:string}}){
 const user=currentUser();if(!user||user.role!=='student')return NextResponse.json({error:'Unauthorized'},{status:401});
 const db=getDb();const video=db.prepare('SELECT grade FROM videos WHERE id=?').get(params.id) as {grade:string}|undefined;
 if(!video)return NextResponse.json({error:'Not found'},{status:404});
 const student=db.prepare('SELECT grade FROM users WHERE id=?').get(user.id) as {grade:string}|undefined;
 if(!student||!(video.grade===student.grade||video.grade==='كل الصفوف'))return NextResponse.json({error:'Forbidden'},{status:403});
 db.prepare('INSERT INTO video_views(id,video_id,user_id,viewed_at) VALUES(?,?,?,?)').run(randomUUID(),params.id,user.id,new Date().toISOString());
 return NextResponse.json({ok:true});
}
