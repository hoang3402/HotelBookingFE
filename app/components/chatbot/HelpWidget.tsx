"use client";

import React, {useEffect} from "react";
import ChatPanel from "@/app/components/chatbot/ChatPanel";
import {BsChatRightDots} from "react-icons/bs";
import {domain} from "@/app/actions/getRoomById";


export type TMessage = {
  message: string;
  sender: string;
};


const HelpWidget = () => {

  const [isOpen, setIsOpen] = React.useState(false)
  const [reply, setReply] = React.useState(0)
  const [text, setText] = React.useState("")
  const [messages, setMessages] = React.useState<TMessage[]>([])

  const handleCloseWidget = () => {
    setIsOpen(false)
  }

  const handleOpenSupportWidget = () => {
    setIsOpen(true)
  }

  const handleSendMessage = (e: any) => {
    e.preventDefault()
    setMessages([...messages, {message: text, sender: "client"}])
    setReply(reply + 1)
    setText("")
  }

  useEffect(() => {
    if (reply == 0) return;
    // setMessages([...messages, {message: "alo", sender: "server"}])
    fetch(`${domain}api/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({message: messages[messages.length - 1].message}),
    }).then(res => res.json())
      .then(data => {
        setMessages([...messages, {message: data.message, sender: "server"}])
      })
      .finally(()=>{
      })
  }, [reply])


  return isOpen ? (
    <div
      className="
      fixed bottom-10 right-10 rounded-3xl border-1 border-gray-300
      flex h-96 w-fit flex-col justify-between bg-white p-6 z-20"
    >
      <ChatPanel
        text={text}
        setText={setText}
        messages={messages}
        onClose={handleCloseWidget}
        handleSendMessage={handleSendMessage}
      />
    </div>
  ) : (
    <button
      onClick={handleOpenSupportWidget}
      className="
        fixed bottom-10 right-10 cursor-pointer bg-blue-400 p-4
        text-white hover:bg-blue-500 rounded-full
      "
    >
      <BsChatRightDots/>
    </button>
  );
}


export default HelpWidget