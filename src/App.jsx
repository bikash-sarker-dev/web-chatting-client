import { useState } from "react";
function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);

  const joinRoom = () => {};
  return (
    <>
      <p className="bg-red-400">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
