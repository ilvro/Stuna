interface GuideProps {
    isDark: boolean;
}

function Guide( {isDark}: GuideProps) {
    return (
        <div className="text-center">
            <h1 className={`text-2xl font-md mb-4 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Guide
            </h1>
            <p className={`transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                this is the guide
            </p>
        </div>
    )
}

export default Guide;