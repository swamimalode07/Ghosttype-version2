"use client";
import React, { useEffect, useState } from "react";
import { generate } from "random-words";

const TypingPage = () => {
  const [words, setWords] = useState("");
  const [input, setInput] = useState("");

  useEffect(() => {
    setWords(generate({ exactly: 30, join: " " }));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if(e.key==="Backspace"){
        setInput((prev)=> prev.slice(0,-1));
        return
      }

      if (e.key.length !== 1) return;
      if (input.length >= words.length) return;

      setInput((prev) => prev + e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input, words]);

  return (
    <div className="max-w-3xl mx-auto mt-10 text-center">
      <div className="text-lg leading-relaxed font-mono border p-4 rounded">
        {words.split("").map((char, index) => {
          const typedChar = input[index];

          let className = "text-gray-400";
          if (typedChar !== undefined) {
            className =
              typedChar === char ? "text-green-500" : "text-red-500";
          }

          return (
            <span key={index} className="relative text-center">
              {index === input.length && (
                <span className="absolute -left-[2px] top-0 w-[2px] h-[1.2em] bg-black animate-pulse text-center" />
              )}
              <span className={className} >{char}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default TypingPage;
