interface Props {
    icon: React.ReactNode;
    title: string;
    stat: number | string;
    isDark: boolean;
}

export default function StatCard({icon, title, stat, isDark}: Props) {
    return (
        <div className={`border rounded-xl pl-4 shadow-lg flex items-start justify-between transition-colors duration-200 ${isDark ? 'border-white/30 bg-transparent' : 'border-gray-300 bg-white'}`}>
            <div>
                <div className="text-sm pt-2">{icon}</div>
                <h2 className={`text-xs pt-1 pb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{title}</h2>
            </div>
            <div>
                <h2 className={`px-4 mt-2 text-sm ${isDark ? 'text-blue-50' : 'text-gray-900'}`}>{stat}</h2>
            </div>
        </div>
    )
}