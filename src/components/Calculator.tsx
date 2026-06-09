"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CalculatorIcon } from "lucide-react";
import { Function as FunctionIcon } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

/**
 * Safe recursive-descent math evaluator.
 * Supports: +, -, *, /, parentheses, decimal numbers.
 * Does NOT use eval or new Function — fully type-safe.
 */
function safeMathEval(expr: string): number {
  let pos = 0;
  const peek = () => expr[pos] ?? "";
  const consume = () => expr[pos++];

  const skipSpaces = () => {
    while (peek() === " ") pos++;
  };

  const parseNumber = (): number => {
    skipSpaces();
    let numStr = "";
    while (/[0-9.]/.test(peek())) numStr += consume();
    if (!numStr) throw new Error("Expected number");
    return parseFloat(numStr);
  };

  const parseExpr = (): number => parseAddSub();

  const parseAddSub = (): number => {
    let left = parseMulDiv();
    skipSpaces();
    while (peek() === "+" || peek() === "-") {
      const op = consume();
      const right = parseMulDiv();
      left = op === "+" ? left + right : left - right;
      skipSpaces();
    }
    return left;
  };

  const parseMulDiv = (): number => {
    let left = parseUnary();
    skipSpaces();
    while (peek() === "*" || peek() === "/") {
      const op = consume();
      const right = parseUnary();
      if (op === "/" && right === 0) throw new Error("Division by zero");
      left = op === "*" ? left * right : left / right;
      skipSpaces();
    }
    return left;
  };

  const parseUnary = (): number => {
    skipSpaces();
    if (peek() === "-") { consume(); return -parsePrimary(); }
    if (peek() === "+") { consume(); return parsePrimary(); }
    return parsePrimary();
  };

  const parsePrimary = (): number => {
    skipSpaces();
    if (peek() === "(") {
      consume(); // (
      const val = parseExpr();
      skipSpaces();
      if (peek() === ")") consume();
      return val;
    }
    return parseNumber();
  };

  const result = parseExpr();
  return result;
}

interface CalculatorState {
  display: string;
  expression: string;
  previousValue: number | null;
  operation: string | null;
  waitingForNewValue: boolean;
  memory: number;
}

interface CalculatorProps {
  /** AI-extracted expression to pre-fill and evaluate on mount, e.g. "20 * 500" */
  initialExpression?: string;
}

