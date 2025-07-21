import { useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { UploadTextTranscriptionForm } from '@/components/upload-text-transcription-form';

const isRecordingSupported =
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === 'function' &&
  typeof window.MediaRecorder === 'function';

type RoomParams = {
  roomId: string;
};

export function RecordRoomAudio() {
  const params = useParams<RoomParams>();
  const [isRecording, setIsRecording] = useState(false);
  const recorder = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>(null);

  function stopRecording() {
    setIsRecording(false);

    if (recorder.current && recorder.current.state === 'inactive') {
      recorder.current.stop();
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }

  async function uploadAudio(audio: Blob) {
    const formData = new FormData();

    formData.append('file', audio, 'audio.webm');

    const response = await fetch(
      `http://localhost:3333/rooms/${params.roomId}/audio`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const result = await response.json();
    // biome-ignore lint/suspicious/noConsole: sadsa
    console.log('Audio uploaded:', result);
  }

  function createRecorder(audio: MediaStream) {
    recorder.current = new MediaRecorder(audio, {
      mimeType: 'audio/webm',
      audioBitsPerSecond: 64_000,
    });

    recorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        uploadAudio(event.data);
      }
    };

    recorder.current.onstart = () => {
      // biome-ignore lint/suspicious/noConsole: sadas
      console.log('Recording started');
    };
    recorder.current.onstop = () => {
      // biome-ignore lint/suspicious/noConsole: asdasd
      console.log('Recording stopped');
    };
    recorder.current.start();
  }

  async function startRecording() {
    if (!isRecordingSupported) {
      alert('Gravação de áudio não é suportada neste navegador.');
      return;
    }

    setIsRecording(true);

    const audio = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44_100,
      },
    });

    createRecorder(audio);

    intervalRef.current = setInterval(() => {
      recorder.current?.stop();
      createRecorder(audio);
    }, 5000);
  }

  if (!params.roomId) {
    return <Navigate replace to="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-zinc-900 rounded-2xl shadow-2xl p-8 flex flex-col gap-6 items-center">
        <div className="w-full flex items-center justify-between mb-2">
          <Link to="/" className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 size-4" />
              Voltar
            </Button>
          </Link>
          <span className="text-xs text-muted-foreground">Sala: <span className="font-bold">{params.roomId}</span></span>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground mb-2 text-center">Captura de Áudio ou Texto</h1>
        <p className="text-muted-foreground text-center mb-4 text-base">
          Grave um áudio para transcrição automática <span className="font-bold">ou</span> envie um texto/manual ou arquivo.<br />
          <span className="font-semibold">Escolha a opção que preferir:</span>
        </p>
        <div className="flex flex-col items-center gap-3 w-full">
          {isRecording ? (
            <Button onClick={stopRecording} variant="destructive" className="w-full text-lg py-3">
              Parar gravação
            </Button>
          ) : (
            <Button onClick={startRecording} variant="default" className="w-full text-lg py-3">
              Iniciar gravação
            </Button>
          )}
          {isRecording ? <p className="text-primary font-semibold">Gravando...</p> : <p className="text-muted-foreground">Pausado</p>}
        </div>
        <div className="w-full mt-6">
          <div className="mb-2 text-base text-foreground font-semibold">Ou envie um texto ou arquivo:</div>
          <UploadTextTranscriptionForm />
         
        </div>
      </div>
    </div>
  );
}
