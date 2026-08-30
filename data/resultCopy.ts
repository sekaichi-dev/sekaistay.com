// 診断結果の文言テンプレート — スコア帯別に管理

import type { Category } from './questions'

export type ResultCopy = {
  rank: 'A' | 'B' | 'C' | 'D'
  scoreRange: string
  rankLabel: string
  rankColor: string       // Tailwind text color class
  rankBg: string          // Tailwind bg color class
  summary: string         // 総評（1〜2文）
  strength: string        // 現状の強み
  improvement: string     // 改善余地
  priority: string        // 優先して見直すべきこと
  expectation: string     // 改善した場合に期待できること
  ctaText: string         // 相談CTAのボタン文言
  ctaSubtext: string      // CTAの補足文
}

export const RESULT_COPIES: Record<'A' | 'B' | 'C' | 'D', ResultCopy> = {
  A: {
    rank: 'A',
    scoreRange: '80〜100点',
    rankLabel: '優秀',
    rankColor: 'text-emerald-700',
    rankBg: 'bg-emerald-50',
    summary: '現状の運営はとても安定しています。あとは精度を上げて、さらにゆとりと収益を伸ばす段階です。',
    strength: '稼働率や対応の仕組みが整っており、運営の基盤はしっかりしています。',
    improvement: '価格戦略の精度向上や、直接予約の比率を上げることで、さらに収益を伸ばせます。',
    priority: '価格最適化の自動化・直接予約チャネルの強化',
    expectation: '年間収益の10〜20%アップと、さらなる手離れが期待できます。',
    ctaText: '無料相談で次のステップを確認する',
    ctaSubtext: 'さらなる最適化の可能性を、一緒に整理します。',
  },
  B: {
    rank: 'B',
    scoreRange: '60〜79点',
    rankLabel: '良好',
    rankColor: 'text-blue-700',
    rankBg: 'bg-blue-50',
    summary: '運営の基礎はできていますが、いくつかの課題が収益と効率を下げています。',
    strength: '物件の運用は継続できており、改善の土台があります。',
    improvement: 'OTA依存の見直しと対応負荷の軽減が、大きな改善ポイントです。',
    priority: '集客チャネルの拡大・ゲスト対応の自動化',
    expectation: '稼働率と単価が改善されれば、月間収益の20〜30%向上が見込めます。',
    ctaText: '無料相談で改善策を確認する',
    ctaSubtext: '具体的な改善ポイントを、一緒に整理します。',
  },
  C: {
    rank: 'C',
    scoreRange: '40〜59点',
    rankLabel: '改善余地あり',
    rankColor: 'text-amber-700',
    rankBg: 'bg-amber-50',
    summary: '現在の運用にはいくつかの課題が重なっており、見直しによって大きく改善できる状態です。',
    strength: 'すでに運営を継続されているため、改善の実績を積める段階にあります。',
    improvement: '稼働率・ゲスト対応・コスト管理のすべてに見直しの余地があります。',
    priority: '運用の整理・コストの見直し・集客方法の改善',
    expectation: '仕組みを整えることで、手間を減らしながら収益を着実に伸ばせます。',
    ctaText: '無料相談で現状を整理する',
    ctaSubtext: '今の課題を一緒に整理し、改善の優先順位をご提案します。',
  },
  D: {
    rank: 'D',
    scoreRange: '0〜39点',
    rankLabel: '要見直し',
    rankColor: 'text-red-700',
    rankBg: 'bg-red-50',
    summary: '現在の運用は多くの負荷と課題を抱えており、早めの見直しが必要な状態です。',
    strength: '物件を所有・運用されているため、改善余地は非常に大きい状態です。',
    improvement: '稼働率・対応負荷・コスト・集客のすべてに改善の余地があります。',
    priority: 'まず運用体制とコスト構造を整理することから始めましょう。',
    expectation: '適切な改善を取れば、現状から大きく状況を好転させられます。',
    ctaText: '無料相談を申し込む',
    ctaSubtext: '今の状況を整理し、改善の第一歩を一緒に考えます。',
  },
}

// カテゴリ別の課題コメント
export const CATEGORY_ISSUE_COPY: Record<Category, { title: string; body: string }> = {
  revenue: {
    title: '売上の伸びしろがあります',
    body: '稼働率または単価の改善で、売上をさらに伸ばせる可能性があります。',
  },
  marketing: {
    title: '集客チャネルの最適化が有効です',
    body: 'OTA依存の見直しやページ品質の向上で、予約数を増やせます。',
  },
  customer: {
    title: 'ゲスト対応を効率化できます',
    body: '対応の自動化・テンプレート化で、手間を大きく減らせます。',
  },
  operations: {
    title: '運用の仕組み化が必要です',
    body: '清掃・現地対応を整理することで、安定した運営が実現できます。',
  },
  cost: {
    title: 'コストを見直せる可能性があります',
    body: '外注費や代行費の構造を整理することで、収益を改善できます。',
  },
  management: {
    title: '管理体制の見直しが有効です',
    body: '手離れを高めることで、オーナーの負担を減らしつつ収益を維持できます。',
  },
}
