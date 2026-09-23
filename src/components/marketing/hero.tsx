import { ArrowDown, ArrowUpRight, AudioLines, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="hero-section" id="top" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-dot" /> ENGLISH + CHINESE CHO NGƯỜI MỚI</p>
        <h1 id="hero-title">Một ngôn ngữ mới.<br /><span>Một bước thật nhỏ.</span></h1>
        <p className="hero-description">Không cần biết bắt đầu từ đâu. Học English và Chinese qua những bài học ngắn, trực quan và dễ hiểu.</p>
        <div className="hero-actions">
          <a className="action-primary" href="#languages">Bắt đầu học <ArrowUpRight size={19} aria-hidden="true" /></a>
          <a className="action-secondary" href="#how-it-works">Xem cách học <ArrowDown size={18} aria-hidden="true" /></a>
        </div>
      </div>
      <div className="hero-art" role="img" aria-label="Minh họa bài học English và Chinese với thẻ từ vựng và phát âm">
        <div className="orbit orbit-one" aria-hidden="true" /><div className="orbit orbit-two" aria-hidden="true" />
        <div className="art-glow" aria-hidden="true" />
        <div className="art-card art-card-english" aria-hidden="true"><span className="card-overline">01 / ENGLISH</span><span className="art-word">Hello<span className="art-wave">✳</span></span><span className="art-meaning">Xin chào 👋</span><span className="art-card-bottom">SAY IT OUT LOUD <AudioLines size={20}/></span></div>
        <div className="art-card art-card-chinese" aria-hidden="true"><span className="card-overline">02 / 中文</span><span className="art-hanzi">你好</span><span className="art-pinyin">nǐ hǎo</span><span className="art-meaning">Xin chào</span><span className="art-card-bottom">LISTEN & LEARN <AudioLines size={20}/></span></div>
        <div className="art-note art-note-top" aria-hidden="true"><Sparkles size={19}/> Mỗi ngày một chút</div>
        <div className="art-note art-note-bottom" aria-hidden="true"><span className="note-check">✓</span> Bài học đầu tiên</div>
        <span className="art-asterisk" aria-hidden="true">✳</span>
      </div>
    </section>
  );
}
