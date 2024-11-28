import { Fragment, useEffect, useState } from "react";
import "../Styles/DarkMode.css";

export default function DarkMode() {
    const [isDark, setIsDark] = useState(localStorage.getItem("is-dark") === "yes");

    function light() {
        document.querySelector("body").setAttribute("is-dark", "no");
        localStorage.setItem("is-dark", "no");
    }

    function dark() {
        document.querySelector("body").setAttribute("is-dark", "yes");
        localStorage.setItem("is-dark", "yes");
    }

    function changeTheme(event) {
        const selected = event.target.checked;
        setIsDark(selected);
    }

    useEffect(() => {
        isDark ? dark() : light()
    }, [isDark]);

    return (
        <Fragment>
            <input type="checkbox" checked={isDark} onChange={changeTheme} id="dark-toggle"/>
            <label htmlFor="dark-toggle">
                <div className="point"></div>
            </label>
        </Fragment>
    )
}
