import { Fragment, useReducer, useRef } from "react";
import Swal from "sweetalert";
import RegisterModal from "../Components/RegisterModal";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import "../Styles/SimpleRegister.css";

const defaultValue = {
    db: [], name: "", age: "", gender: "", address: "",
    image: "", profile: "", isModalOpen: false, isUpdateOpen: false,
    fileName: "", totalData: 0
}

// Handler
function handleOption(state, action) {
    switch (action.type) {
        case "SET_NAME":
            return { ...state, name: action.payload }
        case "SET_AGE":
            return { ...state, age: action.payload }
        case "SET_GENDER":
            return { ...state, gender: action.payload }
        case "SET_ADDRESS":
            return { ...state, address: action.payload }
        case "SET_DATA":
            return { ...state, db: action.payload }
        case "SET_IMAGE":
            return { ...state, image: action.payload } // menerima file
        case "SET_PREVIEW":
            return { ...state, profile: action.payload } // menampilkan gambar
        case "SHOW_FILE_NAME" :
            return { ...state, fileName: action.payload } // menampilkan nama
        case "SET_DATA_LENGTH":
            return { ...state, totalData: action.payload }
        case "OPEN_MODAL_FORM" :
            return { ...state, isModalOpen: action.payload }
        case "OPEN_UPDATE_FORM" : 
            return { ...state, isUpdateOpen: action.payload }
        default:
            return state;
    }
}

