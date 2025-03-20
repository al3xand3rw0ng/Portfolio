export default function HeapOverflow() {
  return (
    <div>
      <div className="text-center fs-3">
        <p>HeapOverflow</p>
      </div>
      <div>
        <p>
          HeapOverflow was modeled after StackOverflow, incorporating essential
          features such as filtering, sorting, and voting. Frontend features
          were designed and implemented using the Chakra UI library to ensure a
          responsive and user-friendly interface. Interactive elements were
          developed, including a community leaderboard that reflects user
          contributions such as questions, answers, and comments. Throughout the
          development process, an Agile approach was applied, with sprint
          planning and retrospectives aimed at iteratively improving the
          application based on feedback and evolving requirements.
        </p>
        <div className="text-center">
          <embed
            src="https://heapoverflow-ck07.onrender.com/"
            className="HeapOverflow"
          ></embed>
        </div>
        <p>
          The project was developed using JavaScript, React, TypeScript, and
          styled with CSS and Chakra UI components. The backend was implemented
          using TypeScript, Mongoose, MongoDB, NoSQL, Express, and Socket.IO.
          Testing was performed using Jest. A Mongoose schema was used to define
          user fields for the profile page, with custom hooks to retrieve and
          display data on the frontend. The social page leveraged a MongoDB
          database to maintain a user list, which also tracked user
          contributions (questions, answers, and comments) to populate the
          leaderboard. The chat page utilized two MongoDB schemas to store
          messages and chat data. For managing the website's color theme
          settings, we employed Chakra UI's ColorModeProvider to provide
          seamless theme control and color mode switching.
        </p>
        <p>
          Visit the deployed application at{" "}
          <a href="https://heapoverflow-ck07.onrender.com/">
            https://heapoverflow-ck07.onrender.com/
          </a>
          .
        </p>
      </div>
    </div>
  );
}
