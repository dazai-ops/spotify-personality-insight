"use client";
import { useEffect, useState } from "react";
import { Inconsolata } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

const inconsolata = Inconsolata({
  subsets: ["latin"],
  weight: ["600"],
});

export default function PersonalityInsightPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paragraphIndex, setParagraphIndex] = useState(0);

  // Generate the text (paragraphs)
  async function generate() {
    setLoading(true);
    setParagraphs([]);
    setCurrentText("");
    setCurrentIndex(0);
    setParagraphIndex(0);

    const topArtists: string[] = JSON.parse(sessionStorage.getItem("artistList") ?? "[]");
    const topTracks: string[] = JSON.parse(sessionStorage.getItem("trackList") ?? "[]");

    try {
      const res = await fetch("/api/gemini-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topArtists, topTracks }),
      });

      const data = await res.json();

      if (res.ok) {
        const resultText = data.paragraphs;
        setParagraphs(resultText);
      } else {
        setParagraphs(["Error generating insight. Please try again."]);
      }
    } catch (err) {
      console.error(err);
      setParagraphs(["Something went wrong. Please try again."]);
    } finally {
      setLoading(false);
    }
  }

  // Generate the text when the component mounts
  useEffect(() => {
    generate();
  }, []);

  // Typing effect browww :v
  useEffect(() => {
    if (paragraphIndex >= paragraphs.length) return;

    const currentParagraph = paragraphs[paragraphIndex];
    if (currentIndex < currentParagraph.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prev) => prev + currentParagraph[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 10);
      return () => clearTimeout(timeout);
    } else {
      const pause = setTimeout(() => {
        setParagraphIndex((prev) => prev + 1);
        setCurrentIndex(0);
        setCurrentText("");
      }, 1000);
      return () => clearTimeout(pause);
    }
  }, [currentIndex, paragraphIndex, paragraphs]);

  return (
    <div className="w-full min-h-screen bg-black flex flex-col justify-center items-center px-4">
      <div className="max-w-3xl w-full flex flex-col justify-center mt-6">
        {loading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="flex space-x-2">
              <span className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-3 h-3 bg-white rounded-full animate-bounce" />
            </div>
            <p className="text-white text-sm sm:text-lg font-medium animate-pulse">
              Wait a couple seconds, only for you ✨
            </p>
          </div>
        ) : (
          <>
            {paragraphs.slice(0, paragraphIndex).map((p, i) => (
              <p key={i} className={`${inconsolata.className} mb-8 text-white text-sm sm:text-lg leading-relaxed`}>
                {p}
              </p>
            ))}
            {paragraphIndex < paragraphs.length && (
              <p className={`${inconsolata.className} mb-8 text-white text-sm sm:text-lg leading-relaxed`}>
                {currentText}
                <span className="animate-pulse text-black">|</span>
              </p>
            )}
          </>
        )}
      </div>

      {/* Generate Button */}
      {!loading && paragraphIndex >= paragraphs.length && (
        <div className="flex flex-col items-center">
          <button
            onClick={generate}
            className="mt-2 px-4 py-2 sm:px-6 sm:py-3 bg-white text-black rounded-full hover:bg-gray-800 transition"
          >
            <span className="font-semibold">Generate Again</span>
          </button>
          <Link
            href="/home"
            onClick={generate}
            className="mb-2 mt-4"
          >
            <Image src="/home-icon-white.svg" alt="Home" width={30} height={30} />
          </Link>
        </div>
      )}
    </div>
  );
}
