import Slider from "react-slick";

export default function HeroSlider() {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 450,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const slides = [
    { tag: "New", title: "New Season", desc: "Up to 50% off selected items" },
    { tag: "Drop", title: "Streetwear Drop", desc: "Fresh fits, clean lines" },
    { tag: "Style", title: "Accessories", desc: "Small things. Big vibe." },
  ];

  return (
    <div className="w-full">
      <Slider {...settings}>
        {slides.map((s, i) => (
          <div key={i} className="px-1">
            <div className="w-full rounded-2xl border border-zinc-200 overflow-hidden flex">
              <div className="w-full min-h-[180px] sm:min-h-[260px] lg:min-h-[320px] flex items-center">
                <div className="w-full p-6 sm:p-10 flex flex-col gap-3">
                  <div className="text-xs uppercase tracking-widest text-zinc-500">
                    {s.tag}
                  </div>
                  <div className="text-2xl sm:text-3xl font-semibold text-zinc-900">
                    {s.title}
                  </div>
                  <div className="text-sm text-zinc-600">{s.desc}</div>
                  <div className="flex gap-3 pt-2">
                    <button className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-sm">
                      Shop Now
                    </button>
                    <button className="px-4 py-2 rounded-xl border border-zinc-200 text-sm">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
