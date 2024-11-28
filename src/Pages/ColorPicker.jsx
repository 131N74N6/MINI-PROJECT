import { Fragment, useState } from "react";
import Header from "../Components/Header";
import "../Styles/ColorPicker.css";

export default function ColorPicker() {
    const [color, setColor] = useState("");

    function handleColor(event) {
        const newColor = (event.target.value);
        setColor(newColor);
    }

    return(
        <Fragment>
            <Header number={1} />
            <div className="color-wrap">
                <form className="color-form">
                    <input type="text" value={color} onChange={handleColor} />
                </form>
                <div className="color-result" style={{backgroundColor:`${color}`}}></div>
            </div>
        </Fragment>
    )
}