import {NextResponse} from 'next/server';
import {requireRole} from '@/lib/auth';
import {getDb} from '@/lib/db';
export const runtime='nodejs';
export async function GET(){
 if(!requireRole('admin'))return NextResponse.json({error:'Forbidden'},{status:403});
 const d=getDb();
 const students=d.prepare("SELECT id,name,email,phone,grade,education_type AS educationType,guardian_phone AS guardianPhone,age,governorate,city,created_at AS createdAt FROM users WHERE role='student' ORDER BY created_at DESC").all();
 const mistakes=d.prepare('SELECT id,user_id AS studentId,student_name AS studentName,grade,topic,question,wrong_answer AS wrongAnswer,correct_answer AS correctAnswer,date,academic_year AS year,note FROM mistakes ORDER BY date DESC').all();
 const gradeStats=d.prepare("SELECT COALESCE(grade,'غير محدد') AS grade,COUNT(*) AS students FROM users WHERE role='student' GROUP BY grade ORDER BY grade").all();
 const monthly=d.prepare("SELECT substr(created_at,1,7) AS month,COUNT(*) AS students FROM users WHERE role='student' AND created_at >= date('now','-11 months') GROUP BY month ORDER BY month").all();
 const views=d.prepare('SELECT COUNT(*) AS totalViews,COUNT(DISTINCT user_id) AS uniqueViewers FROM video_views').get();
 const videos=d.prepare('SELECT COUNT(*) AS totalVideos FROM videos').get();
 const attempts=d.prepare('SELECT COUNT(*) AS totalAttempts,COALESCE(AVG(score*100.0/NULLIF(total,0)),0) AS averageScore FROM exam_attempts').get();
 const watchedLessons=d.prepare("SELECT COUNT(DISTINCT video_id || '-' || user_id) AS watchedLessons FROM video_views").get();
 return NextResponse.json({students,mistakes,gradeStats,monthly,views,videos,attempts,watchedLessons});
}
