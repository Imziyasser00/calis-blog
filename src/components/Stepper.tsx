type Props = { step: number; labels: string[] };
export default function Stepper({ step, labels }: Props) {
    return (
        <div className="mb-4 sm:mb-6">
            <div className="flex items-center justify-between">
                {labels.map((_, i) => (
                    <div key={i} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                            <div
                                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition ${
                                    i <= step
                                        ? "bg-purple-500"
                                        : "bg-[#16161e] border border-white/10 text-gray-400"
                                }`}
                            >
                                {i + 1}
                            </div>
                            <span className={`text-[10px] sm:text-xs mt-1.5 ${i <= step ? "text-purple-500" : "text-gray-600"}`}>
                {labels[i].split(" ")[0]}
              </span>
                        </div>
                        {i < labels.length - 1 && (
                            <div className="flex-1 h-0.5 mx-2 sm:mx-3 mb-6">
                                <div className={`${i < step ? "bg-purple-500" : "bg-[#16161e]"} h-full`} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
