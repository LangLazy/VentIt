import './App.css';
import Axios from 'axios'
import React, {useState, useEffect} from 'react';
import { io } from "socket.io-client";
//Imports all needed util, which are React hooks, Axios, and the Socket.io client

const baseUrlS = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' 
const baseUrlH = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
//The URLs of your server, the S one is for the websocket connection, and the other is for HTTP

const socket = io(baseUrlS)


function App() {
  const [curInp, updateCurInp] = useState("")
  const [curMsgs, updateCurMsgs] = useState([])

  
  useEffect(()=>{    
    Axios.get(`${baseUrlH}/api/messages`).then(msgs =>updateCurMsgs(msgs.data.reverse()));
        },[])
  
  useEffect(()=>{
      socket.on('newMessage',nMsg =>{ 
        const ncontent = {content: nMsg}
        const nmessages = [ncontent, ...curMsgs] 
      updateCurMsgs(nmessages)
    })
          },[curMsgs])
          
  //Handles message submission
  const subMsg = (e) =>{
    e.preventDefault()
    const nMes = {content: curInp}
    socket.emit('newMessage', curInp)
    Axios.post( `${baseUrlH}/api/messages`, nMes)
    updateCurInp("")  
  }
  //Handles changes in the text feild
  const onType = (e) =>{
    updateCurInp(e.target.value)
  }
  //Turns submitted messages into elements to be rendered using JSX
  const formatMessages = (msg) =>{
    return(
      <div class="mine messages">      
        <div class="message last" data-time="">
          {msg.content}
        </div>
    </div>
    )
} 
//The layout of the webpage
  return (
    <div>
      <div className="TitleText">Vent it!</div>
      <div className="labelText">Sometimes all you need is to let it all out, so feel free to vent your frustrations! But Please be civil while doing so : ) </div>
      <div className="labelText">Write a message using the text box below, and to send press the enter key!</div>
      <div className="labelText"><a href="https://rahulg.me/projects/vent-it/">Dev Log</a></div>
      <div className="labelText"><b>Made by: </b>Rahul G</div>
      <form className="bar" onSubmit={subMsg}>
        <input onChange={onType} value={curInp}>
        </input>
      </form>
      <ul>
        {curMsgs.map(formatMessages)}
      </ul>
    </div>
  );
}

export default App;
