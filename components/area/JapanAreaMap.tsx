'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { Area } from '@/lib/areas'
import { REGIONS, groupAreasByRegion, type RegionId } from './regions'

/**
 * タイルグリッド型の日本地図。
 * 8列×3行のグリッドに地方ブロックを幾何学配置し、日本列島の
 * 南西→北東の弧を模す。地方タイルをクリックすると下の
 * エリアカード一覧がその地方でフィルタされる。
 */
const TILE_POS: Record<RegionId, string> = {
  hokkaido:          'col-start-8 col-span-2 row-start-1',
  tohoku:            'col-start-7 col-span-2 row-start-2',
  kanto:             'col-start-6 col-span-2 row-start-3',
  chubu:             'col-start-4 col-span-2 row-start-3',
  kansai:            'col-start-3 col-span-2 row-start-4',
  'chugoku-shikoku': 'col-start-1 col-span-2 row-start-4',
  'kyushu-okinawa':  'col-start-1 col-span-2 row-start-5',
}

type Selection = RegionId | 'all'

export default function JapanAreaMap({ areas }: { areas: Area[] }) {
  const [selected, setSelected] = useState<Selection>('all')

  const groups = useMemo(() => groupAreasByRegion(areas), [areas])

  const visibleRegions =
    selected === 'all'
      ? REGIONS.filter((r) => groups[r.id].length > 0)
      : REGIONS.filter((r) => r.id === selected)

  const visibleCount = visibleRegions.reduce((n, r) => n + groups[r.id].length, 0)

  const toggleRegion = (id: RegionId) => {
    setSelected((prev) => (prev === id ? 'all' : id))
  }

  return (
    <div>
      {/* ── Tile-grid Japan map ── */}
      <div className="bg-paper border border-rule p-5 md:p-8">
        <div className="flex items-baseline justify-between gap-4 mb-5">
          <p className="eyebrow-mono text-mid-gray">Japan — Tile Atlas</p>
          <p className="text-caption text-dark-gray hidden sm:block">
            地方をクリックすると、下のエリア一覧が絞り込まれます
          </p>
        </div>

        <div className="overflow-x-auto -mx-5 px-5 md:mx-0 md:px-0 pb-1">
          <div
            role="group"
            aria-label="地方を選んでエリアを絞り込む"
            className="grid grid-cols-9 grid-rows-5 gap-1.5 md:gap-2 min-w-[560px]"
          >
            {REGIONS.map((region) => {
              const active = selected === region.id
              const count = groups[region.id].length
              return (
                <button
                  key={region.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleRegion(region.id)}
                  className={`${TILE_POS[region.id]} min-h-[84px] md:min-h-[108px] p-2.5 md:p-3.5 text-left flex flex-col justify-between transition ${
                    active
                      ? 'bg-sekai-teal border border-sekai-teal text-ivory'
                      : 'bg-mist border border-rule hover:border-sekai-teal hover:bg-paper'
                  }`}
                >
                  <span>
                    <span
                      className={`block font-sans font-bold text-[12px] md:text-[14px] leading-tight jp-keep ${
                        active ? 'text-ivory' : 'text-ink'
                      }`}
                    >
                      {region.label}
                    </span>
                    <span
                      className={`block eyebrow-mono mt-1 ${active ? '!text-ivory/80' : '!text-mid-gray'}`}
                    >
                      {region.labelEn}
                    </span>
                  </span>
                  <span
                    className={`inline-flex items-baseline gap-1 self-start px-1.5 py-0.5 ${
                      active ? 'bg-ivory/20 text-ivory' : 'bg-paper border border-rule text-sekai-teal'
                    }`}
                  >
                    <span className="font-sans font-bold text-[13px] md:text-[15px] leading-none tabular-nums">
                      {count}
                    </span>
                    <span className={`text-[10px] leading-none ${active ? 'text-ivory/80' : 'text-dark-gray'}`}>
                      エリア
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Filter chips（リセット + 地方。地図と同期） ── */}
        <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-rule">
          <button
            type="button"
            aria-pressed={selected === 'all'}
            onClick={() => setSelected('all')}
            className={`px-3.5 py-2 font-sans font-bold text-[12.5px] transition ${
              selected === 'all'
                ? 'bg-ink text-ivory border border-ink'
                : 'bg-paper text-dark-gray border border-rule hover:border-ink hover:text-ink'
            }`}
          >
            すべて <span className="tabular-nums ml-0.5">{areas.length}</span>
          </button>
          {REGIONS.map((region) => {
            const active = selected === region.id
            return (
              <button
                key={region.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggleRegion(region.id)}
                className={`px-3.5 py-2 font-sans font-bold text-[12.5px] transition ${
                  active
                    ? 'bg-sekai-teal text-ivory border border-sekai-teal'
                    : 'bg-paper text-dark-gray border border-rule hover:border-sekai-teal hover:text-ink'
                }`}
              >
                {region.label}{' '}
                <span className="tabular-nums ml-0.5">{groups[region.id].length}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── 表示状態 ── */}
      <div className="flex items-baseline justify-between gap-4 mt-10 mb-2" aria-live="polite">
        <p className="font-sans text-[14px] text-dark-gray">
          {selected === 'all' ? (
            <>
              全<span className="font-bold text-ink tabular-nums">{visibleCount}</span>
              エリアを地方別に表示中
            </>
          ) : (
            <>
              「{REGIONS.find((r) => r.id === selected)?.label}」の
              <span className="font-bold text-ink tabular-nums">{visibleCount}</span>
              エリアを表示中
            </>
          )}
        </p>
        {selected !== 'all' && (
          <button
            type="button"
            onClick={() => setSelected('all')}
            className="font-sans font-bold text-[13px] text-sekai-teal underline underline-offset-4 hover:text-teal-ink transition"
          >
            すべて表示に戻す
          </button>
        )}
      </div>

      {/* ── 地方ごとのエリアカード ── */}
      {visibleRegions.map((region) => {
        const regionAreas = groups[region.id]
        return (
          <div key={region.id} className="mt-10">
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <span className="eyebrow">{region.label}</span>
              <span className="eyebrow-mono">
                {region.labelEn} · {regionAreas.length} {regionAreas.length === 1 ? 'Area' : 'Areas'}
              </span>
              <span className="h-px bg-rule flex-1" />
            </div>

            {regionAreas.length === 0 ? (
              <div className="border border-rule bg-paper p-8">
                <p className="text-body-sm text-dark-gray jp-break">
                  この地方の掲載エリアは準備中です。清掃パートナーの確保でき次第、順次対応します。お急ぎの場合は
                  <Link href="/contact" className="text-sekai-teal font-bold underline underline-offset-4 mx-1">
                    無料相談
                  </Link>
                  からお問い合わせください。
                </p>
              </div>
            ) : (
              <div className="bg-rule border border-rule grid sm:grid-cols-2 lg:grid-cols-3 gap-px">
                {regionAreas.map((area) => (
                  <Link
                    key={area.slug}
                    href={`/area/${area.slug}`}
                    className="group flex flex-col bg-paper p-6 md:p-7 transition hover:bg-mist min-w-0"
                  >
                    <div className="flex items-baseline justify-between gap-3 pb-3 border-b border-rule">
                      <h3 className="font-sans font-medium text-[20px] md:text-[22px] text-ink group-hover:text-sekai-teal transition leading-tight">
                        {area.name}
                      </h3>
                      <span className="eyebrow-mono shrink-0">{area.prefecture}</span>
                    </div>

                    <ul className="mt-4 mb-5 space-y-1.5">
                      {area.highlights.slice(0, 2).map((highlight) => (
                        <li
                          key={highlight}
                          className="flex gap-2 font-sans text-[13px] text-dark-gray leading-relaxed"
                        >
                          <span aria-hidden className="mt-[9px] h-px w-3 shrink-0 bg-sekai-teal" />
                          <span className="jp-break">{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-4 border-t border-rule flex items-end justify-between gap-3">
                      <div>
                        <p className="eyebrow-mono mb-1">月間平均売上</p>
                        <p className="font-sans font-light text-[22px] text-ink leading-none tabular-nums">
                          ¥{Math.round(area.avgRevenue / 10000)}
                          <span className="font-sans text-[13px] text-dark-gray ml-0.5">万</span>
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-2 text-sekai-teal font-sans font-medium text-[13px] pb-0.5">
                        詳しく見る
                        <span
                          aria-hidden
                          className="block w-5 h-px bg-sekai-teal group-hover:w-9 transition-[width]"
                        />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
