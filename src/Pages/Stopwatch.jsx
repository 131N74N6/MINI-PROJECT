import { useState, useEffect, useRef } from "react";
import Header from "../Components/Header";

export default function Stopwatch() {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const intervalId = useRef(null);
    const startTime = useRef(0);

    useEffect(() => {
        if (isRunning) {
            intervalId.current = setInterval(() => {
                setElapsedTime(Date.now() - startTime.current);
            }, 10);
        } 
        else {
            if (intervalId.current) {
                clearInterval(intervalId.current);
                intervalId.current = null;
            }
        }
    }, [isRunning]);

    const handleStart = () => {
        setIsRunning(true);
        startTime.current = Date.now() - elapsedTime;
    };

    const handleStop = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setElapsedTime(0);
        setIsRunning(false);
    };

    const formatTime = () => {
        const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
        const minutes = Math.floor(elapsedTime / (1000 * 60) % 60);
        const seconds = Math.floor(elapsedTime / 1000 % 60);
        const miliSeconds = Math.floor((elapsedTime % 1000) / 10);

        const paddedHours = String(hours).padStart(2, "0");
        const paddedMinutes = String(minutes).padStart(2, "0");
        const paddedSeconds = String(seconds).padStart(2, "0");
        const paddedMiliSeconds = String(miliSeconds).padStart(2, "0");

        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}:${paddedMiliSeconds}`;
    };

    return (
        <>
            <Header page={3}/>    
            <div className="stopwatch-container">
                <div className="stopwatch-content">
                    <h3 className="display-st">{formatTime()}</h3>
                    <div className="stopwatch-control">
                        <button onClick={handleStart}>Start</button>
                        <button onClick={handleStop}>Stop</button>
                        <button onClick={handleReset}>Reset</button>
                    </div>
                </div>
            </div>
        </>
    );
}