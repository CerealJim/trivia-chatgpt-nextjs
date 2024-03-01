import React, { useState } from "react";
import styles from "@/styles/Quiz.module.css";
import TriviaQuestion from "./question";
import { TriviaQuizData } from "../types/triviaQueston";

interface TriviaDataProps {
  quizData: TriviaQuizData[];
}

const TriviaQuiz: React.FC<TriviaDataProps> = ({ quizData = [] }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    Array(quizData.length)
  );
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleAnswerSelect = (selectedUserOption: string, index: number) => {
    setSubmitted(false);
    const newSelectedAnswers = [...selectedAnswers]; //copy by value using spread operator
    newSelectedAnswers[index] = selectedUserOption; //using the index, replace the answer in the correct index slot
    setSelectedAnswers(newSelectedAnswers);

    // console.log(newSelectedAnswers, "selectedAnswers");
  };

  const calculateScore = (): number => {
    let score = 0;
    quizData.forEach((question, index) => {
      if (question.answer === selectedAnswers[index]) {
        score++;
      }
    });
    return score;
  };

  const handleQuizSubmit = () => {
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  return (
    <div>
      {submitted && (
        <div>
          <p className={styles.quizScore}>Your score: {calculateScore()}</p>
        </div>
      )}
      <div className={styles.quizContainer}>
        <div className={styles.quiz}>
          {quizData.map((question, index) => (
            <div key={index}>
              <TriviaQuestion
                question={question.question}
                options={question.options || []}
                answer={question.answer}
                onOptionSelect={(selectedOption) =>
                  handleAnswerSelect(selectedOption, index)
                }
                showAnswers={submitted} // pass the submitted state variable to show answers
              />
            </div>
          ))}
          {!submitted && (
            <div>
              <button
                className={styles.quizSubmitButton}
                onClick={handleQuizSubmit}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TriviaQuiz;
