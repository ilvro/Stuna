interface Props {
    isOpen: boolean;
    toggle: () => void;
  }
  
export default function SideBar({ isOpen }: Props) {
    return (
      <div className={`fixed top-0 left-0 h-screen bg-blue-950 text-white shadow-lg transition-all duration-250 
                      ${isOpen ? 'w-32 translate-x-0' : '-translate-x-full w-16'} flex flex-col items-center py-4`}>
        <div className="mt-3 mb-6">TEST</div>
        <i>A</i>
        <i>B</i>
        <i>C</i>
        <i>D</i>
      </div>
    );
  }
  