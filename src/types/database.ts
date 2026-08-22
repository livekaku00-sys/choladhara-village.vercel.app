export interface DailyRate {
  id: string | number;
  item_key: string;
  title_en: string;
  title_as: string;
  rate_value: string;
  unit_en: string;
  unit_as: string;
  updated_at?: string;
}

export interface Notice {
  id: string | number;
  title_en: string;
  title_as: string;
  details_en?: string;
  details_as?: string;
  category: 'general' | 'health' | 'flood_alert' | 'meeting';
  file_url?: string;
  is_pinned: boolean;
  created_at?: string;
}

export interface SkilledWorker {
  id: string | number;
  full_name: string;
  skill_en: string;
  skill_as: string;
  phone_number: string;
  chuburi_ward: string;
  experience_years?: number;
  is_verified: boolean;
  submitted_at?: string;
}

export interface Scholarship {
  id: string | number;
  title_en: string;
  title_as: string;
  provider: string;
  eligibility_en?: string;
  eligibility_as?: string;
  benefit_amount?: string;
  apply_link: string;
  deadline: string;
  is_approved: boolean;
  source_type: string;
  tracked_at?: string;
}

export interface Opportunity {
  id: string | number;
  category: 'job' | 'training' | 'self_employment';
  title?: string;
  title_en: string;
  title_as: string;
  eligibility_en?: string;
  eligibility_as?: string;
  official_link?: string;
  deadline?: string;
  is_approved: boolean;
  created_at?: string;
}

export interface EntranceExam {
  id: string | number;
  exam_name_en: string;
  exam_name_as: string;
  conducting_body: string;
  category: 'medical' | 'engineering' | 'university' | 'agriculture' | 'defense' | 'assam_state' | 'general';
  eligibility_en: string;
  eligibility_as: string;
  apply_link: string;
  deadline: string;
  exam_date?: string;
  is_approved: boolean;
  source_type: string;
  tracked_at?: string;
}

export interface AgriFeed {
  id: string | number;
  item_key: string;
  category: 'scheme' | 'paddy_msp' | 'tea' | 'advisory';
  title_as: string;
  title_en: string;
  authority_as: string;
  authority_en: string;
  benefit_as: string;
  benefit_en: string;
  badge_as: string;
  badge_en: string;
  action_link?: string;
  action_label_as?: string;
  action_label_en?: string;
  deadline?: string;
  is_active: boolean;
}

export interface LocalAd {
  id: string | number;
  slot_number: number;
  business_name_en: string;
  business_name_as: string;
  tagline_en?: string;
  tagline_as?: string;
  category: string;
  contact_phone: string;
  whatsapp_number?: string;
  location_text: string;
  offer_badge_en?: string;
  offer_badge_as?: string;
  valid_until: string;
  is_active: boolean;
  created_at?: string;
}
