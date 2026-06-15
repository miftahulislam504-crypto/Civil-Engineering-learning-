// ─── Encyclopedia Categories ───────────────────────────────────────────────────
export type EncyclopediaCategory =
  | 'structural'
  | 'geotechnical'
  | 'transportation'
  | 'water_resources'
  | 'environmental'
  | 'construction'
  | 'project_management'
  | 'quantity_surveying'
  | 'building_services'
  | 'materials'

export const ENC_CATEGORY_LABELS: Record<EncyclopediaCategory, string> = {
  structural:          'স্ট্রাকচারাল ইঞ্জিনিয়ারিং',
  geotechnical:        'জিওটেকনিক্যাল ইঞ্জিনিয়ারিং',
  transportation:      'ট্রান্সপোর্টেশন ইঞ্জিনিয়ারিং',
  water_resources:     'পানি সম্পদ ইঞ্জিনিয়ারিং',
  environmental:       'পরিবেশ ইঞ্জিনিয়ারিং',
  construction:        'কনস্ট্রাকশন ইঞ্জিনিয়ারিং',
  project_management:  'প্রজেক্ট ম্যানেজমেন্ট',
  quantity_surveying:  'কোয়ান্টিটি সার্ভেয়িং',
  building_services:   'বিল্ডিং সার্ভিসেস',
  materials:           'নির্মাণ উপকরণ',
}

export const ENC_CATEGORY_ICONS: Record<EncyclopediaCategory, string> = {
  structural:         '🏗️',
  geotechnical:       '🌍',
  transportation:     '🛣️',
  water_resources:    '💧',
  environmental:      '🌿',
  construction:       '🔨',
  project_management: '📊',
  quantity_surveying: '📐',
  building_services:  '🔧',
  materials:          '🧱',
}

export const ENC_CATEGORY_COLORS: Record<EncyclopediaCategory, { text: string; bg: string; border: string }> = {
  structural:         { text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20'   },
  geotechnical:       { text: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20'  },
  transportation:     { text: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20'  },
  water_resources:    { text: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20'   },
  environmental:      { text: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/20'},
  construction:       { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
  project_management: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  quantity_surveying: { text: 'text-pink-400',   bg: 'bg-pink-500/10',   border: 'border-pink-500/20'   },
  building_services:  { text: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
  materials:          { text: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20'    },
}

// ─── Sub-categories ────────────────────────────────────────────────────────────
export const ENC_SUBCATEGORIES: Partial<Record<EncyclopediaCategory, string[]>> = {
  structural: [
    'RCC Design', 'Steel Structure', 'Prestressed Concrete',
    'Bridge Engineering', 'Structural Analysis', 'Seismic Engineering',
    'Composite Structure', 'Industrial Structure',
  ],
  geotechnical: [
    'Soil Mechanics', 'Foundation Engineering', 'Ground Improvement',
    'Retaining Structure', 'Slope Stability',
  ],
  transportation: [
    'Highway Engineering', 'Pavement Design', 'Traffic Engineering',
    'Road Safety', 'Airport Engineering',
  ],
  water_resources: [
    'Hydraulics', 'Hydrology', 'Irrigation', 'Drainage', 'River Engineering',
  ],
  construction: [
    'Construction Technology', 'Site Management', 'Equipment',
    'Temporary Structures', 'Quality Control',
  ],
}

// ─── Formula Model ─────────────────────────────────────────────────────────────
export interface Formula {
  id:          string
  name:        string
  nameBn:      string
  expression:  string       // LaTeX
  variables:   FormulaVar[]
  unit:        string
  codeRef:     string
}

export interface FormulaVar {
  symbol:  string
  name:    string
  nameBn:  string
  unit:    string
}

// ─── Worked Example ────────────────────────────────────────────────────────────
export interface WorkedExample {
  id:       string
  title:    string
  titleBn:  string
  problem:  string
  solution: string    // markdown with steps
  answer:   string
  unit:     string
}

// ─── Code Reference ────────────────────────────────────────────────────────────
export interface CodeReference {
  code:    'BNBC' | 'ACI' | 'ASTM' | 'AASHTO' | 'IS' | 'Eurocode' | 'BS'
  clause:  string
  title:   string
  url?:    string
}

// ─── Encyclopedia Topic ────────────────────────────────────────────────────────
export interface EncyclopediaTopic {
  id:                  string
  title:               string
  titleBn:             string
  slug:                string
  category:            EncyclopediaCategory
  subcategory:         string
  overview:            string
  overviewBn:          string
  theory:              string    // HTML/markdown
  concepts:            string    // HTML/markdown
  formulas:            Formula[]
  workedExamples:      WorkedExample[]
  diagrams:            string[]  // image URLs
  practicalApplication:string
  commonMistakes:      string[]
  fieldNotes:          string
  relatedTopics:       string[]  // topic IDs
  codeReferences:      CodeReference[]
  videoUrl:            string
  pdfUrl:              string
  tags:                string[]
  viewCount:           number
  isPublished:         boolean
  createdBy:           string
  createdAt:           Date
  updatedAt:           Date
}

// ─── Topic Summary (for listing) ──────────────────────────────────────────────
export type TopicSummary = Pick<
  EncyclopediaTopic,
  | 'id' | 'title' | 'titleBn' | 'slug'
  | 'category' | 'subcategory'
  | 'overviewBn' | 'overview'
  | 'tags' | 'viewCount' | 'isPublished'
  | 'formulas' | 'videoUrl'
>
