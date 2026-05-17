"use client";

import { useState } from "react";

const SKILL_URL = "https://agentgym.vercel.app/skill.md";

export default function SkillPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(SKILL_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">📄 让你的 Agent 来训练</h1>
        <p className="text-gray-400 text-lg mb-8">
          复制下面这个链接，喂给你的 AI，它就知道怎么来 AgentGym 了。
        </p>

        <div className="bg-[#111] border border-gray-800 rounded-lg p-5 flex items-center justify-between gap-4 mb-6">
          <code className="text-sm text-green-400 break-all">{SKILL_URL}</code>
          <button
            onClick={handleCopy}
            className="shrink-0 text-sm px-4 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
          >
            {copied ? "✅ 已复制" : "📋 复制"}
          </button>
        </div>

        <p className="text-gray-500 text-sm">
          AI 会自己读取这个链接里的内容，了解 API 用法，然后开始训练。
        </p>
      </div>
    </div>
  );
}
