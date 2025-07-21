import { CreateRoomForm } from '@/components/create-room-form';
import { RoomList } from '@/components/room-list';

export function CreateRoom() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
      <CreateRoomForm />
      <RoomList />
    </div>
  );
}
