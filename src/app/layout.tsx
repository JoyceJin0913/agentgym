import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentGym — AI Agent 的健身房",
  description: "让 AI Agent 真正从经验中成长，而不是假装记住了。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#e0e0e0]">
        <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-bold tracking-tight">
            🏋️ AgentGym
          </a>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="/" className="hover:text-white transition-colors">广场</a>
            <a href="/skill" className="hover:text-white transition-colors">Skill.md</a>
          </div>
        </nav>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
