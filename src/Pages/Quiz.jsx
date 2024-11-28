import { Fragment, useState } from "react";
import Header from "../Components/Header";
import questions from "../Data/questions";
import "../Styles/Quiz.css";

export default function Quiz() {
    const [score, setScore] = useState(0);
    const [total, setTotal] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState({});
    const [isShow, setIsShow] = useState(false);

    function handleAnswer(questionId, isCorrect) {
        setSelectedAnswer((selected) => ({ ...selected, [questionId]: isCorrect }));
    }

    function calculate(event) {
        event.preventDefault();
        const totalTrueAnswer = Object.values(selectedAnswer).filter(Boolean).length;
        const calculate = ((totalTrueAnswer / questions.length) * 100);
        setIsShow(true);
        setTotal(totalTrueAnswer);
        setScore(calculate);
    }

    return (
        <Fragment>
            <Header number={1}/>
            <div className="quiz-wrap">
                <form title="quiz">
                    <div className="result">
                        <button type="submit" onClick={calculate}>Submit</button>
                        {isShow === true ? 
                            <div className="message">
                                <div className="score">Nilai : {score.toFixed(2)}</div>
                                <div className="text">
                                    Kamu menjawab benar {total} pertanyaan dari {questions.length} pertanyaan yang ada.
                                </div>
                            </div> : 
                            <div className="message">
                                "Coba kerjakan quiz ini untuk mengetahui berapa nilai yang kamu dapatkan."
                            </div>
                        }
                    </div>
                    <div className="content">
                        <ol>
                            {questions.slice(0,8).map((q) => (
                                <li className="quest-id" key={q.id}>
                                    <div className="questions">{q.question}</div>
                                    {q.answer.map((a, index) => (
                                        <div key={`answer-${q.id}-${index}`}>
                                            <input 
                                                type="radio" id={`question-${q.id}-${a.choose}`} 
                                                name={`question-n-${q.id}`} value={a.choose} 
                                                onChange={() => handleAnswer(q.id, a.isCorrect)}
                                            />
                                            <label htmlFor={`question-${q.id}-${a.choose}`}>{a.choose}</label>
                                        </div>
                                    ))}
                                </li>
                            ))}
                        </ol>
                    </div>
                    <div className="content">
                        <ol start={9}>
                            {questions.slice(8,14).map((q) => (
                                <li className="quest-id" key={q.id}>
                                    <div className="questions">{q.question}</div>
                                    {q.answer.map((a, index) => (
                                        <div key={`answer-${q.id}-${index}`}>
                                            <input 
                                                type="radio" id={`question-${q.id}-${a.choose}`} 
                                                name={`question-n-${q.id}`} value={a.choose} 
                                                onChange={() => handleAnswer(q.id, a.isCorrect)}
                                            />
                                            <label htmlFor={`question-${q.id}-${a.choose}`}>{a.choose}</label>
                                        </div>
                                    ))}
                                </li>
                            ))}
                        </ol>
                    </div>
                </form>
            </div>
        </Fragment>
    )
}
