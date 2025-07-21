import { Outlet } from "react-router-dom";
import { Footer } from "../footer/footer";
import { Header } from "../header/header";


export const MainLayout = () => {
  return (
    <div className=" text-rig min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center  px-4 py-8 w-full">
        <div className="w-full max-w-4xl">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}