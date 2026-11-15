export type MoodTag = 
  | 'xao_nhang'   // Xao nhãng số, lướt điện thoại đêm, mất tập trung
  | 'tri_hoan'    // Trì hoãn công việc, né tránh
  | 'kiet_que'    // Mệt mỏi, sương mù não, cạn kiệt năng lượng
  | 'dan_vat'     // Dằn vặt, tự trách bản thân, cảm giác tội lỗi
  | 'hy_vong';    // Hy vọng, bắt đầu lại, khoảnh khắc thức tỉnh

export type ReactionType = 'feel_you' | 'hug' | 'not_alone';

export type NoteColorTheme = 'yellow' | 'mint' | 'rose' | 'blue' | 'lavender' | 'be' | 'green' | 'terracotta';

export interface Confession {
  id: string;
  slug: string;
  moodTag: MoodTag;
  content: string;
  createdAt: string;
  isPublic: boolean;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  approvedBy?: string;
  aiCompassionReply?: string;
  reactions: {
    feel_you: number;
    hug: number;
    not_alone: number;
  };
  cardColorTheme?: NoteColorTheme;
}

export interface ConfessionSubmission {
  moodTag: MoodTag;
  content: string;
  isPublic: boolean;
  email?: string;
  wantHealingLetter?: boolean;
}

export interface ContactLead {
  id: string;
  email: string;
  source: string;
  tags: string[];
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface ReactionRecord {
  confessionId: string;
  reactionType: ReactionType;
  ipHash: string;
  createdAt: string;
}
