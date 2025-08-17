interface StatCardProps {
    icon: any;
    color: string;
    background: string;
    title: string;
    stat: number | string;
    isDark: boolean;
}

export default function StatCard({icon: Icon, color, background, title, stat, isDark}: StatCardProps) {
    return (
        <div className={`group border rounded-lg p-2 shadow-xs transition-all hover:scale-[1.01] ${isDark ? 'border-white/20' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-1">
                    <div className={`ml-2 my-1 ${background} rounded-md p-2.5 transition-colors`}>
                        <Icon className={`w-6 h-6 ${color}`} />
                    </div>
                <div className={`text-lg pr-2 font-medium ${isDark ? 'text-white' : 'text-gray-600'}`}>{stat}</div>
            </div>
            <h3 className={`text-xs pl-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{title}</h3>
        </div>
    );
}