// ローカルストレージへの読み書き — バックエンド導入時はここだけ差し替え

import { type Answers } from './scoring'
import { getIssueTags, calculateScore } from './scoring'

export type Submission = {
  id: string
  submittedAt: string
  answers: Answers
  totalScore: number
  issueTags: string[]
  // 連絡先（表示用に展開）
  name: string
  propertyName: string
  email: string
  tel: string
  managementStyle: string
  wantsConsultation: string
}

const SUBMISSION_KEY = 'minpaku_submissions'
const CURRENT_KEY = 'minpaku_current_answers'

// 回答を一時保存
export function saveCurrentAnswers(answers: Answers): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(CURRENT_KEY, JSON.stringify(answers))
}

// 一時保存した回答を取得
export function getCurrentAnswers(): Answers {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(CURRENT_KEY) ?? '{}')
  } catch {
    return {}
  }
}

// 診断を完了して保存
export function submitAnswers(answers: Answers): Submission {
  const score = calculateScore(answers)
  const tags = getIssueTags(answers)

  const submission: Submission = {
    id: Date.now().toString(),
    submittedAt: new Date().toISOString(),
    answers,
    totalScore: score.total,
    issueTags: tags,
    name: String(answers['contact_name'] ?? ''),
    propertyName: String(answers['contact_property'] ?? ''),
    email: String(answers['contact_email'] ?? ''),
    tel: String(answers['contact_tel'] ?? ''),
    managementStyle: String(answers['management_style'] ?? ''),
    wantsConsultation: String(answers['wants_consultation'] ?? ''),
  }

  if (typeof window !== 'undefined') {
    const existing = getAllSubmissions()
    existing.push(submission)
    localStorage.setItem(SUBMISSION_KEY, JSON.stringify(existing))
    // 一時保存データは削除
    localStorage.removeItem(CURRENT_KEY)
  }

  return submission
}

// 全回答を取得（管理画面用）
export function getAllSubmissions(): Submission[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(SUBMISSION_KEY) ?? '[]')
  } catch {
    return []
  }
}

// 最後の提出を取得（結果ページ用）
export function getLatestSubmission(): Submission | null {
  const all = getAllSubmissions()
  if (all.length === 0) return null
  return all[all.length - 1]
}
