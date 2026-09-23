import { ArrowRight, ArrowUpRight, Check, Flame, MoveUpRight, Target, Zap } from "lucide-react";
import { benefits, methods, steps } from "@/data/marketing";

function SectionHeading({ kicker, title, description, id }: { kicker: string; title: string; description?: string; id?: string }) {
  return <div className="section-heading"><p className="eyebrow">{kicker}</p><h2 id={id}>{title}</h2>{description && <p>{description}</p>}</div>;
}

export function Benefits() {
  return <section className="benefits-section page-width" aria-label="Điều làm việc học dễ bắt đầu">
    <div className="benefits-intro"><span>HỌC NHẸ HƠN</span><ArrowRight size={19} aria-hidden="true" /></div>
    <div className="benefit-list">{benefits.map((item) => <article className="benefit-item" key={item.title}><span className="benefit-glyph" aria-hidden="true">{item.icon}</span><h3>{item.title}</h3><p>{item.detail}</p></article>)}</div>
  </section>;
}

export function Experience() {
  return <section className="section-block page-width" id="experience" aria-labelledby="experience-title">
    <div className="section-heading"><p className="eyebrow">TRẢI NGHIỆM ZHONGLISH</p><h2 id="experience-title">Ngoại ngữ không cần bắt đầu bằng một cuốn giáo trình dày.</h2><p>Từng bước vừa đủ để bạn hiểu, thử và muốn học tiếp.</p></div>
    <div className="experience-grid">
      <div className="experience-small-grid">
        <article className="experience-tile"><span className="tile-icon">↗</span><h3>Bắt đầu ngay</h3><p>Không cần hiểu A1 hay HSK là gì.</p></article>
        <article className="experience-tile"><span className="tile-icon">◌</span><h3>Học bằng tình huống</h3><p>Những từ và câu dùng được ngoài đời.</p></article>
        <article className="experience-tile"><span className="tile-icon">✳</span><h3>Tiến bộ từng chút</h3><p>Một bài học nhỏ, một bước đi tiếp.</p></article>
        <article className="experience-tile"><span className="tile-icon">♡</span><h3>Sai cũng là học</h3><p>Phản hồi rõ ràng, không làm bạn nản.</p></article>
      </div>
      <div className="experience-feature"><span className="feature-label">HỌC THEO CÁCH CỦA BẠN</span><div className="feature-path"><span>Nghe</span><span>Nhìn</span><span>Chọn</span><span>Nói</span><span>Nhớ</span></div><p>Không phải học tất cả cùng lúc. Bạn chỉ cần biết bước tiếp theo.</p><div className="feature-orb">中<span>hi!</span></div></div>
    </div>
  </section>;
}

export function HowItWorks() {
  return <section className="section-block page-width" id="how-it-works" aria-labelledby="steps-title">
    <SectionHeading id="steps-title" kicker="CHỈ BA BƯỚC" title="Bắt đầu dễ. Đi tiếp rõ ràng." description="Từ lựa chọn đầu tiên đến bài học mỗi ngày, mọi thứ đều vừa đủ." />
    <div className="steps-grid">{steps.map((step, index) => <article className="step-card" key={step.number}><div className="step-top"><span>{step.number}</span><MoveUpRight size={24} aria-hidden="true" /></div><div className={`step-graphic step-graphic-${index + 1}`} aria-hidden="true">{index === 0 ? "A  中" : index === 1 ? "05:00" : "↗"}</div><h3>{step.title}</h3><p>{step.description}</p></article>)}</div>
  </section>;
}

export function ProgressAndMethod() {
  return <>
    <section className="progress-section page-width" aria-labelledby="progress-title">
      <div><p className="eyebrow">TIẾN BỘ MỖI NGÀY</p><h2 id="progress-title">Một chút hôm nay.<br />Vững hơn ngày mai.</h2><p>XP, chuỗi ngày học và mục tiêu hằng ngày sẽ giúp bạn nhận ra mình đang đi xa hơn. Đây là bản xem trước trải nghiệm sắp có.</p></div>
      <div className="progress-visual" aria-label="Bản xem trước các yếu tố theo dõi tiến độ"><div className="progress-chip"><Flame size={25} aria-hidden="true" /><span>Chuỗi ngày học</span><strong>Tiếp tục mỗi ngày</strong></div><div className="progress-chip"><Zap size={25} aria-hidden="true" /><span>Điểm học tập</span><strong>Ghi nhận nỗ lực</strong></div><div className="progress-chip"><Target size={25} aria-hidden="true" /><span>Mục tiêu nhỏ</span><strong>Dễ bắt đầu lại</strong></div></div>
    </section>
    <section className="section-block page-width method-section" aria-labelledby="method-title"><SectionHeading id="method-title" kicker="CÁCH HỌC" title="Dùng nhiều giác quan. Ghi nhớ tự nhiên hơn." /><div className="method-grid">{methods.map((method) => <article className="method-card" key={method.title}><span aria-hidden="true">{method.glyph}</span><h3>{method.title}</h3><p>{method.description}</p></article>)}</div><div className="method-footnote"><Check size={18} aria-hidden="true" /> Với 中文, bạn sẽ làm quen với chữ Hán, Pinyin, âm thanh và nghĩa của từ.</div></section>
  </>;
}

export function Trust() {
  return <section className="trust-section page-width"><span className="eyebrow">DÀNH CHO NGƯỜI MỚI THẬT SỰ</span><h2>Không thuộc từ vựng? Không sao.<br />Chưa dám nói? Mình bắt đầu từ đó.</h2><p>Zhonglish được xây quanh những khó khăn thường gặp khi bắt đầu học ngoại ngữ: không biết học gì trước, sợ sai, và thiếu thời gian. Không có con số hay lời chứng thực bịa đặt ở đây.</p></section>;
}

export function FinalCTA() {
  return <section className="final-cta page-width" aria-labelledby="final-title"><div className="final-orbit" aria-hidden="true">A <span>中</span></div><p className="eyebrow">BẮT ĐẦU TỪ HÔM NAY</p><h2 id="final-title">Một ngôn ngữ mới có thể bắt đầu từ vài phút.</h2><a className="action-primary" href="#languages">Chọn ngôn ngữ <ArrowUpRight size={19} aria-hidden="true" /></a></section>;
}

export function Footer() {
  return <footer className="footer page-width"><div><a href="#top" className="footer-brand">✳ Zhonglish</a><p>English + Chinese cho người mới bắt đầu.</p></div><nav aria-label="Điều hướng chân trang"><a href="#experience">Trải nghiệm</a><a href="#how-it-works">Cách học</a><a href="#languages">Ngôn ngữ</a><a href="#faq">FAQ</a><a href="https://github.com/Nhutduyasda/Zhonglish" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={15} aria-hidden="true" /></a></nav><small>© Zhonglish</small></footer>;
}
