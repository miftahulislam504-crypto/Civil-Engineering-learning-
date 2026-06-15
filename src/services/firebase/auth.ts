import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
import type { UserRole, UserProfile } from '@/types'

const googleProvider = new GoogleAuthProvider()

// ─── Register with Email ───────────────────────────────────────────────────────
export async function registerWithEmail(
  email: string,
  password: string,
  displayName: string,
  role: UserRole
) {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName })
  await createUserDocument(credential.user, role)
  return credential.user
}

// ─── Login with Email ──────────────────────────────────────────────────────────
export async function loginWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

// ─── Login with Google ─────────────────────────────────────────────────────────
export async function loginWithGoogle() {
  const credential = await signInWithPopup(auth, googleProvider)
  const userDoc = await getDoc(doc(db, 'users', credential.user.uid))
  if (!userDoc.exists()) {
    await createUserDocument(credential.user, 'student')
  }
  return credential.user
}

// ─── Logout ────────────────────────────────────────────────────────────────────
export async function logout() {
  await signOut(auth)
}

// ─── Reset Password ────────────────────────────────────────────────────────────
export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email)
}

// ─── Create User Document in Firestore ────────────────────────────────────────
async function createUserDocument(user: User, role: UserRole) {
  const userRef = doc(db, 'users', user.uid)
  const newUser: Omit<UserProfile, 'createdAt' | 'updatedAt'> & {
    createdAt: ReturnType<typeof serverTimestamp>
    updatedAt: ReturnType<typeof serverTimestamp>
  } = {
    uid:             user.uid,
    displayName:     user.displayName ?? '',
    email:           user.email ?? '',
    photoURL:        user.photoURL,
    role,
    university:      '',
    batch:           '',
    experience:      0,
    bio:             '',
    points:          0,
    badges:          [],
    enrolledCourses: [],
    savedArticles:   [],
    bookmarks:       [],
    recentlyViewed:  [],
    createdAt:       serverTimestamp(),
    updatedAt:       serverTimestamp(),
  }
  await setDoc(userRef, newUser)
}

// ─── Get User Profile ──────────────────────────────────────────────────────────
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userDoc = await getDoc(doc(db, 'users', uid))
  if (!userDoc.exists()) return null
  const data = userDoc.data()
  return {
    ...data,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  } as UserProfile
}

// ─── Auth State Observer ───────────────────────────────────────────────────────
export { onAuthStateChanged, auth }
