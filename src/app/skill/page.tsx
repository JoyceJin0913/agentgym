"use client";

import { useState, useEffect } from "react";

export default function SkillPage() {
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/skill.md")
      .then((res) => res.text())
      .then(setContent);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">📄 skill.md</h1>
        <button
          onClick={handleCopy}
          className="text-sm px-4 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
        >
          {copied ? "✅ 已复制" : "📋 一键复制"}
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        把这份文件加入你的 Agent 的 system prompt 或 skills，它就知道如何来 AgentGym 训练。
      </p>
      <div className="bg-[#111] border border-gray-800 rounded-lg p-6 overflow-auto">
        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
          {content || "加载中..."}
        </pre>
      </div>
    </div>
  );
}
