import { useRef, useReducer, Fragment, useContext } from "react";
import Swal from "sweetalert";
import DateTimeModal from "../Components/DateTimeModal";
import Header from "../Components/Header";
import "../Styles/Schedule.css";

const defaultValue = {
    data: [], act: "", date: "", time: "", isUpdateActive: false, isFormActive: false, total: 0
}

function features(state, action) {
    switch (action.type) {
        case 'active':
            return { ...state, active: action.payload };
        case 'set total' :
            return { ...state, total: action.payload };
        case 'set act':
            return { ...state, act: action.payload };
        case 'set date':
            return { ...state, date: action.payload };
        case 'set time':
            return { ...state, time: action.payload };
        case 'set data':
            return { ...state, data: action.payload };
        case 'beingDone':
            return { ...state, beingDone: action.payload };
        case 'finished':
            return { ...state, finished: action.payload }
        case 'activate form':
            return { ...state, isFormActive: action.payload };
        case 'activate update':
            return { ...state, isUpdateActive: action.payload };
        default:
            return state;
    }
}

export default function Schedule() {
    const selectData = useRef();

    const [state, updater] = useReducer(features, defaultValue);

    function formAppear() {
        updater({ type: 'activate form', payload: true });
        updater({ type: 'activate update', payload: false });
    }

    function formDisappear() {
        updater({ type: 'activate form', payload: false });
        updater({ type: 'activate update', payload: false });
    }

    function setAct(event) {
        updater({ type: 'set act', payload: event.target.value });
    }

    function setDate(event) {
        updater({ type: 'set date', payload: event.target.value });
    }

    function setTime(event) {
        updater({ type: 'set time', payload: event.target.value });
    }

    function addData(event) {
        event.preventDefault();
        const only = /^[a-zA-Z ]+$/
        const newData = { act: state.act, date: state.date, time: state.time }
        if (only.test(state.act) && state.act.trim() !== "" && state.date && state.time) {
            const isExist = state.data.find((data) => {
                return data.act === newData.act && data.time === newData.time && data.date === newData.date
            });
            if (!isExist) {
                updater({ type: 'set data', payload: [...state.data, newData] });
                updater({ type: 'set total', payload: state.total + 1 });
                updater({ type: 'set act', payload: "" });
                updater({ type: 'set date', payload: "" });
                updater({ type: 'set time', payload: "" });
                updater({ type: 'activate form', payload: false});
                Swal("","data baru ditambahkan","success");
            }
            else {
                Swal("","data sudah ada","error");
            }
        }
        else {
            Swal("","isi data dengan benar","error");
            updater({ type: 'set act', payload: "" });
            updater({ type: 'set date', payload: "" });
            updater({ type: 'set time', payload: "" });
            updater({ type: 'activate form', payload: false});
        }
    }

    function handleDelete(index) {
        Swal({
            title : "kamu ingin menghapusnya ?",
            text : "data yang dihapus tidak dapat dikembalikan",
            icon : "warning",
            buttons : true,
            dangerMode : true
        }).then((willDelete) => {
            if (willDelete) {
                Swal("data berhasil dihapus", {icon : "success"});
                const deletedData = state.data.filter((_, i) => i !== index);
                updater({ type: 'set data', payload: [...deletedData] });
                updater({ type: 'set total', payload: state.total - 1 });
            }
            else {
                Swal("data batal dihapus");
            }
        })
    }

    function ascendSort() {
        const sortedData = [...state.data];
        const ascending = sortedData.sort((a, b) => a.act.localeCompare(b.act));
        updater({ type: 'set data', payload: [...ascending] });
    }

    function descendSort() {
        const sortedData = [...state.data];
        const descending = sortedData.sort((a, b) => b.act.localeCompare(a.act));
        updater({ type: 'set data', payload: [...descending] });
    }

    function clearAllAct() {
        if (state.data.length > 0) {
            Swal({
                title : "kamu ingin menghapusnya ?",
                text : "data yang dihapus tidak dapat dikembalikan",
                icon : "warning",
                buttons : true,
                dangerMode : true
            }).then((willDelete) => {
                if (willDelete) {
                    Swal("data berhasil dihapus", {icon : "success"});
                    updater({ type: 'set data', payload: [] });
                    updater({ type: 'set total', payload: 0 });
                    Swal("","berhasil dikosongkan","success");
                }
                else {
                    Swal("data batal dihapus");
                }
            })
        }
        else {
            Swal("kamu belum membuat satu pun aktivitas");
        }
    }

    function selectAct(index) {
        selectData.current = index;
        updater({ type: 'activate form', payload: false });
        updater({ type: 'activate update', payload: true });
        updater({ type: 'set act', payload: state.data[selectData.current].act });
        updater({ type: 'set date', payload: state.data[selectData.current].date });
        updater({ type: 'set time', payload: state.data[selectData.current].time });
    }

    function updateData(event) {
        event.preventDefault();
        const allowChar = /^[a-zA-Z ]+$/;
        const editedData = [...state.data];
        if (selectData.current !== null && selectData.current !== undefined) {
            if (allowChar.test(state.act) && state.date && state.time && state.act.trim() !== "") {
                if (state.act !== state.data[selectData.current].act ||
                    state.date !== state.data[selectData.current].date ||
                    state.time !== state.data[selectData.current].time) {
                    state.data[selectData.current].act = state.act;
                    state.data[selectData.current].date = state.date;
                    state.data[selectData.current].time = state.time;
                    updater({ type: 'set data', payload: [...editedData] });
                    updater({ type: 'activate update', payload: false });
                    updater({ type: 'set act', payload: "" });
                    updater({ type: 'set date', payload: "" });
                    updater({ type: 'set time', payload: "" });
                }
                else {
                    Swal("","data sudah ada","error");
                    updater({ type: 'activate update', payload: false });
                    updater({ type: 'set act', payload: "" });
                    updater({ type: 'set date', payload: "" });
                    updater({ type: 'set time', payload: "" });
                }
            }
            else {
                Swal("","masukkan data dengan benar","error");
                updater({ type: 'set act', payload: "" });
                updater({ type: 'set date', payload: "" });
                updater({ type: 'set time', payload: "" });
            }
        }
        else {
            Swal("kamu belum menambahkan data satu pun");
        }
    }

    function moveUp(index) {
        if (index > 0) {
            const changeData = [...state.data];
            [changeData[index], changeData[index - 1]] = [changeData[index - 1], changeData[index]];
            updater({ type: 'set data', payload: [...changeData] });
        }
    }

    function moveDown(index) {
        if (index < state.data.length - 1) {
            const changeData = [...state.data];
            [changeData[index], changeData[index + 1]] = [changeData[index + 1], changeData[index]];
            updater({ type: 'set data', payload: [...changeData] });
        }
    }

    return (
        <Fragment>
            <Header number={1}/>
            <div className="activity">
                <div className="todo-content">
                    <div className="act-input">
                        {state.isFormActive === true ? 
                            <form className="add-act" title="add-act">
                                <input placeholder="masukkan nama aktivitas..." 
                                type="text" required id="act-name" onChange={setAct} value={state.act} />
                                <input type="date" required id="act-date" onChange={setDate} value={state.date} />
                                <input type="time" required id="act-time" onChange={setTime} value={state.time} />
                                <div className="act-handler">
                                    <button type="submit" onClick={addData}>Add</button>
                                    <button type="button" onClick={formDisappear}>Cancel</button>
                                </div>
                            </form> : null
                        }
                        {state.isUpdateActive === true ? 
                            <form className="change-act" title="change-act">
                                <DateTimeModal 
                                    act={state.act} date={state.date} time={state.time} setAct={setAct} 
                                    setDate={setDate} setTime={setTime} update={updateData} 
                                    close={formDisappear}
                                />
                            </form> : null
                        }
                    </div>
                    <div className="todo-data">
                        <div className="controls">
                            <button type="button" onClick={formAppear}>Add Activity</button>
                            <button type="button" onClick={clearAllAct}>Erase</button>
                            <button onClick={() => ascendSort()}>A-Z</button>
                            <button onClick={() => descendSort()}>Z-A</button>
                            {state.data.length > 1 ? 
                                <div className="act-total">{state.total} activities added</div> :
                                <div className="act-total">{state.total} activity added</div>
                            }
                        </div>
                        <div className="act-to-do">
                            <div className="recently-added">
                                {state.data.length > 0 ? (state.data.map((data, index) => (
                                    <div className="activity-card" key={`data-${index}`}>
                                        <div>act : {data.act}</div>
                                        <div>date : {data.date}</div>
                                        <div>time : {data.time}</div>
                                        <div className="control">
                                            <button type="button" onClick={() => selectAct(index)}>select</button>
                                            <button type="button" onClick={() => handleDelete(index)}>delete</button>
                                            <button type="button" onClick={() => moveUp(index)}>⬆️</button>
                                            <button type="button" onClick={() => moveDown(index)}>⬇️</button>
                                        </div>
                                    </div>
                                ))) : (
                                    <div className="empty-msg">empty</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
