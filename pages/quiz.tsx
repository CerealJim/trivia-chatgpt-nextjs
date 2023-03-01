import React, { useState } from "react";
import styles from "@/styles/Question.module.css";
import TriviaQuestion from "./question";
import { TriviaQuizData } from "../types/triviaQueston";

interface TriviaDataProps {
  quizData: TriviaQuizData[];
}

const TriviaQuiz: React.FC<TriviaDataProps> = ({ quizData = [] }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleAnswerSelect = (selectedUserOption: string, index: number) => {
    // setSelectedAnswers([...selectedAnswers, selectedUserOption]);
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[index] = selectedUserOption;
    setSelectedAnswers(newSelectedAnswers);
    console.log(selectedAnswers, "selectedAnswers");
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
  };

  return (
    <div>
      {quizData.map((question, index) => (
        <div key={index}>
          <TriviaQuestion
            question={question.question}
            options={question.options || []}
            answer={question.answer}
            onOptionSelect={(selectedOption) =>
              handleAnswerSelect(selectedOption, index)
            }
          />
        </div>
      ))}
      <div>
        <button onClick={handleQuizSubmit}>Submit</button>
      </div>
      {submitted && (
        <div>
          <p>Your score: {calculateScore()}</p>
        </div>
      )}
    </div>
  );
};

export default TriviaQuiz;