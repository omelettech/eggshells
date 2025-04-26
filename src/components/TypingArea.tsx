import React, {
    useEffect,
    useState,
    useRef,
    KeyboardEvent,
    FormEvent,
    FC,
} from "react";

import "./TypingArea.css"
interface CompletedWord {
    word: string;
    correct: boolean;
}

interface InputProps {
    signalStart: () => void;
    setStats: (stats: [number, number, string]) => void;
    time: number;
}

const TypingArea: FC<InputProps> = ({ signalStart, setStats, time }) => {
    const textInputRef = useRef<HTMLDivElement|null>(null);
    const targetWordRef = useRef<HTMLSpanElement|null>(null);
    const initialTargetWords: string[] = ["hello","World"];
    const [targetWords, setTargetWords] = useState<string[]>(initialTargetWords);
    const [currentTarget, setCurrentTarget] = useState<string>(initialTargetWords[0]);
    const [userInput, setUserInput] = useState<string>("");
    const [wrongInput, setWrongInput] = useState<boolean>(false);
    const [completedWords, setCompletedWords] = useState<CompletedWord[]>([]);

    const focusInput = (): void => {
        textInputRef.current?.focus();
    };

    // Update the displayed target word as user types
    useEffect(() => {
        const numOfCharsEntered = userInput.trim().length;
        if (currentTarget && targetWordRef.current) {
            if (userInput === currentTarget.slice(0, numOfCharsEntered)) {
                console.log(currentTarget)
                targetWordRef.current.textContent = currentTarget.slice(numOfCharsEntered);
                setWrongInput(false);
            } else {
                setWrongInput(true);
            }
        }
    }, [userInput, currentTarget]);

    useEffect(() => {
        focusInput();
    }, []);

    useEffect(() => {
        console.log(completedWords)
    }, [completedWords]);
    const submitWord = (e: KeyboardEvent<HTMLDivElement>): void => {
        signalStart();
        if (e.key === " " || e.key === "Enter") {
            const trimmedInput = userInput.trim();
            const correct = currentTarget === trimmedInput;

            setCompletedWords((prev) => [
                ...prev,
                { word: trimmedInput, correct },
            ]);

            // Update the target words list and current target word
            const newTargetWord = targetWords[1];
            setCurrentTarget(newTargetWord);

            // Clear the input text and state
            if (textInputRef.current) {
                textInputRef.current.textContent = "";
            }
            setUserInput("");

            // Prevent default space or enter insertion
            e.preventDefault();
        }
    };

    const countWordsCharsAndAcc = (): [number, number, string] => {
        const totalWordsCount = completedWords.length;
        const correctWords = completedWords.filter((obj) => obj.correct);
        const correctWordsCount = correctWords.length;
        const characterCount = correctWords.reduce(
            (acc, curr) => acc + curr.word.length,
            0
        );
        const accuracyRate =
            totalWordsCount > 0
                ? ((correctWordsCount / totalWordsCount) * 100).toFixed(2)
                : "0.00";

        return [correctWordsCount, characterCount, accuracyRate];
    };

    // Reset input and update stats when time reaches zero
    useEffect(() => {
        if (time === 0) {
            setStats(countWordsCharsAndAcc());
            const newTargetWords = ["Changed","Hello","world"];
            setTargetWords(newTargetWords);
            setCurrentTarget(newTargetWords[0]);
            setUserInput("");
            setWrongInput(false);
            setCompletedWords([]);
            if (textInputRef.current) {
                textInputRef.current.textContent = "";
            }
        }
    }, [time, setStats]);

    return (
        <div
            className="input-form bg-light"
            id="tooltip-target"
            onClick={focusInput}
        >
            <div className="input-field-wrapper">
                <div style={{ display: "flex", float: "right", textAlign: "right" }}>
                    {completedWords.slice(-10).map((val, i) => (
                        <span
                            key={i}
                            className={`word ${val.correct ? "completed" : "completed-wrong"}`}
                        >
              {val.word}
            </span>
                    ))}

                    <div
                        className={`input-field ${wrongInput ? "wrong" : "correct"}`}
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck="false"
                        contentEditable
                        ref={textInputRef}
                        onInput={(e: FormEvent<HTMLDivElement>) => {
                            setUserInput(e.currentTarget.textContent || "");
                        }}
                        onKeyPress={submitWord}
                    ></div>
                </div>
            </div>

            <div className="words-list">
                {targetWords.map((val, i) => (
                    <span
                        key={i}
                        ref={i === 0 ? targetWordRef : null}
                        className="word"
                    >
            {val}
          </span>
                ))}
            </div>
        </div>
    );
};

export default TypingArea;
