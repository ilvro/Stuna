import { Link, useLocation } from 'react-router';
import { Sun, MoonIcon } from 'lucide-react';

interface NavigationBarProps {
    isDark: boolean;
    toggleTheme: () => void;
}

function NavigationBar({ isDark, toggleTheme }: NavigationBarProps) {
    const location = useLocation();

    const getLinkClass = (path: string) => {
        const isActive = location.pathname === path;
        return `transition-colors duration-300 ${
            isActive 
                ? (isDark ? 'text-[#29b5be]' : 'text-[#29b5be]')
                : (isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900')
        }`;
    };

    return (
        <nav className={`flex items-center h-14 mb-10 space-x-8 px-12 border-b transition-colors duration-300 ${isDark ? 'bg-[#101113] border-[#0b0c0e] shadow-lg' : 'bg-gray-50 border-gray-200 shadow-2xs'}`} id="main-nav-bar">
            <Link to="/" className={`transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>Stuna</Link>
            <Link to="/analysis" className={getLinkClass('/analysis')}>Analysis</Link>
            <Link to="/guide" className={getLinkClass('/guide')}>Guide</Link>
            
            <div className="flex items-center space-x-4 ml-auto">
                <button
                    onClick={toggleTheme}
                    className={`group flex items-center justify-center w-8 h-8 rounded-full !bg-transparent
                        ${isDark 
                            ? 'text-yellow-400 hover:text-yellow-300' 
                            : 'text-gray-600 hover:text-gray-500'}
                        transition-colors duration-300
                    `}
                >

                    {/* current theme icon (deactivates when hovering) */}
                    <div className="transition-all duration-300 ease-in-out scale-100 group-hover:rotate-180 group-hover:opacity-0">
                        {isDark ? <MoonIcon size={18} /> : <Sun size={18} />}
                    </div>

                    {/* opposite theme icon (activates when hovering) */}
                    <div className="absolute flex items-center justify-center transition-all duration-300 ease-in-out opacity-0 scale-0 group-hover:scale-100 group-hover:rotate-180 group-hover:opacity-100">
                        {isDark ? <Sun size={18} /> : <MoonIcon size={18} />}
                    </div>
                </button>
                
            </div>
            <a className={`flex transition-colors duration-300 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'}`} href="https://github.com/ilvro/Stuna" target='_blank'>GitHub</a>
        </nav>
    );
}

export default NavigationBar;