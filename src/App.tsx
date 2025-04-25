import { useState } from 'react'
import './App.css'

function App() {
    return (
        <div>
            <Title text="Hello World!"></Title>
            <CountButton></CountButton>
        </div>
    )
}

interface TitleProps {
    text: string;
}

interface CountProps {
    initialCount?: number;
}

function Title(props: TitleProps) {
    return <h1>{props.text}</h1>
}

function CountButton({initialCount = 0}: CountProps) {
    const [count, setCount] = useState(initialCount);
    const handleClick = () => {
        setCount(count+1);
    }

    return (
        <button onClick={handleClick}>
            {count}
        </button>
    )
}


export default App;