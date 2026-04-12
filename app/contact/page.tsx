// /contact ページ本体（Server Component）
// 訪問者向けの公開問い合わせフォームを配置するだけの薄い入れ物
import ContactForm from "./ContactForm";

export default function ContactPage() {
  return (
    <main className="max-w-md mx-auto px-4 py-12">
      {/* 見出しと説明を中央揃え */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800">お問い合わせ</h1>
        <p className="text-slate-500 mt-2">
          ご質問やご相談はこちらからお気軽にどうぞ
        </p>
      </div>
      <ContactForm />
    </main>
  );
}
