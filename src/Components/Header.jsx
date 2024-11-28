import { Fragment } from "react";
import { Link } from "react-router-dom";
import DarkMode from "../Utilities/DarkMode";
import "../Styles/Header.css";

export default function Header(props) {
    if (props.number === 0) {
        return(
            <Fragment>
                <header className="header">
                    <form title="dark-theme"><DarkMode/></form>
                    <div>MINI PROJECT</div>
                </header>
            </Fragment>
        )
    }

    else if (props.number === 1) {
        return(
            <Fragment>
                <header className="header">
                    <Link to="/" className="back"><i className="fa-solid fa-arrow-left"></i></Link>
                    <form title="dark-theme"><DarkMode/></form>
                </header>
            </Fragment>
        )
    }

    else {
        return null;
    }
}
