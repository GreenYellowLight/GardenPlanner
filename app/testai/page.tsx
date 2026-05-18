import Image from "next/image";

export default function Page() {

    console.log("I work!")

    return <div className="flex flex-col items-center justify-center min-h-screen pt-[15vh]">
        <h1 className="text-2xl">Before:</h1>
        <Image
            src="/example-fence-image.webp"
            alt="fence with grass"
            width={430}
            height={287}
        />

        <h1 className="text-2xl">After:</h1>

    </div>;

}