import { NextResponse } from 'next/server';
import { getDb, hashPassword, createSession } from '@/lib/db';
import { randomUUID } from 'node:crypto';
export const runtime='nodejs';
const normalizeDigits=(value:string)=>value.replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString()).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
export async function POST(req:Request){
 try {
  const body=await req.json();
  const name=String(body.name||'').trim();
  const phone=normalizeDigits(String(body.phone||'')).replace(/[\s()+-]/g,'');
  const guardianPhone=normalizeDigits(String(body.guardianPhone||'')).replace(/[\s()+-]/g,'');
  const grade=String(body.grade||''); const educationType=String(body.educationType||'');
  const governorate=String(body.governorate||''); const city=String(body.city||''); const age=Number(body.age);
  const password=String(body.password||''); const confirmPassword=String(body.confirmPassword||'');
  const validGrades=['الصف الأول الثانوي','الصف الثاني الثانوي','الصف الثالث الثانوي'];
  const validEducation=['عام','بكالوريا','أزهر'];
  if(name.length<3) return NextResponse.json({error:'اكتب الاسم بالكامل.'},{status:400});
  if(!/^01[0-9]{9}$/.test(phone)) return NextResponse.json({error:'رقم الموبايل المصري يجب أن يتكون من 11 رقمًا ويبدأ بـ 01.'},{status:400});
  if(!/^01[0-9]{9}$/.test(guardianPhone)) return NextResponse.json({error:'رقم ولي الأمر غير صحيح.'},{status:400});
  if(!validGrades.includes(grade)||!validEducation.includes(educationType)) return NextResponse.json({error:'اختار الصف ونوع التعليم.'},{status:400});
  if(!governorate||!city) return NextResponse.json({error:'اختار المحافظة والمدينة أو المركز.'},{status:400});
  if(!Number.isInteger(age)||age<10||age>30) return NextResponse.json({error:'اكتب سنًا صحيحًا.'},{status:400});
  if(password.length<8) return NextResponse.json({error:'كلمة المرور يجب ألا تقل عن 8 أحرف.'},{status:400});
  if(password!==confirmPassword) return NextResponse.json({error:'كلمتا المرور غير متطابقتين.'},{status:400});
  const db=getDb();
  const existing=db.prepare('SELECT id FROM users WHERE phone=?').get(phone);
  if(existing) return NextResponse.json({error:'رقم الموبايل مسجل بالفعل. جرّب تسجيل الدخول.'},{status:409});
  const id=randomUUID();
  const email=`student.${phone}@accounts.chemistrypro.local`;
  db.prepare('INSERT INTO users(id,name,email,phone,grade,password_hash,role,created_at,education_type,guardian_phone,age,governorate,city) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)').run(id,name,email,phone,grade,hashPassword(password),'student',new Date().toISOString(),educationType,guardianPhone,age,governorate,city);
  const user={id,name,email,phone,grade,educationType,guardianPhone,age,governorate,city,role:'student'};
  const res=NextResponse.json({user});
  res.cookies.set('chemistrypro_session',createSession(user),{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:604800});
  return res;
 } catch(e:any) { return NextResponse.json({error:e?.code==='SQLITE_CONSTRAINT_UNIQUE'?'الحساب مسجل بالفعل.':'تعذر إنشاء الحساب. راجع البيانات وحاول مرة أخرى.'},{status:400}); }
}
