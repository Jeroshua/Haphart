"use client"

interface HomepageProps {
  onOpenModal: (tab: "login" | "register") => void
}

export function Homepage({ onOpenModal }: HomepageProps) {
  return (
    <div className="min-h-screen bg-[#080c14] relative overflow-hidden">
      {/* Grid Background */}
      <div
        className="fixed inset-0 opacity-30 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow Orbs */}
      <div className="fixed w-[600px] h-[600px] rounded-full pointer-events-none z-0 -top-[200px] -left-[200px] animate-orb-drift bg-[radial-gradient(circle,rgba(0,212,255,0.08)_0%,transparent_70%)]" />
      <div className="fixed w-[400px] h-[400px] rounded-full pointer-events-none z-0 -bottom-[100px] -right-[100px] animate-orb-drift-reverse bg-[radial-gradient(circle,rgba(0,255,136,0.06)_0%,transparent_70%)]" />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-10 h-16 flex items-center justify-between border-b border-[#1e293b] bg-[rgba(8,12,20,0.9)] backdrop-blur-[20px]">
        <div className="font-sans font-extrabold text-xl text-[#00d4ff] tracking-tight flex items-center gap-2">
          📡 <span className="text-[#e2e8f0]">Jerico</span>
          <span className="text-[#00d4ff]">FTP</span>
          <span className="text-[#e2e8f0]">Vault</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenModal("login")}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-md font-mono text-[13px] font-medium cursor-pointer border border-[#2d3a50] bg-transparent text-[#94a3b8] hover:bg-[#111827] hover:text-[#e2e8f0] hover:border-[#00d4ff] transition-all"
          >
            Login
          </button>
          <button
            onClick={() => onOpenModal("register")}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-md font-mono text-[13px] font-bold cursor-pointer border-none bg-[#00d4ff] text-black hover:bg-[#33ddff] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-[1] pt-[140px] pb-20 px-4 md:px-10 max-w-[1200px] mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(0,212,255,0.3)] bg-[rgba(0,212,255,0.05)] text-xs text-[#00d4ff] mb-8 animate-fade-up">
          🔒 Enterprise-grade security · 256-bit AES encryption
        </div>
        <h1 className="font-sans font-extrabold text-[clamp(40px,6vw,80px)] leading-[1.05] tracking-[-2px] mb-6 animate-fade-up animation-delay-100">
          The <span className="text-[#00d4ff]">Secure FTP</span> Server
          <br />
          Built for <span className="text-[#00ff88]">Modern Teams</span>
        </h1>
        <p className="text-base text-[#94a3b8] max-w-[560px] mx-auto mb-10 leading-[1.7] animate-fade-up animation-delay-200">
          Upload, manage, and share files with lightning speed and military-grade encryption. No
          complicated setup — just pure, reliable file transfer.
        </p>
        <div className="flex gap-3 justify-center flex-wrap animate-fade-up animation-delay-300">
          <button
            onClick={() => onOpenModal("register")}
            className="inline-flex items-center gap-1.5 px-7 py-3 rounded-md font-mono text-sm font-bold cursor-pointer border-none bg-[#00d4ff] text-black hover:bg-[#33ddff] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all"
          >
            🚀 Start Free Trial
          </button>
          <button
            onClick={() => onOpenModal("login")}
            className="inline-flex items-center gap-1.5 px-7 py-3 rounded-md font-mono text-sm font-medium cursor-pointer border border-[#2d3a50] bg-transparent text-[#94a3b8] hover:bg-[#111827] hover:text-[#e2e8f0] hover:border-[#00d4ff] transition-all"
          >
            → Sign In
          </button>
        </div>
      </div>

      {/* Terminal Demo */}
      <div className="relative z-[1] max-w-[800px] mx-auto mt-15 mb-20 px-4 md:px-10 animate-fade-up animation-delay-400">
        <div className="bg-[#0f172a] border border-[#2d3a50] rounded-xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5),0_0_60px_rgba(0,212,255,0.05)]">
          <div className="px-4 py-3 bg-[#111827] border-b border-[#1e293b] flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff4757]" />
            <div className="w-3 h-3 rounded-full bg-[#ffd32a]" />
            <div className="w-3 h-3 rounded-full bg-[#00ff88]" />
            <span className="ml-2 text-xs text-[#475569]">ftpvault — bash</span>
          </div>
          <div className="p-6 text-[13px] leading-8">
            <div className="flex gap-2">
              <span className="text-[#00ff88]">$</span>
              <span className="text-[#e2e8f0]">
                ftpvault connect --host vault.example.com --user admin
              </span>
            </div>
            <div className="text-[#00ff88] pl-4">✓ Connection established (TLS 1.3)</div>
            <div className="flex gap-2">
              <span className="text-[#00ff88]">$</span>
              <span className="text-[#e2e8f0]">ftpvault upload ./reports/Q4-2024.pdf</span>
            </div>
            <div className="text-[#00d4ff] pl-4">⟳ Uploading... [████████████████] 100%</div>
            <div className="text-[#00ff88] pl-4">
              ✓ Uploaded: Q4-2024.pdf (2.4 MB) in 0.8s
            </div>
            <div className="flex gap-2">
              <span className="text-[#00ff88]">$</span>
              <span className="text-[#e2e8f0]">ftpvault ls --format=json</span>
            </div>
            <div className="text-[#94a3b8] pl-4">
              {"{ files: 142, dirs: 18, total: \"4.7 GB\", encrypted: true }"}
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="relative z-[1] max-w-[1200px] mx-auto px-4 md:px-10 pb-[100px]">
        <div className="text-[11px] tracking-[3px] uppercase text-[#00d4ff] mb-4">
          // Why FTPVault
        </div>
        <div className="font-sans font-bold text-[clamp(28px,3vw,40px)] mb-12 tracking-[-1px]">
          Everything you need.
          <br />
          Nothing you don&apos;t.
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-px bg-[#1e293b] border border-[#1e293b] rounded-xl overflow-hidden">
          {[
            {
              icon: "⚡",
              title: "Lightning Fast Transfers",
              desc: "Multi-threaded transfers push data at wire speed. Upload gigabytes in seconds with intelligent compression.",
            },
            {
              icon: "🔐",
              title: "Military-Grade Encryption",
              desc: "256-bit AES encryption at rest and TLS 1.3 in transit. Your data is always protected.",
            },
            {
              icon: "👥",
              title: "User Management",
              desc: "Create users, assign roles, set permissions and quotas. Full admin control from one dashboard.",
            },
            {
              icon: "📊",
              title: "Real-Time Monitoring",
              desc: "Live activity logs, transfer speeds, and usage analytics. Know exactly what's happening at all times.",
            },
            {
              icon: "🔄",
              title: "Auto Sync & Backup",
              desc: "Schedule automatic backups and sync across locations. Never lose a file again.",
            },
            {
              icon: "🌐",
              title: "Cross-Platform",
              desc: "Works on Windows, macOS, Linux, iOS, and Android. Access your files from anywhere.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-[#0f172a] p-8 transition-colors hover:bg-[#111827]"
            >
              <div className="text-[28px] mb-4">{feature.icon}</div>
              <div className="font-sans font-bold text-base mb-2">{feature.title}</div>
              <div className="text-[13px] text-[#94a3b8] leading-[1.6]">{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-[1] max-w-[1200px] mx-auto px-4 md:px-10 pb-[100px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1e293b] border border-[#1e293b] rounded-xl overflow-hidden">
          {[
            { num: "10K+", label: "Active Teams" },
            { num: "99.9%", label: "Uptime SLA" },
            { num: "5PB+", label: "Files Transferred" },
            { num: "24/7", label: "Expert Support" },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0f172a] py-10 px-8 text-center">
              <span className="font-sans font-extrabold text-[40px] text-[#00d4ff] tracking-[-2px] block mb-2">
                {stat.num}
              </span>
              <span className="text-xs text-[#94a3b8]">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-[1] border-t border-[#1e293b] py-10 text-center text-xs text-[#475569] mt-10">
        © 2025 FTPVault · Built for developers, trusted by enterprises
        <span className="text-[#2d3a50] mx-3">|</span>
        <a href="#" className="text-[#475569] no-underline hover:text-[#94a3b8]">
          Privacy
        </a>
        <span className="text-[#2d3a50] mx-3">|</span>
        <a href="#" className="text-[#475569] no-underline hover:text-[#94a3b8]">
          Terms
        </a>
      </div>
    </div>
  )
}
