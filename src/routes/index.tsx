import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

const SITE_URL = "/civicconnect/index.html";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CivicConnect — Citizen Service & Complaint Platform" },
      {
        name: "description",
        content:
          "CivicConnect is a student project prototype where citizens report civic issues, track complaints and read local announcements.",
      },
      { property: "og:title", content: "CivicConnect — Citizen Service & Complaint Platform" },
      {
        property: "og:description",
        content:
          "Report civic issues, track complaint status and access public service information — a Class 12 student prototype.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace(SITE_URL);
  }, []);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 text-center">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">CivicConnect</h1>
        <p className="mt-2 text-sm text-muted-foreground">Opening the CivicConnect prototype…</p>
        <p className="mt-4">
          <a
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            href={SITE_URL}
          >
            Continue to CivicConnect
          </a>
        </p>
      </div>
    </div>
  );
}
