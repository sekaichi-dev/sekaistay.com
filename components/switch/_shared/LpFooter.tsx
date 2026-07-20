import Image from "next/image";
import LegalModal from "./LegalModal";

export default function Footer() {
  return (
    <footer className="bg-switch-charcoal text-switch-gray-mid py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/switch/logo-symbol.png"
              alt="SEKAI STAY"
              width={28}
              height={28}
              className="h-7 w-auto invert object-contain"
            />
            <div>
              <Image
                src="/images/switch/logo-text.png"
                alt="SEKAI STAY"
                width={100}
                height={13}
                className="h-4 w-auto invert object-contain"
              />
              <p className="text-xs mt-1.5">民泊運用代行サービス</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <LegalModal />
            <a href="#company" className="hover:text-white transition-colors">
              会社概要
            </a>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs">
          &copy; {new Date().getFullYear()} SEKAI STAY. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
