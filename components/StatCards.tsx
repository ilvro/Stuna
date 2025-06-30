interface StatCardProps {
    icon: React.ReactNode;
    title: string;
    stat: number | string;
    isDark: boolean;
}

export default function StatCard({icon, title, stat, isDark}: StatCardProps) {
    return (
        <div className={`group border rounded-md p-2 shadow-xs transition-all duration-100 hover:scale-[1.01] ${isDark ? 'border-white/20' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-1">
                    <div className="pl-2 py-1">
                        {icon}
                    </div>
                <div className={`text-lg pr-2 font-medium ${isDark ? 'text-white' : 'text-gray-600'}`}>{stat}</div>
            </div>
            <h3 className={`text-xs pl-2 font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{title}</h3>
        </div>
    );
}