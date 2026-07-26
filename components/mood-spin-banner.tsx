import Link from "next/link";

export function MoodSpinBanner() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="bg-tomato rounded-3xl p-8 md:p-12 text-center shadow-[8px_8px_0px_#1f3c88] border-3 border-blue">
        <p className="text-cream font-bold uppercase tracking-widest text-sm mb-3">
          Mini game đặc biệt
        </p>

        <h2 className="text-3xl md:text-4xl text-white font-saigon2 mb-4 leading-tight">
          Bật mí mood hôm nay, quay ngay ưu đãi!
        </h2>

        <p className="text-cream text-base md:text-lg mb-6 max-w-xl mx-auto">
          Trả lời 3 câu hỏi nhỏ, nhận 1 câu quote dành riêng cho bạn và quay số
          nhận voucher giảm giá lên đến 7%.
        </p>

        <Link
          href="/mood-spin"
          className="inline-block bg-blue text-mustard px-8 py-4 rounded-full font-bold text-lg hover:bg-cream hover:text-blue transition-colors"
        >
          Chơi ngay
        </Link>
      </div>
    </section>
  );
}