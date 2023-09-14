import { FileVideo, Upload } from 'lucide-react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Separator } from './ui/separator'
import { Label } from './ui/label'

import { useMemo, useRef, useState } from 'react'
import { getFFmpeg } from '@/lib/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { api } from '@/lib/axios'

type Status =
  | 'waiting'
  | 'converting'
  | 'uploading'
  | 'generating'
  | 'success'
  | 'error'

const statusMessages = {
  waiting: 'Carregar vídeo...',
  converting: 'Convertendo vídeo...',
  uploading: 'Enviando vídeo...',
  generating: 'Gerando transcrição...',
  success: 'Vídeo carregado com sucesso!',
  error: 'Ocorreu um erro ao carregar o vídeo.',
}

export function VideoInputForm() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('waiting')

  const promptInputRef = useRef<HTMLTextAreaElement>(null)

  function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) return

    setFile(file)
  }

  async function convertVideoToAudio(video: File) {
    const ffmpeg = await getFFmpeg()
    await ffmpeg.writeFile('input.mp4', await fetchFile(video))

    ffmpeg.on('progress', (progress) => {
      console.log('convert progress: ' + Math.round(progress.progress * 100))
    })

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3',
    ])

    const data = await ffmpeg.readFile('output.mp3')
    const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })

    const audioFile = new File([audioFileBlob], 'output.mp3', {
      type: 'audio/mpeg',
    })

    return audioFile
  }

  async function handleUploadVideo(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const prompt = promptInputRef.current?.value
    if (!file || !prompt) return

    setStatus('converting')

    const audioFile = await convertVideoToAudio(file)

    const data = new FormData()

    data.append('file', audioFile)

    setStatus('uploading')
    const response = await api.post('/videos', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    const videoId = response.data.video.id

    setStatus('generating')
    await api.post(`/videos/${videoId}/transcription`, {
      prompt,
    })

    setStatus('success')
  }

  const previewURL = useMemo(() => {
    if (!file) return

    return URL.createObjectURL(file)
  }, [file])

  return (
    <form className="space-y-6" onSubmit={handleUploadVideo}>
      <label
        htmlFor="video"
        className="border flex rounded-md aspect-video cursor-pointer border-dashed flex-col text-sm gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
      >
        {file ? (
          <video
            src={previewURL}
            className="w-full h-full object-cover pointer-events-none"
            controls={false}
          />
        ) : (
          <>
            <FileVideo className="w-4 h-4" />
            Selecione um vídeo
          </>
        )}
      </label>

      <input
        type="file"
        id="video"
        accept="video/mp4"
        className="sr-only"
        onChange={handleFileSelected}
      />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
        <Textarea
          disabled={status !== 'waiting'}
          ref={promptInputRef}
          id="transcription_prompt"
          className="h-20 leading-relaxed resize-none"
          placeholder="Inclua palavras-chave mencionadas no vídeo separadas por vírgula(,)"
        />
      </div>

      <Button
        disabled={status !== 'waiting'}
        type="submit"
        className="w-full data-[success=true]:bg-emerald-500"
        data-success={status === 'success'}
      >
        {statusMessages[status]}
        {status === 'waiting' && <Upload className="w-4 h-4 ml-2" />}
      </Button>
    </form>
  )
}
