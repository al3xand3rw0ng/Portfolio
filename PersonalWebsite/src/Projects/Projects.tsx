import { useState } from "react";
import HeapOverflow from "./HeapOverflow";
import Kanbas from "./Kanbas";
import BallGame from "./BallGame";
// import MarbleSolitaire from "./MarbleSolitaire";
// import FloodIt from "./FloodIt";

export default function Projects() {
  const projects = {
    HeapOverflow: <HeapOverflow />,
    Kanbas: <Kanbas />,
    // MarbleSolitaire: <MarbleSolitaire />,
    BallGame: <BallGame />,
    // FloodIt: <FloodIt />,
  };
  const [selectedProject, setSelectedProject] = useState(null);

  const handleButtonClick = (project: any) => {
    setSelectedProject(project);
  };

  const handleBackClick = () => {
    setSelectedProject(null);
  };

  return (
    <div>
      <h1 className="text-center mb-2">Featured Work</h1>
      {selectedProject === null ? (
        // Display the buttons if no project is selected
        <div className="container">
          <div className="row justify-content-center">
            <div className="col text-center">
              <p
                className="text-decoration-underline"
                onClick={() => handleButtonClick("HeapOverflow")}
              >
                HeapOverflow
              </p>
            </div>
            <div className="col text-center">
              <p
                className="text-decoration-underline"
                onClick={() => handleButtonClick("Kanbas")}
              >
                Kanbas
              </p>
            </div>
            {/* <div className="col text-center">
              <p
                className="text-decoration-underline"
                onClick={() => handleButtonClick("MarbleSolitaire")}
              >
                Marble Solitaire
              </p>
            </div> */}
            <div className="col text-center">
              <p
                className="text-decoration-underline"
                onClick={() => handleButtonClick("BallGame")}
              >
                Ball Game
              </p>
            </div>
            {/* <div className="col text-center">
              <p
                className="text-decoration-underline"
                onClick={() => handleButtonClick("FloodIt")}
              >
                FloodIt
              </p>
            </div> */}
          </div>
        </div>
      ) : (
        // Display content based on the selected project
        <div>
          {projects[selectedProject]}
          <div className="text-center">
            <img
              className="back-button"
              src={"./images/back_button.png"}
              alt={"back"}
              onClick={handleBackClick}
            />
          </div>
        </div>
      )}
    </div>
  );
}
