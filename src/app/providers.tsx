
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type Settings = {
  dark: boolean;
  lang: "en" | "ar";
  toggleTheme: () => void;
  toggleLanguage: () => void;
};

const SettingsContext = createContext<Settings | null>(null);

// Translation dictionary
const translations: Record<string, string> = JSON.parse(String.raw`{
  "الرئيسية": "Home",
  "الكورسات": "Courses",
  "المحاضرات": "Lectures",
  "تسجيل الدخول": "Login",
  "إنشاء حساب": "Create Account",
  "ابدأ التعلم الآن": "Start Learning Now",
  "اعرف المزيد": "Learn More",
  "لوحة التحكم": "Dashboard",
  "حسابي": "My Account",
  "تسجيل الخروج": "Logout",
  "اللغة": "Language",
  "المظهر": "Appearance",
  "فاتح": "Light",
  "داكن": "Dark",
  "الصف الأول الثانوي": "First Secondary",
  "الصف الثاني الثانوي": "Second Secondary",
  "الصف الثالث الثانوي": "Third Secondary",
  "جميع الكورسات": "All Courses",
  "عرض الكورس": "View Course",
  "ابدأ الاختبار": "Start Quiz",
  "السؤال التالي": "Next Question",
  "إنهاء الاختبار": "Finish Quiz",
  "اختر الإجابة الصحيحة": "Choose the correct answer",
  "الاسم بالكامل": "Full Name",
  "رقم الهاتف": "Phone Number",
  "رقم ولي الأمر": "Guardian Phone",
  "المحافظة": "Governorate",
  "المدينة أو المركز": "City or Center",
  "كلمة المرور": "Password",
  "تأكيد كلمة المرور": "Confirm Password",
  "العمر": "Age",
  "الصف الدراسي": "Grade",
  "نوع التعليم": "Education Track",
  "عام": "General",
  "بكالوريا": "Baccalaureate",
  "أزهر": "Azhar",
  "حفظ": "Save",
  "إلغاء": "Cancel",
  "بحث": "Search",
  "الطلاب": "Students",
  "إدارة الطلاب": "Student Management",
  "إدارة الفيديوهات": "Video Management",
  "بنك الأخطاء": "Mistake Bank",
  "الإحصائيات": "Analytics",
  "تصدير CSV": "Export CSV",
  "لا توجد بيانات": "No data available",
  "مرحباً بك": "Welcome",
  "ساعات": "hours",
  "درس": "lessons",
  "الامتحانات": "Exams",
  "عن المدرس": "About the Teacher",
  "التسجيل": "Registration",
  "إنشاء حساب طالب": "Create Student Account",
  "منصة الكيمياء للثانوية العامة": "Chemistry Platform for Secondary Students",
  "الكيمياء مش صعبة...": "Chemistry Isn't Difficult...",
  "لما تفهمها صح!": "When You Understand It!",
  "افهم الفكرة، أتقن الحل، وادخل الامتحان بثقة.": "Understand the concept, master the solution, and enter the exam with confidence.",
  "شرح مبسط، تدريبات على كل درس، وامتحانات": "Simple explanations, exercises for every lesson, and interactive exams",
  "تفاعلية تساعدك تتابع مستواك خطوة بخطوة.": "that help you track your progress step by step.",
  "اكتشف الكورسات": "Explore Courses",
  "جرّب امتحان مجاني": "Try a Free Exam",
  "رحلتك للتفوق تبدأ من هنا": "Your journey to excellence starts here",
  "افهمها بطريقة مختلفة": "Understand It Differently",
  "شرح منظم": "Organized Explanations",
  "من الأساسيات للاحتراف": "From Basics to Mastery",
  "تدريبات مستمرة": "Continuous Practice",
  "اختبر فهمك بعد كل درس": "Test Your Understanding After Every Lesson",
  "تابع تقدمك": "Track Your Progress",
  "اعرف نقاط قوتك": "Discover Your Strengths",
  "تعلم معانا": "Learn With Us",
  "خطوة بخطوة لحد هدفك": "Step by Step Toward Your Goal",
  "اختار طريقك للتفوق": "Choose Your Path to Excellence",
  "الكورسات المميزة": "Featured Courses",
  "محتوى مرتب يساعدك تفهم كل نقطة وتتدرب عليها.": "Organized content that helps you understand and practice every concept.",
  "كل الكورسات": "All Courses",
  "الثانوية العامة": "Secondary School",
  "تأسيس": "Foundations",
  "مستوى متقدم": "Advanced Level",
  "مراجعات": "Revision",
  "أساسيات الكيمياء": "Chemistry Fundamentals",
  "الكيمياء العضوية": "Organic Chemistry",
  "الاتزان الكيميائي": "Chemical Equilibrium",
  "التحليل الكيميائي": "Chemical Analysis",
  "الكهربية الكيميائية": "Electrochemistry",
  "مراجعة ليلة الامتحان": "Night Before the Exam Review",
  "ابدأ صح وافهم أساسيات المادة والذرة والروابط.": "Start right and understand the basics of matter, atoms, and bonds.",
  "شرح مبسط للتفاعلات العضوية مع تدريبات شاملة.": "Simple explanations of organic reactions with comprehensive exercises.",
  "افهم القوانين وخطوات الحل بدل الحفظ فقط.": "Understand the laws and solution steps instead of memorizing.",
  "تدريبات على المسائل والتحليل خطوة بخطوة.": "Step-by-step exercises on problems and analysis.",
  "الخلايا الكهربية والأكسدة والاختزال بطريقة سهلة.": "Electrochemical cells, oxidation, and reduction explained simply.",
  "أهم الأفكار والأسئلة في مراجعة مركزة.": "Key concepts and questions in a focused review.",
  "درّب نفسك باستمرار": "Practice Regularly",
  "كل سؤال بيقرّبك": "Every Question Gets You Closer",
  "من الدرجة النهائية": "to the Full Mark",
  "جرّب امتحان قصير، شوف إجاباتك، واعرف التفسير": "Take a short test, review your answers, and understand",
  "العلمي لكل سؤال. التدريب المنتظم هو سر الثقة.": "the scientific explanation for each question. Regular practice builds confidence.",
  "أسئلة متنوعة على المنهج": "Varied Curriculum Questions",
  "تصحيح فوري وتفسير للإجابة": "Instant Grading and Answer Explanations",
  "تابع مستواك مع كل محاولة": "Track Your Progress With Every Attempt",
  "ابدأ التدريب": "Start Practicing",
  "اختبار تجريبي مجاني": "Free Practice Quiz",
  "اختبر معلوماتك": "Test Your Knowledge",
  "النتيجة": "Result",
  "ما الجسيم الذي يحمل شحنة سالبة داخل الذرة؟": "Which particle carries a negative charge inside an atom?",
  "البروتون": "Proton",
  "الإلكترون": "Electron",
  "النيوترون": "Neutron",
  "النواة": "Nucleus",
  "الإلكترون يحمل شحنة سالبة.": "The electron carries a negative charge.",
  "ما قيمة الرقم الهيدروجيني للمحلول المتعادل عند 25°C؟": "What is the pH of a neutral solution at 25°C?",
  "المحلول المتعادل يكون pH = 7 عند 25°C.": "A neutral solution has a pH of 7 at 25°C.",
  "أي مما يلي يُعد رابطة تساهمية؟": "Which of the following is a covalent bond?",
  "انتقال إلكترونات": "Transfer of electrons",
  "مشاركة إلكترونات": "Sharing of electrons",
  "فقد بروتون": "Loss of a proton",
  "تكوين أيونات فقط": "Formation of ions only",
  "الرابطة التساهمية تنتج عن مشاركة الإلكترونات.": "A covalent bond forms when electrons are shared.",
  "اعرض النتيجة": "Show Result",
  "ممتاز! إجاباتك كلها صحيحة.": "Excellent! All your answers are correct.",
  "بداية كويسة! راجع التفسيرات وجرب مرة تانية.": "Good start! Review the explanations and try again.",
  "إعادة الاختبار": "Retry Quiz",
  "مين معاك في الرحلة؟": "Who's With You on This Journey?",
  "مش مجرد شرح...": "It's More Than Just Explanations...",
  "دي رحلة تفوق": "It's a Journey to Excellence",
  "هدفنا إنك تفهم الكيمياء وتعرف تفكر في السؤال،": "Our goal is to help you understand chemistry and think through each question,",
  "مش تحفظ الإجابة وخلاص. كل درس معمول عشان يقربك": "not just memorize answers. Every lesson is designed to bring you closer",
  "من هدفك.": "to your goal.",
  "شرح مبسط ومنظم": "Simple, Organized Explanations",
  "من الفكرة الأساسية لحد مستوى أسئلة الامتحان.": "From basic concepts to exam-level questions.",
  "تدريب بعد كل خطوة": "Practice After Every Step",
  "تأكد إنك فهمت قبل ما تنتقل للدرس اللي بعده.": "Make sure you understand before moving to the next lesson.",
  "ابدأ رحلتك دلوقتي": "Start Your Journey Now",
  "خطوتك الأولى": "Your First Step",
  "جاهز تبدأ؟": "Ready to Get Started?",
  "سجّل بياناتك": "Register Your Details",
  "املأ البيانات وهنكون جاهزين نساعدك تختار": "Fill in your details and we'll help you choose",
  "الكورس المناسب ليك.": "the right course for you.",
  "للاستفسار والتسجيل": "For Inquiries and Registration",
  "أضف رقم المدرس هنا": "Add Teacher's Phone Number Here",
  "البريد الإلكتروني": "Email Address",
  "تسجيل طالب جديد": "Register a New Student",
  "املأ الحقول المطلوبة لإنشاء حسابك": "Fill in the required fields to create your account",
  "اكتب اسمك الثلاثي أو الرباعي": "Enter your full name",
  "رقم موبايل الطالب": "Student Mobile Number",
  "ثانوي عام": "General Secondary",
  "السن": "Age",
  "اختار المحافظة": "Select Governorate",
  "المدينة / المركز": "City / District",
  "اختار المدينة أو المركز": "Select City or District",
  "اختار المحافظة أولًا": "Select a Governorate First",
  "8 أحرف على الأقل": "At least 8 characters",
  "أعد كتابة كلمة المرور": "Re-enter your password",
  "اكتب اسمك بالكامل.": "Please enter your full name.",
  "رقم الموبايل لازم يكون 11 رقم ويبدأ بـ 01.": "The mobile number must be 11 digits and start with 01.",
  "اكتب رقم ولي أمر صحيح (11 رقم).": "Enter a valid guardian phone number (11 digits).",
  "اكتب سن صحيح.": "Enter a valid age.",
  "اختار المحافظة والمدينة أو المركز.": "Select your governorate and city or district.",
  "كلمة المرور لازم تكون 8 أحرف على الأقل.": "Password must be at least 8 characters.",
  "كلمتا المرور غير متطابقتين.": "Passwords do not match.",
  "تعذر إنشاء الحساب.": "Unable to create account.",
  "تعذر الاتصال بالخادم. حاول مرة أخرى.": "Unable to connect to the server. Please try again.",
  "جاري إنشاء الحساب...": "Creating Account...",
  "إنشاء حساب الطالب": "Create Student Account",
  "بعد التسجيل هتدخل مباشرة على حسابك، وتقدر تسجل دخول بعد كده برقم الموبايل وكلمة المرور.": "After registration, you'll be taken directly to your account. You can log in later using your mobile number and password.",
  "تم تسجيل حسابك بنجاح!": "Your account has been created successfully!",
  "تم إنشاء حسابك وحفظ بيانات التسجيل في قاعدة بيانات المنصة.": "Your account has been created and your registration details have been saved.",
  "تسجيل طالب آخر": "Register Another Student",
  "افهم الكيمياء، اتدرب بذكاء، وحقق هدفك.": "Understand Chemistry, Practice Smart, and Achieve Your Goal.",
  "تواصل معنا": "Contact Us"
}`);

