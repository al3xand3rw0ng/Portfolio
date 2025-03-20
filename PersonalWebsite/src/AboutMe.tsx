export default function AboutMe() {
  return (
    <div>
      <h1 className="text-center mb-2">About Me</h1>
      <img
        className="headshot float-start"
        src="./images/headshot.jpg"
        alt="Headshot"
      />
      <div className="fs-5">
        <p>
          My name is Alexander Wong. I am from Berkeley, California, but I have
          since moved to Boston, Massachusetts to continue my education. I am
          pursuing a B.S. in Computer Science at Northeastern University.
        </p>
        <p>
          In addition to my studies, I am currently a Software Development
          Engineer Intern at CREWASIS, where I contribute to the development and
          maintenance of a Next.js and Django-based web platform. I collaborate
          with cross-functional teams, including Senior Engineers, Data
          Scientists, and Designers, to design and implement software solutions
          that align with company goals. My responsibilities include
          troubleshooting and resolving technical issues, integrating new
          features, and optimizing system performance.
        </p>
        <p>
          Prior to this, during the summer of 2024, I completed an internship at
          State Street Corporation, where I contributed to the deployment of a
          new financial application utilizing Nginx.
        </p>
        <p>
          In my future career, I hope to capitalize upon learning opportunities.
          I would additionally love to have the opportunity to work within a
          creative team where I can collaborate with like-minded individuals to
          develop innovative solutions to challenging problems.
        </p>
        <p>
          I'm excited to continue my journey in computer science and explore the
          intersections of technology, creativity, and sustainability. Feel free
          to connect with me on{" "}
          <a href="https://www.linkedin.com/in/alexander-wong-569848251/">
            LinkedIn
          </a>
          , and thank you for stopping by!
        </p>
      </div>
    </div>
  );
}
