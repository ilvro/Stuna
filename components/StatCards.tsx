interface Props {
    icon: React.ReactNode;
    title: string;
    stat: number | string;
}

export default function StatCard({icon, title, stat}: Props) {
    return (
        <div className="border border-white/30 rounded-xl pl-4 shadow-lg flex items-start justify-between">
            <div>
                <div className="text-sm pt-2">{icon}</div>
                <h2 className="text-xs pt-2 pb-2">{title}</h2>
            </div>
            <div>
                <h2 className="px-4 mt-2 text-blue-50">{stat}</h2>
            </div>
        </div>
    )
}
//