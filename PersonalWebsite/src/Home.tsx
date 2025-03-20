import { useEffect, useState } from "react";

export default function Home() {
  const images = [
    "./images/name01.png",
    "./images/name02.png",
    "./images/name03.png",
  ];
  const [image, setImage] = useState(images[0]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => (prevCount + 1) % images.length);
    }, 1250);

    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    setImage(images[count]);
  }, [count, images]);

  return (
    <div className="logo-container text-center">
      <img className="logo" src={image} alt="homepage" />
    </div>
  );
}
