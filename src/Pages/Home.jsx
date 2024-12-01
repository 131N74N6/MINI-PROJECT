import { Fragment, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import "../Styles/Home.css";

export default function Home() {
    const carouselWrap = useRef();
    const cardMove = useRef();

    const contents = [
        { name: 'register + image', link: '/simple-register', icon: <i className="fa-regular fa-address-card"></i> },
        { name: 'color picker', link: '/color-picker', icon: <i className="fa-solid fa-paint-roller"></i> },
        { name: 'image uploader', link: '/image-uploader', icon: <i className="fa-regular fa-image"></i> },
        { name: 'image slider', link: '/image-slider', icon: <i className="fa-solid fa-sliders"></i> },
        { name: 'digital clock', link: '/digital-clock', icon: <i className="fa-regular fa-clock"></i> },
        { name: 'schedule-maker', link: '/schedule-maker', icon: <i className="fa-regular fa-calendar-days"></i> },
        { name: 'register + checkbox', link: '/registration', icon: <i className="fa-regular fa-square-check"></i> },
        { name: 'cart', link: '/cart', icon: <i className="fa-solid fa-cart-shopping"></i> },
        { name: 'multiple choice quiz', link: '/quiz', icon: <i className="fa-solid fa-question"></i> },
        { name: 'simple todo list', link:'/simple-todo-list' }
    ]

    function prevBtn() {
        carouselWrap.current.scrollLeft -= cardMove.current.offsetWidth;
    }

    function nextBtn() {
        carouselWrap.current.scrollLeft += cardMove.current.offsetWidth;
    }
    
    contents.sort((a,b) => a.name.localeCompare(b.name));

    return (
        <Fragment>
            <Header number={0} />
            <div className="project">
                <div className="wrap" ref={carouselWrap}>
                    {contents.map((content, index) => (
                        <div className="project-card" key={`link-${index}`} ref={cardMove}>
                            <div>{content.name}</div>
                            <div className="project-icon">{content.icon}</div>
                            <div className="link">
                                <Link to={content.link}>
                                    <button type="button" className="link-btn">See Project</button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="controller">
                <button type="button" onClick={prevBtn}>prev</button>
                <button type="button" onClick={nextBtn}>next</button>
            </div>
            <Footer/>
        </Fragment>
    )
}