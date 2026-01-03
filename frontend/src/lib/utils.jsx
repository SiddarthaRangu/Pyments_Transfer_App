import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function highlightText(text, highlight) {
  if (!highlight.trim()) return text;
  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) => 
    regex.test(part) ? <mark key={i} className="bg-indigo-100 text-indigo-700 rounded-sm px-0.5">{part}</mark> : part
  );
}