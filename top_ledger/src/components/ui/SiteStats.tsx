export default function Header() {
    return (
        <section className="py-16 bg-[#0F0C24] flex flex-wrap justify-center gap-8">
        {[
            { label: "Total Bets Today", value: 124 },
            { label: "Top User Profit", value: "$5,340" },
            { label: "Active Users", value: 87 },
            { label: "Biggest Win", value: "$1,200" },
        ].map((stat) => (
            <div
            key={stat.label}
            className="bg-[#1A142D] border-2 border-[#A350A3] rounded-xl px-8 py-6 text-center shadow-lg"
            >
            <p className="text-[#C1436D] text-sm uppercase mb-2">{stat.label}</p>
            <p className="text-white text-3xl font-bold neon-tube">{stat.value}</p>
            </div>
        ))}
        </section>
    );
}