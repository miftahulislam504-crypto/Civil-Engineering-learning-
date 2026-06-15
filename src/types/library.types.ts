// ─── Library Item Types ────────────────────────────────────────────────────────
export type LibraryItemType =
  | 'note'
  | 'lecture_note'
  | 'handbook'
  | 'manual'
  | 'design_guide'
  | 'technical_article'
  | 'research_paper'
  | 'thesis'
  | 'design_example'

export const LIBRARY_TYPE_LABELS: Record<LibraryItemType, string> = {
  note:               'নোট',
  lecture_note:       'লেকচার নোট',
  handbook:           'হ্যান্ডবুক',
  manual:             'ম্যানুয়াল',
  design_guide:       'ডিজাইন গাইড',
  technical_article:  'টেকনিক্যাল আর্টিকেল',
  research_paper:     'গবেষণা পত্র',
  thesis:             'থিসিস',
  design_example:     'ডিজাইন উদাহরণ',
}

export const LIBRARY_TYPE_ICONS: Record<LibraryItemType, string> = {
  note:               '📝',
  lecture_note:       '📋',
  handbook:           '📕',
  manual:             '📗',
  design_guide:       '📘',
  technical_article:  '📄',
  research_paper:     '🔬',
  thesis:             '🎓',
  design_example:     '📐',
}

// ─── Standard Codes ────────────────────────────────────────────────────────────
export type StandardCode =
  | 'BNBC'
  | 'ACI'
  | 'ASTM'
  | 'AASHTO'
  | 'Eurocode'
  | 'IS'
  | 'BS'

export const STANDARD_CODE_LABELS: Record<StandardCode, string> = {
  BNBC:     'Bangladesh National Building Code',
  ACI:      'American Concrete Institute',
  ASTM:     'American Society for Testing and Materials',
  AASHTO:   'American Association of State Highway and Transportation Officials',
  Eurocode: 'European Standards',
  IS:       'Indian Standards',
  BS:       'British Standards',
}

export const STANDARD_COLORS: Record<StandardCode, { bg: string; text: string; border: string }> = {
  BNBC:     { bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20'  },
  ACI:      { bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20'   },
  ASTM:     { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  AASHTO:   { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20'  },
  Eurocode: { bg: 'bg-cyan-500/10',   text: 'text-cyan-400',   border: 'border-cyan-500/20'   },
  IS:       { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  BS:       { bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/20'    },
}

// ─── Library Item ──────────────────────────────────────────────────────────────
export interface LibraryItem {
  id:            string
  title:         string
  titleBn:       string
  type:          LibraryItemType
  category:      string        // civil engineering category
  subcategory:   string
  author:        string
  authorBn:      string
  description:   string
  descriptionBn: string
  fileUrl:       string
  thumbnailUrl:  string
  fileSize:      number        // bytes
  pages:         number
  language:      'bn' | 'en' | 'both'
  isLicensed:    boolean
  licenseType:   string
  downloadCount: number
  tags:          string[]
  isPublished:   boolean
  createdAt:     Date
  updatedAt:     Date
}

// ─── Standard ─────────────────────────────────────────────────────────────────
export interface Standard {
  id:          string
  name:        string
  code:        StandardCode
  title:       string
  titleBn:     string
  year:        number
  category:    string
  description: string
  fileUrl:     string
  isLicensed:  boolean
  chapterCount:number
  isPublished: boolean
  createdAt:   Date
}

// ─── Reference Table ──────────────────────────────────────────────────────────
export type RefTableCategory =
  | 'material_properties'
  | 'design_tables'
  | 'unit_conversion'
  | 'charts'

export const REF_TABLE_LABELS: Record<RefTableCategory, string> = {
  material_properties: 'উপকরণের বৈশিষ্ট্য',
  design_tables:       'ডিজাইন টেবিল',
  unit_conversion:     'একক রূপান্তর',
  charts:              'চার্ট ও গ্রাফ',
}

export interface ReferenceTable {
  id:       string
  title:    string
  titleBn:  string
  category: RefTableCategory
  data:     ReferenceRow[]
  headers:  string[]
  unit:     string
  source:   string
}

export interface ReferenceRow {
  [key: string]: string | number
}

// ─── Helper ───────────────────────────────────────────────────────────────────
export function formatFileSize(bytes: number): string {
  if (bytes < 1024)       return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
