import { useEffect, useRef, useState } from "react";
import Header from "../Components/Header";
import "../Styles/DigitalClock.css";

export default function DigitalClock() {
    const time = useRef(new Date());
    const [clock, setClock] = useState(formatTime());

    useEffect(() => {
        const intervalId = setInterval(() => {
            time.current = new Date();
            setClock(formatTime());
        }, 1000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    function formatTime() {
        const hours = time.current.getHours();
        const minutes = time.current.getMinutes();
        const seconds = time.current.getSeconds();
        return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    }

    function padZero(number) {
        return (number < 10 ? "0" : "") + number;
    }

    return (
        <>
            <div className="clock-bg-image">
            <Header number={1}/>
                <div className="clock-container">
                    <div className="clock-wrap">
                        <h3 className="clock">{clock} AM</h3>
                    </div>
                </div>
            </div>
        </>
    );
}