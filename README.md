# ChemistryPro — Full-stack local release

منصة تعليم كيمياء مبنية باستخدام Next.js 14، مع قاعدة بيانات SQLite على الخادم وتسجيل دخول بجلسات آمنة عبر Cookies من نوع HttpOnly.

## متطلبات التشغيل

- Windows 10/11
- **Node.js 22 LTS أو أحدث** (مطلوب لاستخدام `node:sqlite` المدمج)
- اتصال إنترنت لأول مرة لتثبيت حزم المشروع

## تشغيل المشروع

1. فك ضغط الملف بالكامل.
2. افتح مجلد `chemistry-pro`.
3. شغّل `START.bat` بالنقر المزدوج؛ في أول تشغيل سيثبّت الحزم تلقائياً وينشئ `.env.local` إذا لم يكن موجوداً.
4. بعد أول تشغيل، افتح `.env.local` وغيّر `ADMIN_PASSWORD` و`SESSION_SECRET` إلى قيم قوية وفريدة، ثم أعد تشغيل `START.bat`.
5. سيبدأ الموقع تلقائياً ويفتح المتصفح على `http://localhost:3000`. اترك نافذة التشغيل مفتوحة طوال استخدام الموقع.
6. لتشغيل فحوصات TypeScript وProduction Build وملفات المشروع وSQLite، شغّل `TEST.bat`.

يمكنك أيضاً تشغيل `SETUP.bat` لتثبيت الحزم يدوياً قبل `START.bat`.

يمكن تشغيله أيضاً بالأوامر `npm install` ثم `npm run dev`.

## حساب المدير الأول

يتم إنشاء حساب المدير تلقائياً عند أول تشغيل لقاعدة البيانات باستخدام القيم الموجودة في `.env.local`:

- البريد الافتراضي: `admin@chemistrypro.local`
- كلمة المرور الافتراضية: `ChangeMe-2026!`

**غيّر كلمة المرور السرية وSESSION_SECRET قبل إضافة بيانات طلاب حقيقية أو نشر الموقع.** لا تشارك ملف `.env.local`.

## ما تم ربطه في هذا الإصدار

- تسجيل الطلاب وحفظ بياناتهم في SQLite على الخادم، مع منع تكرار البريد الإلكتروني.
- تخزين كلمات المرور باستخدام scrypt مع Salt عشوائي؛ لا تُخزن كلمات المرور كنص صريح.
- تسجيل الدخول وجلسات موقعة ومخزنة في Cookie من نوع HttpOnly وSameSite=Lax.
- صلاحيات الإدارة مفحوصة على الخادم لكل API إداري؛ إخفاء صفحة الإدارة في الواجهة ليس وسيلة الحماية الوحيدة.
- لوحة الإدارة تعرض الطلاب والأخطاء من قاعدة البيانات، وتدعم حذف الطلاب وسجلات الأخطاء وتصدير بيانات الطلاب والأخطاء CSV.
- لوحة إحصائيات تعرض عدد حسابات الطلاب المسجلة، وتوزيعهم حسب الصف، وتسجيلات الطلاب شهرياً، ومحاولات الاختبار ومتوسط الدرجات. عدد الطلاب هنا يعني الحسابات المسجلة وليس الاشتراكات المدفوعة؛ لا توجد بوابة دفع في هذا الإصدار.
- رفع فيديوهات الحصص من لوحة الإدارة لكل صف (حتى 500 MB للفيديو)، مع حفظ الملفات في `data/uploads/videos` وتقديم الفيديو عبر API يتطلب تسجيل الدخول ويتحقق من الصف الدراسي.
- يتم تسجيل كل مرة يبدأ فيها الطالب تشغيل الفيديو، وتعرض لوحة الإدارة عدد الطلاب الفريدين الذين شاهدوا كل حصة وإجمالي مرات التشغيل.
- يمكن للأدمن رفع صورة شخصية من لوحة الإدارة؛ تُحفظ الصور في `data/uploads/admin`.
- أزرار Facebook وInstagram مربوطة بروابط الحسابات التي زودنا بها، وزر YouTube يفتح YouTube العام إلى أن يتم توفير رابط القناة.
- تم تحسين تبديل العربية والإنجليزية ليترجم عناصر الواجهة الشائعة، كما أصبحت لوحة الإدارة وصفحة الدخول ولوحة الطالب تدعم الإنجليزية مباشرة.
- إرسال نتيجة الاختبار التجريبي للخادم؛ الخادم يصحح الأسئلة من نسخة موثوقة لديه ويسجل كل إجابة خاطئة تلقائياً في Mistake Bank مع الطالب والصف والموضوع والتاريخ والعام الدراسي.
- حفظ قاعدة البيانات في `data/chemistrypro.sqlite` وتستمر بعد إغلاق الموقع وإعادة تشغيله.

