import { useMutation, useQueryClient } from "@tanstack/react-query";
import mammoth from "mammoth";
import { getDocument } from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist";
GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export function useUploadTextTranscription(roomId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: string | File) => {
      let fullText = "";
      if (typeof input === "string") {
        fullText = input;
      } else {
        const fileType = input.type;
        if (fileType === "text/plain") {
          fullText = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(input);
          });
        } else if (fileType === "application/pdf") {
          const arrayBuffer = await input.arrayBuffer();
          const pdf = await getDocument({ data: arrayBuffer }).promise;
          let text = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item: any) => item.str).join(" ") + "\n";
          }
          fullText = text;
        } else if (
          fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          fileType === "application/msword"
        ) {
          const arrayBuffer = await input.arrayBuffer();
          const { value } = await mammoth.extractRawText({ arrayBuffer });
          fullText = value;
        } else {
          throw new Error("Formato de arquivo não suportado. Envie .txt, .pdf ou .docx");
        }
      }

      // Função para dividir o texto em chunks de até 1000 caracteres
      function splitTextIntoChunks(text: string, chunkSize = 1000): string[] {
        const chunks = [];
        for (let i = 0; i < text.length; i += chunkSize) {
          chunks.push(text.slice(i, i + chunkSize));
        }
        return chunks;
      }
      const chunks = splitTextIntoChunks(fullText);

      // Envia cada chunk separadamente para o backend
      const results = [];
      for (const chunk of chunks) {
        const response = await fetch(`http://localhost:3333/rooms/${roomId}/text`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ transcription: chunk }),
        });
        results.push(await response.json());
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-questions", roomId] });
    },
  });
}
