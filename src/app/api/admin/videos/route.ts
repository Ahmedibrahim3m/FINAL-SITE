import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { getDb } from '@/lib/db';
export const runtime = 'nodejs';
const grades = ['الصف الأول الثانوي','الصف الثاني الثانوي','الصف الثالث الثانوي','كل الصفوف'];
export async function GET() {
  if (!requireRole('admin')) return NextResponse.json({error:'Forbidden'},{status:403});
  const videos = getDb().prepare(`SELECT v.id,v.title,v.grade,v.description,v.file_url AS fileUrl,v.file_name AS fileName,v.size_bytes AS sizeBytes,v.created_at AS createdAt,COUNT(DISTINCT vv.user_id) AS viewers,COUNT(vv.id) AS views FROM videos v LEFT JOIN video_views vv ON vv.video_id=v.id GROUP BY v.id ORDER BY v.created_at DESC`).all();
  return NextResponse.json({videos});
}
export async function POST(req: Request) {
  if (!requireRole('admin')) return NextResponse.json({error:'Forbidden'},{status:403});
  const form = await req.formData(); const file = form.get('video'); const title = String(form.get('title')||'').trim(); const grade = String(form.get('grade')||''); const description = String(form.get('description')||'').trim();
  if (!(file instanceof File) || !title || !grades.includes(grade)) return NextResponse.json({error:'أدخل عنوان الفيديو والصف وارفع ملف فيديو صالح.'},{status:400});
  if (!file.type.startsWith('video/')) return NextResponse.json({error:'الملف يجب أن يكون فيديو.'},{status:400});
  if (file.size > 500 * 1024 * 1024) return NextResponse.json({error:'الحد الأقصى لحجم الفيديو 500 ميجابايت.'},{status:413});
  const ext = path.extname(file.name).replace(/[^.a-zA-Z0-9]/g,'').slice(0,12) || '.mp4'; const id = randomUUID(); const fileName = `${id}${ext}`; const dir = path.join(process.cwd(),'data','uploads','videos'); await fs.mkdir(dir,{recursive:true}); await fs.writeFile(path.join(dir,fileName),Buffer.from(await file.arrayBuffer()));
  getDb().prepare('INSERT INTO videos(id,title,grade,description,file_url,file_name,size_bytes,created_at) VALUES(?,?,?,?,?,?,?,?)').run(id,title,grade,description,`/api/videos/${id}/stream`,file.name,file.size,new Date().toISOString());
  return NextResponse.json({ok:true,id});
}
export async function DELETE(req: Request) {
  if (!requireRole('admin')) return NextResponse.json({error:'Forbidden'},{status:403});
  const {id}=await req.json(); const video=getDb().prepare('SELECT file_name AS fileName FROM videos WHERE id=?').get(id) as {fileName:string}|undefined; if(!video)return NextResponse.json({error:'Not found'},{status:404});
  getDb().prepare('DELETE FROM video_views WHERE video_id=?').run(id); getDb().prepare('DELETE FROM videos WHERE id=?').run(id);
  try { await fs.unlink(path.join(process.cwd(),'data','uploads','videos',video.fileName)); } catch {}
  return NextResponse.json({ok:true});
}
