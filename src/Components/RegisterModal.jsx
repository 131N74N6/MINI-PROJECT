export default function RegisterModal(props) {
    return (
        <Fragment>
            <input placeholder="your name..." type="text" className="set-name" value={props.name} 
            onChange={props.handleName} />
            <input placeholder="your age..." type="text" className="set-age" value={props.age} 
            onChange={props.handleAge} />
            <input placeholder="your address..." type="text" className="set-address" value={props.address} 
            onChange={props.handleAddress} />
            <input placeholder="your gender..." type="text" className="set-gender" value={props.gender} 
            onChange={props.handleGender} />
            <input type="file" className="set-image" onChange={props.handleImage} ref={props.refr} />
            <div className="file-preview">
                {props.profile ?
                    <img src={props.profile} onClick={props.handlePreview} /> :
                    <div className="symbol" onClick={props.handlePreview}>Tap here to upload your image</div>
                }
            </div>
            <div className="submit-cancel">
                <button type="submit" onClick={props.submit}>Change</button>
                <button type="button" onClick={props.close}>Cancel</button>
            </div>
        </Fragment>
    )
}
