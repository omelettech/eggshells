import {useState} from 'react'
import './App.css'
import TypingArea from "./components/TypingArea.tsx";

function App() {
    const [count, setCount] = useState(0)
    const [time, setTime] = useState(60);
    const [startTimer, setStartTimer] = useState(false);
    const [stats, setStats] = useState([]);
    const startCountdown = async () => {
        for (let i = 59; i >= 0; i--) {
            await new Promise((r) => setTimeout(r, 1000));
            setTime(i);
        }
        setStartTimer(false);
    };

    return (
        <>
            <div>
                <h1>Eggshells</h1>
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
