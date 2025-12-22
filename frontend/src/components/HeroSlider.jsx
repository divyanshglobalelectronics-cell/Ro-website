import { useEffect, useMemo, useState } from 'react';

import img1 from '../assets/hero/1.jpg';
import img2 from '../assets/hero/2.jpg';
import img3 from '../assets/hero/3.jpg';
import img4 from '../assets/hero/4.jpg';
import img5 from '../assets/hero/5.jpg';
import img6 from '../assets/hero/6.jpg';
import img7 from '../assets/hero/7.jpg';

const defaultImages = [img1, img2, img3, img4, img5, img6, img7];

export default function HeroSlider({ intervalMs = 4500, transition = 'fade', captions = [], images = defaultImages }) {
  const [idx, setIdx] = useState(0);
  const total = images.length;

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % total), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs, total]);

  const go = (next) => setIdx((i) => (i + next + total) % total);

  const indicators = useMemo(() => (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
      {images.map((_, i) => (
        <button
          key={i}
          onClick={() => setIdx(i)}
          className={`h-2 w-2 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50 hover:bg-white/70'}`}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </div>
  ), [idx, images.length]);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[220px] sm:h-[300px] md:h-[380px] lg:h-[460px]">
        {transition === 'fade' ? (
          <>
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Slide ${i + 1}`}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
          </>
        ) : (
          <div className="absolute inset-0 h-full w-full">
            <div
              className="flex h-full w-full transition-transform duration-700"
              style={{ transform: `translateX(-${idx * 100}%)`, width: `${images.length * 100}%` }}
            >
              {images.map((src, i) => (
                <img key={i} src={src} alt={`Slide ${i + 1}`} className="h-full w-full object-cover flex-shrink-0" />
              ))}
            </div>
          </div>
        )}

        {/* gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

        {/* per-slide caption (optional) */}
        {captions[idx] && (
          <div className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-black/40 text-white text-sm sm:text-base px-3 py-2 rounded">
            {captions[idx]}
          </div>
        )}

        {/* controls */}
        <button
          onClick={() => go(-1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/35 hover:bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center"
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          onClick={() => go(1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/35 hover:bg-black/50 text-white rounded-full w-10 h-10 flex items-center justify-center"
          aria-label="Next slide"
        >
          ›
        </button>

        {indicators}
      </div>
    </section>
  );
}
