export function SiteFooter() {
  return (
    <footer className="border-t-4 border-blue bg-blue px-4 py-12 text-mustard sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {/* Thêm tracking-wider cho tiêu đề logo */}
          <p className="font-saigon3 text-2xl tracking-wider">
            TACO<span className="text-tomato">TANGO</span>
          </p>
          {/* Giãn chữ cho câu slogan */}
          <p className="mt-2 max-w-xs font-saigon3 text-sm tracking-wider text-mustard/80">
            Đang quạu thì ăn kiểu quạu, đang vui thì quẩy kiểu vui!
          </p>
        </div>

        {/* Chuyển sang font-mono và normal-case cho thông tin liên hệ */}
        <div className="flex flex-col gap-2 font-mono text-sm normal-case">
          <span className="font-saigon3 uppercase tracking-wider text-tomato">
            Theo dõi
          </span>
          <span className="tracking-wide">tacotango.id.vn</span>
          <span className="tracking-wide">tacotango2026@gmail.com</span>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-6xl border-t-3 border-mustard/30 pt-6 font-mono text-xs text-mustard/60">
        © {new Date().getFullYear()} Taco Tango. All rights reserved.
      </p>
    </footer>
  );
}