//import { useState } from 'react'
import './App.css'

function App() {
  return (
    <Title text="Hello World!"></Title>
  )
}

interface TitleProps {
    text: string;
}
function Title(props: TitleProps) {
    return <h1>{props.text}</h1>
}

export default App
