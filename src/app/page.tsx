
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Atom,
  FlaskConical,
  ArrowLeft,
  ArrowUpLeft,
  Play,
  BookOpen,
  ClipboardCheck,
  Users,
  GraduationCap,
  Star,
  CheckCircle2,
  Menu,
  X,
  Clock3,
  Sparkles,
  Microscope,
  Trophy,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Youtube,
  CircleHelp,
  Zap,
} from "lucide-react";


const egyptLocations: Record<string,string[]> = {
  "القاهرة":["مدينة نصر","مصر الجديدة","المعادي","حلوان","شبرا","وسط البلد","التجمع الخامس","عين شمس","المطرية","المرج","السلام","الزيتون","حدائق القبة"],
  "الجيزة":["الدقي","المهندسين","العجوزة","فيصل","الهرم","إمبابة","أكتوبر","الشيخ زايد","البدرشين","العياط","أوسيم","كرداسة","منشأة القناطر"],
  "الإسكندرية":["شرق","وسط","غرب","المنتزه","الجمرك","العامرية","برج العرب","العجمي","محرم بك","سيدي جابر"],
  "الدقهلية":["المنصورة","طلخا","ميت غمر","دكرنس","أجا","السنبلاوين","شربين","بلقاس","منية النصر","تمي الأمديد"],
  "البحر الأحمر":["الغردقة","رأس غارب","سفاجا","القصير","مرسى علم","الشلاتين","حلايب"],
  "البحيرة":["دمنهور","كفر الدوار","رشيد","إدكو","أبو حمص","أبو المطامير","الدلنجات","حوش عيسى","إيتاي البارود","كوم حمادة","شبراخيت","النوبارية"],
  "الفيوم":["الفيوم","سنورس","إطسا","طامية","أبشواي","يوسف الصديق"],
  "الغربية":["طنطا","المحلة الكبرى","كفر الزيات","زفتى","السنطة","بسيون","قطور","سمنود"],
  "الإسماعيلية":["الإسماعيلية","فايد","القنطرة شرق","القنطرة غرب","التل الكبير","أبو صوير","القصاصين"],
  "المنوفية":["شبين الكوم","منوف","أشمون","الباجور","قويسنا","تلا","بركة السبع","الشهداء","سرس الليان"],
  "المنيا":["المنيا","ملوي","مغاغة","بني مزار","سمالوط","أبو قرقاص","دير مواس","مطاي","العدوة"],
  "القليوبية":["بنها","شبرا الخيمة","قليوب","القناطر الخيرية","الخانكة","كفر شكر","طوخ","شبين القناطر","العبور","الخصوص"],
  "الوادي الجديد":["الخارجة","الداخلة","الفرافرة","باريس","بلاط"],
  "السويس":["حي السويس","الأربعين","عتاقة","الجناين","فيصل"],
  "أسوان":["أسوان","دراو","كوم أمبو","نصر النوبة","إدفو","أبو سمبل"],
  "أسيوط":["أسيوط","ديروط","القوصية","منفلوط","أبنوب","أبو تيج","الغنايم","ساحل سليم","البداري","صدفا"],
  "بني سويف":["بني سويف","الواسطى","ناصر","إهناسيا","ببا","سمسطا","الفشن"],
  "بورسعيد":["حي الشرق","حي العرب","حي المناخ","حي الضواحي","حي الزهور","حي الجنوب"],
  "دمياط":["دمياط","فارسكور","الزرقا","كفر سعد","كفر البطيخ","رأس البر","عزبة البرج"],
  "جنوب سيناء":["الطور","شرم الشيخ","دهب","نويبع","طابا","أبو رديس","أبو زنيمة","سانت كاترين"],
  "كفر الشيخ":["كفر الشيخ","دسوق","فوه","مطوبس","بلطيم","الحامول","بيلا","سيدي سالم","قلين","الرياض"],
  "مطروح":["مرسى مطروح","الحمام","العلمين","الضبعة","النجيلة","سيدي براني","السلوم","سيوة"],
  "الأقصر":["الأقصر","القرنة","إسنا","أرمنت","البياضية","الزينية","الطود"],
  "قنا":["قنا","نجع حمادي","دشنا","قفط","قوص","أبو تشت","فرشوط","نقادة"],
  "شمال سيناء":["العريش","بئر العبد","الشيخ زويد","رفح","الحسنة","نخل"],
  "سوهاج":["سوهاج","أخميم","جرجا","طهطا","المراغة","المنشأة","البلينا","دار السلام","ساقلتة","جهينة"],
  "الشرقية":["الزقازيق","العاشر من رمضان","بلبيس","منيا القمح","أبو حماد","فاقوس","ههيا","ديرب نجم","أبو كبير","الحسينية","الإبراهيمية","كفر صقر","أولاد صقر"]
};

