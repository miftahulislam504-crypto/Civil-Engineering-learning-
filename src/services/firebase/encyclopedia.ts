import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc,
  query, where, orderBy, limit, serverTimestamp, increment,
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type {
  EncyclopediaTopic, TopicSummary, EncyclopediaCategory,
} from '@/types/encyclopedia.types'

// ─── Get All Topics (summary) ─────────────────────────────────────────────────
export async function getTopics(filters?: {
  category?:    EncyclopediaCategory
  subcategory?: string
  limit?:       number
}): Promise<TopicSummary[]> {
  let q = query(
    collection(db, 'encyclopedia'),
    where('isPublished', '==', true),
    orderBy('viewCount', 'desc'),
  )
  if (filters?.category) {
    q = query(q, where('category', '==', filters.category))
  }
  if (filters?.subcategory) {
    q = query(q, where('subcategory', '==', filters.subcategory))
  }
  if (filters?.limit) {
    q = query(q, limit(filters.limit))
  }
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({
    id: d.id, ...d.data(),
  })) as TopicSummary[]
}

// ─── Get Topic by Slug ─────────────────────────────────────────────────────────
export async function getTopicBySlug(slug: string): Promise<EncyclopediaTopic | null> {
  const q    = query(
    collection(db, 'encyclopedia'),
    where('slug', '==', slug),
    where('isPublished', '==', true),
    limit(1),
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return {
    id: d.id, ...d.data(),
    createdAt: d.data().createdAt?.toDate(),
    updatedAt: d.data().updatedAt?.toDate(),
  } as EncyclopediaTopic
}

// ─── Get Topic by ID ───────────────────────────────────────────────────────────
export async function getTopicById(id: string): Promise<EncyclopediaTopic | null> {
  const snap = await getDoc(doc(db, 'encyclopedia', id))
  if (!snap.exists()) return null
  return {
    id: snap.id, ...snap.data(),
    createdAt: snap.data().createdAt?.toDate(),
    updatedAt: snap.data().updatedAt?.toDate(),
  } as EncyclopediaTopic
}

// ─── Increment View Count ──────────────────────────────────────────────────────
export async function incrementView(topicId: string): Promise<void> {
  await updateDoc(doc(db, 'encyclopedia', topicId), {
    viewCount: increment(1),
  })
}

// ─── Get Related Topics ────────────────────────────────────────────────────────
export async function getRelatedTopics(
  topicIds: string[],
): Promise<TopicSummary[]> {
  if (!topicIds.length) return []
  const results = await Promise.all(
    topicIds.slice(0, 6).map((id) => getTopicById(id)),
  )
  return results.filter(Boolean) as TopicSummary[]
}

// ─── Popular Topics ────────────────────────────────────────────────────────────
export async function getPopularTopics(count = 8): Promise<TopicSummary[]> {
  const q    = query(
    collection(db, 'encyclopedia'),
    where('isPublished', '==', true),
    orderBy('viewCount', 'desc'),
    limit(count),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as TopicSummary[]
}

// ─── Search Topics (client-side for now) ──────────────────────────────────────
export function searchTopics(topics: TopicSummary[], query: string): TopicSummary[] {
  if (!query.trim()) return topics
  const q = query.toLowerCase()
  return topics.filter((t) =>
    t.title.toLowerCase().includes(q)      ||
    t.titleBn?.toLowerCase().includes(q)   ||
    t.subcategory?.toLowerCase().includes(q)||
    t.tags?.some((tag) => tag.toLowerCase().includes(q))
  )
}

// ─── Seed Demo Topics ──────────────────────────────────────────────────────────
export async function seedDemoTopics(): Promise<void> {
  const topics = [
    {
      title:       'RCC Beam Design',
      titleBn:     'RCC বিম ডিজাইন',
      slug:        'rcc-beam-design',
      category:    'structural',
      subcategory: 'RCC Design',
      overview:    'RCC Beam is a structural member that resists bending moments and shear forces.',
      overviewBn:  'RCC বিম হলো একটি কাঠামোগত সদস্য যা নমন মুহূর্ত এবং শিয়ার বলকে প্রতিরোধ করে।',
      theory:      '<h2>Theory</h2><p>RCC beam design follows limit state method...</p>',
      concepts:    '<h2>Key Concepts</h2><p>Balanced section, under-reinforced, over-reinforced...</p>',
      formulas: [
        {
          id: 'f1', name: 'Moment of Resistance', nameBn: 'প্রতিরোধ মুহূর্ত',
          expression: 'M_u = 0.87 f_y A_{st} \\left(d - \\frac{A_{st} f_y}{b f_{ck}}\\right)',
          variables: [
            { symbol: 'f_y',  name: 'Yield strength of steel', nameBn: 'স্টিলের ফলন শক্তি', unit: 'N/mm²' },
            { symbol: 'A_{st}', name: 'Area of tension steel',  nameBn: 'টেনশন স্টিলের ক্ষেত্রফল', unit: 'mm²'   },
            { symbol: 'd',    name: 'Effective depth',         nameBn: 'কার্যকর গভীরতা',      unit: 'mm'    },
          ],
          unit: 'N·mm', codeRef: 'ACI 318-19, Clause 9.5',
        },
      ],
      workedExamples: [
        {
          id: 'ex1',
          title:   'Singly Reinforced Beam Design',
          titleBn: 'এককভাবে রিইনফোর্সড বিম ডিজাইন',
          problem: 'Design a simply supported RCC beam of span 6m carrying UDL of 20 kN/m. fc = 25 MPa, fy = 415 MPa.',
          solution: '## ধাপ ১: লোড নির্ধারণ\n\nউপরে দেওয়া তথ্য অনুযায়ী...\n\n## ধাপ ২: বিম সাইজ ধরা\n\n...',
          answer: 'Ast = 1256 mm²', unit: 'mm²',
        },
      ],
      diagrams:            [],
      practicalApplication:'সাধারণ ভবন নির্মাণে ফ্লোর বিম হিসেবে ব্যবহৃত হয়।',
      commonMistakes:      ['অপর্যাপ্ত কভার দেওয়া', 'শিয়ার রিইনফোর্সমেন্ট ভুলে যাওয়া'],
      fieldNotes:          'সাইটে কংক্রিট ঢালাইয়ের সময় কমপক্ষে ২৮ দিন কিউরিং করতে হবে।',
      relatedTopics:       [],
      codeReferences: [
        { code: 'BNBC', clause: 'Part 6, Chapter 8',  title: 'Reinforced Concrete' },
        { code: 'ACI',  clause: '318-19, Chapter 9',  title: 'Beams' },
      ],
      videoUrl:    '',
      pdfUrl:      '',
      tags:        ['rcc', 'beam', 'structural', 'design', 'bending'],
      viewCount:   0,
      isPublished: true,
      createdBy:   'system',
      createdAt:   serverTimestamp(),
      updatedAt:   serverTimestamp(),
    },
  ]

  for (const topic of topics) {
    await addDoc(collection(db, 'encyclopedia'), topic)
  }
}
