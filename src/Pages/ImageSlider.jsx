import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import animeImages from "../Data/animeImages";
import movieImages from "../Data/movieImages";
import "../Styles/ImageSlider.css";

export default function ImageSlider() {
    const [index1, setIndex1] = useState(0);
    const [index2, setIndex2] = useState(0);

    function prevButton() {
        setIndex1((updateIndex) => updateIndex - 1);
    }

    function nextButton() {
        setIndex1((updateIndex) => updateIndex + 1);
    }

    function prevButton2() {
        if (index2 > 0) {
            setIndex2(index2 - 1);
        }
        else {
            setIndex2(0)
        }
    }

    function nextButton2() {
        if (index2 < movieImages.length - 1) {
            setIndex2(index2 + 1);
        }
        else {
            setIndex2(0);
        }
    }

    return (
        <Fragment>
            <div className="background-wrap">
                <Link className="back-home" to="/">⬅️</Link>
                {animeImages.map((image, i) => (
                    <div className={`background-content ${index1 === i ? "active" : ""}`} key={i} >
                        <img src={image.image} alt={image.text} className={`image${i}`} />
                        <div className="group-of-text">
                            <h2 className="judul-gambar">{image.text}</h2>
                        </div>
                    </div>    
                ))}
            </div>
            <div className="next-prev">
                <button type="button" className="prev-btn" onClick={prevButton} disabled={index1 === 0}>
                    <i className="fa-solid fa-backward"></i>
                </button>
                <button type="button" className="next-btn" onClick={nextButton} 
                disabled={index1 === animeImages.length - 1}>
                    <i className="fa-solid fa-forward"></i>
                </button>
            </div>
            <div className="background-wrap-2">
                {movieImages.map((image2, i) => (
                    <div className={`background-content-2 ${index2 === i ? "active" : ""}`} key={i}>
                        <img src={image2.image} alt={image2.text} className={`image2${i}`} />
                        <div className="group-of-text-2">
                            <h2>{image2.text}</h2>
                        </div>
                    </div>
                ))}
            </div>
            <div className="next-prev-2">
                <button type="button" className="prev-btn-2" onClick={prevButton2} >
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <button type="button" className="next-btn-2" onClick={nextButton2} >
                    <i className="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </Fragment>
    )
}
