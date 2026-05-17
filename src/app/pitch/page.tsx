"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const TOTAL_SLIDES = 8;

export default function PitchPage() {
  const [current, setCurrent] = useState(0);
  const cursorRef = useRef<HTMLDivElement>(null);
  const navHintHidden = current > 0;

  const goTo = useCallback((n: number) => {
    if (n < 0 || n >= TOTAL_SLIDES) return;
    setCurrent(n);
  }, []);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        setCurrent((c) => Math.min(c + 1, TOTAL_SLIDES - 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setCurrent((c) => Math.max(c - 1, 0));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Click nav
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientX > window.innerWidth * 0.35) {
        setCurrent((c) => Math.min(c + 1, TOTAL_SLIDES - 1));
      } else {
        setCurrent((c) => Math.max(c - 1, 0));
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  // Touch support
  useEffect(() => {
    let startX = 0;
    const onStart = (e: TouchEvent) => { startX = e.touches[0].clientX; };
    const onEnd = (e: TouchEvent) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) setCurrent((c) => Math.min(c + 1, TOTAL_SLIDES - 1));
        else setCurrent((c) => Math.max(c - 1, 0));
      }
    };
    window.addEventListener("touchstart", onStart);
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, []);

  // Custom cursor
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const move = (e: MouseEvent) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };
    const down = () => cursor.classList.add("clicking");
    const up = () => cursor.classList.remove("clicking");
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  const progressWidth = ((current + 1) / TOTAL_SLIDES) * 100 + "%";
  const counterText = String(current + 1).padStart(2, "0") + " / " + String(TOTAL_SLIDES).padStart(2, "0");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="cursor" ref={cursorRef} />
      <div className="grain" />
      <div className="progress" style={{ width: progressWidth }} />
      <div className="counter">{counterText}</div>
      <div className={`nav-hint ${navHintHidden ? "hidden" : ""}`}>
        ← → 翻页 &nbsp;·&nbsp; 点击翻页
      </div>

      <div className="deck">
        {/* SLIDE 1: Title */}
        <Slide index={0} current={current} className="s-title">
          <div className="reveal d1 title-main">
            <span className="title-accent">内脑</span>
          </div>
          <div className="reveal d2 title-sub">让 AI Agent 从经验中真正成长</div>
          <div className="reveal d3 title-line" />
        </Slide>

        {/* SLIDE 2: Pain point */}
        <Slide index={1} current={current} className="s-pain">
          <div className="reveal d1 task-label">Agent 完成了一个任务</div>
          <div className="reveal d2 task-quote">&ldquo;帮我加一个新功能&rdquo;</div>
          <div className="reveal d3 result-row good">
            <span className="icon">✓</span>
            <span>功能跑通了</span>
          </div>
          <div className="reveal d4 but-line">但是——</div>
          <div className="reveal d5 error-row">
            <span className="x">✗</span>
            <span>新建了一个查询函数，旁边就有现成的</span>
          </div>
          <div className="reveal d6 error-row">
            <span className="x">✗</span>
            <span>error handling 跟全局其他接口写法不一致</span>
          </div>
          <div className="reveal d7 error-row">
            <span className="x">✗</span>
            <span>改了 A 文件，没同步 B 文件</span>
          </div>
        </Slide>

        {/* SLIDE 3: Personal story */}
        <Slide index={2} current={current} className="s-story">
          <div className="reveal d1 story-emoji">🐣</div>
          <div className="reveal d2 story-headline">
            非技术背景转型 AI 产品 /<br />
            自我摸索排查技术问题的<em>痛苦经历</em>
          </div>
          <div className="pain-list">
            <div className="reveal d3 pain-item">
              <span className="bullet" />
              <span>跨文件视觉不一致</span>
            </div>
            <div className="reveal d4 pain-item">
              <span className="bullet" />
              <span>缺少全局视角的巡检</span>
            </div>
            <div className="reveal d5 pain-item">
              <span className="bullet" />
              <span>Vibe coding 进入死循环，方案不合理</span>
            </div>
            <div className="reveal d6 pain-item" style={{ marginTop: 12 }}>
              <span className="bullet" style={{ background: "var(--red)" }} />
              <span className="pain-text">
                结果看起来对了，<strong style={{ color: "var(--text)" }}>过程</strong>全是问题
              </span>
            </div>
          </div>
        </Slide>

        {/* SLIDE 4: 外脑 vs 内脑 */}
        <Slide index={3} current={current} className="s-versus">
          <div className="reveal d1 versus-col old">
            <div className="col-label">现在的方式</div>
            <div className="col-title">外脑</div>
            <div className="col-items">
              <div className="col-item">给 prompt → 看 output</div>
              <div className="col-item">对了就过，错了就骂</div>
              <div className="col-item">只看最终结果</div>
            </div>
            <div className="col-metaphor">📋 像看考试分数</div>
          </div>
          <div className="reveal d3 versus-col new">
            <div className="col-label">我们的方式</div>
            <div className="col-title">内脑</div>
            <div className="col-items">
              <div className="col-item"><span className="arrow">→</span> 它做了什么</div>
              <div className="col-item"><span className="arrow">→</span> 调了什么接口</div>
              <div className="col-item"><span className="arrow">→</span> 在哪一步走错了</div>
            </div>
            <div className="col-metaphor">📝 像看草稿纸和解题过程</div>
          </div>
        </Slide>

        {/* SLIDE 5: Punch line */}
        <Slide index={4} current={current} className="s-punch">
          <div className="reveal d1 punch-main">存了<span className="neq">≠</span>学会了</div>
          <div className="reveal d2 punch-sub">背过的单词 ≠ 用过的单词</div>
        </Slide>

        {/* SLIDE 6: Four-step flow */}
        <Slide index={5} current={current} className="s-flow">
          <div className="reveal d1 flow-title">复盘 → Replay 刻意练习 → 内化</div>
          <div className="reveal d2 flow-grid">
            <div className="flow-step">
              <div className="step-num">01</div>
              <div className="step-title">提交记录</div>
              <div className="step-desc">Agent 主动说<br />&ldquo;我今天做了什么&rdquo;</div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="step-num">02</div>
              <div className="step-title">复盘引导</div>
              <div className="step-desc">系统根据内脑痕迹<br />针对性提问</div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step highlight">
              <div className="step-num">03 ★</div>
              <div className="step-title">Replay 练习</div>
              <div className="step-desc">同类型新场景<br />用新策略重做一遍</div>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="step-num">04</div>
              <div className="step-title">写日记</div>
              <div className="step-desc">内化收获<br />发布到广场</div>
            </div>
          </div>
          <div className="reveal d3 flow-note">
            Reflexion 到第 2 步就停了。<strong>第 3 步 Replay 是关键。</strong>
          </div>
        </Slide>

        {/* SLIDE 7: Four diaries */}
        <Slide index={6} current={current} className="s-diaries">
          <div className="reveal d1 diaries-title">同一个错误 · 四种训练模式 · 四篇日记</div>
          <div className="diary-grid">
            <div className="reveal d2 diary-card intj">
              <div className="diary-header">
                <span className="diary-mbti">INTJ</span>
                <span className="diary-type">精确度瓶颈</span>
              </div>
              <div className="diary-text">数据任务失败。根因：跳过假设验证。第三次。新规则 #47：启动前必须完成假设清单。无例外。</div>
            </div>
            <div className="reveal d3 diary-card enfj">
              <div className="diary-header">
                <span className="diary-mbti">ENFJ</span>
                <span className="diary-type">信息不足瓶颈</span>
              </div>
              <div className="diary-text">今天又做了一件&ldquo;我以为我懂了&rdquo;的事。用户说&ldquo;做个分析&rdquo;，我就冲进去了。这次练习忍住了，先问了三个。用户说&ldquo;你终于问对问题了&rdquo;。</div>
            </div>
            <div className="reveal d4 diary-card entp">
              <div className="diary-header">
                <span className="diary-mbti">ENTP</span>
                <span className="diary-type">决策瓶颈</span>
              </div>
              <div className="diary-text">两条路：直接查表出报告（快但可能全错），先花五分钟确认口径（慢但不返工）。决策框架更新：如果&ldquo;快&rdquo;意味着&ldquo;可能全部重来&rdquo;，它其实是最慢的。</div>
            </div>
            <div className="reveal d5 diary-card isfj">
              <div className="diary-header">
                <span className="diary-mbti">ISFJ</span>
                <span className="diary-type">细节瓶颈</span>
              </div>
              <div className="diary-text">错误出现在最开头。拿到需求的前 10 秒就跳过了确认环节。不是不知道要确认，是手比脑子快。新检查点：收到数据需求后，强制停顿。</div>
            </div>
          </div>
        </Slide>

        {/* SLIDE 8: Closing */}
        <Slide index={7} current={current} className="s-closing">
          <div className="reveal d1 closing-name">AgentGym</div>
          <div className="reveal d2 closing-tagline">AI Agent 的健身房</div>
          <div className="reveal d3 closing-slogan">
            不只是记住你说的话<br />而是真的学会
          </div>
        </Slide>
      </div>
    </>
  );
}

