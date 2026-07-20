// スコアリングロジック — 設問データとは分離して管理

import { QUESTIONS, CATEGORY_LABELS, type Category } from '@/data/questions'

export type Answers = Record<string, string | number>

export type CategoryScore = {
  category: Category
  label: string
  score: number    // 0〜100
  rawScore: number
  maxScore: number
}

export type AuditScore = {
  total: number          // 0〜100
  rank: 'A' | 'B' | 'C' | 'D'
  categories: CategoryScore[]
  weakCategories: Category[]  // スコアが低い上位3カテゴリ
}

// スコア済み設問のみ取得
const SCORED_QUESTIONS = QUESTIONS.filter(q => q.scored && q.options)

export function calculateScore(answers: Answers): AuditScore {
  // カテゴリ別の得点を集計
  const categoryRaw: Record<Category, { score: number; max: number }> = {
    revenue: { score: 0, max: 0 },
    marketing: { score: 0, max: 0 },
    customer: { score: 0, max: 0 },
    operations: { score: 0, max: 0 },
    cost: { score: 0, max: 0 },
    management: { score: 0, max: 0 },
  }

  let totalScore = 0
  let totalMax = 0

  for (const q of SCORED_QUESTIONS) {
    const answer = answers[q.id]
    if (answer === undefined || answer === '') continue

    const maxForQ = Math.max(...(q.options?.map(o => o.score) ?? [0]))
    const selectedOption = q.options?.find(o => o.label === answer)
    const scoreForQ = selectedOption?.score ?? 0

    categoryRaw[q.category].score += scoreForQ
    categoryRaw[q.category].max += maxForQ
    totalScore += scoreForQ
    totalMax += maxForQ
  }

  // カテゴリ別スコア(0-100換算)
  const categories: CategoryScore[] = (Object.keys(categoryRaw) as Category[])
    .filter(cat => categoryRaw[cat].max > 0)
    .map(cat => ({
      category: cat,
      label: CATEGORY_LABELS[cat],
      score: categoryRaw[cat].max > 0
        ? Math.round((categoryRaw[cat].score / categoryRaw[cat].max) * 100)
        : 0,
      rawScore: categoryRaw[cat].score,
      maxScore: categoryRaw[cat].max,
    }))

  // 総合スコア
  const total = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0

  // ランク判定
  const rank = total >= 80 ? 'A' : total >= 60 ? 'B' : total >= 40 ? 'C' : 'D'

  // 弱点カテゴリ（スコア低い順TOP3）
  const weakCategories = [...categories]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map(c => c.category)

  return { total, rank, categories, weakCategories }
}

// 課題タグ生成（管理画面用）
export function getIssueTags(answers: Answers): string[] {
  const score = calculateScore(answers)
  const tags: string[] = []

  for (const cat of score.weakCategories) {
    if (cat === 'revenue') tags.push('売上改善')
    if (cat === 'marketing') tags.push('集客強化')
    if (cat === 'customer') tags.push('対応効率化')
    if (cat === 'operations') tags.push('運用見直し')
    if (cat === 'cost') tags.push('コスト削減')
    if (cat === 'management') tags.push('管理体制')
  }

  // 特定回答による追加タグ
  if (answers['outsourcing_cost'] === '高すぎると感じている') tags.push('代行費不満')
  if (answers['satisfaction'] === '不満がある') tags.push('現状不満')

  return Array.from(new Set(tags)).slice(0, 4)
}
