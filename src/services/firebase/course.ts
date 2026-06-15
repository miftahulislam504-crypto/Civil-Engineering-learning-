import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc,
  query, where, orderBy, limit, serverTimestamp,
  increment, arrayUnion, runTransaction,
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { Course, Lesson, CourseReview, CourseCategory, CourseLevel } from '@/types/course.types'

// ─── Fetch Courses ─────────────────────────────────────────────────────────────
export async function getCourses(filters?: {
  category?: CourseCategory
  level?:    CourseLevel
  isFree?:   boolean
  limit?:    number
}): Promise<Course[]> {
  let q = query(
    collection(db, 'courses'),
    where('isPublished', '==', true),
    orderBy('enrollCount', 'desc'),
  )

  if (filters?.category) {
    q = query(q, where('category', '==', filters.category))
  }
  if (filters?.level) {
    q = query(q, where('level', '==', filters.level))
  }
  if (filters?.isFree !== undefined) {
    q = query(q, where('isFree', '==', filters.isFree))
  }
  if (filters?.limit) {
    q = query(q, limit(filters.limit))
  }

  const snap = await getDocs(q)
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate(),
    updatedAt: d.data().updatedAt?.toDate(),
  })) as Course[]
}

// ─── Fetch Single Course ───────────────────────────────────────────────────────
export async function getCourse(courseId: string): Promise<Course | null> {
  const snap = await getDoc(doc(db, 'courses', courseId))
  if (!snap.exists()) return null
  return {
    id: snap.id,
    ...snap.data(),
    createdAt: snap.data().createdAt?.toDate(),
    updatedAt: snap.data().updatedAt?.toDate(),
  } as Course
}

// ─── Fetch Lessons ─────────────────────────────────────────────────────────────
export async function getCourseLessons(courseId: string): Promise<Lesson[]> {
  const q    = query(
    collection(db, 'courses', courseId, 'lessons'),
    orderBy('order', 'asc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({
    id: d.id,
    courseId,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate(),
  })) as Lesson[]
}

// ─── Enroll ────────────────────────────────────────────────────────────────────
export async function enrollCourse(userId: string, courseId: string): Promise<void> {
  await runTransaction(db, async (tx) => {
    const courseRef = doc(db, 'courses', courseId)
    const userRef   = doc(db, 'users', userId)
    const enrollRef = doc(db, 'enrollments', `${userId}_${courseId}`)

    const enrollSnap = await tx.get(enrollRef)
    if (enrollSnap.exists()) return // already enrolled

    tx.set(enrollRef, {
      userId,
      courseId,
      enrolledAt: serverTimestamp(),
      expiresAt: null,
    })
    tx.update(courseRef, { enrollCount: increment(1) })
    tx.update(userRef, {
      enrolledCourses: arrayUnion(courseId),
    })
  })
}

// ─── Check Enrollment ─────────────────────────────────────────────────────────
export async function isEnrolled(userId: string, courseId: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'enrollments', `${userId}_${courseId}`))
  return snap.exists()
}

// ─── Reviews ──────────────────────────────────────────────────────────────────
export async function getCourseReviews(courseId: string): Promise<CourseReview[]> {
  const q    = query(
    collection(db, 'courses', courseId, 'reviews'),
    orderBy('createdAt', 'desc'),
    limit(20),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({
    id: d.id,
    courseId,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate(),
  })) as CourseReview[]
}

export async function addReview(
  courseId: string,
  review: Omit<CourseReview, 'id' | 'courseId' | 'createdAt'>,
): Promise<void> {
  await addDoc(collection(db, 'courses', courseId, 'reviews'), {
    ...review,
    createdAt: serverTimestamp(),
  })

  // Recalculate average rating
  const reviews = await getCourseReviews(courseId)
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  await updateDoc(doc(db, 'courses', courseId), {
    rating:      Math.round(avg * 10) / 10,
    ratingCount: reviews.length,
  })
}

// ─── Featured Courses ─────────────────────────────────────────────────────────
export async function getFeaturedCourses(count = 6): Promise<Course[]> {
  const q    = query(
    collection(db, 'courses'),
    where('isPublished', '==', true),
    orderBy('rating', 'desc'),
    limit(count),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toDate(),
    updatedAt: d.data().updatedAt?.toDate(),
  })) as Course[]
}

// ─── Seed Demo Course (dev only) ──────────────────────────────────────────────
export async function seedDemoCourse(): Promise<string> {
  const ref = await addDoc(collection(db, 'courses'), {
    title:          'RCC Design Fundamentals',
    titleBn:        'RCC ডিজাইনের মূল ধারণা',
    description:    'Learn the fundamentals of RCC design including beams, columns and slabs.',
    descriptionBn:  'RCC বিম, কলাম ও স্ল্যাব ডিজাইনের মূল ধারণা শিখুন।',
    thumbnail:      '',
    category:       'structural',
    type:           'mixed',
    level:          'beginner',
    targetRoles:    ['student', 'diploma_engineer', 'graduate_engineer'],
    instructor:     'demo_instructor',
    instructorName: 'Engr. Demo',
    instructorPhoto:'',
    price:          0,
    isFree:         true,
    totalLessons:   5,
    totalDuration:  120,
    rating:         4.8,
    ratingCount:    12,
    enrollCount:    0,
    tags:           ['rcc', 'structural', 'beam', 'column'],
    isPublished:    true,
    sections:       [
      {
        id: 'sec1', title: 'Introduction', titleBn: 'ভূমিকা', order: 1,
        lessons: [],
      },
    ],
    createdAt:  serverTimestamp(),
    updatedAt:  serverTimestamp(),
  })
  return ref.id
}
