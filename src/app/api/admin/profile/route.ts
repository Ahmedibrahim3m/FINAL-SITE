import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { requireRole, currentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';
export const runtime='nodejs';
export async function GET(req:Request){
 if(!requireRole('admin'))return NextResponse.json({error:'Forbidden'},{status:403});
 const file=new URL(req.url).searchParams.get('file');if(!file)return NextResponse.json({error:'Missing file'},{status:400});
 const safe=path.basename(file);const ext=path.extname(safe).toLowerCase();const type=ext==='.png'?'image/png':ext==='.webp'?'image/webp':ext==='.gif'?'image/gif':'image/jpeg';
 try{const bytes=await fs.readFile(path.join(process.cwd(),'data','uploads','admin',safe));return new Response(bytes,{headers:{'Content-Type':type,'Cache-Control':'private, max-age=3600'}});}catch{return NextResponse.json({error:'Image not found'},{status:404});}
}
export async function POST(req:Request){
 if(!requireRole('admin'))return NextResponse.json({error:'Forbidden'},{status:403});
 const form=await req.formData();const file=form.get('avatar');const allowedTypes=['image/jpeg','image/png','image/webp','image/gif'];if(!(file instanceof File)||!allowedTypes.includes(file.type))return NextResponse.json({error:'استخدم صورة PNG أو JPG أو WEBP أو GIF.'},{status:400});
 if(file.size>5*1024*1024)return NextResponse.json({error:'الحد الأقصى 5 ميجابايت.'},{status:413});
 const ext=({ 'image/jpeg':'.jpg','image/png':'.png','image/webp':'.webp','image/gif':'.gif' } as Record<string,string>)[file.type];const name=`${randomUUID()}${ext}`;const dir=path.join(process.cwd(),'data','uploads','admin');await fs.mkdir(dir,{recursive:true});await fs.writeFile(path.join(dir,name),Buffer.from(await file.arrayBuffer()));
 const avatarUrl=`/api/admin/profile?file=${encodeURIComponent(name)}`;const user=currentUser();getDb().prepare('UPDATE users SET avatar_url=? WHERE id=?').run(avatarUrl,user!.id);return NextResponse.json({avatarUrl});
}
