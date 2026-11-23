import { NextResponse } from 'next/server';
import { getDb,verifyPassword,createSession } from '@/lib/db';
export const runtime='nodejs';
const normalizeDigits=(value:string)=>value.replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString()).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
export async function POST(req:Request){
 const {email,identifier,password}=await req.json();
 const login=String(identifier||email||'').trim();
 const normalized=normalizeDigits(login).replace(/[\s()+-]/g,'');
 const user:any=getDb().prepare('SELECT id,name,email,password_hash,role,grade,phone FROM users WHERE lower(email)=? OR phone=?').get(login.toLowerCase(),normalized);
 if(!user||!verifyPassword(String(password||''),user.password_hash))return NextResponse.json({error:'رقم الموبايل أو البريد الإلكتروني أو كلمة المرور غير صحيحة.'},{status:401});
 const safe={id:user.id,name:user.name,email:user.email,phone:user.phone,role:user.role,grade:user.grade};
 const res=NextResponse.json({user:safe});res.cookies.set('chemistrypro_session',createSession(safe),{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:604800});return res;
}
