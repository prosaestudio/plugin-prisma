import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="min-h-screen w-full bg-background">
      <main className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
        <Outlet />
      </main>
    </div>
  );
}
