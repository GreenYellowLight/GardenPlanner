

export function StepCircle({ number }: { number: string }) {
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" className="mb-3 flex-shrink-0">
            <circle cx="14" cy="14" r="14" fill="#15803d" />
            <text x="14" y="14" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="14" fontWeight="bold">{number}</text>
        </svg>
    )
}

export function StepPill({ step }: { step: number }) {
    return (
        <svg width="58" height="26" viewBox="0 0 58 26" className="flex-shrink-0">
            <rect width="58" height="26" rx="13" fill="#15803d" />
            <text x="29" y="13" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="14" fontWeight="bold">Step {step}</text>
        </svg>
    )
}

export function MainPanel({children}: {children: React.ReactNode} ) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8 scroll-mt-6">
            {children}
        </div>


    )
}


export function SubHeading({children}: {children: React.ReactNode}) {
    return (
        <h2 className="text-xl font-semibold text-green-900">{children}</h2>


    )
}


export function Description({children}:{children: React.ReactNode}){
    return ( 
        <p className="text-sm text-stone-500 mb-6 mt-2 leading-relaxed">{children}</p>
    )
}