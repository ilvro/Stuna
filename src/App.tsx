import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router';
import Navigation from '../components/NavigationBar.tsx';
import Home from '../components/pages/Home.tsx';
import AnalysisMain from '../components/pages/AnalysisMain.tsx';
import Guide from '../components/pages/Guide.tsx'

function AppContent() {
    const [isDark, setIsDark] = useState(true);

    const toggleTheme = () => {
        setIsDark(!isDark);
    }

    useEffect(() => {
        // initialize theme on load
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        document.body.style.backgroundColor = isDark ? '#101115' : '#f9fafb';
        document.body.style.transition = 'background-color 0.4s ease';
    }, [isDark]);

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#101115]' : 'bg-white'}`}>
            <Navigation isDark={isDark} toggleTheme={toggleTheme} />
            
            <div key={useLocation().pathname} className="px-24 page-transition"> {/* adding isLocation makes react rebuild the component and play the page-transition animation when the location changes */}
                <Routes> {/* main page is now the nav bar with a div below it. the div loads the other pages*/}
                    <Route path="/" element={<Home isDark={isDark} />} />
                    <Route path="/analysis" element={<AnalysisMain isDark={isDark} />} />
                    <Route path="/guide" element={<Guide isDark={isDark}/>} />
                </Routes>
            </div>
        </div>
    );
}

function App() {
    return ( /* main page is now the nav bar with a div below it. the div loads the other pages*/
        <Router> 
            <AppContent />
        </Router>
    );
}

export default App;