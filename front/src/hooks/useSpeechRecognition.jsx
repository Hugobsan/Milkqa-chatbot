// src/hooks/useSpeechRecognition.js
import { useState, useEffect, useRef } from 'react'

const useSpeechRecognition = () => {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.error('Este navegador não suporta reconhecimento de fala.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'pt-BR'

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onresult = (event) => {
      const lastTranscript =
        event.results[event.results.length - 1][0].transcript
      setTranscript(lastTranscript)
    }

    recognitionRef.current = recognition
  }, [])

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('')
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  return {
    listening,
    transcript,
    startListening,
    stopListening,
  }
}

export default useSpeechRecognition
