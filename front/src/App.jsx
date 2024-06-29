import React, { useState, useEffect } from 'react'
import './App.css'
import { FaMicrophone } from 'react-icons/fa'
import { IoSend } from 'react-icons/io5'
import UserTalk from './components/UserTalk'
import IATalk from './components/IATalk'
import History from './components/History'
import useSpeechRecognition from './hooks/useSpeechRecognition'
import axios from 'axios'
import { ImSpinner2 } from 'react-icons/im'

function App() {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false);
  const { listening, transcript, startListening, stopListening } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setInputValue(transcript)
    }
  }, [transcript])

  const handleSendMessage = async () => {
    if (inputValue.trim() !== '') {
      const userMessage = { type: 'user', text: inputValue }
      setMessages([...messages, userMessage])
      setInputValue('')

      try {
        setLoading(true);
        const response = await axios.post('http://localhost:5000/api/questions', {
          question: inputValue,
        })

        const botMessage = { type: 'bot', text: response.data.result }
        setMessages([...messages, userMessage, botMessage])
      } catch (error) {
        console.error('Error sending message:', error)
        setLoading(false)
        const errorMessage = {
          type: 'bot',
          text: 'Erro ao obter resposta. Por favor, tente novamente.',
        }
        setMessages([...messages, userMessage, errorMessage])
      }
      finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-1/4 bg-white border-r border-gray-300">
        <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-blue-600 text-white">
          <h1 className="text-2xl font-semibold">LOGO</h1>
        </header>

        <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
          <History />
          <History />
          <History />
        </div>
      </div>

      <div className="flex-1">
        <header className="bg-gray-100 p-4 text-gray-700">
          <h1 className="text-2xl font-semibold">
            Milk<span className="text-blue-600 font-bold">QA</span>
          </h1>
        </header>

        <div className="h-screen overflow-y-auto p-4 pb-36 mt-5">
          {messages.map((message, index) => (
            <div key={index}>
              {message.type === 'user' ? (
                <UserTalk text={message.text} />
              ) : (
                <IATalk text={message.text} />
              )}
            </div>
          ))}

          {loading ?  <div className='flex items-center justify-center'>
            <ImSpinner2 class="w-8 h-8 text-gray-200 animate-spin fill-blue-600" />
            <span class="sr-only">Carregando...</span>
          </div> : ''}

        </div>

        <footer className="bg-white border-t border-gray-300 p-4 absolute bottom-0 w-3/4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
          >
            <label htmlFor="chat" className="sr-only">
              Digite uma mensagem...
            </label>
            <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50">
              <button
                type="button"
                className={`inline-flex justify-center flex-col align-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100  ${
                  listening ? 'text-red-500' : ''
                }`}
                onClick={listening ? stopListening : startListening}
              >
                <FaMicrophone />
                {listening ? (
                  <div className="flex gap-1 mt-2">
                    <span className="sr-only">Loading...</span>
                    <div className="h-1 w-1 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-1 w-1 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-1 w-1 bg-red-500 rounded-full animate-bounce"></div>
                  </div>
                ) : (
                  ''
                )}
                <span className="sr-only">Usar microfone</span>
              </button>
              <textarea
                id="chat"
                rows="1"
                className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Digite uma mensagem..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              ></textarea>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 transition duration-500 ease-in-out text-white bg-blue-600 hover:bg-blue-700 focus:outline-none gap-2"
              >
                <span>Enviar</span>
                <IoSend className="w-4 h-4" />
              </button>
            </div>
          </form>
        </footer>
      </div>
    </div>
  )
}

export default App
