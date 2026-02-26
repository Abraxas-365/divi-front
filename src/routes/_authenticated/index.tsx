import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  component: HomePage,
  staticData: { breadcrumb: "Home" },
});

function HomePage() {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-bold tracking-tight">
        Welcome to Divi Front
      </h2>
    </div>
  );
}
