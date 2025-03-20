export default function Kanbas() {
  return (
    <div>
      <div className="text-center fs-3">
        <p>Kanbas</p>
      </div>
      <div>
        <p>
          Kanbas is a learning management system (LMS). The system includes core
          LMS functionalities such as course navigation, content management, and
          interactive assessments. Styling is enhanced with Bootstrap to ensure
          a responsive design that adapts to different screen sizes. State
          management is handled using Redux to efficiently track and update
          application data.
        </p>
        <div className="text-center">
          <embed
            src="https://final--papaya-bavarois-a5154b.netlify.app/#/Kanbas/Account/Signin"
            className="Kanbas"
          ></embed>
        </div>
        <p>
          As part of the project, I expanded Kanbas by developing a Quizzes
          section, integrating interactive assessments to enhance the learning
          experience. Faculty can create and preview quizzes, while students can
          take them multiple times based on configurable attempt limits. Each
          student's quiz responses are stored separately, allowing them to
          review past attempts and track their progress. Correct answers are
          marked in green, while incorrect ones are highlighted in red. Once
          students have used all available attempts, they can no longer retake
          the quiz, but they can always access their latest results.
        </p>
        <p>
          Kanbas was built using JavaScript, React, TypeScript, and styled with
          CSS and Bootstrap components. The backend leverages Node.js,
          Express.js, and MongoDB to manage data efficiently. RESTful Web
          services were implemented to support dynamic content retrieval, and
          authentication was integrated to manage user access. The project
          follows an Agile development workflow, with iterative improvements
          based on testing and feedback.
        </p>
        <p>
          Visit the deployed application at{" "}
          <a href="https://final--papaya-bavarois-a5154b.netlify.app/#/Kanbas/Account/Signin">
            https://final--papaya-bavarois-a5154b.netlify.app/#/Kanbas/Account/Signin
          </a>
          .
        </p>
      </div>
    </div>
  );
}
