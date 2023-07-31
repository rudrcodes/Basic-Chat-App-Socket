/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'

const Chats = ({ socket, username, roomID }) => {
    const [currentMessage, setCurrentMessage] = useState("")
    const [messageList, setMessageList] = useState([])
    const sendMessage = async () => {
        if (currentMessage === "") return alert("Empty  input fields..")
        const messageData = {
            roomID,
            username,
            message: currentMessage,
            time: `${(new Date(Date.now()).getHours()) - 12}:${new Date(Date.now()).getMinutes()}:${new Date(Date.now()).getSeconds()}`
        }
        setMessageList((list) => [...list, messageData])
        await socket.emit("send_message", messageData);
        setCurrentMessage("")
    }
    useEffect(() => {
        socket.on("recieve_message", (dataMessage) => {
            // let newList = [...messageList,dataMessage.message];
            // newList.push(dataMessage.message)
            // setMessageList(newList)
            // console.log(messageList);

            // ? Only this works and nothing else .. IDK WHY ? c😵😕😖
            setMessageList((list) => [...list, dataMessage])
        })
    }, [socket])
    return (


        <div className='chat-window'>
            <div className='chat-header'>
                <h2>Live chat..</h2>
            </div>
            <div className='chat-body' style={{ color: 'black' }}>
                <ScrollToBottom className='message-container'>

                    {messageList.map((msg) => {
                        // eslint-disable-next-line react/jsx-key
                        return <div className='message' id={username === msg.username ? "you" : "other"}>
                            <div>
                                <div className='message-content'>
                                    <p>{msg.message}</p>
                                </div>
                                <div className='message-meta'>
                                    <p id='time'>{msg.time}</p>
                                    <p id='author'>{msg.username}</p>
                                </div>
                            </div>
                        </div>
                    })}
                </ScrollToBottom>
            </div>
            <div className='chat-footer'>
                <input value={currentMessage} type='text' placeholder='Enter message..' onChange={(e) => setCurrentMessage(e.target.value)} onKeyPress={(e) => { if (e.key == "Enter") sendMessage() }} />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    )
}

export default Chats