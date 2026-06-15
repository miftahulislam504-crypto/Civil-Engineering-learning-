import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { updateProfile } from 'firebase/auth'
import { db, storage, auth } from '@/config/firebase'
import type { UserProfile } from '@/types'

// ─── Update Profile ────────────────────────────────────────────────────────────
export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<UserProfile, 'displayName' | 'bio' | 'university' | 'batch' | 'experience' | 'role'>>
) {
  const userRef = doc(db, 'users', uid)
  await updateDoc(userRef, { ...data, updatedAt: serverTimestamp() })

  if (data.displayName && auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: data.displayName })
  }
}

// ─── Upload Profile Photo ──────────────────────────────────────────────────────
export async function uploadProfilePhoto(uid: string, file: File): Promise<string> {
  const storageRef = ref(storage, `profile_photos/${uid}`)
  await uploadBytes(storageRef, file)
  const url = await getDownloadURL(storageRef)

  await updateDoc(doc(db, 'users', uid), { photoURL: url, updatedAt: serverTimestamp() })
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { photoURL: url })
  }
  return url
}

// ─── Add Points ────────────────────────────────────────────────────────────────
export async function addPoints(uid: string, pts: number) {
  await updateDoc(doc(db, 'users', uid), {
    points: increment(pts),
    updatedAt: serverTimestamp(),
  })
}

// ─── Save Article ──────────────────────────────────────────────────────────────
export async function saveArticle(uid: string, articleId: string) {
  await updateDoc(doc(db, 'users', uid), {
    savedArticles: arrayUnion(articleId),
  })
}

export async function unsaveArticle(uid: string, articleId: string) {
  await updateDoc(doc(db, 'users', uid), {
    savedArticles: arrayRemove(articleId),
  })
}

// ─── Bookmark ─────────────────────────────────────────────────────────────────
export async function addBookmark(uid: string, topicId: string) {
  await updateDoc(doc(db, 'users', uid), {
    bookmarks: arrayUnion(topicId),
  })
}

export async function removeBookmark(uid: string, topicId: string) {
  await updateDoc(doc(db, 'users', uid), {
    bookmarks: arrayRemove(topicId),
  })
}

// ─── Recently Viewed ──────────────────────────────────────────────────────────
export async function addRecentlyViewed(uid: string, itemId: string) {
  const userRef = doc(db, 'users', uid)
  const snap    = await getDoc(userRef)
  if (!snap.exists()) return

  let recent: string[] = snap.data().recentlyViewed ?? []
  recent = [itemId, ...recent.filter((id) => id !== itemId)].slice(0, 20)

  await updateDoc(userRef, { recentlyViewed: recent })
}

// ─── Course Progress ──────────────────────────────────────────────────────────
export async function markLessonComplete(
  uid: string,
  courseId: string,
  lessonId: string,
  totalLessons: number,
) {
  const progressRef = doc(db, 'user_progress', uid, 'courses', courseId)
  const snap        = await getDoc(progressRef)

  if (!snap.exists()) {
    const { setDoc } = await import('firebase/firestore')
    await setDoc(progressRef, {
      completedLessons:    [lessonId],
      progressPercent:     Math.round((1 / totalLessons) * 100),
      lastAccessedLesson:  lessonId,
      isCompleted:         totalLessons === 1,
      startedAt:           serverTimestamp(),
      completedAt:         totalLessons === 1 ? serverTimestamp() : null,
    })
  } else {
    const data      = snap.data()
    const completed = Array.from(new Set([...(data.completedLessons ?? []), lessonId]))
    const pct       = Math.round((completed.length / totalLessons) * 100)
    const isDone    = completed.length >= totalLessons

    const { updateDoc: upd } = await import('firebase/firestore')
    await upd(progressRef, {
      completedLessons:   completed,
      progressPercent:    pct,
      lastAccessedLesson: lessonId,
      isCompleted:        isDone,
      ...(isDone && { completedAt: serverTimestamp() }),
    })

    if (isDone) await addPoints(uid, 50)
  }
  await addPoints(uid, 5)
}

// ─── Get Course Progress ───────────────────────────────────────────────────────
export async function getCourseProgress(uid: string, courseId: string) {
  const snap = await getDoc(doc(db, 'user_progress', uid, 'courses', courseId))
  return snap.exists() ? snap.data() : null
}

// ─── Get All Progress ─────────────────────────────────────────────────────────
export async function getAllProgress(uid: string) {
  const col  = collection(db, 'user_progress', uid, 'courses')
  const snap = await getDocs(col)
  return snap.docs.map((d) => ({ courseId: d.id, isCompleted: false, progressPercent: 0, completedLessons: [], lastAccessedLesson: '', startedAt: new Date(), completedAt: null, ...d.data() } as import('@/types/course.types').CourseProgress))
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────
export async function getLeaderboard(limitCount = 10) {
  const q    = query(collection(db, 'users'), orderBy('points', 'desc'), limit(limitCount))
  const snap = await getDocs(q)
  return snap.docs.map((d) => d.data() as UserProfile)
}

// ─── Badge Unlock ─────────────────────────────────────────────────────────────
export async function unlockBadge(uid: string, badge: string) {
  await updateDoc(doc(db, 'users', uid), {
    badges:    arrayUnion(badge),
    updatedAt: serverTimestamp(),
  })
}

// ─── Notifications ────────────────────────────────────────────────────────────
export async function getNotifications(uid: string) {
  const q    = query(
    collection(db, 'notifications'),
    where('userId', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(20),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function markNotificationRead(notifId: string) {
  await updateDoc(doc(db, 'notifications', notifId), { isRead: true })
}
