import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';
export const runtime='nodejs';
export async function GET(req:Request,{params}:{params:{id:string}}){
 const user=currentUser(); if(!user)return NextResponse.json({error:'Unauthorized'},{status:401});
 const db=getDb(); const video=db.prepare('SELECT file_name AS fileName,grade FROM videos WHERE id=?').get(params.id) as {fileName:string;grade:string}|undefined;
 if(!video)return NextResponse.json({error:'Not found'},{status:404});
 if(user.role==='student'){const student=db.prepare('SELECT grade FROM users WHERE id=?').get(user.id) as {grade:string}|undefined;if(!student||!(video.grade===student.grade||video.grade==='كل الصفوف'))return NextResponse.json({error:'Forbidden'},{status:403});}
 const filePath=path.join(process.cwd(),'data','uploads','videos',video.fileName);
 try{const info=await fs.stat(filePath);const ext=path.extname(video.fileName).toLowerCase();const type=ext==='.webm'?'video/webm':ext==='.mov'?'video/quicktime':ext==='.ogg'?'video/ogg':'video/mp4';const range=req.headers.get('range');const common={'Content-Type':type,'Accept-Ranges':'bytes','Cache-Control':'private, no-store'};
  if(range){const match=/bytes=(\d*)-(\d*)/.exec(range);if(!match)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${info.size}`}});const start=match[1]?Number(match[1]):0;const end=match[2]?Math.min(Number(match[2]),info.size-1):info.size-1;if(start>end||start>=info.size)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${info.size}`}});const stream=createReadStream(filePath,{start,end});return new Response(Readable.toWeb(stream) as ReadableStream,{status:206,headers:{...common,'Content-Length':String(end-start+1),'Content-Range':`bytes ${start}-${end}/${info.size}`}});}
  const stream=createReadStream(filePath);return new Response(Readable.toWeb(stream) as ReadableStream,{headers:{...common,'Content-Length':String(info.size)}});
 }catch{return NextResponse.json({error:'Video file is missing'},{status:404});}
}
