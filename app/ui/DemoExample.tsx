import { SubHeading } from "./Elements"

export default function DemoExample() {
  const images = [
    { src: "/demo-conversion/before.webp", label: "Your garden today" },
    { src: "/demo-conversion/during.webp", label: "Freshly planted" },
    { src: "/demo-conversion/after.webp", label: "5 years from now" },
  ]

  return (
    <>

      <SubHeading>See it in action</SubHeading>
      <p className="text-sm text-stone-500 mb-6">
        A real example using <span className="text-green-800">Flax Lilly</span> and <span className="text-green-800">2 × Shasta Daisy</span>.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {images.map(({ src, label }) => (
          <div key={src}>
            <p className="text-sm font-semibold text-green-900 mb-2">{label}</p>
            <img
              src={src}
              alt={label}
              className="w-full rounded-xl object-cover aspect-video border border-stone-200 shadow-sm"
            />
          </div>
        ))}
      </div>
    </>
  )
}
