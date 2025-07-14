import { useState } from "react";
import { useParams } from "react-router-dom";
import { useUploadTextTranscription } from "@/http/use-upload-text-transcription";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function UploadTextTranscriptionForm() {
  const { roomId } = useParams<{ roomId: string }>();
  const [text, setText] = useState("");
  const mutation = useUploadTextTranscription(roomId!);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    await mutation.mutateAsync(text);
    setText("");
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Digite ou cole a transcrição manual aqui..."
        disabled={mutation.isPending}
        className="min-h-[100px]"
      />
      <Button type="submit" disabled={mutation.isPending || !text.trim()}>
        {mutation.isPending ? "Enviando..." : "Enviar texto como transcrição"}
      </Button>
      {mutation.isSuccess && <span className="text-green-600 text-sm">Texto enviado com sucesso!</span>}
    </form>
  );
}
