import { useState } from 'react';
import './App.css'
import Chats from './Chats';


import io from 'socket.io-client'
// Connecting front to backend
const socket = io.connect("http://localhost:3001/");


function App() {
  const [username, setUsername] = useState("")
  const [roomID, setRoomID] = useState("")
  const [showChat, setShowChat] = useState(false)

  const joinRoom = () => {
    if (username == "" || roomID == "") return alert("empty");
    // else alert("both present")
    //first the event name and second the data 
    socket.emit("join_room", { username, roomID })
    setShowChat(true);
    // setUsername("")
    // setRoomID("")
  }
  return (
    <>
      <div className='App'>
        {!showChat ? (<div className='joinChatContainer'>
          <h2>Real time chat app using SOCKET.io</h2>
          <h3>Join a Chat</h3>
          <input type='text' placeholder='Name..' value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type='text' placeholder='Room ID..' value={roomID} onChange={(e) => setRoomID(e.target.value)} />
          <h3>Join a Room</h3>
          <button onClick={joinRoom}>Click to join a room</button>
        </div>) : (<Chats socket={socket} username={username} roomID={roomID} />
        )}

      </div>
    </>
  )
}

export default App
