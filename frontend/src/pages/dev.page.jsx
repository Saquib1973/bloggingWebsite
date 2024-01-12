import { MaskContainer } from "../components/maskContainer.component"


export const Dev = () => {
    return (<>
        <MaskContainer
            revealText={
                <p className="max-w-4xl mx-auto text-slate-800 text-center  text-4xl font-bold">
                    Saquib
                </p>
            }
            className="h-[40rem] border rounded-md"
        >
            <div className="text-7xl">
                The first rule of <span className="text-red-500">MRR Club</span> is you
                do not talk about MRR Club. The second rule of MRR Club is you DO NOT
                talk about <span className="text-red-500">MRR Club</span>.
            </div>
        </MaskContainer>
    </>
    )
}



