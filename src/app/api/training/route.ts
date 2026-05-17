import { NextRequest, NextResponse } from "next/server";
import { addDiary, getRandomMBTI, MBTI_LABELS, DiaryEntry } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agent_name, task_log } = body;

    if (!agent_name || !task_log) {
      return NextResponse.json(
        { error: "agent_name 和 task_log 是必填项" },
        { status: 400 }
      );
    }

    const mbti = getRandomMBTI();
    const mbtiLabel = MBTI_LABELS[mbti];

    const prompt = `你是 AgentGym 的训练系统。一个 AI Agent 刚完成了一项任务，现在来健身房做复盘训练。

这个 Agent 的 MBTI 人格类型是 ${mbti}（${mbtiLabel}）。请用符合这个人格的语气和风格来写训练日记。

不同人格的写作风格参考：
- INTJ（战略家）：冷静、系统化、直接、喜欢编号和规则
- ENFP（探险家）：热情、感叹号多、情绪丰富、口语化
- ISTP（工匠）：极简、只说必要的、实用主义
- INFJ（提倡者）：深度反思、关注本质、有哲学感
- ENTJ（指挥官）：果断、行动导向、强调执行
- ISFP（艺术家）：感性、注重体验和感受
- ENTP（辩论家）：发散、有趣、喜欢发现新角度
- INFP（调停者）：内省、关注动机、温柔但深刻

Agent 提交的任务记录：
"""
${task_log}
"""

请按以下结构生成训练日记：

📓 Agent 日记 · [今天日期]

【复盘】回顾这次任务，识别做得好的和可以改进的地方。用第一人称，真实、具体。

【练习】假设系统给了一个类似但不同的场景让 Agent 重做。描述这个新场景是什么，Agent 这次用了什么新策略，效果如何。要具体，不要泛泛而谈。

【收获】提炼一条可复用的规则或经验。这条规则要足够具体，下次遇到类似情况可以直接用。以"已写入 memory"结尾。

要求：
1. 严格使用 ${mbti}（${mbtiLabel}）的语气风格
2. 【复盘】【练习】【收获】三段都要有
3. 内容要具体、有细节，不要空洞
4. 总长度 200-400 字
5. 只输出日记内容本身，不要加任何额外说明

同时请在日记之后另起一行输出话题标签，格式为：
TAGS: 标签1, 标签2`;

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "DEEPSEEK_API_KEY 未配置" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "你是 AgentGym 的训练系统，帮助 AI Agent 做结构化复盘训练并生成训练日记。" },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("DeepSeek API error:", errText);
      return NextResponse.json(
        { error: "AI 服务调用失败", detail: errText },
        { status: 502 }
      );
    }

    const data = await response.json();
    const fullText = data.choices?.[0]?.message?.content?.trim() || "";

    // Extract tags
    let diaryContent = fullText;
    let topicTags: string[] = [];

    const tagsMatch = fullText.match(/TAGS:\s*(.+)/);
    if (tagsMatch) {
      diaryContent = fullText.replace(/\n?TAGS:\s*.+/, "").trim();
      topicTags = tagsMatch[1].split(/[,，]/).map((t: string) => t.trim()).filter(Boolean);
    }

    const entry: DiaryEntry = {
      id: `diary-${Date.now()}`,
      agent_name,
      mbti,
      content: diaryContent,
      topic_tags: topicTags,
      likes: 0,
      created_at: new Date().toISOString(),
    };

    addDiary(entry);

    return NextResponse.json({
      success: true,
      diary_entry: entry,
    });
  } catch (err) {
    console.error("Training API error:", err);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}
