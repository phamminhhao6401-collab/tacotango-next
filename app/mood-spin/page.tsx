"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const MOOD_QUESTIONS = [
  {
    id: "mood",
    question: "Hôm nay bạn đang cảm thấy thế nào?",
    options: [
      "Mệt mỏi, cần nạp năng lượng",
      "Căng thẳng, áp lực",
      "Vui vẻ, phấn khích",
      "Bình thường, không có gì đặc biệt",
      "Chán nản, buồn",
      "Đói cồn cào",
    ],
  },
  {
    id: "occasion",
    question: "Bạn ăn taco vào lúc nào là hợp nhất?",
    options: [
      "Một mình, xả stress sau giờ làm/học",
      "Ăn cùng bạn bè, đồng nghiệp",
      "Bữa xế giữa ngày",
      "Late night, đói bất chợt",
      "Ăn mừng, có dịp đặc biệt",
    ],
  },
  {
    id: "flavor",
    question: "Vị nào khiến bạn thấy 'đã' nhất?",
    options: [
      "Cay nồng, đã miệng",
      "Chua thanh, dễ ăn",
      "Béo ngậy, đậm đà",
      "Mặn vừa, an toàn",
    ],
  },
];

const QUOTES: Record<string, string> = {
  "Mệt mỏi, cần nạp năng lượng": "Pin người còn 1%, để Taco Tango cứu viện!",
  "Căng thẳng, áp lực": "Deadline vẫn còn đó. Nhưng ăn xong rồi tính nha:)",
  "Vui vẻ, phấn khích": "Có Taco Tango là tự nhiên thấy cuộc đời dễ thương hơn.",
  "Bình thường, không có gì đặc biệt": "Ngày nào cũng đáng để ăn ngon.",
  "Chán nản, buồn": "Buồn thì khóc. Đói thì ăn Walking Taco!!!",
  "Đói cồn cào": "Bụng biểu tình khởi nghĩa rồi đó:)",
};

export default function MoodSpinPage() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [phone, setPhone] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<{ code: string; label: string } | null>(null);
  const [error, setError] = useState("");

  // THÊM MỚI
  const [copied, setCopied] = useState(false);

  const currentQuestion = MOOD_QUESTIONS[step];


  const handleAnswer = (option: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));

    if (step < MOOD_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setStep(MOOD_QUESTIONS.length);
    }
  };


  // THÊM MỚI: COPY MÃ
  const copyVoucher = async () => {
    if (!result?.code) return;

    try {
      await navigator.clipboard.writeText(result.code);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch (error) {
      console.error("Copy failed:", error);
    }
  };


  const handleSpin = async () => {
    if (!phone.trim()) {
      setError("Vui lòng nhập số điện thoại để xác định lượt quay.");
      return;
    }

    setIsSpinning(true);
    setError("");

    try {
      const res = await fetch("/api/spin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), answers }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Có lỗi xảy ra, vui lòng thử lại.");
        setIsSpinning(false);
        return;
      }

      setTimeout(() => {
        setResult(data);
        setIsSpinning(false);
      }, 2000);

    } catch {
      setError("Lỗi kết nối, vui lòng thử lại.");
      setIsSpinning(false);
    }
  };


  if (result) {
    const moodQuote =
      QUOTES[answers.mood] ||
      "Cảm ơn bạn đã chia sẻ cùng Taco Tango!";


    return (
      <div className="min-h-screen bg-mustard flex flex-col items-center justify-center text-center p-6">

        <p className="text-blue italic mb-6 max-w-md">
          "{moodQuote}"
        </p>


        <h1 className="text-3xl text-blue font-saigon2 mb-4">
          Bạn nhận được mã:
        </h1>


        {/* THÊM MỚI: HIỂN THỊ CODE + COPY */}
        <div className="flex items-center gap-3 mb-4">

          <span className="bg-cream border-2 border-blue px-5 py-3 rounded-xl text-blue font-bold">
            {result.code}
          </span>


          <button
            onClick={copyVoucher}
            className="bg-blue text-mustard px-4 py-3 rounded-xl font-bold hover:bg-cream hover:text-blue transition-colors"
          >
            {copied ? "Đã copy ✓" : "Copy mã"}
          </button>

        </div>


        <p className="text-tomato font-bold mb-8">
          {result.label}
        </p>


        <button
          onClick={() => router.push("/checkout")}
          className="bg-tomato text-white px-8 py-4 rounded-full font-bold"
        >
          Dùng mã ngay
        </button>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-mustard flex flex-col items-center justify-center text-center p-6">

      {step < MOOD_QUESTIONS.length ? (

        <>
          <h2 className="text-2xl text-blue font-saigon2 mb-8">
            {currentQuestion.question}
          </h2>


          <div className="flex flex-col gap-3 w-full max-w-sm">

            {currentQuestion.options.map((opt) => (

              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                className="p-3 rounded-lg border-2 border-blue bg-cream text-blue font-bold hover:bg-blue hover:text-mustard transition-colors"
              >
                {opt}
              </button>

            ))}

          </div>
        </>


      ) : (

        <>
          <h2 className="text-2xl text-blue font-saigon2 mb-4">
            Nhập số điện thoại để quay số nhận ưu đãi
          </h2>


          <input
            placeholder="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-3 rounded-lg border-2 border-blue mb-4 w-full max-w-sm"
          />


          {error && (
            <p className="text-tomato font-bold mb-4">
              {error}
            </p>
          )}


          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className="bg-tomato text-white px-8 py-4 rounded-full font-bold disabled:opacity-60"
          >
            {isSpinning ? "Đang quay..." : "Quay số ngay"}
          </button>

        </>

      )}

    </div>
  );
}