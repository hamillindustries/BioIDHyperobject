import React from "react";
import "./style.scss";

const TextButton = ({ text, onClick, visible }) => {
  return (
    <div className={`TextButton ${visible ? "" : "hide"}`} onClick={onClick}>
      {text}
    </div>
  );
};

export default TextButton;
