import { Fragment, useCallback, useReducer, useRef } from "react";
import Swal from "sweetalert";
import "../Styles/ToDo.css";
import Header from "../Components/Header";
import ToDoModal from "../Components/ToDo-Modal";

const initialState = {
    data: [], updateData: "", isFillOpen: false,
    isChangeOpen: false, totalList: 0
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_DATA':
            return { ...state, data: action.payload }
        case 'SET_UPDATE_DATA':
            return { ...state, updateData: action.payload }
        case 'SET_FILL_MODAL':
            return { ...state, isFillOpen: action.payload }
        case 'SET_CHANGE_MODAL':
            return { ...state, isChangeOpen: action.payload }
        case 'SET_TOTAL_LIST':
            return { ...state, totalList: action.payload }
        default:
            return state;
    }
}

export default function ToDoList() {

    const [state, dispatch] = useReducer(reducer, initialState);
    const inputRef = useRef();
    const selectIndexRef = useRef();
    const submitRef = useRef();

    const openForm = () => {
        dispatch({ type: 'SET_CHANGE_MODAL', payload: false });
        dispatch({ type: 'SET_FILL_MODAL', payload: true });
        submitRef.current.style.display = "none";
    }

    const closeForm = () => {
        dispatch({ type: 'SET_CHANGE_MODAL', payload: false });
        dispatch({ type: 'SET_FILL_MODAL', payload: false });
        submitRef.current.style.display = "inline-block";
    }

    const handleDataChange = (event) => {
        dispatch({ type: 'SET_UPDATE_DATA', payload: event.target.value });
    }

    //menghapus salah satu data
    const handleDelete = useCallback((index) => {
        Swal({
            title : "kamu ingin menghapusnya ?",
            text : "data yang dihapus tidak dapat dikembalikan",
            icon : "warning",
            buttons : true,
            dangerMode : true
        }).then((willDelete) => {
            if (willDelete) {
                Swal("data berhasil dihapus", {icon : "success"})
                const deletedData = state.data.filter((_, i) => i !== index);
                dispatch({ type: 'SET_DATA', payload: deletedData });
                dispatch({ type: 'SET_TOTAL_LIST', payload: state.totalList - 1 });
            }
            else {
                Swal("data batal dihapus");
            }
        })
    }, [state.updateData, state.totalList, state.data]);

    //memindahkan array ke atas
    const moveAbove = useCallback((index) => {
        if (index > 0) {
            const editedData = [...state.data];
            [editedData[index], editedData[index - 1]] = [editedData[index - 1], editedData[index]];
            dispatch({ type: 'SET_DATA', payload: editedData });
        }
    }, [state.data]);

    //memindahkan array ke bawah
    const moveBelow = useCallback((index) => {
        if (index < state.data.length - 1) {
            const editedData = [...state.data];
            [editedData[index], editedData[index + 1]] = [editedData[index + 1], editedData[index]];
            dispatch({ type: 'SET_DATA', payload: editedData });
        }
    }, [state.data]);

    const handleClearAll = useCallback(() => {
        if (state.data.length > 0) {
            Swal({
                title: "kamu ingin menghapus seluruh data ?",
                text: "data akan hilang setelah dihapus!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    Swal("tempat sudah kosong", {
                        icon: "success",
                    })
                    dispatch({ type: 'SET_DATA', payload: [] })
                    dispatch({ type: 'SET_TOTAL_LIST', payload: 0 });
                }
                else {
                    Swal("List batal dihapus!");
                }
            })
        }
        else {
            Swal("", "kamu belum menambahkan satu data pun", "warning");
        }
    }, [state.data, state.totalList]);

    //menambahkan ke array (database)
    const handleAdd = useCallback((event) => {
        const allowedChar = /^[a-zA-Z -0-9]+$/
        event.preventDefault();
        if (allowedChar.test(state.updateData) && state.updateData.trim() !== "") {
            if (!state.data.includes(state.updateData)) {
                dispatch({ type: 'SET_DATA', payload: [...state.data, state.updateData] });
                dispatch({ type: 'SET_UPDATE_DATA', payload: "" });
                dispatch({ type: 'SET_TOTAL_LIST', payload: state.totalList + 1 });
                Swal("", "data berhasil ditambahkan", "success");
            }
            else {
                dispatch({ type: 'SET_UPDATE_DATA', payload: "" });
                Swal("", "data sudah ada", "error");
            }
        }
        else {
            dispatch({ type: 'SET_UPDATE_DATA', payload: "" });
            Swal("", "masukkan data dengan benar", "warning");
        }
    }, [state.data, state.updateData, state.totalList]);

    //mengututkan dari kecil ke besar
    const ascendingSort = useCallback(() => {
        const asc = [...state.data].sort((a, b) => a.localeCompare(b)); 
        dispatch({ type: 'SET_DATA', payload: asc });
    }, [state.data]);

    //mengututkan dari besar ke kecil
    const descendingSort = useCallback(() => {
        const dsc = [...state.data].sort((a, b) => b.localeCompare(a)); 
        dispatch({ type: 'SET_DATA', payload: dsc });
    }, [state.data]);

    const handleSelect = useCallback((index) => {
        selectIndexRef.current = index;
        dispatch({ type: 'SET_UPDATE_DATA', payload: state.data[selectIndexRef.current] });
        dispatch({ type:'SET_CHANGE_MODAL', payload: true });
        dispatch({ type: 'SET_FILL_MODAL', payload: false });
        submitRef.current.style.display = "inline-block";
    }, [state.data, state.updateData]);

    const handleUpdate = useCallback((event) => {
        event.preventDefault();
        const allowChar = /^[a-zA-Z -0-9]+$/;
        const editedData = [...state.data];

        if (selectIndexRef.current !== undefined && selectIndexRef.current !== null && 
            state.data[selectIndexRef.current] !== undefined) {
            if (allowChar.test(state.updateData) && state.updateData.trim() !== "") {
                if (state.updateData !== state.data[selectIndexRef.current]) {
                    editedData[selectIndexRef.current] = state.updateData
                    dispatch({ type: 'SET_DATA', payload: editedData });
                    dispatch({ type: 'SET_UPDATE_DATA', payload: "" });
                    Swal("", "data berhasil di update", "success");
                }
                else {
                    dispatch({ type: 'SET_UPDATE_DATA', payload: "" });
                    Swal("", "data harus berbeda", "error");
                }
            }
            else {
                dispatch({ type: 'SET_UPDATE_DATA', payload: "" });
                Swal("", "data harus berbeda", "error");
            }
        }
        else {
            Swal("", "kamu belum menambahkan satu data pun", "error");
        }
    }, [state.data, state.updateData]);

    return (
        <Fragment>
            <Header number={1}/>
            <div className="list-wrap">
                <div className="list-content">
                    <h2>simple to-do list project</h2>
                    {state.isFillOpen === true && (
                        <form id="input-wrap">
                            <input type="text" id="list-input" value={state.updateData} onChange={handleDataChange}
                                placeholder="masukkan aktivitas..." ref={inputRef} />
                            <button type="submit" className="add-btn" onClick={handleAdd}>Add</button>
                            <button type="button" className="cancel-btn" onClick={closeForm}>Cancel</button>
                        </form>
                    )}
                    {state.isChangeOpen === true && (
                        <form className="update-list" >
                            <ToDoModal 
                                getData={state.updateData} handleData={handleDataChange} 
                                update={handleUpdate} cancel={closeForm}
                            />
                        </form>
                    )}
                    <div className="sorting">
                        <button type="button" id="open" onClick={openForm} ref={submitRef}>Add List</button>
                        <button type="button" id="asc-1" onClick={() => ascendingSort()}>A-Z</button>
                        <button type="button" id="dsc-1" onClick={() => descendingSort()}>Z-A</button>
                        <button type="button" id="empty" onClick={handleClearAll}>Clear All</button>
                    </div>
                    <div className="data-length" style={{textAlign:'center'}}>{state.totalList} list added</div>
                    <div className="added-list">
                        {state.data.length > 0 ? (
                            state.data.map((dt, index) => (
                                <div key={index} className="list">
                                    <div className="list-text">
                                        {dt}
                                    </div>
                                    <div className="control-wrap">
                                        <button type="button" id="editlist" onClick={() => handleSelect(index)} >📝</button>
                                        <button type="button" id="moveup" onClick={() => moveAbove(index)}>⬆️</button>
                                        <button type="button" id="movedwn" onClick={() => moveBelow(index)}>⬇️</button>
                                        <button type="button" id="erase" onClick={() => handleDelete(index)}>🗑️</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-wrap">
                                <div className="empty-warn">...kamu belum menambahkan list satu pun...</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}