import Link from 'next/link'
import { QUESTION_BLOCKS, FEE_TABLE } from '@/content/home/copy-questions'
import type { QuestionItem } from '@/content/home/copy-questions'
import { IconArrowRight } from '@/components/Icons'
import { JP } from '@/components/JP'

function FeeTable() {
  return (
    <div className="mt-6">
      <p className="text-body-sm text-dark-gray mb-4 jp-break">{FEE_TABLE.intro}</p>
      <div className="overflow-x-auto border border-rule bg-paper">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-rule">
              {FEE_TABLE.head.map((h) => (
                <th key={h} className="px-4 py-3 eyebrow-mono text-mid-gray !normal-case !tracking-[0.1em] font-normal whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FEE_TABLE.rows.map((row) => (
              <tr key={row[0]} className="border-b border-rule last:border-b-0">
                {row.map((cell, i) => (
                  <td
                    key={i}
                    className={`px-4 py-4 font-sans text-[14px] md:text-[15px] tabular-nums whitespace-nowrap ${
                      i === row.length - 1 ? 'font-medium text-sekai-teal' : i === 0 ? 'font-medium text-ink' : 'text-dark-gray'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 space-y-1">
        {FEE_TABLE.notes.map((note) => (
          <p key={note} className="text-caption text-mid-gray leading-relaxed jp-break">
            {note}
          </p>
        ))}
      </div>
    </div>
  )
}

function QuestionEntry({ item }: { item: QuestionItem }) {
  return (
    <article className="py-9 md:py-11 border-b border-rule last:border-b-0">
      <div className="grid md:grid-cols-12 gap-5 md:gap-8">
        {/* Question */}
        <div className="md:col-span-5 min-w-0">
          <p className="eyebrow-mono text-sekai-teal mb-3">{item.num}</p>
          <h4 className="font-sans font-medium text-[19px] md:text-[21px] text-ink leading-snug jp-keep">
            <JP>{item.q}</JP>
          </h4>
        </div>

        {/* Answer */}
        <div className="md:col-span-7 min-w-0">
          <p className="eyebrow-mono text-mid-gray mb-3 !text-[9.5px]">SEKAI STAYの答え</p>
          <p className="font-sans font-medium text-[17px] md:text-[19px] text-sekai-teal leading-snug mb-3 jp-keep">
            <JP>{item.aLead}</JP>
          </p>
          <p className="text-body-sm text-dark-gray jp-break">{item.aBody}</p>

          {item.showFeeTable && <FeeTable />}

          {item.notes?.map((note) => (
            <p key={note} className="mt-4 text-caption text-mid-gray leading-relaxed jp-break">
              {note}
            </p>
          ))}

          {item.cta && (
            <div className="mt-7">
              <Link href={item.cta.href} className="btn btn-primary group">
                {item.cta.label}
                <IconArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </Link>
              <p className="text-caption text-mid-gray mt-3">{item.cta.microcopy}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default function TenQuestions() {
  return (
    <section className="bg-ivory">
      <div className="container-edit section-xl">
        {QUESTION_BLOCKS.map((block, blockIdx) => (
          <div key={block.id} className={blockIdx > 0 ? 'mt-16 md:mt-24' : ''}>
            <div className="chapter-marker">
              <span className="rule-teal-sm" />
              <span className="eyebrow">{block.eyebrow}</span>
            </div>
            <h3 className="heading-hero text-ink mb-2 jp-keep">
              <JP>{block.title}</JP>
            </h3>
            <div className="border-t border-rule mt-8">
              {block.items.map((item) => (
                <QuestionEntry key={item.num} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
