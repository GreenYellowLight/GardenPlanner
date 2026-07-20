import { Description, SubHeading, Title } from "./Elements"
import { BASE_PATH } from "@/app/lib/constants"

export default function DemoExample() {
  const images = [
    { src: `${BASE_PATH}/demo-conversion/before.webp`, label: "Your garden today" },
    { src: `${BASE_PATH}/demo-conversion/during.webp`, label: "Freshly planted" },
    { src: `${BASE_PATH}/demo-conversion/after.webp`, label: "5 years from now" },
  ]

  return (
    <>

      <SubHeading>See it in action</SubHeading>
      <Description>Example made using <span className="text-green-800">Flax Lilly</span> and <span className="text-green-800">2 × Shasta Daisy</span></Description>


      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {images.map(({ src, label }) => (
          <div key={src}>
            <Title>{label}</Title>
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
