import { ReactNode } from 'react'

/**
 * JP — 日本語の見出し・本文を、文節（意味のまとまり）単位で
 * 折り返す。読点「、」句点「。」「！」「？」「：」「；」の
 * 直後で自動分割し、各文節を inline-block で包む。
 *
 * これにより、ブラウザは文節の「中」では折り返さず、文節と
 * 文節の「間」でだけ折り返す。「もう丸投げで\nいい」のような
 * 意味を壊す改行を防ぐ。
 *
 * 使い方:
 *   <h2 className="jp-keep"><JP>民泊運営は、もう丸投げでいい。</JP></h2>
 *
 * 明示的に途中で区切りたい時は "｜" を挿入する:
 *   <JP>オーナーは、｜伸びるかどうかだけ｜見ればいい。</JP>
 */
export function JP({ children }: { children: string }): ReactNode {
  // Normalize & split: break AFTER 、 。 ！ ？ ： ； , and at explicit "｜"
  const raw = children.replace(/｜/g, '\u0001')
  const bySentinel = raw
    .split('\u0001')
    .flatMap((seg) => seg.split(/(?<=[、。！？：；])/))
    .filter(Boolean)

  if (bySentinel.length <= 1) return <>{children}</>

  return (
    <>
      {bySentinel.map((phrase, i) => (
        <span key={i} className="inline-block">
          {phrase}
        </span>
      ))}
    </>
  )
}
