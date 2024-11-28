import React, { Fragment, useReducer, useRef } from "react";
import Swal from "sweetalert";
import Header from "../Components/Header";
import "../Styles/Registration.css";

const defaultVal = {
    name: "", number: "", range: "", gender: "", savedData: [], checkedData: []
}

function stateChanger(state, action) {
    switch(action.type) {
        case "name":
            return { ...state, name: action.payload }
        case "number":
            return { ...state, number: action.payload }
        case "range":
            return { ...state, range: action.payload }
        case "gender":
            return { ...state, gender: action.payload }
        case "savedData":
            return { ...state, savedData: action.payload }
        case "checkedData":
            return { ...state, checkedData: action.payload }
        default:
            return state;
    }
}

export default function Registration() {
    const choose = [
        "algoritma dasar", "database", "pemrograman web",
        "oop", "jaringan komputer", "otomasi",
        "komputasi paralel", "pemrograman web lanjut", "pemrograman bergerak"
    ]

    const [state, dispatch] = useReducer(stateChanger, defaultVal);

    const identityRef = useRef();
    const inputRef = useRef();

    function handleName(event) {
        dispatch({ type: "name", payload: event.target.value });
    }

    function handleNumber(event) {
        const newNumber = parseInt(event.target.value, 10);
        if (newNumber > 0) {
            dispatch({ type: "number", payload: newNumber });
        }
        else {
            dispatch({ type: "number", payload: 0 });
        }
    }

    function handleRange(event) {
        const newRange = parseInt(event.target.value, 10);
        if (newRange) {
            dispatch({ type: "range", payload: newRange });
        }
        else {
            dispatch({ type: "range", payload: 1 });
        }
    }

    function handleCheckbox(event) {
        const selected = (event.target.checked);
        const valueAccess = (event.target.value);
        if (selected) {
            dispatch({ type: "checkedData", payload: [...state.checkedData, valueAccess] });
        } 
        else {
            dispatch({ type: "checkedData", payload: state.checkedData.filter((item) => item !== valueAccess) })
        }
    }

    function handleGender(event) {
        const selected = (event.target.checked);
        const valueAccess = (event.target.value);
        if (selected) {
            dispatch({ type: "gender", payload: valueAccess });
        }
        else {
            dispatch({ type: "gender", payload: "" });
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        const char = /^[a-zA-Z ]+$/;
        const saveData = {
            name: state.name,
            gender: state.gender,
            number: state.number,
            range: state.range,
            check: state.checkedData,
        };

        if (char.test(state.name) && state.name.trim() !== "" && state.number && state.gender) {
            const isExist = state.savedData.find((data) => data.name === saveData.name && data.number === saveData.number);
            if (!isExist) {
                if (state.checkedData.length > 0) {
                    Swal("","data berhasil ditambahkan","success");
                    dispatch({ type: "savedData", payload: [...state.savedData, saveData] });
                    dispatch({ type: "name", payload: "" });
                    dispatch({ type: "number", payload: "" });
                    dispatch({ type: "checkedData", payload: [] });
                    dispatch({ type: "range", payload: 1 });
                }
                else {
                    Swal("","kamu belum memilih","error");
                }
            }
            else {
                Swal("data sudah ada");
                dispatch({ type: "name", payload: "" });
                dispatch({ type: "number", payload: "" });
                dispatch({ type: "checkedData", payload: [] });
                dispatch({ type: "range", payload: 1 });
            }
        }
        else {
            Swal("","masukkan data dengan benar","error");
            dispatch({ type: "name", payload: "" });
            dispatch({ type: "number", payload: "" });
            dispatch({ type: "checkedData", payload: [] });
            dispatch({ type: "range", payload: 1 });
        }
    }

    function handleErase(index) {
        Swal({
        title: "Ingin Menghapus Data Ini ?",
        text: "Data yang Sudah Dihapus Tidak Dapat Kembali",
        icon: "warning",
        buttons: true,
        dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                Swal("Objek Berhasil Dihapus", {
                    icon: "success",
                })
                const deletedData = savedData.filter((_, i) => i !== index);
                dispatch({ type: "savedData", payload: [...deletedData] });
            }
            else {
                Swal("Data Batal Dihapus");
            }
        })
    }

    function eraseAll() {
        if (savedData.length > 0) {
            Swal({
            title: "Ingin Menghapus Data Ini ?",
            text: "Data yang Sudah Dihapus Tidak Dapat Kembali",
            icon: "warning",
            buttons: true,
            dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    Swal("data kamu kosong".toUpperCase(), {
                        icon: "success",
                    })
                    dispatch({ type: "savedData", payload: [] });
                }
                else {
                    Swal("data batal dihapus".toUpperCase());
                }
            })
        }
        else {
            Swal("data masih kosong".toUpperCase());
        }
    }

    function handleSorting() {
        const copiedData = [...state.savedData];
        const sortedData = copiedData.sort((a, b) => a.range - b.range);
        dispatch({ type: "savedData", payload: sortedData });
    }

    function reverseSorting() {
        const copyData = [...state.savedData];
        const reversed = copyData.sort((a, b) => b.range - a.range);
        dispatch({ type: "savedData", payload: reversed });
    }

    function moveAbove(index) {
        if (index > 0) {
            const changedData = [...state.savedData];
            [changedData[index], changedData[index - 1]] = [changedData[index - 1], changedData[index]];
            dispatch({ type: "savedData", payload: changedData });
        }
    }

    function moveBelow(index) {
        if (index < state.savedData.length - 1) {
            const changedData = [...state.savedData];
            [changedData[index], changedData[index + 1]] = [changedData[index + 1], changedData[index]];
            dispatch({ type: "savedData", payload: changedData });
        }
    }

    function selectData(index) {
        identityRef.current = index;
        inputRef.current.focus();
        dispatch({ type: "name", payload: state.savedData[identityRef.current].name });
        dispatch({ type: "number", payload: state.savedData[identityRef.current].number });
        dispatch({ type: "gender", payload: state.savedData[identityRef.current].gender });
        dispatch({ type: "range", payload: state.savedData[identityRef.current].range });
    }

    function handleUpdate(event) {
        event.preventDefault();
        const char = /^[a-zA-Z ]+$/;
        const saveUpdatedData = [...state.savedData];

        if (identityRef.current !== null && identityRef.current !== undefined) {
            if (state.name !== state.savedData[identityRef.current].name || 
                state.number !== state.savedData[identityRef.current].number || 
                state.range !== state.savedData[identityRef.current].range) {
                if (char.test(state.name) && state.name.trim() !== "" && state.number) {
                    saveUpdatedData[identityRef.current].name = state.name;
                    saveUpdatedData[identityRef.current].number = state.number;
                    saveUpdatedData[identityRef.current].range = state.range;
                    saveUpdatedData[identityRef.current].check = state.checkedData;
                    dispatch({ type: "savedData", payload: saveUpdatedData });
                    Swal("","data berhasil di update","success");
                }
                else {
                    Swal("masukkan data dengan benar");
                    dispatch({ type: "name", payload: "" });
                    dispatch({ type: "number", payload: "" });
                    dispatch({ type: "checkedData", payload: [] });
                    dispatch({ type: "range", payload: 1 });
                }
            }
            else {
                Swal("masukkan data yang berbeda");
            }
        }
        else {
            Swal("kamu belum menambahkan satu data pun");
        }
    }

    return (
        <Fragment>
            <Header number={1} />
            <div className="form-with-checkbox">
                <form className="lesson-reg">
                    <div className="range-type">
                        <input type="text" placeholder="name..." value={state.name} onChange={handleName} ref={inputRef} />
                        <input type="text" placeholder="number..." value={state.number} onChange={handleNumber} />
                        <input type="range" min={1} max={8} step={1} value={state.range} onChange={handleRange} />
                        <input type="text" className="range-val" value={state.range} onChange={handleRange}
                        placeholder="semester.." />
                        <div className="set-gender">
                            <input type="radio" required name="gender" id="male" value="male" onChange={handleGender }/>
                            <label htmlFor="male">Male</label>
                            <input type="radio" required name="gender" id="female" value="female" onChange={handleGender} />
                            <label htmlFor="female">Female</label>
                        </div>
                    </div>
                    <div className="checkbox-wrapper">
                        <div className="sub-checkbox-wrapper-1">
                            {choose.slice(0,4).map((lesson, index) => (
                                <div className="lesson-choose-1">
                                    <input id={`ck-${index + 1}`} type="checkbox" value={lesson} key={`aaa-${index}`}
                                    onChange={handleCheckbox} />
                                    <label htmlFor={`ck-${index + 1}`}>{lesson}</label>
                                </div>
                            ))}
                        </div>
                        <div className="sub-checkbox-wrapper-2">
                            {choose.slice(4,9).map((lesson, index) => (
                                <div className="lesson-choose-2">
                                    <input id={`ck-${index + 5}`} type="checkbox" value={lesson} key={`lesson-${index + 4}`}
                                    onChange={handleCheckbox} />
                                    <label htmlFor={`ck-${index + 5}`}>{lesson}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="gtn-group">
                        <button type="submit" onClick={handleSubmit}>Send</button>
                        <button type="submit" onClick={handleUpdate}>Update</button>
                        <button className="erase" type="button" onClick={eraseAll}>erase all</button>
                        <button className="sorted" type="button" onClick={() => handleSorting()}>0-9</button>
                        <button className="reversed" type="button" onClick={() => reverseSorting()}>9-0</button>
                    </div>
                </form>
                <div className="saved-data">
                    {state.savedData.length > 0 ? (
                        state.savedData.map((data, index) => (
                            <div key={index} className="obj-data">
                                <div>Name : {data.name}</div>
                                <div>Gender : {data.gender}</div>
                                <div>Number : {data.number}</div>
                                <div>Semester : {data.range}</div>
                                <div>
                                    {data.check.length > 1 ? "Lessons" : "Lesson"} 
                                    {data.check.map((dataCheck, index) => (
                                        <div key={index}>
                                            <li>{dataCheck}</li>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={() => selectData(index)}>📄</button>
                                <button type="button" onClick={() => handleErase(index)}>🗑️</button>
                                <button type="button" onClick={() => moveAbove(index)}>⬆️</button>
                                <button type="button" onClick={() => moveBelow(index)}>👇</button>
                                <hr/>
                            </div>
                        ))
                    ) : (
                        <div>
                            <div>...Empty...</div>
                        </div>
                    )}
                </div>
            </div>
        </Fragment>
    )
}
