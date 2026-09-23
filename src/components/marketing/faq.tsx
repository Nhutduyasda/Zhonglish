import { Plus } from "lucide-react";
import { faqs } from "@/data/marketing";

export function FAQ() {
  return <section className="section-block page-width faq-section" id="faq" aria-labelledby="faq-title"><div className="section-heading"><p className="eyebrow">GIẢI ĐÁP</p><h2 id="faq-title">Bạn đang thắc mắc?</h2><p>Một vài điều cần biết trước khi bắt đầu.</p></div><div className="faq-list">{faqs.map((item) => <details key={item.question}><summary>{item.question}<Plus size={21} aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div></section>;
}
