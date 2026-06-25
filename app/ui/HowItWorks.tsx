import { outerCardClass } from "../lib/styles";
import { Description, SubHeading, StepCircle } from "./Elements";





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
            <StepCircle number={s.number} />
            <p className="font-semibold text-green-900 mb-1">{s.title}</p>
             <Description>{s.body}</Description>
          </a>
        ))}
      </div>
    </>
  );
}
