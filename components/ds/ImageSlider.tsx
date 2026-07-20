"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

/**
 * [DESIGN_PARTS] ImageSlider — sense-trust /company のヒーロー画像スライド踏襲。
 * 全幅画像を「クロスフェード」で自動切替（横スライドではない）。
 * 実測値: type:fade / interval:4000 / speed:1500 / arrows・pagination なし / pauseOnHover:false。
 */
export default function ImageSlider({
  images,
  ariaLabel = "運用物件のイメージ",
}: {
  images: { src: string; alt?: string }[]
  ariaLabel?: string
}) {
  return (
    <Splide
      options={{
        type: "fade",
        rewind: true,
        autoplay: true,
        interval: 4000,
        speed: 1500,
        arrows: false,
        pagination: false,
        pauseOnHover: false,
        drag: false,
      }}
      aria-label={ariaLabel}
      className="st-imageslider"
    >
      {images.map((im, i) => (
        <SplideSlide key={i}>
          <div className="aspect-[16/9] w-full overflow-hidden sm:aspect-[21/9]">
            <img
              src={im.src}
              alt={im.alt ?? ""}
              aria-hidden={!im.alt}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        </SplideSlide>
      ))}
    </Splide>
  )
}
