import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loading from "./Utilities/Loading";
import "./Styles/App.css";

const Home = lazy(() => import("./Pages/Home"));
const SimpleRegister = lazy(() => import("./Pages/SimpleRegister"));
const ImageUploader = lazy(() => import("./Pages/ImageUploader"));
const ColorPicker = lazy(() => import("./Pages/ColorPicker"));
const ImageSlider = lazy(() => import("./Pages/ImageSlider"));
const DigitalClock = lazy(() => import("./Pages/DigitalClock"));
const Schedule = lazy(() => import("./Pages/Schedule"));
const Registration = lazy(() => import("./Pages/Registration"));
const Cart = lazy(() => import("./Pages/Cart"));
const Quiz = lazy(() => import("./Pages/Quiz"));
const SimpleTodo = lazy(() => import("./Pages/ToDo"));

export default function App() {
    return (
        <>
            <Suspense fallback={<Loading/>}>
                <Router>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/simple-register" element={<SimpleRegister/>}/>
                        <Route path="/image-uploader" element={<ImageUploader/>}/>
                        <Route path="/color-picker" element={<ColorPicker/>}/>
                        <Route path="/image-slider" element={<ImageSlider/>}/>
                        <Route path="/digital-clock" element={<DigitalClock/>}/>
                        <Route path="/schedule-maker" element={<Schedule/>}/>
                        <Route path="/registration" element={<Registration/>}/>
                        <Route path="/cart" element={<Cart/>}/>
                        <Route path="/quiz" element={<Quiz/>}/>
                        <Route path="/simple-todo-list" element={<SimpleTodo/>}/>
                    </Routes>
                </Router>
            </Suspense>
        </>
    )
}