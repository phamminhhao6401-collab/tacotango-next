import Image from "next/image";

export function StorySection() {
  return (
    <section
      id="story"
      className="border-b-4 border-blue bg-cream px-4 py-20 sm:px-6"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        {/* === KHU VỰC HÌNH ẢNH === */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="relative aspect-[4/5] w-full rotate-[-4deg] overflow-hidden rounded-2xl border-3 border-blue shadow-retro transition-transform hover:rotate-0">
              <Image
                src="/images/tango.jpg"
                alt="Taco Tango"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
              />
            </div>

            <div className="relative mt-8 aspect-[4/5] w-full rotate-[3deg] overflow-hidden rounded-2xl border-3 border-blue shadow-retro transition-transform hover:rotate-0">
              <Image
                src="/images/emotions.png"
                alt="Taco Tango"
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>

          <span className="absolute -bottom-2 -right-2 z-10 rotate-6 rounded-full border-3 border-blue bg-mustard px-4 py-2 font-saigon3 text-xs font-bold uppercase tracking-wide text-blue shadow-retro-sm sm:-bottom-4 sm:-right-4">
            est. ueh-isb, 2026
          </span>
        </div>

        {/* === KHU VỰC VĂN BẢN === */}
        <div className="flex flex-col gap-5">
          <span className="font-saigon3 text-xs font-bold uppercase tracking-[0.3em] text-tomato">
            Câu chuyện
          </span>
          <h2 className="font-saigon2 text-3xl leading-tight text-blue sm:text-4xl">
            Điệu nhảy và cảm xúc
          </h2>
          <p className="font-mono text-base leading-relaxed text-blue">
            Taco Tango lấy cảm hứng từ điệu nhảy tango, nơi từng nhịp chuyển động luôn sôi động, cuốn hút và đầy cảm xúc. Cũng như tâm trạng mỗi ngày của tụi mình, có lúc vui, lúc chill, lúc deadline dí, lúc hơi quạu một chút, mỗi mood đều có một nhịp riêng.
          </p>

          <p className="font-mono text-base leading-relaxed text-blue">
            Từ đó, Taco Tango mang đến walking taco như một cách bắt nhịp cảm xúc bằng hương vị. Snack giòn rụm, topping đầy màu sắc và sốt đậm vị hòa vào nhau trong từng cú lắc, từng miếng cắn. Cầm lên là vui, ăn vào là đã.{" "}
            <span className="font-bold text-tomato">
              Taco Tango, giòn tan nhịp vangggggg!
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}