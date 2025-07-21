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
    <form className="flex flex-col gap-4 bg-zinc-800 rounded-xl shadow-lg p-6 w-full">
      <Textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Digite ou cole a transcrição manual aqui..."
        disabled={mutation.isPending}
        className="min-h-[100px] text-base bg-zinc-900 border-zinc-700 focus:border-primary focus:ring-2 focus:ring-primary/30 rounded-lg"
      />
      <Button type="submit" disabled={mutation.isPending || !text.trim()} className="w-full text-base py-2">
        {mutation.isPending ? "Enviando..." : "Enviar texto manual"}
      </Button>
      <div className="flex flex-col gap-2 mt-2">
        <label htmlFor="file-upload" className="text-base text-foreground font-semibold mb-1">
          Ou envie um arquivo (.txt, .pdf, .docx):
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".txt,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={mutation.isPending}
          className="block w-full text-base text-muted-foreground border border-zinc-700 rounded-lg p-2 bg-zinc-900 focus:border-primary focus:ring-2 focus:ring-primary/30"
        />
      </div>
      {mutation.isSuccess && <span className="text-green-600 text-base font-semibold mt-2">Transcrição enviada com sucesso!</span>}
      <div className="mt-2 text-xs text-muted-foreground">
        <ul className="list-disc ml-4">
          <li>Você pode digitar, colar ou enviar arquivos de texto.</li>
          <li>Arquivos suportados: .txt, .pdf, .docx</li>
          <li>O texto será salvo e usado para responder perguntas nesta sala.</li>
        </ul>
      </div>
    </form>
  );
}
