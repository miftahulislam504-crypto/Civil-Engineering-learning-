// ─── User Roles ───────────────────────────────────────────────────────────────
export type UserRole =
  | 'student'
  | 'diploma_engineer'
  | 'graduate_engineer'
  | 'site_engineer'
  | 'design_engineer'
  | 'consultant'
  | 'contractor'
  | 'researcher'
  | 'teacher'
  | 'admin'

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  student:           'শিক্ষার্থী',
  diploma_engineer:  'ডিপ্লোমা ইঞ্জিনিয়ার',
  graduate_engineer: 'গ্র্যাজুয়েট ইঞ্জিনিয়ার',
  site_engineer:     'সাইট ইঞ্জিনিয়ার',
  design_engineer:   'ডিজাইন ইঞ্জিনিয়ার',
  consultant:        'কনসালট্যান্ট',
  contractor:        'কন্ট্রাক্টর',
  researcher:        'গবেষক',
  teacher:           'শিক্ষক',
  admin:             'অ্যাডমিন',
}

// ─── User Profile ─────────────────────────────────────────────────────────────
export interface UserProfile {
  uid:              string
  displayName:      string
  email:            string
  photoURL:         string | null
  role:             UserRole
  university:       string
  batch:            string
  experience:       number
  bio:              string
  points:           number
  badges:           string[]
  enrolledCourses:  string[]
  savedArticles:    string[]
  bookmarks:        string[]
  recentlyViewed:   string[]
  createdAt:        Date
  updatedAt:        Date
}

// ─── Course ───────────────────────────────────────────────────────────────────
export type CourseLevel    = 'beginner' | 'intermediate' | 'advanced'
export type CourseType     = 'video' | 'pdf' | 'text' | 'mixed'
export type CourseCategory =
  | 'structural'
  | 'geotechnical'
  | 'transportation'
  | 'water_resources'
  | 'environmental'
  | 'construction'
  | 'project_management'
  | 'quantity_surveying'
  | 'building_services'
  | 'software_training'
  | 'research'
  | 'career_development'

export const COURSE_CATEGORY_LABELS: Record<CourseCategory, string> = {
  structural:           'স্ট্রাকচারাল ইঞ্জিনিয়ারিং',
  geotechnical:         'জিওটেকনিক্যাল ইঞ্জিনিয়ারিং',
  transportation:       'ট্রান্সপোর্টেশন ইঞ্জিনিয়ারিং',
  water_resources:      'পানি সম্পদ ইঞ্জিনিয়ারিং',
  environmental:        'পরিবেশ ইঞ্জিনিয়ারিং',
  construction:         'কনস্ট্রাকশন ইঞ্জিনিয়ারিং',
  project_management:   'প্রজেক্ট ম্যানেজমেন্ট',
  quantity_surveying:   'কোয়ান্টিটি সার্ভেয়িং',
  building_services:    'বিল্ডিং সার্ভিসেস',
  software_training:    'সফটওয়্যার ট্রেনিং',
  research:             'গবেষণা',
  career_development:   'ক্যারিয়ার ডেভেলপমেন্ট',
}

export interface Course {
  id:            string
  title:         string
  titleBn:       string
  description:   string
  thumbnail:     string
  category:      CourseCategory
  type:          CourseType
  level:         CourseLevel
  targetRoles:   UserRole[]
  instructor:    string
  price:         number
  isFree:        boolean
  totalLessons:  number
  totalDuration: number
  rating:        number
  enrollCount:   number
  tags:          string[]
  isPublished:   boolean
  createdAt:     Date
  updatedAt:     Date
}

export interface Lesson {
  id:            string
  courseId:      string
  title:         string
  titleBn:       string
  type:          'video' | 'pdf' | 'text' | 'download'
  videoUrl:      string
  videoProvider: 'youtube' | 'bunny'
  pdfUrl:        string
  content:       string
  downloadUrl:   string
  duration:      number
  order:         number
  isFree:        boolean
  createdAt:     Date
}

// ─── Auth State ───────────────────────────────────────────────────────────────
export interface AuthState {
  user:      UserProfile | null
  isLoading: boolean
  error:     string | null
}
