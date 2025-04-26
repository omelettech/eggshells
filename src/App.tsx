import {useEffect, useState} from 'react'
import './App.css'
import TypingArea from "./components/TypingArea.tsx";

function App() {
    const [count, setCount] = useState(0)
    const [time, setTime] = useState(10);
    const [startTimer, setStartTimer] = useState(false);
    const [stats, setStats] = useState([]);
    const startCountdown = async () => {
        for (let i = 9; i >= 0; i--) {
            await new Promise((r) => setTimeout(r, 1000));
            setTime(i);
        }
        setStartTimer(false);
    };

    useEffect(() => {
        console.log(stats);
    }, [stats]);

    return (
        <>
            <div>
                <h1>Eggshells</h1>
                <h2>Time:{time}</h2>
                <TypingArea signalStart={() => {
                    if (!startTimer) {
                        setStartTimer(true);
                        startCountdown();
                    }
                }}
                            time={time}
                            setStats={setStats}></TypingArea>
            </div>

        </>
    )
}

export default App
