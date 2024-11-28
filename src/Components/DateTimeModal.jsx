import { Fragment } from "react";

export default function DateTimeModal(props) {
    return (
        <Fragment>
            <input type="text" required id="act-name" onChange={props.setAct} value={props.act} />
            <input type="date" required id="act-date" onChange={props.setDate} value={props.date} />
            <input type="time" required id="act-time" onChange={props.setTime} value={props.time} />
            <div className="act-handler">
                <button type="submit" onClick={props.update}>Change</button>
                <button type="button" onClick={props.close}>Cancel</button>
            </div>
        </Fragment>
    )
}