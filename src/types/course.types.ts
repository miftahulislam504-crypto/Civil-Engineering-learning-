// ─── Course Types ─────────────────────────────────────────────────────────────
export type CourseLevel    = 'beginner' | 'intermediate' | 'advanced'
export type CourseType     = 'video' | 'pdf' | 'text' | 'mixed'
export type LessonType     = 'video' | 'pdf' | 'text' | 'download'
export type VideoProvider  = 'youtube' | 'bunny'

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
  structural:          'স্ট্রাকচারাল ইঞ্জিনিয়ারিং',
  geotechnical:        'জিওটেকনিক্যাল ইঞ্জিনিয়ারিং',
  transportation:      'ট্রান্সপোর্টেশন ইঞ্জিনিয়ারিং',
  water_resources:     'পানি সম্পদ ইঞ্জিনিয়ারিং',
  environmental:       'পরিবেশ ইঞ্জিনিয়ারিং',
  construction:        'কনস্ট্রাকশন ইঞ্জিনিয়ারিং',
  project_management:  'প্রজেক্ট ম্যানেজমেন্ট',
  quantity_surveying:  'কোয়ান্টিটি সার্ভেয়িং',
  building_services:   'বিল্ডিং সার্ভিসেস',
  software_training:   'সফটওয়্যার ট্রেনিং',
  research:            'গবেষণা',
  career_development:  'ক্যারিয়ার ডেভেলপমেন্ট',
}

export const COURSE_LEVEL_LABELS: Record<CourseLevel, string> = {
  beginner:     'শিক্ষানবিস',
  intermediate: 'মধ্যবর্তী',
  advanced:     'উন্নত',
}

export const LEVEL_COLORS: Record<CourseLevel, string> = {
  beginner:     'text-green-400 bg-green-500/10 border-green-500/20',
  intermediate: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  advanced:     'text-red-400 bg-red-500/10 border-red-500/20',
}

// ─── Course Model ──────────────────────────────────────────────────────────────
export interface Course {
  id:            string
  title:         string
  titleBn:       string
  description:   string
  descriptionBn: string
  thumbnail:     string
  category:      CourseCategory
  type:          CourseType
  level:         CourseLevel
  targetRoles:   string[]
  instructor:    string       // uid
  instructorName:string
  instructorPhoto:string
  price:         number
  isFree:        boolean
  totalLessons:  number
  totalDuration: number       // minutes
  rating:        number
  ratingCount:   number
  enrollCount:   number
  tags:          string[]
  isPublished:   boolean
  sections:      CourseSection[]
  createdAt:     Date
  updatedAt:     Date
}

export interface CourseSection {
  id:      string
  title:   string
  titleBn: string
  order:   number
  lessons: Lesson[]
}

export interface Lesson {
  id:            string
  courseId:      string
  sectionId:     string
  title:         string
  titleBn:       string
  type:          LessonType
  videoUrl:      string
  videoProvider: VideoProvider
  pdfUrl:        string
  content:       string       // markdown
  downloadUrl:   string
  downloadName:  string
  duration:      number       // minutes
  order:         number
  isFree:        boolean
  createdAt:     Date
}

// ─── Review ────────────────────────────────────────────────────────────────────
export interface CourseReview {
  id:          string
  courseId:    string
  userId:      string
  userName:    string
  userPhoto:   string
  rating:      number
  comment:     string
  createdAt:   Date
}

// ─── Enroll ────────────────────────────────────────────────────────────────────
export interface Enrollment {
  userId:    string
  courseId:  string
  enrolledAt:Date
  expiresAt: Date | null
}

// ─── Progress ─────────────────────────────────────────────────────────────────
export interface CourseProgress {
  courseId:           string
  completedLessons:   string[]
  progressPercent:    number
  lastAccessedLesson: string
  isCompleted:        boolean
  startedAt:          Date
  completedAt:        Date | null
}
