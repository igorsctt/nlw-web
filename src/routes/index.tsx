import { MainLayout } from "@/components/layout/main-layout";
import { CreateRoom } from "@/pages/create-room";
import { LoginCard } from "@/pages/login";
import { RecordRoomAudio } from "@/pages/record-room-audio";
import { Room } from "@/pages/room";
import { Route, Routes } from "react-router-dom";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<CreateRoom />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="/room/:roomId/audio" element={<RecordRoomAudio />} />
      </Route>
        <Route path="/login" element={<LoginCard />} />
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
  );
}
