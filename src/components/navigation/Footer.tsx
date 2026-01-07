"use client";

interface FooterProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function Footer({ className = "", style }: FooterProps) {
  return (
    <footer
      className={`relative w-full min-h-[50vh] bg-[#0a0a0a] z-10 flex flex-col items-center justify-between p-8 font-mono text-[11px] text-[rgba(245,245,245,0.9)] uppercase leading-[1.2] ${className}`}
      style={style}
    >
      <div className="w-full h-full flex flex-col justify-between">
        {/* Main Content */}
        <div className="flex justify-between w-full mb-8">
          {/* Left Column */}
          <div className="flex flex-col gap-[0.15rem] text-[12px]">
            <p>THE DARKNESS</p>
            <p>IS WHERE</p>
            <p>LIGHT IS BORN</p>
            <p>EMPTINESS</p>
            <p>CREATES SPACE</p>
            <p>FOR HEALING</p>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-[0.15rem] text-[12px] text-right max-w-[40%]">
            <p>CREATIVITY FLOWS THROUGH</p>
            <p>INFINITE PATHWAYS</p>
            <p>CONSCIOUSNESS EXPANDS</p>
            <p>INTO BOUNDLESS REALMS</p>
            <p>OF LIGHT AND POSSIBILITY</p>
            <p>WHERE HEALING BECOMES ART</p>
          </div>
        </div>

        {/* Credits */}
        <div className="text-[10px] tracking-[0.7em] text-[rgba(245,245,245,0.6)] mb-4">
          <p>
            Design & Development by{" "}
            <a
              href="https://expontmind.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[rgba(245,245,245,0.9)] no-underline hover:opacity-70 transition-opacity"
            >
              EXPONT MIND
            </a>
          </p>
        </div>
      </div>

      {/* Bottom SVG/Logo Section */}
      <div className="w-full mt-8">
        <div className="w-full flex items-center justify-center">
          <svg
            viewBox="0 0 800 100"
            className="w-full max-w-4xl h-auto"
            fill="rgba(245, 245, 245, 0.9)"
          >
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              className="font-mono text-[72px] uppercase tracking-[0.3em]"
              style={{ fontSize: "72px" }}
            >
              EXPONT MIND
            </text>
          </svg>
        </div>
      </div>

      {/* Bottom Links */}
      <div className="w-full flex justify-between items-center mt-8 pt-4 border-t border-white/10">
        <div className="flex gap-8 text-[10px] tracking-[0.1em]">
          <a
            href="#"
            className="text-[rgba(245,245,245,0.6)] no-underline hover:text-[rgba(245,245,245,0.9)] transition-colors"
          >
            PRIVACY
          </a>
          <a
            href="#"
            className="text-[rgba(245,245,245,0.6)] no-underline hover:text-[rgba(245,245,245,0.9)] transition-colors"
          >
            TERMS
          </a>
          <a
            href="#"
            className="text-[rgba(245,245,245,0.6)] no-underline hover:text-[rgba(245,245,245,0.9)] transition-colors"
          >
            COOKIES
          </a>
        </div>

        <div className="flex gap-8 text-[10px] tracking-[0.1em]">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[rgba(245,245,245,0.6)] no-underline hover:text-[rgba(245,245,245,0.9)] transition-colors"
          >
            TWITTER
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[rgba(245,245,245,0.6)] no-underline hover:text-[rgba(245,245,245,0.9)] transition-colors"
          >
            INSTAGRAM
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[rgba(245,245,245,0.6)] no-underline hover:text-[rgba(245,245,245,0.9)] transition-colors"
          >
            LINKEDIN
          </a>
        </div>

        <div className="text-[10px] tracking-[0.1em] text-[rgba(245,245,245,0.4)]">
          © {new Date().getFullYear()} EXPONT MIND
        </div>
      </div>
    </footer>
  );
}
