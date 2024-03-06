// components/InputError.tsx

import React from "react";

interface InputErrorProps {
  message: string;
}

const InputError: React.FC<InputErrorProps> = ({ message }) => {
  return <div style={{ color: "white" }}>{message}</div>;
};

export default InputError;
