/* 運営プレビューの帯（ゲストと同じ画面を送信不可で見るとき・契約画面と宿泊者名簿で共通） */
export default function StaffPreviewBanner({ title, detail }: { title: string; detail?: React.ReactNode }) {
  return (
    <div className="bg-amber-100 border-b border-amber-300" role="status">
      <div className="max-w-2xl mx-auto px-5 py-3 text-[13px] leading-[1.7] text-amber-900">
        <p className="font-bold">{title}</p>
        {detail ? <p>{detail}</p> : null}
      </div>
    </div>
  );
}
