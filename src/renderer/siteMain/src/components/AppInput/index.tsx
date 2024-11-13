import React, { useState, useRef, useEffect } from "react"
import { Button } from "antd"

const WHISPER_SAMPLING_RATE = 16000
const MAX_AUDIO_LENGTH = 10 // seconds
const MAX_SAMPLES = WHISPER_SAMPLING_RATE * MAX_AUDIO_LENGTH

export default function AppInput() {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [recording, setRecording] = useState(false)
  const [chunks, setChunks] = useState<Blob[]>([])
  const recorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  const getAudio = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setStream(stream)

        recorderRef.current = new MediaRecorder(stream, { mimeType: "audio/webm" })
        audioContextRef.current = new AudioContext({ sampleRate: WHISPER_SAMPLING_RATE })

        console.log(recorderRef.current)

        recorderRef.current.onstart = () => {
          console.log("start")
          setRecording(true)
          setChunks([])
        }
        recorderRef.current.ondataavailable = (e) => {
          console.log(e)
          if (e.data.size > 0) {
            setChunks((prev) => [...prev, e.data])
          } else {
            // Empty chunk received, so we request new data after a short timeout
            setTimeout(() => {
              recorderRef.current?.requestData()
            }, 25)
          }
        }

        recorderRef.current.onstop = () => {
          setRecording(false)
        }
      })
      .catch((err) => console.error("The following error occurred: ", err))
  }

  console.log(chunks)

  useEffect(() => {
    if (chunks.length > 0) {
      // Generate from data
      const blob = new Blob(chunks, { type: recorderRef.current?.mimeType })

      const fileReader = new FileReader()

      fileReader.onloadend = async () => {
        const arrayBuffer = fileReader.result as ArrayBuffer
        const decoded = await audioContextRef.current?.decodeAudioData(arrayBuffer)
        let audio = decoded?.getChannelData(0)
        if (audio && audio.length > MAX_SAMPLES) {
          // Get last MAX_SAMPLES
          audio = audio.slice(-MAX_SAMPLES)
        }

        window.ipcSend("WHISPER_GENERATE", { audio, language: "zh" })
      }
      fileReader.readAsArrayBuffer(blob)
    } else {
      recorderRef.current?.requestData()
    }
  }, [chunks])
  return (
    <div>
      <Button onClick={getAudio}>开始录音</Button>
    </div>
  )
}
