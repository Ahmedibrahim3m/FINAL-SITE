import { cookies } from 'next/headers';
import { readSession } from './db';
export function currentUser(){ return readSession(cookies().get('chemistrypro_session')?.value); }
export function requireRole(role:'admin'|'student'){ const user=currentUser(); if(!user||user.role!==role)return null; return user; }
