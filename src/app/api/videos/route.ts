import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';
export const runtime='nodejs';
export async function GET(){const user=currentUser(); if(!user)return NextResponse.json({error:'Unauthorized'},{status:401}); const row=getDb().prepare('SELECT grade FROM users WHERE id=?').get(user.id) as {grade:string}|undefined; const videos=getDb().prepare('SELECT id,title,grade,description,file_url AS fileUrl,created_at AS createdAt FROM videos WHERE grade=? OR grade=? ORDER BY created_at DESC').all(row?.grade||'', 'كل الصفوف'); const watched=getDb().prepare('SELECT DISTINCT video_id FROM video_views WHERE user_id=?').all(user.id) as {video_id:string}[]; return NextResponse.json({videos,watched:watched.map(x=>x.video_id)});}