type Course = {
  id: number;
  title: string;
  grade: string;
  category: string;
  lessons: number;
  duration: string;
  color: string;
  description: string;
};

const courses: Course[] = [
  {
    id: 1,
    title: "أساسيات الكيمياء",
    grade: "الصف الأول الثانوي",
    category: "foundations",
    lessons: 12,
    duration: "8 ساعات",
    color: "cyan",
    description: "ابدأ صح وافهم أساسيات المادة والذرة والروابط.",
  },
  {
    id: 2,
    title: "الكيمياء العضوية",
    grade: "الصف الثالث الثانوي",
    category: "organic",
    lessons: 18,
    duration: "14 ساعة",
    color: "purple",
    description: "شرح مبسط للتفاعلات العضوية مع تدريبات شاملة.",
  },
  {
    id: 3,
    title: "الاتزان الكيميائي",
    grade: "الصف الثالث الثانوي",
    category: "advanced",
    lessons: 10,
    duration: "7 ساعات",
    color: "pink",
    description: "افهم القوانين وخطوات الحل بدل الحفظ فقط.",
  },
  {
    id: 4,
    title: "التحليل الكيميائي",
    grade: "الصف الثاني الثانوي",
    category: "foundations",
    lessons: 14,
    duration: "9 ساعات",
    color: "blue",
    description: "تدريبات على المسائل والتحليل خطوة بخطوة.",
  },
  {
    id: 5,
    title: "الكهربية الكيميائية",
    grade: "الصف الثالث الثانوي",
    category: "advanced",
    lessons: 11,
    duration: "8 ساعات",
    color: "green",
    description: "الخلايا الكهربية والأكسدة والاختزال بطريقة سهلة.",
  },
  {
    id: 6,
    title: "مراجعة ليلة الامتحان",
    grade: "كل الصفوف",
    category: "revision",
    lessons: 6,
    duration: "4 ساعات",
    color: "orange",
    description: "أهم الأفكار والأسئلة في مراجعة مركزة.",
  },
];

const quizQuestions = [
  {
    topic: "تركيب الذرة",
    question: "ما الجسيم الذي يحمل شحنة سالبة داخل الذرة؟",
    options: ["البروتون", "الإلكترون", "النيوترون", "النواة"],
    answer: 1,
    explanation: "الإلكترون يحمل شحنة سالبة.",
  },
  {
    topic: "الأحماض والقواعد",
    question: "ما قيمة الرقم الهيدروجيني للمحلول المتعادل عند 25°C؟",
    options: ["1", "5", "7", "14"],
    answer: 2,
    explanation: "المحلول المتعادل يكون pH = 7 عند 25°C.",
  },
  {
    topic: "الروابط الكيميائية",
    question: "أي مما يلي يُعد رابطة تساهمية؟",
    options: [
      "انتقال إلكترونات",
      "مشاركة إلكترونات",
      "فقد بروتون",
      "تكوين أيونات فقط",
    ],
    answer: 1,
    explanation: "الرابطة التساهمية تنتج عن مشاركة الإلكترونات.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const [registered, setRegistered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    name: "", phone: "", grade: "الصف الثالث الثانوي", educationType: "عام",
    guardianPhone: "", age: "", governorate: "", city: "", password: "", confirmPassword: "",
  });

  const filteredCourses = useMemo(
    () =>
      filter === "all"
        ? courses
        : courses.filter(
            (course) =>
              course.category === filter ||
              (filter === "third" &&
                course.grade.includes("الثالث"))
          ),
    [filter]
  );

  const score = answers.reduce(
    (sum, answer, index) =>
      sum +
      (answer === quizQuestions[index]?.answer ? 1 : 0),
    0
  );

  function chooseAnswer(index: number) {
    if (showResult) return;

    const next = [...answers];
    next[quizIndex] = index;
    setAnswers(next);
  }

  function nextQuestion() {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(quizIndex + 1);
    } else {
      setShowResult(true);
      fetch("/api/exams/attempt", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({answers}) }).catch(()=>{});
    }
  }

  function resetQuiz() {
    setQuizIndex(0);
    setAnswers([]);
    setShowResult(false);
  }


