import { useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
    <div className="flex h-screen flex-col items-center justify-center gap-8 bg-zinc-950 px-4">
      <div className="flex flex-col items-center gap-4 bg-zinc-900 rounded-xl p-8 shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold text-foreground mb-2">Captura de Áudio ou Texto</h1>
        <p className="text-muted-foreground text-center mb-4">
          Você pode gravar um áudio para transcrição automática ou digitar/colar um texto manualmente.<br />
          <span className="font-semibold">Escolha a opção que preferir:</span>
        </p>
        <div className="flex flex-col items-center gap-3 w-full">
          {isRecording ? (
            <Button onClick={stopRecording} variant="destructive" className="w-full">
              Parar gravação
            </Button>
          ) : (
            <Button onClick={startRecording} variant="default" className="w-full">
              Iniciar gravação
            </Button>
          )}
          {isRecording ? <p className="text-primary">Gravando...</p> : <p className="text-muted-foreground">Pausado</p>}
        </div>
        <div className="w-full mt-6">
          <div className="mb-2 text-sm text-foreground font-medium">Ou envie um texto manual:</div>
          <UploadTextTranscriptionForm />
          <div className="mt-2 text-xs text-muted-foreground">
            <ul className="list-disc ml-4">
              <li>Digite ou cole a transcrição desejada no campo acima.</li>
              <li>O texto será salvo e usado para responder perguntas nesta sala.</li>
              <li>Você pode enviar quantos textos quiser, além dos áudios.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
