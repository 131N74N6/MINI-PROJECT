import { useReducer } from "react";
import Swal from "sweetalert";
import Header from "../Components/Header";
import "../Styles/ImageUploader.css";

const defaultValue = {
    text:"", imageData: [], filterData: [], preview: "", image: "", imageUrl: "", search: "", totalImg: 0, 
    isFormOpen: false, isSearchOpen: false
}

function reducer(state, action) {
    switch(action.type) {
        case "image":
            return { ...state, image: action.payload }
        case "imageData":
            return { ...state, imageData: action.payload }
        case "filterData":
            return { ...state, filterData: action.payload }
        case "imageUrl":
            return { ...state, imageUrl: action.payload }
        case "text":
            return { ...state, text: action.payload }
        case "totalImg":
            return { ...state, totalImg: action.payload }
        case "search":
            return { ...state, search: action.payload }
        case "preview":
            return { ...state, preview: action.payload }
        case "isFormOpen":
            return { ...state, isFormOpen: action.payload }
        case "isSearchOpen":
            return { ...state, isSearchOpen: action.payload }
        default:
            return state;
    }
}

export default function ImageUploader() {
    const [state, dispatch] = useReducer(reducer, defaultValue);

    function handleImage(event) {
        const newImage = (event.target.files[0]);
        dispatch({ type: "image", payload: newImage });

        const reader = new FileReader();
        reader.onloadend = () => {
            dispatch({ type: "preview", payload: reader.result });
        }

        reader.readAsDataURL(newImage);
    }

    function handleImgUrl(event) {
        const newImgUrl = (event.target.value);
        dispatch({ type: "imageUrl", payload: newImgUrl });
    }

    function handleText(event) {
        const newText = (event.target.value);
        dispatch({ type: "text", payload: newText });
    }

    // Mengunggah gambar
    function handleSubmit(event) {
        event.preventDefault();

        const imageFromFile = {
            image: state.preview, // Gunakan URL preview ini daripada objek file
            text: state.text,
        }

        const imageFromUrl = {
            imgUrl: state.imageUrl,
            text: state.text,
        }

        const allowChar = /^[a-zA-Z 0-9_]+$/;
        const allowedType = ["image/jpg","image/jpeg","image/png","image/gif"];

        if (allowedType.includes(state.image.type)) {
            if (allowChar.test(state.text)) {
                if (state.image) {
                    dispatch({ type: "imageData", payload: [...state.imageData, imageFromFile] });
                    Swal("", "Gambar berhasil di upload", "success");
                    dispatch({ type: "image", payload: "" });
                    dispatch({ type: "text", payload: "" });
                    dispatch({ type: "preview", payload: "" });
                    dispatch({ type: "totalImg", payload: state.totalImg + 1 });
                    dispatch({ type: "isFormOpen", payload: false });
                }
                else {
                    dispatch({ type: "imageData", payload: [...state.imageData, imageFromUrl] });
                    Swal("", "Gambar berhasil di upload", "success");
                    dispatch({ type: "image", payload: "" });
                    dispatch({ type: "imageUrl", payload: "" });
                    dispatch({ type: "text", payload: "" });
                    dispatch({ type: "totalImg", payload: state.totalImg + 1 });
                    dispatch({ type: "isFormOpen", payload: false });
                }
            }
            else {
                Swal("masukkan keterangan dengan benar");
                dispatch({ type: "text", payload: "" });
            }
        }
        else {
            Swal("hanya menerima jpg, jpeg, dan png");
            dispatch({ type: "image", payload: "" });
            dispatch({ type: "imageUrl", payload: "" });
            dispatch({ type: "text", payload: "" });
        }
    }

    // menghapus seluruh gambar
    function eraseAll() {
        if (state.imageData.length > 0) {
            Swal({
                title: "Kamu Ingin Menghapus Seluruh Gambar ?",
                text: "Gambar yang Sudah Dihapus Tidak Dapat Kembali",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    Swal("Berhasil Dikosongkan", {
                        icon: "success",
                    });
                    dispatch({ type: "imageData", payload: [] });
                    dispatch({ type: "totalImg", payload: 0 });
                }
                else {
                    Swal("","Gambar Batal Dihapus","warning");
                }
            })
        }
        else {
            Swal("","Kamu Belum Mengunggah Gambar Satu Pun","warning");
        }
    }

    // Menghapus salah satu gambar dengan nilai index
    function deleteImage(index) {
        Swal({
            title: "Kamu Ingin Menghapus Gambar Ini ?",
            text: "Gambar yang Sudah Dihapus Tidak Dapat Kembali",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                Swal("Gambar Berhasil Dihapus", {
                    icon: "success",
                })
                const updatedImage = state.imageData.filter((_, i) => i !== index);
                dispatch({ type: "imageData", payload: [...updatedImage] });
                dispatch({ type: "totalImg", payload: state.totalImg - 1 });
            }
            else {
                Swal("Gambar Batal Dihapus");
            }
        })
    }

    function deleteFilteredImage(selected) {
        Swal({
            title: "Kamu Ingin Menghapus Gambar Ini ?",
            text: "Gambar yang Sudah Dihapus Tidak Dapat Kembali",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                Swal("Objek Berhasil Dihapus", {
                    icon: "success",
                });
                const index = state.imageData.findIndex((imgData) => imgData === selected);
                if (index !== -1) {
                    state.imageData.splice(index, 1);
                    dispatch({ type: "imageData", payload: [...state.imageData] });
                    dispatch({ type: "totalImg", payload: state.totalImg - 1 });
                    dispatch({ type: "filterData", payload: [] });
                }
            } 
            else {
                Swal("Gambar Batal Dihapus");
            }
        });
    }

    function clearAllFilteredData() {
        if (state.filterData.length > 0) {
            Swal({
                title: "Kamu Ingin Menghapus Seluruh Gambar ?",
                text: "Gambar yang Sudah Dihapus Tidak Dapat Kembali",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    Swal("Objek Berhasil Dihapus", {
                        icon: "success",
                    });
                    dispatch({ type: "imageData", payload: [] });
                    dispatch({ type: "filterData", payload: [] });
                    dispatch({ type: "totalImg", payload: 0 });
                } 
                else {
                    Swal("Gambar Batal Dihapus");
                }
            });
        }
        else {
            Swal("kamu belum mengunggah satu pun gambar");
        }
    }

    //handle popup form
    function openForm() {
        dispatch({ type: "isFormOpen", payload: true });
    }

    function closeForm() {
        dispatch({ type: "isFormOpen", payload: false });
    }

    // Sorting data berdasarkan nama gambar 
    function ascendSort() {
        const data = [...state.imageData];
        const ascSort = data.sort((a, b) => a.text.localeCompare(b.text));
        dispatch({ type: "imageData", payload: ascSort });
    }

    function descendSort() {
        const data = [...state.imageData];
        const dscSort = data.sort((a, b) => b.text.localeCompare(a.text));
        dispatch({ type: "imageData", payload: dscSort });
    }

    function handleSearch(event) {
        const newText = event.target.value;
        dispatch({ type: "search", payload: newText });
        const filteredData = state.imageData.filter((imgData) => imgData.text.toLowerCase().includes(newText.toLowerCase()));
        dispatch({ type: "filterData", payload: filteredData });
    }

    function openSearch() {
        dispatch({ type: "isSearchOpen", payload: true });
    }

    function closeSearch() {
        dispatch({ type: "isSearchOpen", payload: false });
        dispatch({ type: "filterData", payload: [] });
    }

    return (
        <div className="image-uploader">
            <Header number={1} />
            <div className="img-nav">
                <button type="button" className="add-image" onClick={openForm}>
                    Add Image
                </button>
                <button type="button" className="erase-all" onClick={eraseAll}>
                    Hapus Semua
                </button>
                <button type="button" id="sorting" onClick={() => ascendSort()}>A-Z</button>
                <button type="button" id="sorting" onClick={() => descendSort()}>Z-A</button>
                <button type="button" onClick={openSearch} id="open-sc-filter">search</button>
                {state.isSearchOpen === true ?
                    <form title="filter-images">
                        <input type="search" placeholder="search title..." id="search-filter"
                        value={state.search} onChange={handleSearch} />
                        <button className="fl-erase-all" onClick={clearAllFilteredData}>Hapus Semua</button>
                        <button onClick={closeSearch} id="close-search">Cancel</button>
                    </form> : null
                }
                <div className="total-img">{state.totalImg} image(s)</div>
            </div> 
            {state.isFormOpen === true ?
                <div className="modal-form-wrap">
                    <form className="uploader-form" title="uploader-form">
                        <input type="file" placeholder="pilih file.." id="img-data" onChange={handleImage} />
                        <input type="url" placeholder="insert image url..." value={state.imageUrl} id="img-text"
                            onChange={handleImgUrl} />
                        <input type="text" placeholder="your text..." value={state.text} id="img-text"
                            onChange={handleText} required />
                        <div className="submit-cancel">
                            <button type="button" id="close-modal" onClick={closeForm}>Cancel</button>
                            <button type="submit" id="submit-img" onClick={handleSubmit}>Unggah</button>
                        </div>
                    </form>
                </div> : null
            }
            <div className="content-3">
                <div className="lot-of-img">
                    {state.filterData.length > 0 ? (
                        state.filterData.map((fltData, index) => (
                            <div className="img-content" key={index}>
                                {fltData.image ? (
                                    <div className="img-wrap">
                                        <img id="gambar" src={fltData.image} alt={index} />
                                        <div className="img-context">
                                            <div className="text">{fltData.text}</div>
                                            <button type="button" onClick={() => deleteFilteredImage(fltData)}>🗑️</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="img-wrap">
                                        <img id="gambar" src={fltData.imgUrl} alt={index} />
                                        <div className="img-context">
                                            <div className="text">{fltData.text}</div>
                                            <button type="button" onClick={() => deleteFilteredImage(fltData)}>🗑️</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        state.imageData.length > 0 ? (
                            state.imageData.map((imgData, index) => (
                                <div className="img-content" key={index}>
                                    {imgData.image ? (
                                        <div className="img-wrap">
                                            <img id="gambar" src={imgData.image} alt={index} />
                                            <div className="img-context">
                                                <div className="text">{imgData.text}</div>
                                                <button type="button" onClick={() => deleteImage(index)}>🗑️</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="img-wrap">
                                            <img id="gambar" src={imgData.imgUrl} alt={index} />
                                            <div className="img-context">
                                                <div className="text">{imgData.text}</div>
                                                <button type="button" onClick={() => deleteImage(index)}>🗑️</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-wrap">
                                <div>Tidak Ada Gambar yang Di Unggah</div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}
