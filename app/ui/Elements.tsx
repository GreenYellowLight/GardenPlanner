

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
        <p className="text-sm text-stone-500 mb-6">{children}</p>
    )
}