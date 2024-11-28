import { Fragment, useContext } from "react";
import "../Styles/Footer.css";

export default function Footer() {
    const getYear = new Date();

    return(
        <Fragment>
            <footer className="footer">
                <div className="footer-content">
                    <div className="year">&copy;2022 - {getYear.getFullYear()}</div>
                </div>
            </footer>
        </Fragment>
    )
}