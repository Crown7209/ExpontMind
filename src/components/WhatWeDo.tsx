const services = [
  {
    number: "01",
    title: "AI-Powered Solutions",
    tagline: "Automation\nthat thinks",
    details: "Smart systems, adaptive AI",
  },
  {
    number: "02",
    title: "Interactive & 3D Web",
    tagline: "Web that\nmoves you",
    details: "WebGL, realtime interaction",
  },
  {
    number: "03",
    title: "Product & Experience Design",
    tagline: "Clarity in\nevery click",
    details: "Minimal UI/UX, seamless flow",
  },
  {
    number: "04",
    title: "Creative Development",
    tagline: "Engineered\nbeauty",
    details: "Custom builds, refined motion",
  },
];

interface ServiceCardProps {
  service: (typeof services)[0];
  alignRight?: boolean;
}

function ServiceCard({ service, alignRight = false }: ServiceCardProps) {
  return (
    <div className="group relative">
      <div
        className={`p-8 md:p-12 lg:p-16 h-full flex flex-col min-h-[50vh] transition-all duration-500 ${
          alignRight ? "items-end" : ""
        }`}
      >
        <div className="flex gap-8 ">
          <div
            className={`border rotate-45 group-hover:rotate-225 w-[56px] h-[56px] flex items-center justify-center transition-all duration-500 border-blue-400`}
          >
            <p className="text-lg font-light group-hover:-rotate-225 text-white -rotate-45 transition-all duration-500">
              {service.number}
            </p>
          </div>

          <div className="py-4">
            <p
              className={`text-sm tracking-[0.2em] uppercase mb-6 transition-all duration-500 text-white/50`}
            >
              {service.title}
            </p>

            {/* Tagline */}
            <div className="flex-1 flex items-start">
              <p
                className={`text-3xl md:text-4xl lg:text-5xl font-light leading-tight whitespace-pre-line transition-all duration-500 text-white uppercase`}
              >
                {service.tagline}
              </p>
            </div>

            {/* Details */}
            <p className={`text-xs tracking-wider mt-6 text-white/50`}>
              — {service.details}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WhatWeDo() {
  return (
    <div className="relative z-10 min-h-screen w-full px-24 py-16">
      {services.map((service, index) => (
        <ServiceCard
          key={service.number}
          service={service}
          alignRight={index === 1 || index === 3}
        />
      ))}
    </div>
  );
}

export default WhatWeDo;
