import { outerCardClass } from "../lib/styles";
import { Description, SubHeading } from "./Elements";





export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Browse our plants",
      body: "Filter by continent of origin or shade requirements to find what suits your garden.",
      href: "#step-1",
    },
    {
      number: "2",
      title: "Upload a photo",
      body: "Take a photo of the space you want to plant in — a garden bed, a corner of your yard, or a balcony — and upload it here.",
      href: "#step-2",
    },
    {
      number: "3",
      title: "See your garden come to life",
      body: "Our AI will show you exactly what your selected plants will look like in your space, freshly planted and again five years from now.",
      href: "#step-3",
    },
  ];

  return (
    <>    
    <SubHeading>How it works</SubHeading>
      <Description>Plan your garden in three simple steps before you buy.</Description>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {steps.map((s) => (
          <a key={s.number} href={s.href} className="bg-stone-50 rounded-xl p-4 border border-stone-200 transition-colors block">
            <svg width="28" height="28" viewBox="0 0 28 28" className="mb-3 flex-shrink-0">
              <circle cx="14" cy="14" r="14" fill="#15803d" />
              <text x="14" y="14" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="14" fontWeight="bold">{s.number}</text>
            </svg>
            <p className="font-semibold text-green-900 mb-1">{s.title}</p>
            <p className="text-sm text-stone-500 leading-relaxed">{s.body}</p>
          </a>
        ))}
      </div>
    </>
  );
}
