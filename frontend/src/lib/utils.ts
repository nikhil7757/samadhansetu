import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function timeAgo(date: string | Date): string {
  if (!date) return '';
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(date);
}

export const JHARKHAND_DISTRICTS = [
  'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum',
  'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara',
  'Khunti', 'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu',
  'Ramgarh', 'Ranchi', 'Sahibganj', 'Saraikela Kharsawan', 'Simdega', 'West Singhbhum',
] as const;

export const CATEGORIES = [
  { value: 'WATER_SANITATION', labelKey: 'common.categoryWater' },
  { value: 'AGRICULTURE', labelKey: 'common.categoryAgriculture' },
  { value: 'HEALTHCARE', labelKey: 'common.categoryHealthcare' },
  { value: 'EDUCATION', labelKey: 'common.categoryEducation' },
  { value: 'INFRASTRUCTURE', labelKey: 'common.categoryInfrastructure' },
  { value: 'ENVIRONMENT', labelKey: 'common.categoryEnvironment' },
  { value: 'SKILL_DEVELOPMENT', labelKey: 'common.categorySkill' },
  { value: 'OTHER', labelKey: 'common.categoryOther' },
] as const;

export const STATUSES = [
  { value: 'PENDING_APPROVAL', labelKey: 'common.statusPending' },
  { value: 'REJECTED', labelKey: 'common.statusRejected' },
  { value: 'OPEN', labelKey: 'common.statusOpen' },
  { value: 'TEAM_FORMED', labelKey: 'common.statusTeamFormed' },
  { value: 'IN_PROGRESS', labelKey: 'common.statusInProgress' },
  { value: 'PILOTED', labelKey: 'common.statusPiloted' },
  { value: 'SOLVED', labelKey: 'common.statusSolved' },
] as const;

export const STATUS_COLORS: Record<string, string> = {
  PENDING_APPROVAL: 'bg-slate-100 text-slate-700 border-slate-300',
  REJECTED: 'bg-rose-100 text-rose-800 border-rose-300',
  OPEN: 'bg-sky-100 text-sky-800 border-sky-300',
  TEAM_FORMED: 'bg-purple-100 text-purple-800 border-purple-300',
  IN_PROGRESS: 'bg-amber-100 text-amber-800 border-amber-300',
  PILOTED: 'bg-orange-100 text-orange-800 border-orange-300',
  SOLVED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
};

export const STATUS_DOT_COLORS: Record<string, string> = {
  PENDING_APPROVAL: 'bg-slate-400',
  REJECTED: 'bg-rose-500',
  OPEN: 'bg-sky-500',
  TEAM_FORMED: 'bg-purple-500',
  IN_PROGRESS: 'bg-amber-500',
  PILOTED: 'bg-orange-500',
  SOLVED: 'bg-emerald-500',
};

export const URGENCY_COLORS: Record<string, string> = {
  LOW: 'bg-emerald-50 text-emerald-700 border-emerald-300',
  MEDIUM: 'bg-amber-50 text-amber-700 border-amber-300',
  HIGH: 'bg-rose-50 text-rose-700 border-rose-300',
};

export const CHART_STATUS_COLORS: Record<string, string> = {
  PENDING_APPROVAL: '#94a3b8',
  REJECTED: '#f43f5e',
  OPEN: '#0284c7',
  TEAM_FORMED: '#a855f7',
  IN_PROGRESS: '#f59e0b',
  PILOTED: '#f97316',
  SOLVED: '#10b981',
};

export const CHART_CATEGORY_COLORS: string[] = [
  '#0d9488', '#0284c7', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#f97316', '#64748b',
];