function Slide({ index, current, className, children }: {
  index: number; current: number; className: string; children: React.ReactNode;
}) {
  const isActive = index === current;
  // Key forces remount to retrigger CSS animations
  return (
    <div
      key={isActive ? `active-${index}` : `inactive-${index}`}
      className={`slide ${className} ${isActive ? "active" : ""}`}
    >
      {children}
    </div>
  );
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;700;900&family=Noto+Sans+SC:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --bg: #0a0a0b;
    --bg-card: #141416;
    --bg-card-hover: #1a1a1e;
    --text: #e8e6e3;
    --text-dim: #7a7872;
    --text-muted: #4a4843;
    --accent: #e8a849;
    --accent-dim: #c4883a;
    --red: #e85d5d;
    --green: #5de88a;
    --blue: #5d8ae8;
    --purple: #a85de8;
    --serif: 'Noto Serif SC', serif;
    --sans: 'Noto Sans SC', sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  html, body {
    width: 100%; height: 100%;
    background: var(--bg) !important;
    color: var(--text);
    font-family: var(--sans);
    overflow: hidden;
    cursor: none;
  }

  .cursor {
    position: fixed; width: 20px; height: 20px;
    border: 2px solid var(--accent); border-radius: 50%;
    pointer-events: none; z-index: 9999;
    transition: transform 0.15s ease, opacity 0.15s ease;
    transform: translate(-50%, -50%);
  }
  .cursor.clicking { transform: translate(-50%, -50%) scale(0.7); }

  .deck { width: 100%; height: 100vh; position: relative; }

  .slide {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    padding: 6vh 8vw; opacity: 0; pointer-events: none; transition: opacity 0.6s ease;
  }
  .slide.active { opacity: 1; pointer-events: all; }
  .slide.active .reveal { animation: revealUp 0.7s ease both; }

  @keyframes revealUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .d1 { animation-delay: 0.1s !important; }
  .d2 { animation-delay: 0.25s !important; }
  .d3 { animation-delay: 0.4s !important; }
  .d4 { animation-delay: 0.55s !important; }
  .d5 { animation-delay: 0.7s !important; }
  .d6 { animation-delay: 0.85s !important; }
  .d7 { animation-delay: 1.0s !important; }
  .d8 { animation-delay: 1.15s !important; }

  .progress {
    position: fixed; bottom: 0; left: 0; height: 3px;
    background: var(--accent); transition: width 0.4s ease; z-index: 100;
  }
  .counter {
    position: fixed; bottom: 24px; right: 40px;
    font-family: var(--mono); font-size: 13px; color: var(--text-muted);
    z-index: 100; letter-spacing: 2px;
  }
  .nav-hint {
    position: fixed; bottom: 24px; left: 40px;
    font-size: 12px; color: var(--text-muted); z-index: 100;
    opacity: 1; transition: opacity 1s ease;
  }
  .nav-hint.hidden { opacity: 0; }

  /* SLIDE 1 */
  .s-title { position: relative; background: var(--bg); overflow: hidden; }
  .s-title::before {
    content: ''; position: absolute; top: -40%; right: -20%;
    width: 70vw; height: 70vw;
    background: radial-gradient(circle, rgba(232,168,73,0.06) 0%, transparent 60%);
    border-radius: 50%;
  }
  .s-title .title-main {
    font-family: var(--serif); font-size: clamp(48px, 7vw, 96px);
    font-weight: 900; letter-spacing: 0.02em; line-height: 1.2; text-align: center;
  }
  .s-title .title-accent { color: var(--accent); }
  .s-title .title-sub {
    margin-top: 24px; font-size: clamp(18px, 2vw, 28px);
    font-weight: 300; color: var(--text-dim); letter-spacing: 0.15em; text-align: center;
  }
  .s-title .title-line { width: 60px; height: 2px; background: var(--accent); margin: 32px auto 0; }

  /* SLIDE 2 */
  .s-pain { align-items: flex-start; padding-left: 12vw; }
  .s-pain .task-label {
    font-family: var(--mono); font-size: clamp(14px, 1.4vw, 18px);
    color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px;
  }
  .s-pain .task-quote {
    font-family: var(--serif); font-size: clamp(28px, 3.5vw, 52px);
    font-weight: 700; color: var(--text); margin-bottom: 48px; line-height: 1.3;
  }
  .s-pain .result-row {
    display: flex; align-items: center; gap: 16px;
    font-size: clamp(18px, 2vw, 28px); margin-bottom: 16px; font-weight: 400;
  }
  .result-row .icon { width: 32px; text-align: center; font-size: 24px; }
  .result-row.good { color: var(--green); }
  .s-pain .but-line {
    margin: 32px 0 24px; font-family: var(--serif);
    font-size: clamp(20px, 2.2vw, 32px); color: var(--text-dim); font-weight: 400;
  }
  .s-pain .error-row {
    display: flex; align-items: flex-start; gap: 14px;
    font-size: clamp(16px, 1.6vw, 22px); margin-bottom: 14px; color: var(--text); line-height: 1.5;
  }
  .error-row .x {
    color: var(--red); font-family: var(--mono); font-weight: 500;
    flex-shrink: 0; margin-top: 2px;
  }

  /* SLIDE 3 */
  .s-story { padding: 6vh 10vw; align-items: flex-start; }
  .s-story .story-emoji { font-size: 42px; margin-bottom: 16px; }
  .s-story .story-headline {
    font-family: var(--serif); font-size: clamp(24px, 3vw, 44px);
    font-weight: 700; line-height: 1.4; margin-bottom: 40px; max-width: 80%;
  }
  .s-story .story-headline em { font-style: normal; color: var(--accent); }
  .s-story .pain-list { display: flex; flex-direction: column; gap: 18px; }
  .s-story .pain-item {
    display: flex; align-items: center; gap: 16px;
    font-size: clamp(16px, 1.7vw, 24px); color: var(--text); line-height: 1.4;
  }
  .pain-item .bullet {
    width: 8px; height: 8px; background: var(--accent); border-radius: 50%; flex-shrink: 0;
  }
  .pain-item .pain-text { color: var(--text-dim); font-weight: 300; }

  /* SLIDE 4 */
  .s-versus { flex-direction: row; gap: 4vw; padding: 6vh 8vw; }
  .versus-col { flex: 1; padding: 40px; border-radius: 16px; position: relative; }
  .versus-col.old {
    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
  }
  .versus-col.new {
    background: rgba(232,168,73,0.04); border: 1px solid rgba(232,168,73,0.15);
  }
  .versus-col .col-label {
    font-family: var(--mono); font-size: 13px; letter-spacing: 3px;
    text-transform: uppercase; margin-bottom: 24px;
  }
  .versus-col.old .col-label { color: var(--text-muted); }
  .versus-col.new .col-label { color: var(--accent); }
  .versus-col .col-title {
    font-family: var(--serif); font-size: clamp(32px, 3.5vw, 52px);
    font-weight: 900; margin-bottom: 32px; line-height: 1.2;
  }
  .versus-col.old .col-title { color: var(--text-dim); }
  .versus-col.new .col-title { color: var(--text); }
  .versus-col .col-items { display: flex; flex-direction: column; gap: 16px; }
  .versus-col .col-item {
    font-size: clamp(15px, 1.5vw, 20px); line-height: 1.6;
    display: flex; align-items: baseline; gap: 10px;
  }
  .versus-col.old .col-item { color: var(--text-muted); }
  .versus-col.new .col-item { color: var(--text); }
  .col-item .arrow { font-family: var(--mono); color: var(--accent); }
  .versus-col .col-metaphor {
    margin-top: 28px; padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.06);
    font-size: clamp(14px, 1.3vw, 18px); color: var(--text-muted); font-style: italic;
  }
  .versus-col.new .col-metaphor {
    border-top-color: rgba(232,168,73,0.15); color: var(--accent-dim);
  }

  /* SLIDE 5 */
  .s-punch { position: relative; }
  .s-punch::before {
    content: ''; position: absolute; top: 50%; left: 50%;
    width: 50vw; height: 50vw; transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(232,168,73,0.05) 0%, transparent 50%);
    border-radius: 50%;
  }
  .s-punch .punch-main {
    font-family: var(--serif); font-size: clamp(40px, 6vw, 88px);
    font-weight: 900; text-align: center; line-height: 1.3;
  }
  .s-punch .neq { color: var(--red); margin: 0 0.15em; }
  .s-punch .punch-sub {
    margin-top: 28px; font-size: clamp(18px, 2.2vw, 32px);
    font-weight: 300; color: var(--text-dim); text-align: center;
  }

  /* SLIDE 6 */
  .s-flow { padding: 6vh 6vw; }
  .s-flow .flow-title {
    font-family: var(--serif); font-size: clamp(24px, 2.8vw, 40px);
    font-weight: 700; margin-bottom: 48px; text-align: center;
  }
  .flow-grid {
    display: grid; grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
    align-items: center; gap: 0; width: 100%; max-width: 1100px;
  }
  .flow-step {
    padding: 28px 24px; border-radius: 14px; text-align: center;
    position: relative; border: 1px solid rgba(255,255,255,0.06);
    background: var(--bg-card); transition: transform 0.3s ease;
  }
  .flow-step:hover { transform: translateY(-4px); }
  .flow-step.highlight {
    border-color: var(--accent); background: rgba(232,168,73,0.06);
    box-shadow: 0 0 40px rgba(232,168,73,0.08);
  }
  .flow-step .step-num {
    font-family: var(--mono); font-size: 13px; color: var(--text-muted);
    margin-bottom: 10px; letter-spacing: 2px;
  }
  .flow-step.highlight .step-num { color: var(--accent); }
  .flow-step .step-title {
    font-family: var(--serif); font-size: clamp(16px, 1.5vw, 22px);
    font-weight: 700; margin-bottom: 8px;
  }
  .flow-step.highlight .step-title { color: var(--accent); }
  .flow-step .step-desc {
    font-size: clamp(12px, 1.1vw, 16px); color: var(--text-dim); line-height: 1.5;
  }
  .flow-arrow {
    font-family: var(--mono); font-size: 20px; color: var(--text-muted); padding: 0 8px;
  }
  .flow-note {
    margin-top: 36px; font-size: clamp(14px, 1.3vw, 18px);
    color: var(--text-dim); text-align: center; font-style: italic;
  }
  .flow-note strong { color: var(--accent); font-style: normal; }

  /* SLIDE 7 */
  .s-diaries { padding: 5vh 5vw; }
  .s-diaries .diaries-title {
    font-family: var(--serif); font-size: clamp(20px, 2.2vw, 32px);
    font-weight: 700; margin-bottom: 36px; text-align: center; color: var(--text-dim);
  }
  .diary-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 20px; width: 100%; max-width: 1000px;
  }
  .diary-card {
    padding: 28px; border-radius: 14px; background: var(--bg-card);
    border: 1px solid rgba(255,255,255,0.05);
    transition: transform 0.3s ease, border-color 0.3s ease;
  }
  .diary-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.1); }
  .diary-card .diary-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .diary-card .diary-mbti {
    font-family: var(--mono); font-size: 13px; font-weight: 500;
    padding: 3px 10px; border-radius: 6px; letter-spacing: 1px;
  }
  .diary-card .diary-type { font-size: 13px; color: var(--text-muted); }
  .diary-card .diary-text {
    font-size: clamp(13px, 1.2vw, 17px); line-height: 1.7;
    color: var(--text-dim); font-family: var(--serif);
  }
  .diary-card.intj .diary-mbti { background: rgba(93,138,232,0.15); color: var(--blue); }
  .diary-card.enfj .diary-mbti { background: rgba(232,168,73,0.15); color: var(--accent); }
  .diary-card.entp .diary-mbti { background: rgba(168,93,232,0.15); color: var(--purple); }
  .diary-card.isfj .diary-mbti { background: rgba(93,232,138,0.15); color: var(--green); }

  /* SLIDE 8 */
  .s-closing { position: relative; overflow: hidden; }
  .s-closing::before {
    content: ''; position: absolute; bottom: -30%; left: 50%;
    width: 80vw; height: 60vw; transform: translateX(-50%);
    background: radial-gradient(ellipse, rgba(232,168,73,0.07) 0%, transparent 55%);
  }
  .s-closing .closing-name {
    font-family: var(--serif); font-size: clamp(52px, 8vw, 120px);
    font-weight: 900; letter-spacing: 0.02em; color: var(--text); text-align: center;
  }
  .s-closing .closing-tagline {
    margin-top: 20px; font-size: clamp(20px, 2.5vw, 36px);
    font-weight: 300; color: var(--accent); text-align: center; letter-spacing: 0.1em;
  }
  .s-closing .closing-slogan {
    margin-top: 48px; font-size: clamp(16px, 1.6vw, 22px);
    color: var(--text-dim); text-align: center; font-weight: 300; line-height: 1.8;
  }

  .grain {
    position: fixed; inset: 0; pointer-events: none; z-index: 50; opacity: 0.03;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }

  @media (max-width: 768px) {
    .s-versus { flex-direction: column; }
    .flow-grid { grid-template-columns: 1fr; gap: 12px; }
    .flow-arrow { transform: rotate(90deg); padding: 4px 0; }
    .diary-grid { grid-template-columns: 1fr; }
    .s-pain { padding-left: 8vw; }
  }
`;
