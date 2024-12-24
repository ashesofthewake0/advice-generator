import axios from "axios";
import { useState, useEffect } from "react";
import initialBg from "./images/city.jpg"; 

const AdviceGenerator = () => {
  const [advice, setAdvice] = useState("");
  const [bgImage, setBgImage] = useState(initialBg);
  const [loading, setLoading] = useState(false);

  // Fetch random advice
  const fetchAdvice = async () => {
    try {
      const response = await axios.get("https://api.adviceslip.com/advice");
      const adviceText = response.data.slip.advice;
      console.log("Fetched advice:", adviceText);
      setAdvice(adviceText);
      fetchBackgroundImage(adviceText); 
    } catch (error) {
      console.error("Error occurred while fetching advice:", error);
    }
  };

  // Fetch related background image based on fetched advice text
  const fetchBackgroundImage = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.unsplash.com/photos/random?query=${query}&client_id=${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`
      );
      console.log("Fetched background image response:", response.data);
      if (response.data?.urls?.regular) {
        setBgImage(response.data.urls.regular);
      } else {
        console.log("No image found for query:", query);
        setBgImage(initialBg);
      }
    } catch (error) {
      console.error("Error fetching background image:", error);
      setBgImage(initialBg); 
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAdvice();
  }, []);

  return (
    <div
      className="h-screen flex items-center justify-center text-white"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div
        className="relative z-10 p-8 rounded-lg shadow-lg bg-gradient-to-br from-yellow-600 via-orange-500 to-red-500 
        text-center max-w-xl transform skew-y-3 rotate-3 border-4 border-black"
      >
        <h1 className="text-4xl font-bold font-serif mb-4 text-black shadow-md">
          Random Advice
        </h1>
        <p className="text-lg font-mono mb-6 text-black">
          {advice || "Loading advice..."}
        </p>
        <button
          className="bg-yellow-700 hover:bg-yellow-900 text-white font-bold py-2 px-4 rounded-md transition-transform 
          transform hover:scale-105"
          onClick={fetchAdvice}
          disabled={loading}
        >
          {loading ? "Loading..." : "Generate Advice"}
        </button>
      </div>
    </div>
  );
};

export default AdviceGenerator;
