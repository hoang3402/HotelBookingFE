import {TMessage} from "@/app/components/chatbot/HelpWidget";
import {useEffect} from "react";

export const ChatPanel = ({
                             handleSendMessage,
                             text,
                             setText,
                             onClose,
                             messages,
                           }: {
  handleSendMessage: any;
  messages: TMessage[];
  text: string;
  onClose?: () => void;
  setText: (newText: string) => void;
}) => {

  useEffect(() => {
    const messageList = document.querySelector('#messages');
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={'p-2'}>
      {onClose && (
        <button
          className="hover:text-red-400d absolute top-2 right-2"
          onClick={onClose}
        >
          X
        </button>
      )}

      <ul id={'messages'} className="h-[300px] overflow-auto">
        {messages.map(({message, sender}, index) => (
          <li
            className={`mb-2 rounded p-1 ${
              sender === "client" ? "bg-gray-50 text-end pr-4" : "bg-blue-200"
            }`}
            key={index}
          >
            {message}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border border-gray-600 p-1 px-2 rounded-2xl"
        ></input>
        <button
          className="
          cursor-pointer bg-blue-400 p-2 px-4
          text-white hover:bg-blue-500"
        >
          Send
        </button>
      </form>
    </div>
  );
};


export default ChatPanel