export default function SimpleRegister() {

    const [state, handler] = useReducer(handleOption, defaultValue);
    const selectData = useRef(); //menyimpan data yang dipilih
    const imageRef = useRef(); //input file

    function openModal1() {
        handler({ type: "OPEN_MODAL_FORM", payload: true });
        handler({ type: "OPEN_UPDATE_FORM", payload: false });
    }
    
    //mengambil nilai nama
    function setName(event) {
        handler({ type: "SET_NAME", payload: event.target.value });
    }

    //mengambil nilai umur
    function setAge(event) {
        const newAge = parseInt(event.target.value, 10);
        if (newAge > 0) {
            handler({ type: "SET_AGE", payload: newAge });
        }
        else {
            handler({ type: "SET_AGE", payload: 0 });
        }
    }

    //mengambil nilai alamat
    function setAddress(event) {
        handler({ type: "SET_ADDRESS", payload: event.target.value });
    }

    //mengambil nilai jenis kelamin
    function setGender(event) {
        handler({ type: "SET_GENDER", payload: event.target.value });
    }

    //menampilkan file gambar
    function setImage(event) {
        const getFile = event.target.files[0];
        const imgType = ["image/jpg", "image/jpeg", "image/png"];
        
        // Validasi tipe file
        if (getFile && imgType.includes(getFile.type)) {
            handler({ type: "SET_IMAGE", payload: getFile });
            const reader = new FileReader();
            reader.onloadend = () => {
                handler({ type: "SET_PREVIEW", payload: reader.result });
            };
            reader.readAsDataURL(getFile);
        } 
        else {
            Swal("", "Hanya menerima gambar tipe jpg, jpeg, dan png", "warning");
            handler({ type: "SET_IMAGE", payload: "" });
        }
    }

    function setPreview() {
        imageRef.current.click();
    }

    //menambahkan data ke array (database)
    function submitData(event) {
        event.preventDefault();
        const newData = {
            name: state.name, age: state.age, address: state.address, 
            gender: state.gender, profile: state.profile
        }

        const select = /^[a-zA-Z ]+$/;
        const select2 = /^[a-zA-Z 0-9-]+$/;
        const imgType = ["image/jpg","image/jpeg","image/png"];
        const isExist = state.db.find((data) => { 
            return newData.name === data.name && newData.age === data.age && newData.gender === data.gender &&
            newData.address === data.address
        });
        
        if (select.test(state.name) && state.name.trim() !== "" && state.age > 0 && 
            state.gender && state.address.trim() !== "" && state.image && select2.test(state.address)) {
            if (imgType.includes(state.image.type)) {
                if (!isExist) {
                    Swal("","data registrasi berhasil","success");
                    handler({ type: "SET_DATA", payload: [...state.db, newData] });
                    handler({ type: "SET_DATA_LENGTH", payload: state.totalData + 1 });
                    handler({ type: "SET_NAME", payload: "" });
                    handler({ type: "SET_ADDRESS", payload: "" });
                    handler({ type: "SET_AGE", payload: "" });
                    handler({ type: "SET_GENDER", payload: "" });
                    handler({ type: "SET_IMAGE", payload: "" });
                    handler({ type: "OPEN_MODAL_FORM", payload: false });
                    console.log(state.db.concat(newData));
                }
                else {
                    handler({ type: "SET_NAME", payload: "" });
                    handler({ type: "SET_ADDRESS", payload: "" });
                    handler({ type: "SET_AGE", payload: "" });
                    handler({ type: "SET_GENDER", payload: "" });
                    handler({ type: "SET_IMAGE", payload: "" });
                    handler({ type: "OPEN_MODAL_FORM", payload: false });
                    Swal("","data sudah ada","error");
                }
            }
            else {
                handler({ type: "SET_NAME", payload: "" });
                handler({ type: "SET_ADDRESS", payload: "" });
                handler({ type: "SET_AGE", payload: "" });
                handler({ type: "SET_GENDER", payload: "" });
                handler({ type: "SET_IMAGE", payload: "" });
                handler({ type: "OPEN_MODAL_FORM", payload: false });
                Swal("","hanya menerima gambar tipe jpg, jpeg, dan png","error");
            }
        }
        else {
            Swal("","isi semua data dengan benar","error");
        }
    }

    function cancelSubmit() {
        handler({ type: "OPEN_MODAL_FORM", payload: false });
        handler({ type: "SET_NAME", payload: "" });
        handler({ type: "SET_ADDRESS", payload: "" });
        handler({ type: "SET_AGE", payload: "" });
        handler({ type: "SET_GENDER", payload: "" });
        handler({ type: "SET_IMAGE", payload: "" });
    }

    // menghapus salah satu data
    function deleteData(index) {
        Swal({
            title: "kamu ingin menghapus data ini ?",
            text: "data akan hilang setelah dihapus!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                Swal("data berhasil dihapus", {
                    icon: "success",
                })
                const deletedData = state.db.filter((_,i) => i !== index);
                handler({ type: "SET_DATA", payload: [...deletedData] })
                handler({ type: "SET_DATA_LENGTH", payload: state.totalData - 1 });
            }
            else {
                Swal("batal dihapus");
            }
        })
    }

    // menghapus semua data
    function clearAllData() {
        if (state.db.length > 0) {
            Swal({
                title: "kamu ingin menghapus seluruh data ?",
                text: "data akan hilang setelah dihapus!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    Swal("penghapusan berhasil", {
                        icon: "success",
                    })
                    handler({ type: "SET_DATA", payload: [] });
                    handler({ type: "SET_DATA_LENGTH", payload: 0 });
                }
                else {
                    Swal("batal dihapus");
                }
            })
        }
        else {
            Swal("", "kamu belum menambahkan satu data pun", "error");
        }
    }

    // memilih salah satu data yang akan dirubah
    function selectedData(index) {
        selectData.current = index;
        handler({ type: "OPEN_MODAL_FORM", payload: false });
        handler({ type: "OPEN_UPDATE_FORM", payload: true });
        handler({ type: "SET_NAME", payload: state.db[selectData.current].name });
        handler({ type: "SET_AGE", payload: state.db[selectData.current].age });
        handler({ type: "SET_ADDRESS", payload: state.db[selectData.current].address });
        handler({ type: "SET_GENDER", payload: state.db[selectData.current].gender });
        handler({ type: "SET_IMAGE", payload: state.db[selectData.current].image });
        handler({ type: "SET_PREVIEW", payload: state.db[selectData.current].profile });
    }

    // merubah salah satu data yang dipilih
    function updateData(event) {
        event.preventDefault();
        const select1 = /^[a-zA-Z ]+$/;
        const select2 = /^[a-zA-Z 0-9-]+$/;
        const dataCopy = [...state.db];
        if (selectData.current !== null && selectData.current !== undefined) {
            if (state.name.trim() !== "" && state.address.trim() !== "" && state.profile && state.gender && 
                select1.test(state.name) && select2.test(state.address) && state.age > 0) {
                if (dataCopy[selectData.current].name !== state.name || 
                    dataCopy[selectData.current].age !== state.age || 
                    dataCopy[selectData.current].address !== state.address || 
                    dataCopy[selectData.current].gender !== state.gender ||
                    dataCopy[selectData.current].profile !== state.profile) {
                    dataCopy[selectData.current].name = state.name;
                    dataCopy[selectData.current].age = state.age;
                    dataCopy[selectData.current].gender = state.gender;
                    dataCopy[selectData.current].address = state.address;
                    dataCopy[selectData.current].profile = state.profile;
                    handler({ type: "SET_DATA", payload: [...dataCopy] });
                    handler({ type: "SET_NAME", payload: "" });
                    handler({ type: "SET_ADDRESS", payload: "" });
                    handler({ type: "SET_AGE", payload: "" });
                    handler({ type: "SET_GENDER", payload: "" });
                    handler({ type: "SET_IMAGE", payload: "" });
                    handler({ type: "OPEN_UPDATE_FORM", payload: false });
                    Swal("","data berhasil dirubah","success");
                }
                else {
                    Swal("","data sudah ada","error");
                }
            }
            else {
                Swal("","isi data dengan benar","error");
            }
        }
        else {
            Swal("","kamu belum menambahkan data","error");
            handler({ type: "OPEN_UPDATE_FORM", payload: false });
        }
    }

    function cancelUpdate() {
        handler({ type: "OPEN_UPDATE_FORM", payload: false });
        handler({ type: "SET_NAME", payload: "" });
        handler({ type: "SET_ADDRESS", payload: "" });
        handler({ type: "SET_AGE", payload: "" });
        handler({ type: "SET_GENDER", payload: "" });
        handler({ type: "SET_IMAGE", payload: "" });
    }

    // mengurutkan dari kecil ke besar
    function sortByName1() {
        if (state.db.length === 1) {
            Swal("","tambahkan 1 data lagi untuk menggunakan fitur ini");
        }
        else if (state.db.length > 1) {
            const dataCopy = [...state.db];
            const sorted1 = dataCopy.sort((a, b) => a.name.localeCompare(b.name));
            handler({ type: "SET_DATA", payload: [...sorted1] });
        }
        else {
            Swal("","masih kosong");
        }
    }

    // mengurutkan dari besar ke kecil
    function sortByName2() {
        if (state.db.length === 1) {
            Swal("","tambahkan 1 data lagi untuk menggunakan fitur ini");
        }
        else if (state.db.length > 1) {
            const dataCopy = [...state.db];
            const sorted2 = dataCopy.sort((a, b) => b.name.localeCompare(a.name));
            handler({ type: "SET_DATA", payload: [...sorted2] });
        }
        else {
            Swal("","masih kosong");
        }
    }

    return (
        <Fragment>
            <Header number={1} />
            <div className="field-2">
                <div className="form-and-update">
                    <div className="control">
                        <button type="button" onClick={openModal1}>add data</button>
                        <button type="button" onClick={clearAllData}>clear all</button>
                        <button type="button" onClick={() => sortByName1()}>A-Z</button>
                        <button type="button" onClick={() => sortByName2()}>Z-A</button>
                        <div style={{fontFamily:'Calibri',fontSize:'20px'}}>{state.totalData} data added</div>
                    </div>
                    {state.isModalOpen === true && (
                        <form className={`register-form ${state.isModalOpen === true ? "active" : ""}`}>
                            <input placeholder="your name..." type="text" className="set-name" value={state.name} 
                            onChange={setName} />
                            <input placeholder="your age..." type="text" className="set-age" value={state.age} 
                            onChange={setAge} />
                            <input placeholder="your address..." type="text" className="set-address" 
                            value={state.address} onChange={setAddress} />
                            <input type="text" placeholder="your gender..." value={state.gender} onChange={setGender} 
                            className="set-gender" />
                            <input type="file" className="set-image" onChange={setImage} ref={imageRef} />
                            <div className="file-preview">
                                {state.image ?
                                    <img src={state.profile} onClick={setPreview} />
                                    :
                                    <div className="symbol" onClick={setPreview}>Tap here to upload your image</div>
                                }
                            </div>
                            <div className="submit-cancel">
                                <button type="submit" onClick={submitData}>Send</button>
                                <button type="button" onClick={cancelSubmit}>Cancel</button>
                            </div>
                        </form>
                    )}
                    {state.isUpdateOpen === true && (
                        <form className={`register-form ${state.isUpdateOpen === true ? "active" : ""}`}>
                            <RegisterModal 
                                name={state.name} address={state.address} age={state.age} 
                                gender={state.gender} image={state.image} profile={state.profile} 
                                handleName={setName} handleAge={setAge} handleAddress={setAddress} 
                                handleGender={setGender} handleImage={setImage} submit={updateData} 
                                handlePreview={setPreview} refr={imageRef} close={cancelUpdate}
                            />
                        </form>
                    )}
                </div>
                <div className="submitted-data">
                    <div className="show-data">
                        {state.db.length > 0 ? (
                            state.db.map((dt, index) => (
                            <div key={`data-${index}`} className="data-id">
                                <div className="img-container">
                                    <img src={dt.profile} alt={dt.name} />
                                </div>
                                <p>name : {dt.name}</p>
                                <p>age : {dt.age}</p>
                                <p>gender : {dt.gender}</p>
                                <p>address : {dt.address}</p>
                                <div className="data-handler">
                                    <button type="button" onClick={() => selectedData(index)}>📝</button>
                                    <button type="button" onClick={() => deleteData(index)}>🗑️</button>
                                </div>
                            </div>
                        ))) : (
                            <div className="submitted-data">
                                empty...
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer/>
        </Fragment>
    )
}