const arabicEntries = Object.entries(translations).sort(
  (a, b) => b[0].length - a[0].length
);

const englishEntries = Object.entries(translations)
  .map(([arabic, english]) => [english, arabic] as [string, string])
  .sort((a, b) => b[0].length - a[0].length);

function replacePhrases(
  value: string,
  entries: [string, string][]
): string {
  let result = value;

  for (const [source, target] of entries) {
    result = result.split(source).join(target);
  }

  return result;
}

function translateDocument(lang: "en" | "ar") {
  if (typeof document === "undefined") return;

  const entries = lang === "en" ? arabicEntries : englishEntries;

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT
  );

  const nodes: Node[] = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  for (const node of nodes) {
    const parent = node.parentElement;

    if (
      !parent ||
      ["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE"].includes(
        parent.tagName
      ) ||
      parent.isContentEditable
    ) {
      continue;
    }

    const original = node.nodeValue || "";
    if (!original.trim()) continue;

    const translated = replacePhrases(original, entries);

    if (translated !== original) {
      node.nodeValue = translated;
    }
  }

  const attributes = ["placeholder", "title", "aria-label"];

  const elements = Array.from(
    document.body.querySelectorAll<HTMLElement>("*")
  );

  for (const element of elements) {
    for (const attribute of attributes) {
      const value = element.getAttribute(attribute);

      if (!value) continue;

      const translated = replacePhrases(value, entries);

      if (translated !== value) {
        element.setAttribute(attribute, translated);
      }
    }
  }
}

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const savedLang = localStorage.getItem("lang");

    setDark(savedTheme === "dark");
    setLang(savedLang === "ar" ? "ar" : "en");

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

    localStorage.setItem("theme", dark ? "dark" : "light");
    localStorage.setItem("lang", lang);

    translateDocument(lang);

    const observer = new MutationObserver(() => {
      translateDocument(lang);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [dark, lang, ready]);

  return (
    <SettingsContext.Provider
      value={{
        dark,
        lang,
        toggleTheme: () => setDark((value) => !value),
        toggleLanguage: () =>
          setLang((value) => (value === "en" ? "ar" : "en")),
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used inside Providers");
  }

  return context;
}