const Calculator = ({ initialExpression }: CalculatorProps = {}) => {
  const t = useTranslations("Tools.Calculator");
  const [mode, setMode] = useState<"basic" | "scientific">("basic");
  const [state, setState] = useState<CalculatorState>({
    display: "0",
    expression: "",
    previousValue: null,
    operation: null,
    waitingForNewValue: false,
    memory: 0,
  });

  const formatNumber = (num: number): string => {
    if (num === 0) return "0";
    if (Math.abs(num) < 1e-10) return "0";
    if (Math.abs(num) >= 1e15) return num.toExponential(6);
    return num.toString();
  };

  // Auto-evaluate initialExpression when provided by the AI pre-fill system
  useEffect(() => {
    if (!initialExpression) return;
    try {
      // Safe math parser — supports +, -, *, /, parentheses, decimals
      const sanitized = initialExpression.replace(/[^0-9+\-*/.() ]/g, "").trim();
      if (!sanitized) return;
      const result = safeMathEval(sanitized);
      if (typeof result === "number" && isFinite(result)) {
        setState({
          display: formatNumber(result),
          expression: `${initialExpression} = ${formatNumber(result)}`,
          previousValue: null,
          operation: null,
          waitingForNewValue: true,
          memory: 0,
        });
      }
    } catch {
      setState((prev) => ({
        ...prev,
        display: initialExpression,
        expression: initialExpression,
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialExpression]);

  const calculate = (a: number, b: number, operation: string): number => {
    switch (operation) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        if (b === 0) throw new Error("Cannot divide by zero");
        return a / b;
      case "^":
        return Math.pow(a, b);
      case "√":
        return Math.sqrt(a);
      case "∛":
        return Math.cbrt(a);
      case "log":
        return Math.log10(a);
      case "ln":
        return Math.log(a);
      case "sin":
        return Math.sin((a * Math.PI) / 180);
      case "cos":
        return Math.cos((a * Math.PI) / 180);
      case "tan":
        return Math.tan((a * Math.PI) / 180);
      case "asin":
        return (Math.asin(a) * 180) / Math.PI;
      case "acos":
        return (Math.acos(a) * 180) / Math.PI;
      case "atan":
        return (Math.atan(a) * 180) / Math.PI;
      default:
        return b;
    }
  };

  const handleNumber = (num: string) => {
    setState((prev) => {
      if (prev.waitingForNewValue) {
        return {
          ...prev,
          display: num,
          expression: prev.expression + num,
          waitingForNewValue: false,
        };
      }
      if (prev.expression === "" || prev.expression.includes("=")) {
        // Starting fresh calculation or after equals
        return {
          ...prev,
          display: prev.display === "0" ? num : prev.display + num,
          expression: prev.display === "0" ? num : prev.display + num,
        };
      }
      return {
        ...prev,
        display: prev.display === "0" ? num : prev.display + num,
        expression: prev.expression + num,
      };
    });
  };

  const handleOperation = (op: string) => {
    setState((prev) => {
      const currentValue = parseFloat(prev.display);
      const displayOp = op === "×" ? "×" : op === "÷" ? "÷" : op;

      if (prev.previousValue === null) {
        return {
          ...prev,
          previousValue: currentValue,
          operation: op,
          expression: prev.display + " " + displayOp + " ",
          waitingForNewValue: true,
        };
      }

      if (prev.operation && !prev.waitingForNewValue) {
        try {
          const result = calculate(
            prev.previousValue,
            currentValue,
            prev.operation
          );
          return {
            ...prev,
            display: formatNumber(result),
            expression: prev.expression + " = " + formatNumber(result),
            previousValue: result,
            operation: op,
            waitingForNewValue: true,
          };
        } catch (error) {
          return {
            ...prev,
            display: "Error",
            expression: prev.expression + " = Error",
            previousValue: null,
            operation: null,
            waitingForNewValue: true,
          };
        }
      }

      return {
        ...prev,
        operation: op,
        expression: prev.expression + " " + displayOp + " ",
        waitingForNewValue: true,
      };
    });
  };

  const handleEquals = () => {
    setState((prev) => {
      if (prev.previousValue === null || prev.operation === null) return prev;

      const currentValue = parseFloat(prev.display);
      try {
        const result = calculate(
          prev.previousValue,
          currentValue,
          prev.operation
        );
        return {
          ...prev,
          display: formatNumber(result),
          expression: prev.expression + " = " + formatNumber(result),
          previousValue: null,
          operation: null,
          waitingForNewValue: true,
        };
      } catch (error) {
        return {
          ...prev,
          display: "Error",
          expression: prev.expression + " = Error",
          previousValue: null,
          operation: null,
          waitingForNewValue: true,
        };
      }
    });
  };

  const handleClear = () => {
    setState({
      display: "0",
      expression: "",
      previousValue: null,
      operation: null,
      waitingForNewValue: false,
      memory: 0,
    });
  };

  const handleClearEntry = () => {
    setState((prev) => ({
      ...prev,
      display: "0",
      expression: prev.expression.replace(/\s+\d+$/, ""),
      waitingForNewValue: true,
    }));
  };

  const handleBackspace = () => {
    setState((prev) => {
      if (prev.display.length > 1) {
        return {
          ...prev,
          display: prev.display.slice(0, -1),
          expression: prev.expression.slice(0, -1),
        };
      }
      return {
        ...prev,
        display: "0",
        expression: prev.expression.replace(/\d+$/, ""),
      };
    });
  };

  const handleDecimal = () => {
    setState((prev) => {
      if (prev.waitingForNewValue) {
        return {
          ...prev,
          display: "0.",
          expression: prev.expression + "0.",
          waitingForNewValue: false,
        };
      }
      if (!prev.display.includes(".")) {
        return {
          ...prev,
          display: prev.display + ".",
          expression: prev.expression + ".",
        };
      }
      return prev;
    });
  };

  const handleScientificFunction = (func: string) => {
    setState((prev) => {
      const currentValue = parseFloat(prev.display);
      try {
        const result = calculate(currentValue, 0, func);
        const funcDisplay = func === "√" ? "√" : func === "∛" ? "∛" : func;
        return {
          ...prev,
          display: formatNumber(result),
          expression:
            funcDisplay + "(" + prev.display + ") = " + formatNumber(result),
          waitingForNewValue: true,
        };
      } catch (error) {
        return {
          ...prev,
          display: "Error",
          expression: func + "(" + prev.display + ") = Error",
          waitingForNewValue: true,
        };
      }
    });
  };

  const handleMemoryOperation = (op: string) => {
    setState((prev) => {
      const currentValue = parseFloat(prev.display);
      switch (op) {
        case "MC":
          return { ...prev, memory: 0 };
        case "MR":
          return {
            ...prev,
            display: formatNumber(prev.memory),
            expression: "MR = " + formatNumber(prev.memory),
            waitingForNewValue: true,
          };
        case "M+":
          return { ...prev, memory: prev.memory + currentValue };
        case "M-":
          return { ...prev, memory: prev.memory - currentValue };
        case "MS":
          return { ...prev, memory: currentValue };
        default:
          return prev;
      }
    });
  };

  const handlePercentage = () => {
    setState((prev) => {
      const currentValue = parseFloat(prev.display);
      const result = currentValue / 100;
      return {
        ...prev,
        display: formatNumber(result),
        expression: prev.display + "% = " + formatNumber(result),
        waitingForNewValue: true,
      };
    });
  };

  const handlePlusMinus = () => {
    setState((prev) => {
      const currentValue = parseFloat(prev.display);
      const result = -currentValue;
      return {
        ...prev,
        display: formatNumber(result),
        expression: prev.expression.replace(
          /\d+(\.\d+)?$/,
          formatNumber(result)
        ),
      };
    });
  };

  const handlePi = () => {
    setState((prev) => ({
      ...prev,
      display: Math.PI.toString(),
      expression: prev.expression + "π",
      waitingForNewValue: true,
    }));
  };

  const handleE = () => {
    setState((prev) => ({
      ...prev,
      display: Math.E.toString(),
      expression: prev.expression + "e",
      waitingForNewValue: true,
    }));
  };

  const handleFactorial = () => {
    setState((prev) => {
      const currentValue = parseFloat(prev.display);
      if (currentValue < 0 || currentValue !== Math.floor(currentValue)) {
        return {
          ...prev,
          display: "Error",
          expression: prev.display + "! = Error",
          waitingForNewValue: true,
        };
      }

      let result = 1;
      for (let i = 2; i <= currentValue; i++) {
        result *= i;
        if (result > 1e15) {
          return {
            ...prev,
            display: "Error",
            expression: prev.display + "! = Error",
            waitingForNewValue: true,
          };
        }
      }

      return {
        ...prev,
        display: formatNumber(result),
        expression: prev.display + "! = " + formatNumber(result),
        waitingForNewValue: true,
      };
    });
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      event.preventDefault();

      if (event.key >= "0" && event.key <= "9") {
        handleNumber(event.key);
      } else if (event.key === ".") {
        handleDecimal();
      } else if (event.key === "+") {
        handleOperation("+");
      } else if (event.key === "-") {
        handleOperation("-");
      } else if (event.key === "*") {
        handleOperation("×");
      } else if (event.key === "/") {
        handleOperation("÷");
      } else if (event.key === "Enter" || event.key === "=") {
        handleEquals();
      } else if (event.key === "Escape") {
        handleClear();
      } else if (event.key === "Backspace") {
        handleBackspace();
      } else if (event.key === "%") {
        handlePercentage();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const basicButtons = [
    [
      {
        label: "C",
        onClick: handleClear,
        className: "bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 cursor-pointer rounded-2xl transition-all duration-150 active:scale-95",
      },
      {
        label: "CE",
        onClick: handleClearEntry,
        className: "bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 cursor-pointer rounded-2xl transition-all duration-150 active:scale-95",
      },
      {
        label: "⌫",
        onClick: handleBackspace,
        className: "bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 cursor-pointer rounded-2xl transition-all duration-150 active:scale-95",
      },
      {
        label: "/",
        onClick: () => handleOperation("÷"),
        className: "bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 cursor-pointer rounded-2xl transition-all duration-150 active:scale-95",
      },
    ],
    [
      {
        label: "7",
        onClick: () => handleNumber("7"),
        className: "bg-[var(--color-paper)] hover:bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)] cursor-pointer rounded-2xl transition-all duration-150 active:scale-95",
      },
      {
        label: "8",
        onClick: () => handleNumber("8"),
        className: "bg-[var(--color-paper)] hover:bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)] cursor-pointer rounded-2xl transition-all duration-150 active:scale-95",
      },
      {
        label: "9",
        onClick: () => handleNumber("9"),
        className: "bg-[var(--color-paper)] hover:bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)] cursor-pointer rounded-2xl transition-all duration-150 active:scale-95",
      },
      {
        label: "×",
        onClick: () => handleOperation("×"),
        className: "bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 cursor-pointer rounded-2xl transition-all duration-150 active:scale-95",
      },
    ],
    [
      {
        label: "4",
        onClick: () => handleNumber("4"),
        className: "bg-[var(--color-paper)] hover:bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)] cursor-pointer rounded-2xl transition-all duration-150 active:scale-95",
      },
      {
        label: "5",
        onClick: () => handleNumber("5"),
        className: "bg-[var(--color-paper)] hover:bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)] cursor-pointer rounded-2xl transition-all duration-150 active:scale-95",
      },
      {
        label: "6",
        onClick: () => handleNumber("6"),
        className: "bg-[var(--color-paper)] hover:bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)] cursor-pointer rounded-2xl transition-all duration-150 active:scale-95",
      },
      {
        label: "-",
        onClick: () => handleOperation("-"),
        className: "bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 cursor-pointer rounded-2xl transition-all duration-150 active:scale-95",
      },
    ],
    [
      {
        label: "1",
        onClick: () => handleNumber("1"),
        className: "bg-[var(--color-paper)] hover:bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)] cursor-pointer rounded-2xl transition-all duration-150 active:scale-95",
      },
      {
        label: "2",
        onClick: () => handleNumber("2"),
        className: "bg-[var(--color-paper)] hover:bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)] cursor-pointer rounded-2xl transition-all duration-150 active:scale-95",
      },
      {
        label: "3",
        onClick: () => handleNumber("3"),
        className: "bg-[var(--color-paper)] hover:bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)] cursor-pointer rounded-2xl transition-all duration-150 active:scale-95",
      },
      {
        label: "+",
        onClick: () => handleOperation("+"),
        className: "bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 cursor-pointer rounded-2xl transition-all duration-150 active:scale-95",
      },
    ],
    [
      {
        label: "±",
        onClick: handlePlusMinus,
        className: "bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 cursor-pointer rounded-2xl transition-all duration-150 active:scale-95",
      },
      {
        label: "0",
        onClick: () => handleNumber("0"),
        className: "bg-[var(--color-paper)] hover:bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)] cursor-pointer rounded-2xl transition-all duration-150 active:scale-95",
      },
      {
        label: ".",
        onClick: handleDecimal,
        className: "bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 cursor-pointer rounded-2xl transition-all duration-150 active:scale-95",
      },
      {
        label: "=",
        onClick: handleEquals,
        className: "bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-[var(--color-accent-ink)] font-bold shadow-sm cursor-pointer rounded-2xl transition-all duration-150 active:scale-95",
      },
    ],
  ];

  const scientificButtons = [
    [
      {
        label: "sin",
        onClick: () => handleScientificFunction("sin"),
        className: "bg-[var(--color-paper-2)] hover:bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)]/40 rounded-2xl text-xs transition-all duration-150 active:scale-95 cursor-pointer",
      },
      {
        label: "cos",
        onClick: () => handleScientificFunction("cos"),
        className: "bg-[var(--color-paper-2)] hover:bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)]/40 rounded-2xl text-xs transition-all duration-150 active:scale-95 cursor-pointer",
      },
      {
        label: "tan",
        onClick: () => handleScientificFunction("tan"),
        className: "bg-[var(--color-paper-2)] hover:bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)]/40 rounded-2xl text-xs transition-all duration-150 active:scale-95 cursor-pointer",
      },
      {
        label: "log",
        onClick: () => handleScientificFunction("log"),
        className: "bg-[var(--color-paper-2)] hover:bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)]/40 rounded-2xl text-xs transition-all duration-150 active:scale-95 cursor-pointer",
      },
    ],
    [
      {
        label: "asin",
        onClick: () => handleScientificFunction("asin"),
        className: "bg-[var(--color-paper-2)] hover:bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)]/40 rounded-2xl text-xs transition-all duration-150 active:scale-95 cursor-pointer",
      },
      {
        label: "acos",
        onClick: () => handleScientificFunction("acos"),
        className: "bg-[var(--color-paper-2)] hover:bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)]/40 rounded-2xl text-xs transition-all duration-150 active:scale-95 cursor-pointer",
      },
      {
        label: "atan",
        onClick: () => handleScientificFunction("atan"),
        className: "bg-[var(--color-paper-2)] hover:bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)]/40 rounded-2xl text-xs transition-all duration-150 active:scale-95 cursor-pointer",
      },
      {
        label: "ln",
        onClick: () => handleScientificFunction("ln"),
        className: "bg-[var(--color-paper-2)] hover:bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)]/40 rounded-2xl text-xs transition-all duration-150 active:scale-95 cursor-pointer",
      },
    ],
    [
      {
        label: "x²",
        onClick: () => handleOperation("^"),
        className: "bg-[var(--color-paper-2)] hover:bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)]/40 rounded-2xl text-xs transition-all duration-150 active:scale-95 cursor-pointer",
      },
      {
        label: "√",
        onClick: () => handleScientificFunction("√"),
        className: "bg-[var(--color-paper-2)] hover:bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)]/40 rounded-2xl text-xs transition-all duration-150 active:scale-95 cursor-pointer",
      },
      {
        label: "∛",
        onClick: () => handleScientificFunction("∛"),
        className: "bg-[var(--color-paper-2)] hover:bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)]/40 rounded-2xl text-xs transition-all duration-150 active:scale-95 cursor-pointer",
      },
      {
        label: "x!",
        onClick: handleFactorial,
        className: "bg-[var(--color-paper-2)] hover:bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)]/40 rounded-2xl text-xs transition-all duration-150 active:scale-95 cursor-pointer",
      },
    ],
    [
      {
        label: "π",
        onClick: handlePi,
        className: "bg-[var(--color-paper-2)] hover:bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)]/40 rounded-2xl text-xs transition-all duration-150 active:scale-95 cursor-pointer",
      },
      {
        label: "e",
        onClick: handleE,
        className: "bg-[var(--color-paper-2)] hover:bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)]/40 rounded-2xl text-xs transition-all duration-150 active:scale-95 cursor-pointer",
      },
      {
        label: "%",
        onClick: handlePercentage,
        className: "bg-[var(--color-paper-2)] hover:bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)]/40 rounded-2xl text-xs transition-all duration-150 active:scale-95 cursor-pointer",
      },
      {
        label: "^",
        onClick: () => handleOperation("^"),
        className: "bg-[var(--color-paper-2)] hover:bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)]/40 rounded-2xl text-xs transition-all duration-150 active:scale-95 cursor-pointer",
      },
    ],
    [
      {
        label: "MC",
        onClick: () => handleMemoryOperation("MC"),
        className: "bg-[var(--color-paper-2)] hover:bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)]/40 rounded-2xl text-xs transition-all duration-150 active:scale-95 cursor-pointer",
      },
      {
        label: "MR",
        onClick: () => handleMemoryOperation("MR"),
        className: "bg-[var(--color-paper-2)] hover:bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)]/40 rounded-2xl text-xs transition-all duration-150 active:scale-95 cursor-pointer",
      },
      {
        label: "M+",
        onClick: () => handleMemoryOperation("M+"),
        className: "bg-[var(--color-paper-2)] hover:bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)]/40 rounded-2xl text-xs transition-all duration-150 active:scale-95 cursor-pointer",
      },
      {
        label: "M-",
        onClick: () => handleMemoryOperation("M-"),
        className: "bg-[var(--color-paper-2)] hover:bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-rule)] hover:border-[var(--color-accent)]/40 rounded-2xl text-xs transition-all duration-150 active:scale-95 cursor-pointer",
      },
    ],
  ];

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card className="bg-[var(--color-paper-2)]/60 backdrop-blur-md border border-[var(--color-rule)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-3xl p-1 sm:p-3 transition-all duration-300">
        <CardContent className="space-y-6 pt-6">
          <Tabs
            value={mode}
            onValueChange={(value) => setMode(value as "basic" | "scientific")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <CalculatorIcon className="h-4 w-4" />
                {t("basic")}
              </TabsTrigger>
              <TabsTrigger
                value="scientific"
                className="flex items-center gap-2"
              >
                <FunctionIcon className="h-4 w-4" />
                {t("scientific")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 mt-6">
              {/* Display */}
              <div className="bg-zinc-950 dark:bg-black/60 text-zinc-100 p-6 rounded-2xl text-right space-y-2 border border-zinc-900 dark:border-zinc-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] select-all transition-all duration-300" dir="ltr">
                <div className="text-xs text-zinc-400 font-mono min-h-[1.5rem] break-all opacity-85">
                  {state.expression || t("expressionPlaceholder")}
                </div>
                <div className="text-4xl font-display tracking-tight min-h-[2.5rem] break-all font-bold text-zinc-50 badge-count">
                  {state.display}
                </div>
              </div>

              {/* Basic Calculator Buttons */}
              <div className="grid grid-cols-4 gap-3">
                {basicButtons.flat().map((button, index) => (
                  <Button
                    key={index}
                    onClick={button.onClick}
                    className={`h-14 text-xl font-semibold transition-colors duration-200 shadow-none ${
                      button.className ||
                      "bg-background border-2 border-gray-300"
                    }`}
                  >
                    {button.label}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="scientific" className="space-y-6 mt-6">
              {/* Display */}
              <div className="bg-zinc-950 dark:bg-black/60 text-zinc-100 p-6 rounded-2xl text-right space-y-2 border border-zinc-900 dark:border-zinc-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] select-all transition-all duration-300" dir="ltr">
                <div className="text-xs text-zinc-400 font-mono min-h-[1.5rem] break-all opacity-85">
                  {state.expression || t("expressionPlaceholder")}
                </div>
                <div className="text-2xl font-display tracking-tight min-h-[2.5rem] break-all font-bold text-zinc-50 badge-count">
                  {state.display}
                </div>
              </div>

              {/* Scientific Calculator Buttons */}
              <div className="grid grid-cols-4 gap-3">
                {scientificButtons.flat().map((button, index) => (
                  <Button
                    key={index}
                    onClick={button.onClick}
                    className={`h-14 text-2xl font-semibold transition-colors duration-200 shadow-none ${
                      button.className ||
                      "bg-background hover:bg-accent hover:text-accent-foreground border-2 border-gray-300"
                    }`}
                  >
                    {button.label}
                  </Button>
                ))}
              </div>

              {/* Basic operations for scientific mode */}
              <div className="grid grid-cols-4 gap-3 mt-4">
                {basicButtons.flat().map((button, index) => (
                  <Button
                    key={`basic-${index}`}
                    onClick={button.onClick}
                    className={`h-14 text-xl font-semibold transition-colors duration-200 shadow-none ${
                      button.className ||
                      "bg-background hover:bg-accent hover:text-accent-foreground border-2 border-gray-300"
                    }`}
                  >
                    {button.label}
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Instructions */}
          <div className="mt-8 p-6 bg-[var(--color-paper)] border border-[var(--color-rule)] rounded-2xl transition-all duration-300">
            <h3 className="font-display font-semibold mb-4 text-base text-[var(--color-ink)] flex items-center gap-2">
              <kbd className="px-2 py-0.5 bg-[var(--color-paper-2)] border border-[var(--color-rule)] rounded text-[10px] font-mono text-[var(--color-neutral)] shadow-sm">⌥</kbd>
              {t("keyboardShortcuts")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" dir="ltr">
              <div className="space-y-2">
                <p className="text-[var(--color-muted)] flex items-center gap-2">
                  <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] rounded text-xs font-mono shadow-sm">
                    0-9
                  </kbd>{" "}
                  <span className="text-xs">{t("shortcutNumbers")}</span>
                </p>
                <p className="text-[var(--color-muted)] flex items-center gap-2">
                  <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] rounded text-xs font-mono shadow-sm">
                    + - * /
                  </kbd>{" "}
                  <span className="text-xs">{t("shortcutOperations")}</span>
                </p>
                <p className="text-[var(--color-muted)] flex items-center gap-2 flex-wrap">
                  <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] rounded text-xs font-mono shadow-sm">
                    Enter
                  </kbd>{" "}
                  <span className="text-xs text-[var(--color-neutral)]">{t("shortcutOr")}</span>{" "}
                  <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] rounded text-xs font-mono shadow-sm">
                    =
                  </kbd>{" "}
                  <span className="text-xs">{t("shortcutCalculate")}</span>
                </p>
                <p className="text-[var(--color-muted)] flex items-center gap-2">
                  <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 rounded text-xs font-mono shadow-sm">
                    Esc
                  </kbd>{" "}
                  <span className="text-xs">{t("shortcutClear")}</span>
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[var(--color-muted)] flex items-center gap-2">
                  <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 rounded text-xs font-mono shadow-sm">
                    ⌫
                  </kbd>{" "}
                  <span className="text-xs">{t("shortcutBackspace")}</span>
                </p>
                <p className="text-[var(--color-muted)] flex items-center gap-2">
                  <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] rounded text-xs font-mono shadow-sm">
                    .
                  </kbd>{" "}
                  <span className="text-xs">{t("shortcutDecimal")}</span>
                </p>
                <p className="text-[var(--color-muted)] flex items-center gap-2">
                  <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] rounded text-xs font-mono shadow-sm">
                    %
                  </kbd>{" "}
                  <span className="text-xs">{t("shortcutPercentage")}</span>
                </p>
                <p className="text-[var(--color-muted)] flex items-center gap-2">
                  <kbd className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-[var(--color-paper-2)] text-[var(--color-ink)] border border-[var(--color-rule)] rounded text-xs font-mono shadow-sm">
                    ±
                  </kbd>{" "}
                  <span className="text-xs">{t("shortcutPlusMinus")}</span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calculator;