async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault(); setErrorMessage(""); if (isSubmitting) return;
  const normalizeDigits=(v:string)=>v.replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d).toString()).replace(/[۰-۹]/g,d=>"۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
  const phone=normalizeDigits(form.phone).replace(/[\s()+-]/g,"");
  const guardianPhone=normalizeDigits(form.guardianPhone).replace(/[\s()+-]/g,"");
  if(form.name.trim().length<3)return setErrorMessage("اكتب اسمك بالكامل.");
  if(!/^01[0-9]{9}$/.test(phone))return setErrorMessage("رقم الموبايل لازم يكون 11 رقم ويبدأ بـ 01.");
  if(!/^01[0-9]{9}$/.test(guardianPhone))return setErrorMessage("اكتب رقم ولي أمر صحيح (11 رقم).");
  if(!form.age||Number(form.age)<10||Number(form.age)>30)return setErrorMessage("اكتب سن صحيح.");
  if(!form.governorate||!form.city)return setErrorMessage("اختار المحافظة والمدينة أو المركز.");
  if(form.password.length<8)return setErrorMessage("كلمة المرور لازم تكون 8 أحرف على الأقل.");
  if(form.password!==form.confirmPassword)return setErrorMessage("كلمتا المرور غير متطابقتين.");
  setIsSubmitting(true);
  try {
    const response=await fetch("/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...form,phone,guardianPhone,age:Number(form.age)})});
    const data=await response.json();
    if(!response.ok){setErrorMessage(data.error||"تعذر إنشاء الحساب.");return;}
    setRegistered(true);
    router.push("/dashboard");
  } catch { setErrorMessage("تعذر الاتصال بالخادم. حاول مرة أخرى."); }
  finally { setIsSubmitting(false); }
}

  return (
    <main>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a className="brand" href="#home">
          <span className="brand-icon">
            <FlaskConical size={22} />
          </span>
          <span>
            Chemistry<span className="brand-blue">Pro</span>
          </span>
        </a>

        <nav
          className={
            mobileMenu
              ? "nav-links nav-open"
              : "nav-links"
          }
        >
          <a href="#home" onClick={() => setMobileMenu(false)}>
            الرئيسية
          </a>
          <a href="#courses" onClick={() => setMobileMenu(false)}>
            الكورسات
          </a>
          <a href="#exams" onClick={() => setMobileMenu(false)}>
            الامتحانات
          </a>
          <a href="#about" onClick={() => setMobileMenu(false)}>
            عن المدرس
          </a>
          <a href="#register" onClick={() => setMobileMenu(false)}>
            التسجيل
          </a>
          <a href="/login" onClick={() => setMobileMenu(false)}>
            تسجيل الدخول
          </a>
        </nav>

        <div className="nav-actions">
          <a className="login-link" href="/login">
            تسجيل الدخول
          </a>
          <a className="btn btn-small" href="#register">
            إنشاء حساب طالب <ArrowLeft size={15} />
          </a>
        </div>

        <button
          className="mobile-toggle"
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label="فتح القائمة"
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>
      </header>

      <section className="hero section-wrap" id="home">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="pulse-dot" />
            منصة الكيمياء للثانوية العامة
            <Sparkles size={15} />
          </div>

          <h1>
            الكيمياء مش صعبة...
            <br />
            <span>لما تفهمها صح!</span>
          </h1>

          <p className="hero-subtitle">
            افهم الفكرة، أتقن الحل، وادخل الامتحان بثقة.
          </p>

          <p className="hero-description">
            شرح مبسط، تدريبات على كل درس، وامتحانات
            تفاعلية تساعدك تتابع مستواك خطوة بخطوة.
          </p>

          <div className="hero-buttons">
            <a className="btn" href="#courses">
              اكتشف الكورسات <ArrowLeft size={18} />
            </a>
            <a className="btn btn-ghost" href="#exams">
              <span className="play-circle">
                <Play size={13} fill="currentColor" />
              </span>
              جرّب امتحان مجاني
            </a>
          </div>

          <div className="hero-trust">
            <div className="avatar-stack">
              <span>م</span>
              <span>س</span>
              <span>ع</span>
              <span>+</span>
            </div>
            <div>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={13}
                    fill="currentColor"
                  />
                ))}
              </div>
              <small>رحلتك للتفوق تبدأ من هنا</small>
            </div>
          </div>
        </div>

        <div
          className="hero-visual"
          aria-label="رسم توضيحي ثلاثي الأبعاد للكيمياء"
        >
          <div className="visual-grid" />
          <div className="orbit orbit-a" />
          <div className="orbit orbit-b" />

          <div className="molecule molecule-one">
            <span />
            <i />
            <b />
            <em />
            <strong />
          </div>

          <div className="molecule molecule-two">
            <span />
            <i />
            <b />
            <em />
          </div>

          <div className="chem-card card-h2o">
            <small>MOLECULE</small>
            <strong>H₂O</strong>
            <span>Water</span>
          </div>

          <div className="chem-card card-atom">
            <Atom size={20} />
            <strong>01</strong>
            <span>Atomic structure</span>
          </div>

          <div className="flask-wrap">
            <div className="flask-glow" />
            <FlaskConical
              className="big-flask"
              strokeWidth={1.05}
            />
            <div className="liquid">
              <span />
              <i />
              <b />
              <em />
            </div>
            <div className="flask-neck" />
          </div>

          <div className="floating-symbol symbol-one">Na⁺</div>
          <div className="floating-symbol symbol-two">e⁻</div>
          <div className="floating-symbol symbol-three">H₂</div>

          <div className="visual-caption">
            <span className="caption-icon">
              <Zap size={17} />
            </span>
            <div>
              <strong>افهمها بطريقة مختلفة</strong>
              <small>Learn · Practice · Achieve</small>
            </div>
            <ArrowUpLeft size={18} />
          </div>
        </div>

        <div className="hero-bottom-line">
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className="stats section-wrap">
        <div className="stat-item">
          <span className="stat-icon"><GraduationCap /></span>
          <div>
            <strong>شرح منظم</strong>
            <small>من الأساسيات للاحتراف</small>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon"><ClipboardCheck /></span>
          <div>
            <strong>تدريبات مستمرة</strong>
            <small>اختبر فهمك بعد كل درس</small>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon"><Trophy /></span>
          <div>
            <strong>تابع تقدمك</strong>
            <small>اعرف نقاط قوتك</small>
          </div>
        </div>
        <div className="stat-item">
          <span className="stat-icon"><Users /></span>
          <div>
            <strong>تعلم معانا</strong>
            <small>خطوة بخطوة لحد هدفك</small>
          </div>
        </div>
      </section>

      <section
        className="section-wrap content-section"
        id="courses"
      >
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span className="tiny-line" />
              اختار طريقك للتفوق
            </div>
            <h2>
              الكورسات <span>المميزة</span>
            </h2>
            <p>
              محتوى مرتب يساعدك تفهم كل نقطة وتتدرب عليها.
            </p>
          </div>
          <a className="text-link" href="#register">
            كل الكورسات <ArrowLeft size={16} />
          </a>
        </div>

        <div className="filter-row">
          {[
            ["all", "كل الكورسات"],
            ["third", "الثانوية العامة"],
            ["foundations", "تأسيس"],
            ["advanced", "مستوى متقدم"],
            ["revision", "مراجعات"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={
                filter === key
                  ? "filter-chip active"
                  : "filter-chip"
              }
            >
              {label}
            </button>
          ))}
        </div>

        <div className="course-grid">
          {filteredCourses.map((course) => (
            <article className="course-card" key={course.id}>
              <div className={`course-art art-${course.color}`}>
                <div className="art-orbit" />
                <div className="art-molecule">
                  <span />
                  <i />
                  <b />
                  <em />
                </div>
                <span className="course-number">
                  0{course.id}
                </span>
                <span className="art-label">
                  <Atom size={13} /> CHEMISTRY LAB
                </span>
              </div>

              <div className="course-body">
                <div className="course-meta">
                  <span className="grade-tag">
                    {course.grade}
                  </span>
                  <span className="course-lessons">
                    <BookOpen size={13} />
                    {course.lessons} درس
                  </span>
                </div>

                <h3>{course.title}</h3>
                <p>{course.description}</p>

                <div className="course-footer">
                  <span>
                    <Clock3 size={14} />
                    {course.duration}
                  </span>
                  <a
                    href="#register"
                    aria-label={`التسجيل في ${course.title}`}
                  >
                    <ArrowLeft size={17} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="exam-section" id="exams">
        <div className="section-wrap exam-layout">
          <div className="exam-copy">
            <div className="eyebrow">
              <span className="tiny-line" />
              درّب نفسك باستمرار
            </div>

            <h2>
              كل سؤال بيقرّبك
              <br />
              <span>من الدرجة النهائية</span>
            </h2>

            <p>
              جرّب امتحان قصير، شوف إجاباتك، واعرف التفسير
              العلمي لكل سؤال. التدريب المنتظم هو سر الثقة.
            </p>

            <div className="exam-benefits">
              <div><CheckCircle2 /> أسئلة متنوعة على المنهج</div>
              <div><CheckCircle2 /> تصحيح فوري وتفسير للإجابة</div>
              <div><CheckCircle2 /> تابع مستواك مع كل محاولة</div>
            </div>

            <a className="btn btn-ghost" href="#quiz">
              ابدأ التدريب <ArrowLeft size={17} />
            </a>
          </div>

          <div className="quiz-card" id="quiz">
            <div className="quiz-top">
              <div className="quiz-icon">
                <ClipboardCheck />
              </div>
              <div>
                <span className="quiz-kicker">
                  اختبار تجريبي مجاني
                </span>
                <h3>اختبر معلوماتك</h3>
              </div>
              <span className="quiz-count">
                {showResult
                  ? "النتيجة"
                  : `${quizIndex + 1} / ${quizQuestions.length}`}
              </span>
            </div>

            {!showResult ? (
              <>
                <div className="progress-track">
                  <span
                    style={{
                      width: `${
                        ((quizIndex + 1) /
                          quizQuestions.length) *
                        100
                      }%`,
                    }}
                  />
                </div>

                <p className="quiz-question">
                  {quizQuestions[quizIndex].question}
                </p>

                <div className="answer-list">
                  {quizQuestions[quizIndex].options.map(
                    (option, index) => (
                      <button
                        key={option}
                        onClick={() => chooseAnswer(index)}
                        className={
                          answers[quizIndex] === index
                            ? "answer-option selected"
                            : "answer-option"
                        }
                      >
                        <span className="option-letter">
                          {["أ", "ب", "ج", "د"][index]}
                        </span>
                        {option}
                        <span className="option-check">
                          {answers[quizIndex] === index && (
                            <CheckCircle2 size={17} />
                          )}
                        </span>
                      </button>
                    )
                  )}
                </div>

                <button
                  className="btn quiz-next"
                  disabled={
                    answers[quizIndex] === undefined
                  }
                  onClick={nextQuestion}
                >
                  {quizIndex === quizQuestions.length - 1
                    ? "اعرض النتيجة"
                    : "السؤال التالي"}
                  <ArrowLeft size={16} />
                </button>
              </>
            ) : (
              <div className="quiz-result">
                <div className="result-medal">
                  <Trophy size={30} />
                </div>
                <h4>
                  نتيجتك {score} من {quizQuestions.length}
                </h4>
                <p>
                  {score === quizQuestions.length
                    ? "ممتاز! إجاباتك كلها صحيحة."
                    : "بداية كويسة! راجع التفسيرات وجرب مرة تانية."}
                </p>

                <div className="result-review">
                  {quizQuestions.map((question, index) => (
                    <div
                      key={question.question}
                      className="review-row"
                    >
                      <span
                        className={
                          answers[index] === question.answer
                            ? "correct-mark"
                            : "wrong-mark"
                        }
                      >
                        {answers[index] === question.answer
                          ? "✓"
                          : "×"}
                      </span>
                      <div>
                        <strong>{question.question}</strong>
                        <small>{question.explanation}</small>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="btn quiz-next"
                  onClick={resetQuiz}
                >
                  إعادة الاختبار <ArrowLeft size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section
        className="section-wrap about-section"
        id="about"
      >
        <div className="about-visual">
          <div className="teacher-orb">
            <div className="teacher-initial">م</div>
            <div className="teacher-ring ring-one" />
            <div className="teacher-ring ring-two" />
            <span className="teacher-badge">
              <FlaskConical size={18} />
            </span>
          </div>
          <div className="floating-note note-one">
            <Star size={15} fill="currentColor" />
            شرح واضح
          </div>
          <div className="floating-note note-two">
            <CheckCircle2 size={15} />
            متابعة مستمرة
          </div>
        </div>

        <div className="about-copy">
          <div className="eyebrow">
            <span className="tiny-line" />
            مين معاك في الرحلة؟
          </div>

          <h2>
            مش مجرد شرح...
            <br />
            <span>دي رحلة تفوق</span>
          </h2>

          <p>
            هدفنا إنك تفهم الكيمياء وتعرف تفكر في السؤال،
            مش تحفظ الإجابة وخلاص. كل درس معمول عشان يقربك
            من هدفك.
          </p>

          <div className="about-points">
            <div>
              <span><Microscope /></span>
              <div>
                <strong>شرح مبسط ومنظم</strong>
                <small>
                  من الفكرة الأساسية لحد مستوى أسئلة الامتحان.
                </small>
              </div>
            </div>
            <div>
              <span><ClipboardCheck /></span>
              <div>
                <strong>تدريب بعد كل خطوة</strong>
                <small>
                  تأكد إنك فهمت قبل ما تنتقل للدرس اللي بعده.
                </small>
              </div>
            </div>
          </div>

          <a className="text-link" href="#register">
            ابدأ رحلتك دلوقتي <ArrowLeft size={16} />
          </a>
        </div>
      </section>

      <section className="register-section" id="register">
        <div className="section-wrap register-layout">
          <div className="register-copy">
            <div className="eyebrow">
              <span className="tiny-line" />
              خطوتك الأولى
            </div>

            <h2>
              جاهز تبدأ؟
              <br />
              <span>سجّل بياناتك</span>
            </h2>

            <p>
              املأ البيانات وهنكون جاهزين نساعدك تختار
              الكورس المناسب ليك.
            </p>

            <div className="contact-line">
              <span><Phone size={17} /></span>
              <div>
                <small>للاستفسار والتسجيل</small>
                <strong>أضف رقم المدرس هنا</strong>
              </div>
            </div>

            <div className="contact-line">
              <span><Mail size={17} /></span>
              <div>
                <small>البريد الإلكتروني</small>
                <strong>teacher@example.com</strong>
              </div>
            </div>
          </div>

          <div className="register-card">
            <div className="form-heading">
              <div className="form-icon"><Users /></div>
              <div>
                <h3>تسجيل طالب جديد</h3>
                <p>املأ الحقول المطلوبة لإنشاء حسابك</p>
              </div>
            </div>

            {registered ? (
              <div className="success-state">
                <div className="success-icon">
                  <CheckCircle2 size={34} />
                </div>
                <h3>تم تسجيل حسابك بنجاح!</h3>
                <p>
                  أهلًا يا {form.name}، تم إنشاء حسابك وحفظ
                  بيانات التسجيل في قاعدة بيانات المنصة.
                </p>
                <button
                  className="btn"
                  onClick={() => {
                    setRegistered(false);
                    setForm({name:"",phone:"",grade:"الصف الثالث الثانوي",educationType:"عام",guardianPhone:"",age:"",governorate:"",city:"",password:"",confirmPassword:""});
                    setErrorMessage("");
                  }}
                >
                  تسجيل طالب آخر
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="registration-form">
                <label>الاسم بالكامل *<input required minLength={3} autoComplete="name" placeholder="اكتب اسمك الثلاثي أو الرباعي" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
                <label>رقم موبايل الطالب *<input required type="tel" inputMode="tel" dir="ltr" placeholder="01xxxxxxxxx" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label>
                <div className="form-row">
                  <label>الصف الدراسي *<select value={form.grade} onChange={e=>setForm({...form,grade:e.target.value})}><option>الصف الأول الثانوي</option><option>الصف الثاني الثانوي</option><option>الصف الثالث الثانوي</option></select></label>
                  <label>نوع التعليم *<select value={form.educationType} onChange={e=>setForm({...form,educationType:e.target.value})}><option value="عام">ثانوي عام</option><option value="بكالوريا">بكالوريا</option><option value="أزهر">أزهر</option></select></label>
                </div>
                <div className="form-row">
                  <label>السن *<input required type="number" min="10" max="30" placeholder="مثال: 16" value={form.age} onChange={e=>setForm({...form,age:e.target.value})}/></label>
                  <label>رقم ولي الأمر *<input required type="tel" inputMode="tel" dir="ltr" placeholder="01xxxxxxxxx" value={form.guardianPhone} onChange={e=>setForm({...form,guardianPhone:e.target.value})}/></label>
                </div>
                <label>المحافظة *<select required value={form.governorate} onChange={e=>setForm({...form,governorate:e.target.value,city:""})}><option value="">اختار المحافظة</option>{Object.keys(egyptLocations).map(g=><option key={g} value={g}>{g}</option>)}</select></label>
                <label>المدينة / المركز *<select required disabled={!form.governorate} value={form.city} onChange={e=>setForm({...form,city:e.target.value})}><option value="">{form.governorate?"اختار المدينة أو المركز":"اختار المحافظة أولًا"}</option>{(egyptLocations[form.governorate]||[]).map(c=><option key={c}>{c}</option>)}</select></label>
                <div className="form-row">
                  <label>كلمة المرور *<input required type="password" minLength={8} autoComplete="new-password" placeholder="8 أحرف على الأقل" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>
                  <label>تأكيد كلمة المرور *<input required type="password" minLength={8} autoComplete="new-password" placeholder="أعد كتابة كلمة المرور" value={form.confirmPassword} onChange={e=>setForm({...form,confirmPassword:e.target.value})}/></label>
                </div>
                {errorMessage&&<p className="auth-error" role="alert">{errorMessage}</p>}
                <button className="btn" type="submit" disabled={isSubmitting}>{isSubmitting?"جاري إنشاء الحساب...":"إنشاء حساب الطالب"} <ArrowLeft size={16}/></button>
                <p className="registration-note">بعد التسجيل هتدخل مباشرة على حسابك، وتقدر تسجل دخول بعد كده برقم الموبايل وكلمة المرور.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="section-wrap footer-main">
          <a className="brand" href="#home">
            <span className="brand-icon">
              <FlaskConical size={22} />
            </span>
            <span>
              Chemistry<span className="brand-blue">Pro</span>
            </span>
          </a>

          <p>افهم الكيمياء، اتدرب بذكاء، وحقق هدفك.</p>

          <div className="socials">
            <a href="https://www.facebook.com/share/1DSViCFivy/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={17} />
            </a>
            <a href="https://www.instagram.com/_modyibrahim_?knvt=MXQ1NWd5cTBncXB0" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={17} />
            </a>
            <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <Youtube size={17} />
            </a>
          </div>
        </div>

        <div className="section-wrap footer-bottom">
          <span>
            © {new Date().getFullYear()} ChemistryPro
          </span>
          <div>
            <a href="#courses">الكورسات</a>
            <a href="#exams">الامتحانات</a>
            <a href="#register">تواصل معنا</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
