import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUploadTextTranscription(roomId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (transcription: string) => {
      const response = await fetch(`http://localhost:3333/rooms/${roomId}/text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcription }),
      });
      const result = await response.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-questions", roomId] });
    },
  });
}
