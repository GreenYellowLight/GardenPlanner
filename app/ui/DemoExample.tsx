import { Description, SubHeading, Title } from "./Elements"
import { BASE_PATH } from "@/app/lib/constants"
import Image from 'next/image'

export default function DemoExample() {
  const images = [
    { src: `${BASE_PATH}/demo-conversion/before.webp`, label: "Your garden today" },
    { src: `${BASE_PATH}/demo-conversion/during.webp`, label: "Freshly planted" },
    { src: `${BASE_PATH}/demo-conversion/after.webp`, label: "3 years from now" },
  ]

  return (
    <>

      <SubHeading>See it in action</SubHeading>
      <Description>Example made using <span className="text-green-800">Coastal Daisy Bush
        </span>, <span className="text-green-800">Common Correa</span> and <span className="text-green-800">
        2 × Everlasting Daisy</span>.</Description>


      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {images.map(({ src, label }) => (
          <div key={src}>
            <Title>{label}</Title>
            <Image
              src={src}
              alt={label}
              loading="eager"
              width={1190}
              height={465}
              className="w-full rounded-xl border border-stone-200 shadow-sm"
            />
          </div>
        ))}
      </div>
    </>
  )
}
