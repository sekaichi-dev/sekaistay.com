'use client'

/* EditorialSimulator — LP /switch の SwitchSimulator と同等の損失/節約試算 UI を
 * サイト editorial パレット (ivory/paper/ink/sekai-teal) で実装した共有コンポーネント。
 * /audit Step 02 と /services Chapter Ⅴ Clear Pricing から使用。 */

import { useMemo, useState } from 'react'

const SEKAI_FEE_PCT = 8
const SEKAI_FIXED_ANNUAL_MAN = 12 // ¥10,000/月 × 12 = 12万円/年

type Props = {
  /** numbered フィールドにする場合の開始番号（例: '02'）。省略時は番号なしのコンパクト表示 */
  startFieldNumber?: string
  /** 結果カードの上部に追加するヘルパー文字列 */
  helpText?: string
  /** 初期値の上書き */
  initialFeePct?: number
  initialMonthlyRev?: number
  initialPastYears?: number
  initialFutureYears?: number
  /** 値変更通知（オプション）—  親で送信時に試算結果が必要なケースに使う */
  onChange?: (state: { feePct: number; monthlyRev: number; pastYears: number; futureYears: number }) => void
}

export default function EditorialSimulator({
  startFieldNumber,
  helpText,
  initialFeePct = 20,
  initialMonthlyRev = 60,
  initialPastYears = 3,
  initialFutureYears = 5,
  onChange,
}: Props) {
  const [feePct, setFeePct] = useState(initialFeePct)
  const [monthlyRev, setMonthlyRev] = useState(initialMonthlyRev)
  const [pastYears, setPastYears] = useState(initialPastYears)
  const [futureYears, setFutureYears] = useState(initialFutureYears)
  const [touched, setTouched] = useState(false)

  const markTouched = () => {
    if (!touched) setTouched(true)
  }

  const update = (next: { feePct?: number; monthlyRev?: number; pastYears?: number; futureYears?: number }) => {
    const merged = { feePct, monthlyRev, pastYears, futureYears, ...next }
    if (next.feePct !== undefined) setFeePct(next.feePct)
    if (next.monthlyRev !== undefined) setMonthlyRev(next.monthlyRev)
    if (next.pastYears !== undefined) setPastYears(next.pastYears)
    if (next.futureYears !== undefined) setFutureYears(next.futureYears)
    markTouched()
    onChange?.(merged)
  }

  const result = useMemo(() => {
    const diff = Math.max(0, feePct - SEKAI_FEE_PCT) / 100
    const annualRevMan = monthlyRev * 12
    const annualWasteMan = annualRevMan * diff
    const annualNetDiffMan = Math.max(0, annualWasteMan - SEKAI_FIXED_ANNUAL_MAN)
    const annualSaving = Math.round(annualNetDiffMan)
    const pastLoss = annualSaving * pastYears
    const futureLoss = annualSaving * futureYears
    const totalLoss = pastLoss + futureLoss
    const futureSaving = annualSaving * futureYears
    return { pastLoss, futureLoss, totalLoss, annualSaving, futureSaving }
  }, [feePct, monthlyRev, pastYears, futureYears])

  const renderField = (idx: number, label: string, valueText: string, slider: React.ReactNode) => {
    const num = startFieldNumber
      ? String(parseInt(startFieldNumber, 10) + idx).padStart(2, '0')
      : null
    return (
      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex items-baseline gap-3">
            {num && <span className="eyebrow-mono text-mid-gray">{num}</span>}
            <label className="text-[14px] md:text-[15px] font-medium text-ink font-sans">{label}</label>
          </div>
          <span className="text-[20px] md:text-[24px] font-bold text-sekai-teal tabular-nums font-sans">
            {valueText}
          </span>
        </div>
        {slider}
      </div>
    )
  }

  return (
    <div className="space-y-7">
      {helpText && <p className="text-[12px] text-mid-gray font-sans">{helpText}</p>}

      {/* Q1: 現在の手数料率 */}
      {renderField(
        0,
        '今の代行会社の手数料率',
        `${feePct}%`,
        <>
          <input
            type="range"
            min={8}
            max={35}
            step={1}
            value={feePct}
            onChange={(e) => update({ feePct: parseInt(e.target.value, 10) })}
            className="w-full accent-sekai-teal"
          />
          <div className="flex justify-between text-[11px] text-mid-gray font-sans">
            <span>8%</span>
            <span>35%</span>
          </div>
        </>,
      )}

      {/* Q2: 月間総売上 */}
      {renderField(
        1,
        '物件の月間総売上',
        `${monthlyRev}万円`,
        <>
          <input
            type="range"
            min={10}
            max={500}
            step={5}
            value={monthlyRev}
            onChange={(e) => update({ monthlyRev: parseInt(e.target.value, 10) })}
            className="w-full accent-sekai-teal"
          />
          <div className="flex justify-between text-[11px] text-mid-gray font-sans">
            <span>10万円</span>
            <span>500万円</span>
          </div>
        </>,
      )}

      {/* Q3: 過去の運用期間 */}
      {renderField(
        2,
        'これまでの運用期間',
        `${pastYears}年`,
        <>
          <input
            type="range"
            min={0}
            max={15}
            step={1}
            value={pastYears}
            onChange={(e) => update({ pastYears: parseInt(e.target.value, 10) })}
            className="w-full accent-sekai-teal"
          />
          <div className="flex justify-between text-[11px] text-mid-gray font-sans">
            <span>0年</span>
            <span>15年</span>
          </div>
        </>,
      )}

      {/* Q4: 今後の運用予定 */}
      {renderField(
        3,
        '今後あと何年運用する予定',
        `${futureYears}年`,
        <>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={futureYears}
            onChange={(e) => update({ futureYears: parseInt(e.target.value, 10) })}
            className="w-full accent-sekai-teal"
          />
          <div className="flex justify-between text-[11px] text-mid-gray font-sans">
            <span>1年</span>
            <span>20年</span>
          </div>
        </>,
      )}

      {/* Result Ledger */}
      <div
        className={`border border-rule overflow-hidden transition-opacity duration-300 ${touched ? 'opacity-100' : 'opacity-70'}`}
        aria-live="polite"
      >
        {!touched && (
          <p className="bg-paper px-5 py-3 text-[12px] text-mid-gray text-center border-b border-rule font-sans">
            ↑ スライダを動かすと、あなたの数字が出ます
          </p>
        )}

        {/* Loss panel */}
        <div className="bg-ink text-ivory p-7 md:p-9 text-center">
          <p className="eyebrow-mono text-bright-teal mb-4">今の代行業者のままだと</p>
          <p className="font-sans font-light leading-none text-ivory mb-5 tabular-nums">
            <span className="text-[36px] md:text-[52px] mr-1">−</span>
            <span className="text-[48px] md:text-[68px]">{result.totalLoss}</span>
            <span className="text-[18px] md:text-[22px] ml-2 text-ivory/70">万円</span>
          </p>
          <div className="grid grid-cols-2 gap-5 pt-5 border-t border-ivory/20 max-w-md mx-auto">
            <div>
              <p className="eyebrow-mono text-ivory/60 mb-1">過去 {pastYears} 年</p>
              <p className="font-sans text-[17px] md:text-[20px] text-ivory/90 tabular-nums">
                −{result.pastLoss}
                <span className="text-[11px] text-ivory/60 ml-1">万円</span>
              </p>
            </div>
            <div>
              <p className="eyebrow-mono text-ivory/60 mb-1">今後 {futureYears} 年</p>
              <p className="font-sans text-[17px] md:text-[20px] text-ivory/90 tabular-nums">
                −{result.futureLoss}
                <span className="text-[11px] text-ivory/60 ml-1">万円</span>
              </p>
            </div>
          </div>
        </div>

        {/* Divider arrow */}
        <div className="relative bg-paper flex items-center justify-center py-4 border-y border-rule">
          <div className="w-8 h-8 rounded-full bg-sekai-teal flex items-center justify-center">
            <svg className="w-4 h-4 text-ivory" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* Saving panel */}
        <div className="bg-mist p-7 md:p-9 text-center">
          <p className="eyebrow-mono text-sekai-teal mb-4">SEKAI STAY に切り替えると</p>
          <p className="font-sans font-light leading-tight text-ink mb-2 tabular-nums">
            <span className="text-[18px] md:text-[20px]">{futureYears}年で</span>
            <span className="text-[38px] md:text-[52px] text-sekai-teal mx-2 font-medium">{result.futureSaving}</span>
            <span className="text-[18px] md:text-[22px] text-sekai-teal">万円</span>
            <span className="text-[14px] md:text-[16px] text-dark-gray ml-1">節約</span>
          </p>
          <p className="text-[12px] text-dark-gray mt-2 font-sans">
            年間
            <span className="font-bold text-sekai-teal mx-1 tabular-nums">{result.annualSaving}</span>
            万円が手元に戻る
          </p>
          <p className="text-[10px] text-mid-gray mt-3 font-sans">
            ※ 手数料 8% ＋ 物件あたり月額 ¥10,000 で計算
          </p>
        </div>
      </div>
    </div>
  )
}
