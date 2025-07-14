import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useUploadTextTranscription } from "@/http/use-upload-text-transcription";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function UploadTextTranscriptionForm() {
  const { roomId } = useParams<{ roomId: string }>();
  const [text, setText] = useState("");
  const mutation = useUploadTextTranscription(roomId!);

  // Log do resultado da mutação
  if (mutation.isSuccess) {
    console.log("Resposta do backend:", mutation.data);
  }
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    console.log("Texto manual enviado:", text);
    await mutation.mutateAsync(text);
    setText("");
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Arquivo selecionado:", file);
      await mutation.mutateAsync(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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
      <div className="flex flex-col gap-2 mt-2">
        <label htmlFor="file-upload" className="text-sm text-foreground font-medium">
          Ou envie um arquivo de texto (.txt, .pdf, .docx):
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".txt,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={mutation.isPending}
          className="block w-full text-sm text-muted-foreground border border-input rounded-md p-2 bg-background"
        />
      </div>
      {mutation.isSuccess && <span className="text-green-600 text-sm">Transcrição enviada com sucesso!</span>}
    </form>
  );
}