## ملفات البيانات والنسخ الاحتياطي

قاعدة البيانات موجودة في `data/chemistrypro.sqlite`. أوقف الخادم قبل نسخ الملف لعمل نسخة احتياطية. لا ترفع قاعدة البيانات أو `.env.local` إلى GitHub.

## حدود هذا الإصدار قبل الإطلاق التجاري

- قاعدة SQLite مناسبة للتطوير والاستضافة على خادم Node واحد مع قرص دائم. لا تستخدم تخزين ملفات مؤقتاً أو Serverless متعدد النسخ؛ عند النشر على منصة Serverless أو عند التوسع لعدة خوادم، انقل قاعدة البيانات إلى PostgreSQL مُدار.
- نموذج الاختبار المربوط حالياً هو الاختبار التجريبي الموجود بالصفحة الرئيسية (3 أسئلة). الاختبارات الفعلية الأخرى تحتاج إلى إنشاء بنك أسئلة وإدارة امتحانات من لوحة المدير وربط كل امتحان بالخادم.
- قائمة إكمال الكورسات القديمة ما زالت محفوظة محلياً في متصفح الطالب؛ مشاهدات فيديوهات الحصص الجديدة تُحفظ على الخادم.
- عدد الطلاب المشاهدين يحسب الطلاب الفريدين، وعدد مرات التشغيل يسجل مرات الضغط على تشغيل. لا يتم قياس مدة المشاهدة أو إتمام الفيديو.
- لا يوجد حالياً استعادة كلمة مرور أو تحقق بريد/هاتف أو بوابة دفع.
- قبل إطلاق عام، أضف HTTPS، وحدود محاولات تسجيل الدخول، ومراجعة أمنية، وسياسة خصوصية ونسخاً احتياطية مجدولة.

## أهم المسارات

- `/` الصفحة الرئيسية والتسجيل والاختبار التجريبي.
- `/login` تسجيل الدخول.
- `/dashboard` لوحة الطالب.
- `/admin` لوحة الإدارة.
- `/api/*` واجهات الخادم.

## Student registration and dashboard

Student sign-up collects the student's full name, Egyptian mobile number, grade, education track (General Secondary / Baccalaureate / Al-Azhar), age, guardian mobile number, governorate, city/center, password and password confirmation. Egyptian mobile numbers may be entered using Arabic or English digits; the server normalizes them before saving. Students sign in using their mobile number and password (legacy email sign-in remains supported). A successful registration creates a secure session and redirects the student directly to `/dashboard`.

The student dashboard includes sidebar navigation for Home, Courses, Lectures and Account, with a logout action. Profile details are loaded from the server database. The governorate selector includes all 27 Egyptian governorates and a curated list of their main cities/centers; it does not enumerate every village.

## Automated project checks

Run `TEST.bat` on Windows after the first dependency installation. It runs the TypeScript type check, a Next.js production build, required-file checks, and a Node.js SQLite smoke test. A successful run does not replace manual end-to-end browser testing (student registration, student/admin login, access restrictions, video upload/playback, and logout).
