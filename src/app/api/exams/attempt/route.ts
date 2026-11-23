import {NextResponse} from 'next/server';
import {requireRole} from '@/lib/auth';
import {getDb} from '@/lib/db';
import {randomUUID} from 'node:crypto';
export const runtime='nodejs';
const questions=[
 {topic:'تركيب الذرة',question:'ما الجسيم الذي يحمل شحنة سالبة داخل الذرة؟',options:['البروتون','الإلكترون','النيوترون','النواة'],answer:1,explanation:'الإلكترون يحمل شحنة سالبة.'},
 {topic:'الأحماض والقواعد',question:'ما قيمة الرقم الهيدروجيني للمحلول المتعادل عند 25°C؟',options:['1','5','7','14'],answer:2,explanation:'المحلول المتعادل يكون pH = 7 عند 25°C.'},
 {topic:'الروابط الكيميائية',question:'أي مما يلي يُعد رابطة تساهمية؟',options:['انتقال إلكترونات','مشاركة إلكترونات','فقد بروتون','تكوين أيونات فقط'],answer:1,explanation:'الرابطة التساهمية تنتج عن مشاركة الإلكترونات.'}
];
export async function POST(req:Request){
 const user=requireRole('student');
 if(!user)return NextResponse.json({error:'سجّل دخولك كطالب لحفظ نتيجتك.'},{status:401});
 const {answers}=await req.json();
 if(!Array.isArray(answers)||answers.length!==questions.length||answers.some((a:any)=>!Number.isInteger(a)||a<0||a>3))return NextResponse.json({error:'إجابات الاختبار غير صالحة.'},{status:400});
 const db=getDb();const student:any=db.prepare('SELECT name,grade FROM users WHERE id=?').get(user.id);
 const id=randomUUID(),date=new Date().toISOString().slice(0,10),year=process.env.ACADEMIC_YEAR||'2026/2027';
 const score=questions.reduce((n,q,i)=>n+(answers[i]===q.answer?1:0),0);
 db.prepare('INSERT INTO exam_attempts(id,user_id,score,total,academic_year,created_at) VALUES(?,?,?,?,?,?)').run(id,user.id,score,questions.length,year,new Date().toISOString());
 const insert=db.prepare('INSERT INTO mistakes(id,attempt_id,user_id,student_name,grade,topic,question,wrong_answer,correct_answer,date,academic_year,note) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)');
 for(let i=0;i<questions.length;i++){const q=questions[i];if(answers[i]!==q.answer)insert.run(randomUUID(),id,user.id,student.name,student.grade,q.topic,q.question,q.options[answers[i]],q.options[q.answer],date,year,q.explanation);}
 return NextResponse.json({ok:true,score,total:questions.length,errors:questions.length-score});
}
