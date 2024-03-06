import React, { useState, useEffect, KeyboardEventHandler } from "react";
import TriviaQuiz from "./quiz";
import styles from "@/styles/Form.module.css";
import { TriviaQuizProps } from "../types/triviaQueston";
import * as Loader from "react-loader-spinner";
import InputError from "./InputError";

interface OpenAIAPIResponse {
  data: string;
  success: boolean;
}
const apiKey = process.env.NEXT_PUBLIC_OPENAI_TOKEN;

const TriviaForm: React.FC = () => {
  const [response, setResponse] = useState<OpenAIAPIResponse>({
    data: "",
    success: false,
  });
  const [loading, setLoading] = useState(false);
  const [triviaQuizProps, setTriviaQuizProps] = useState<TriviaQuizProps[]>([]);

  // State for difficulty and topic
  const [difficulty, setDifficulty] = useState("easy");
  const [topic, setTopic] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  // const [showQuestions, setShowQuestions] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  // API handler using user responses
  const handleClick = async () => {
    if (topic.length <= 2) {
      setErrorMessage("The topic must be at least 2 characters long.");
      return;
    } else {
      setErrorMessage("");
    }

    setLoading(true);
    const result = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: `Give me 3 ${difficulty} trivia questions about ${topic} with 4 options, and their answer, only in a json array format, not a string`,
        // model: "text-davinci-003",
        model: "gpt-3.5-turbo-instruct",
        temperature: 0,
        top_p: 1,
        max_tokens: 350,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });

    const json = await result.json();
    // console.log(json, "json");

    try {
      const chatGptAnswer = json.choices[0].text;
      const parsedTrivia: TriviaQuizProps[] = JSON.parse(
        chatGptAnswer
      ) as TriviaQuizProps[];
      // console.log(parsedTrivia, "parsed json");
      setTriviaQuizProps(parsedTrivia);
    } catch (error) {
      console.error("error parsing chatgpt response");
    }

    // setResponse({ data: json.choices[0].text, success: true });
    setLoading(false);
    setFormSubmitted(true);
  };

  const handleDifficultyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDifficulty(event.target.value);
  };

  const handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(event.target.value);
    if (event.target.value.length >= 2) {
      setErrorMessage("");
    }
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(event, "keypress");
    if (event.key === "Enter") {
      handleClick();
    }
  };

  const handleFormSubmitted = () => {
    setFormSubmitted(false);
  };

  return (
    <div>
      {formSubmitted ? (
        <div className={styles.formDataContainer}>
          <div className={styles.formData}>
            <p>Topic: {topic}</p>
            <p>Difficulty: {difficulty}</p>
            <button className={styles.userStart} onClick={handleFormSubmitted}>
              Back to setup
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.formContainer}>
          <div className={styles.form}>
            <h2 className={styles.formTitle}>Setup Quiz</h2>
            <div className={styles.userInput}>
              <label className={styles.label}>Enter Topic</label>
              <input
                type="text"
                value={topic}
                onChange={handleTopicChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter a topic"
                maxLength={50}
                className={styles.input}
              />
            </div>
            <div className={styles.userInput}>
              <label className={styles.label}>Select Difficulty</label>
              <select
                value={difficulty}
                onChange={handleDifficultyChange}
                className={styles.select}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            {loading ? (
              <button className={styles.userStartLoading} onClick={handleClick}>
                Start
              </button>
            ) : (
              <button className={styles.userStart} onClick={handleClick}>
                Start
              </button>
            )}
          </div>
          {errorMessage && <InputError message={errorMessage} />}
        </div>
      )}
      <div>
        {loading ? (
          <span className={styles.loadingSpin}>
            <div>
              <Loader.RotatingLines
                strokeColor="white"
                strokeWidth="4"
                animationDuration="1.5"
                width="96"
                visible={true}
              />
            </div>
          </span>
        ) : triviaQuizProps.length > 0 && formSubmitted ? (
          <TriviaQuiz quizData={triviaQuizProps} />
        ) : null}
      </div>
    </div>
  );
};

export default TriviaForm;
