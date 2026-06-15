import {
  collection, doc, getDocs, getDoc, query,
  where, orderBy, limit, serverTimestamp,
  increment, updateDoc,
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { LibraryItem, Standard, LibraryItemType, StandardCode } from '@/types/library.types'

// ─── Library Items ─────────────────────────────────────────────────────────────
export async function getLibraryItems(filters?: {
  type?:        LibraryItemType
  category?:    string
  language?:    'bn' | 'en' | 'both'
  limit?:       number
}): Promise<LibraryItem[]> {
  let q = query(
    collection(db, 'library'),
    where('isPublished', '==', true),
    orderBy('downloadCount', 'desc'),
  )
  if (filters?.type)     q = query(q, where('type',     '==', filters.type))
  if (filters?.category) q = query(q, where('category', '==', filters.category))
  if (filters?.language) q = query(q, where('language', '==', filters.language))
  if (filters?.limit)    q = query(q, limit(filters.limit))

  const snap = await getDocs(q)
  return snap.docs.map((d) => ({
    id: d.id, ...d.data(),
    createdAt: d.data().createdAt?.toDate(),
    updatedAt: d.data().updatedAt?.toDate(),
  })) as LibraryItem[]
}

export async function getLibraryItem(id: string): Promise<LibraryItem | null> {
  const snap = await getDoc(doc(db, 'library', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data(), createdAt: snap.data().createdAt?.toDate() } as LibraryItem
}

export async function incrementDownload(id: string): Promise<void> {
  await updateDoc(doc(db, 'library', id), { downloadCount: increment(1) })
}

// ─── Standards ─────────────────────────────────────────────────────────────────
export async function getStandards(code?: StandardCode): Promise<Standard[]> {
  let q = query(
    collection(db, 'standards'),
    where('isPublished', '==', true),
    orderBy('code', 'asc'),
  )
  if (code) q = query(q, where('code', '==', code))

  const snap = await getDocs(q)
  return snap.docs.map((d) => ({
    id: d.id, ...d.data(),
    createdAt: d.data().createdAt?.toDate(),
  })) as Standard[]
}

// ─── Client-side search ────────────────────────────────────────────────────────
export function searchLibrary(items: LibraryItem[], query: string): LibraryItem[] {
  if (!query.trim()) return items
  const q = query.toLowerCase()
  return items.filter((item) =>
    item.title.toLowerCase().includes(q)     ||
    item.titleBn?.toLowerCase().includes(q)  ||
    item.author?.toLowerCase().includes(q)   ||
    item.tags?.some((t) => t.toLowerCase().includes(q))
  )
}

// ─── Built-in Reference Tables ────────────────────────────────────────────────
export const REFERENCE_TABLES = {
  concrete_grades: {
    id:      'concrete_grades',
    title:   'Concrete Grade Properties',
    titleBn: 'কংক্রিট গ্রেডের বৈশিষ্ট্য',
    category:'material_properties' as const,
    unit:    'MPa',
    source:  'BNBC 2020, ACI 318-19',
    headers: ['গ্রেড', 'fck (MPa)', 'fcu (MPa)', 'Ec (GPa)', 'ব্যবহার'],
    data: [
      { 'গ্রেড': 'C15 / M15', 'fck (MPa)': 15, 'fcu (MPa)': 20, 'Ec (GPa)': 26.5, 'ব্যবহার': 'Blinding, non-structural' },
      { 'গ্রেড': 'C20 / M20', 'fck (MPa)': 20, 'fcu (MPa)': 25, 'Ec (GPa)': 28.0, 'ব্যবহার': 'Lightly loaded RCC' },
      { 'গ্রেড': 'C25 / M25', 'fck (MPa)': 25, 'fcu (MPa)': 30, 'Ec (GPa)': 29.5, 'ব্যবহার': 'General RCC (beam, slab)' },
      { 'গ্রেড': 'C30 / M30', 'fck (MPa)': 30, 'fcu (MPa)': 37, 'Ec (GPa)': 31.0, 'ব্যবহার': 'Column, foundation' },
      { 'গ্রেড': 'C35 / M35', 'fck (MPa)': 35, 'fcu (MPa)': 43, 'Ec (GPa)': 32.5, 'ব্যবহার': 'High-rise, bridge' },
      { 'গ্রেড': 'C40 / M40', 'fck (MPa)': 40, 'fcu (MPa)': 50, 'Ec (GPa)': 34.0, 'ব্যবহার': 'Prestressed, bridge deck' },
    ],
  },

  steel_grades: {
    id:      'steel_grades',
    title:   'Reinforcing Steel Properties',
    titleBn: 'রিইনফোর্সিং স্টিলের বৈশিষ্ট্য',
    category:'material_properties' as const,
    unit:    'MPa',
    source:  'BNBC 2020, BDS 1313',
    headers: ['গ্রেড', 'fy (MPa)', 'fu (MPa)', 'Es (GPa)', 'প্রসারণ (%)'],
    data: [
      { 'গ্রেড': 'Grade 40 (SD40)', 'fy (MPa)': 276, 'fu (MPa)': 483, 'Es (GPa)': 200, 'প্রসারণ (%)': 12 },
      { 'গ্রেড': 'Grade 60 (SD60)', 'fy (MPa)': 414, 'fu (MPa)': 620, 'Es (GPa)': 200, 'প্রসারণ (%)': 9  },
      { 'গ্রেড': 'Grade 75 (SD75)', 'fy (MPa)': 517, 'fu (MPa)': 690, 'Es (GPa)': 200, 'প্রসারণ (%)': 7  },
      { 'গ্রেড': 'Fe 415',          'fy (MPa)': 415, 'fu (MPa)': 485, 'Es (GPa)': 200, 'প্রসারণ (%)': 14 },
      { 'গ্রেড': 'Fe 500',          'fy (MPa)': 500, 'fu (MPa)': 545, 'Es (GPa)': 200, 'প্রসারণ (%)': 12 },
    ],
  },

  rebar_properties: {
    id:      'rebar_properties',
    title:   'Rebar Size & Weight',
    titleBn: 'রিবারের সাইজ ও ওজন',
    category:'material_properties' as const,
    unit:    '',
    source:  'BDS, ASTM A615',
    headers: ['ব্যাস (mm)', 'ক্ষেত্রফল (mm²)', 'ওজন (kg/m)', 'পরিধি (mm)'],
    data: [
      { 'ব্যাস (mm)': 8,  'ক্ষেত্রফল (mm²)': 50.3,  'ওজন (kg/m)': 0.395, 'পরিধি (mm)': 25.1  },
      { 'ব্যাস (mm)': 10, 'ক্ষেত্রফল (mm²)': 78.5,  'ওজন (kg/m)': 0.617, 'পরিধি (mm)': 31.4  },
      { 'ব্যাস (mm)': 12, 'ক্ষেত্রফল (mm²)': 113.1, 'ওজন (kg/m)': 0.888, 'পরিধি (mm)': 37.7  },
      { 'ব্যাস (mm)': 16, 'ক্ষেত্রফল (mm²)': 201.1, 'ওজন (kg/m)': 1.579, 'পরিধি (mm)': 50.3  },
      { 'ব্যাস (mm)': 20, 'ক্ষেত্রফল (mm²)': 314.2, 'ওজন (kg/m)': 2.466, 'পরিধি (mm)': 62.8  },
      { 'ব্যাস (mm)': 25, 'ক্ষেত্রফল (mm²)': 490.9, 'ওজন (kg/m)': 3.854, 'পরিধি (mm)': 78.5  },
      { 'ব্যাস (mm)': 28, 'ক্ষেত্রফল (mm²)': 615.8, 'ওজন (kg/m)': 4.834, 'পরিধি (mm)': 87.96 },
      { 'ব্যাস (mm)': 32, 'ক্ষেত্রফল (mm²)': 804.2, 'ওজন (kg/m)': 6.313, 'পরিধি (mm)': 100.5 },
    ],
  },

  soil_classification: {
    id:      'soil_classification',
    title:   'USCS Soil Classification',
    titleBn: 'মাটির USCS শ্রেণিবিভাগ',
    category:'material_properties' as const,
    unit:    '',
    source:  'ASTM D2487',
    headers: ['প্রতীক', 'নাম', 'বৈশিষ্ট্য', 'CBR (%)'],
    data: [
      { 'প্রতীক': 'GW', 'নাম': 'Well-graded Gravel', 'বৈশিষ্ট্য': 'Cu≥4, Cc=1-3',       'CBR (%)': '40-80' },
      { 'প্রতীক': 'GP', 'নাম': 'Poorly-graded Gravel','বৈশিষ্ট্য': 'Cu<4 বা Cc আউট',   'CBR (%)': '30-60' },
      { 'প্রতীক': 'SW', 'নাম': 'Well-graded Sand',    'বৈশিষ্ট্য': 'Cu≥6, Cc=1-3',       'CBR (%)': '20-40' },
      { 'প্রতীক': 'SP', 'নাম': 'Poorly-graded Sand',  'বৈশিষ্ট্য': 'Cu<6 বা Cc আউট',   'CBR (%)': '10-20' },
      { 'প্রতীক': 'ML', 'নাম': 'Silt (Low Plasticity)','বৈশিষ্ট্য': 'PI<7, LL<50',        'CBR (%)': '5-15'  },
      { 'প্রতীক': 'CL', 'নাম': 'Clay (Low Plasticity)', 'বৈশিষ্ট্য': 'PI≥7, LL<50',      'CBR (%)': '5-15'  },
      { 'প্রতীক': 'MH', 'নাম': 'Silt (High Plasticity)','বৈশিষ্ট্য': 'LL≥50',             'CBR (%)': '3-8'   },
      { 'প্রতীক': 'CH', 'নাম': 'Clay (High Plasticity)', 'বৈশিষ্ট্য': 'PI≥0.73(LL-20)', 'CBR (%)': '3-8'   },
    ],
  },

  unit_conversion: {
    id:      'unit_conversion',
    title:   'Engineering Unit Conversion',
    titleBn: 'ইঞ্জিনিয়ারিং একক রূপান্তর',
    category:'unit_conversion' as const,
    unit:    '',
    source:  'SI Units',
    headers: ['পরিমাণ', 'থেকে', 'গুণ করো', 'পাবে'],
    data: [
      { 'পরিমাণ': 'Force',    'থেকে': 'kN',     'গুণ করো': 1000,  'পাবে': 'N'     },
      { 'পরিমাণ': 'Force',    'থেকে': 'kgf',    'গুণ করো': 9.81,  'পাবে': 'N'     },
      { 'পরিমাণ': 'Pressure', 'থেকে': 'kPa',    'গুণ করো': 1000,  'পাবে': 'Pa'    },
      { 'পরিমাণ': 'Pressure', 'থেকে': 'MPa',    'গুণ করো': 145.0, 'পাবে': 'psi'   },
      { 'পরিমাণ': 'Pressure', 'থেকে': 'kN/m²',  'গুণ করো': 1,     'পাবে': 'kPa'   },
      { 'পরিমাণ': 'Length',   'থেকে': 'm',      'গুণ করো': 3.281, 'পাবে': 'ft'    },
      { 'পরিমাণ': 'Length',   'থেকে': 'mm',     'গুণ করো': 0.0394,'পাবে': 'inch'  },
      { 'পরিমাণ': 'Area',     'থেকে': 'm²',     'গুণ করো': 10.764,'পাবে': 'ft²'   },
      { 'পরিমাণ': 'Volume',   'থেকে': 'm³',     'গুণ করো': 35.315,'পাবে': 'ft³'   },
      { 'পরিমাণ': 'Density',  'থেকে': 'kg/m³',  'গুণ করো': 0.0624,'পাবে': 'lb/ft³'},
      { 'পরিমাণ': 'Moment',   'থেকে': 'kN·m',   'গুণ করো': 1000,  'পাবে': 'N·m'   },
      { 'পরিমাণ': 'Mass',     'থেকে': 'kg',     'গুণ করো': 2.205, 'পাবে': 'lb'    },
    ],
  },

  beam_coefficients: {
    id:      'beam_coefficients',
    title:   'Beam Bending Moment Coefficients',
    titleBn: 'বিমের বেন্ডিং মোমেন্ট সহগ',
    category:'design_tables' as const,
    unit:    '',
    source:  'BNBC 2020, ACI 318',
    headers: ['সাপোর্ট অবস্থা', 'লোড টাইপ', 'সর্বোচ্চ মোমেন্ট', 'সর্বোচ্চ শিয়ার', 'সর্বোচ্চ ডিফ্লেকশন'],
    data: [
      { 'সাপোর্ট অবস্থা': 'Simply Supported', 'লোড টাইপ': 'UDL (w)', 'সর্বোচ্চ মোমেন্ট': 'wL²/8',  'সর্বোচ্চ শিয়ার': 'wL/2',  'সর্বোচ্চ ডিফ্লেকশন': '5wL⁴/384EI' },
      { 'সাপোর্ট অবস্থা': 'Simply Supported', 'লোড টাইপ': 'Point (P)', 'সর্বোচ্চ মোমেন্ট': 'PL/4', 'সর্বোচ্চ শিয়ার': 'P/2',   'সর্বোচ্চ ডিফ্লেকশন': 'PL³/48EI'   },
      { 'সাপোর্ট অবস্থা': 'Cantilever',        'লোড টাইপ': 'UDL (w)', 'সর্বোচ্চ মোমেন্ট': 'wL²/2',  'সর্বোচ্চ শিয়ার': 'wL',    'সর্বোচ্চ ডিফ্লেকশন': 'wL⁴/8EI'    },
      { 'সাপোর্ট অবস্থা': 'Cantilever',        'লোড টাইপ': 'Point (P)', 'সর্বোচ্চ মোমেন্ট': 'PL',  'সর্বোচ্চ শিয়ার': 'P',     'সর্বোচ্চ ডিফ্লেকশন': 'PL³/3EI'    },
      { 'সাপোর্ট অবস্থা': 'Fixed-Fixed',        'লোড টাইপ': 'UDL (w)', 'সর্বোচ্চ মোমেন্ট': 'wL²/12', 'সর্বোচ্চ শিয়ার': 'wL/2',  'সর্বোচ্চ ডিফ্লেকশন': 'wL⁴/384EI'  },
      { 'সাপোর্ট অবস্থা': 'Fixed-Pinned',       'লোড টাইপ': 'UDL (w)', 'সর্বোচ্চ মোমেন্ট': 'wL²/8', 'সর্বোচ্চ শিয়ার': '5wL/8', 'সর্বোচ্চ ডিফ্লেকশন': 'wL⁴/185EI'  },
    ],
  },
}
