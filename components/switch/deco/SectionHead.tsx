import type { ReactNode } from "react";

type Props = {
  /** 英語のセクションラベル（例: "Service", "Flow", "Price"） */
  enLabel: string;
  /** 日本語見出し */
  jaTitle: ReactNode;
  /** 任意のサブタイトル */
  subtitle?: ReactNode;
  /** 見出しの色（デフォルトは charcoal、ダーク背景では white を指定） */
  titleColor?: "charcoal" | "white";
  /** ティールアンダーライン装飾を非表示にする */
  hideUnderline?: boolean;
  className?: string;
};

/**
 * SEKAI STAY Creative Guide + 士業LP 定番の
 * 「ENラベル ＋ 日本語見出し ＋ ティールアンダーライン」二段構成の見出しブロック。
 */
export default function SectionHead({
  enLabel,
  jaTitle,
  subtitle,
  titleColor = "charcoal",
  hideUnderline = false,
  className = "",
}: Props) {
  return (
    <div className={`text-center ${className}`}>
      <p className="text-switch-teal font-bold text-xs sm:text-sm tracking-[0.25em] uppercase mb-3">
        {enLabel}
      </p>
      <h2
        className={`text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight ${
          titleColor === "white" ? "text-white" : "text-switch-charcoal"
        }`}
      >
        {jaTitle}
      </h2>
      {/* ティールアンダーライン装飾 */}
      {!hideUnderline && (
        <div className="mx-auto mt-5 mb-5 h-[3px] w-16 bg-switch-teal rounded-full" />
      )}
      {subtitle && (
        <p
          className={`text-base leading-normal max-w-2xl mx-auto ${hideUnderline ? "mt-4" : ""} ${
            titleColor === "white" ? "text-white/70" : "text-switch-gray-dark"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
