import Image from "next/image";
import { Instagram, Facebook } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative border-t-8 border-tomato bg-blue px-6 py-20 text-mustard">
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
        
        {/* CỘT 1: Logo To (Trái) */}
        <div className="flex flex-col gap-4">
          <div className="relative w-64 h-40">
            <Image
              src="/images/logontext.png"
              alt="Taco Tango"
              fill
              className="object-contain object-left"
            />
          </div>
          <p className="font-saigon3 text-lg tracking-widest text-mustard/90">
            GIÒN TAN NHỊP<br />VANGGGGGG!
          </p>
        </div>

        {/* CỘT 2: Danh bạ liên hệ (Giữa) */}
        <div className="flex flex-col gap-6">
          <h4 className="text-tomato font-bold uppercase tracking-widest text-sm border-b border-mustard/20 pb-2">Liên hệ</h4>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-mustard/10 bg-mustard/5">
              <p className="font-bold text-tomato text-base">Phương Nghi</p>
              <p className="font-mono text-sm">0971 427 898</p>
            </div>
            <div className="p-4 rounded-xl border border-mustard/10 bg-mustard/5">
              <p className="font-bold text-tomato text-base">Nhật Lệ</p>
              <p className="font-mono text-sm">0983 422 007</p>
            </div>
          </div>
        </div>

        {/* CỘT 3: Địa chỉ & Kết nối (Phải) */}
        <div className="flex flex-col gap-6">
          <h4 className="text-tomato font-bold uppercase tracking-widest text-sm border-b border-mustard/20 pb-2">Địa chỉ & Kết nối</h4>
          <p className="font-mono text-sm leading-relaxed">
            279 Nguyễn Tri Phương, phường Diên Hồng, TP.HCM
          </p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/tacotango_2026" target="_blank" rel="noopener noreferrer" className="p-3 border-2 border-mustard rounded-full hover:bg-tomato hover:border-tomato transition-all">
              <Instagram className="h-6 w-6" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61590932327366" target="_blank" rel="noopener noreferrer" className="p-3 border-2 border-mustard rounded-full hover:bg-tomato hover:border-tomato transition-all">
              <Facebook className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="mx-auto mt-20 max-w-7xl border-t border-mustard/20 pt-8 text-center text-xs text-mustard/50 font-mono">
        © {new Date().getFullYear()} Taco Tango. All rights reserved.
      </div>
    </footer>
  );
}