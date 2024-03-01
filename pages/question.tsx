import React, { useState } from "react";
import styles from "@/styles/Question.module.css";

interface TriviaQuestionProps {
  question: string;
  options?: string[];
  answer: string;
  onOptionSelect: (selectedOption: string) => void;
  showAnswers: boolean;
}

const TriviaQuestion: React.FC<TriviaQuestionProps> = ({
  question,
  options = [],
  onOptionSelect,
  answer,
  showAnswers,
}) => {
  const [selectedOption, setSelectedOption] = useState("");
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!showAnswers) {
      onOptionSelect(event.target.value);
      setSelectedOption(event.target.value);
    }

    // console.log(event.target.value, "selected Option");
  };
  const optionLetter: string[] = ["a. ", "b. ", "c. ", "d. "];

  return (
    <div className={styles.questionContainer}>
      <h2 className={styles.question}>{question}</h2>
      <form className={styles.optionsContainer}>
        {options.map((option, index) => (
          <div
            key={index}
            className={`${styles.option} 
              ${selectedOption === option ? styles.selectedOption : ""}
              ${
                showAnswers && option === answer
                  ? styles.correct
                  : showAnswers && option !== answer
                  ? styles.incorrect
                  : ""
              }
              `}
          >
            <span className={styles.optionLetter}>{optionLetter[index]}</span>
            <input
              type="radio"
              id={option}
              name="option"
              value={option}
              checked={selectedOption === option}
              onChange={handleOptionChange}
              className={`${styles.customRadio}`}
            />
            <label htmlFor={option} className={styles.label}>
              {option}
            </label>
          </div>
        ))}
      </form>
    </div>
  );
};

export default TriviaQuestion;
