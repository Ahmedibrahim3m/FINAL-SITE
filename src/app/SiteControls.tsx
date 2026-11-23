"use client";
import { useSettings } from "./providers";
export default function SiteControls(){const {dark,lang,toggleTheme,toggleLanguage}=useSettings();return <div className="site-controls"><button type="button" onClick={toggleTheme}>{dark?(lang==='ar'?'☀️ الوضع الفاتح':'☀️ Light mode'):(lang==='ar'?'🌙 الوضع الداكن':'🌙 Dark mode')}</button><button type="button" onClick={toggleLanguage}>{lang==='ar'?'English':'العربية'}</button></div>;}
