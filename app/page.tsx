import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center bg-background text-foreground">
      <section className="container mx-auto flex flex-1 items-center px-6 py-16">
        <div className="mx-auto flex max-w-3xl flex-col gap-12">
          <header className="space-y-5">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Software Engineer — Frontend
            </span>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Brix.supply take-home by Mykhaylo Tymofyeyev
              </h1>
              <p className="text-base text-muted-foreground sm:text-lg">
                A focused exploration of the census queue feature for Construction
                Pro Inc.&apos;s procurement squad—showing how we can help them
                request new vendors without polluting Brix&apos;s core catalog.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                Designed for the brix.supply product vision
              </span>
              <Separator
                orientation="vertical"
                className="hidden h-4 md:inline-flex"
              />
              <span>
                By{" "}
                <Link
                  href="https://tymofyeyev.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-dashed underline-offset-4"
                >
                  Mykhaylo Tymofyeyev
                </Link>
              </span>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link
                  href="/vendors"
                  prefetch
                >
                  View the vendors concept
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link
                  href="https://tymofyeyev.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  More about me
                </Link>
              </Button>
            </div>
          </header>

          <section className="grid gap-8 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
            <article className="space-y-3 rounded-lg border border-border bg-card/40 p-6 backdrop-blur">
              <h2 className="text-base font-semibold text-foreground">
                Overview
              </h2>
              <Separator />
              <p>
                Brix drives AI-powered construction procurement. The long-term
                vision is a single touchpoint for vendor scouting, requirement
                analysis, and automated tendering—grounded in reliable data
                pipelines and APIs that every stakeholder can plug into.
              </p>
            </article>
            <article className="space-y-3 rounded-lg border border-border bg-card/40 p-6 backdrop-blur">
              <h2 className="text-base font-semibold text-foreground">
                Task
              </h2>
              <Separator />
              <p>
                Construction Pro Inc. needs a census queue to submit vendors that
                aren&apos;t yet in the catalog. The feature should integrate
                seamlessly with the existing vendor workspace while respecting the
                integrity of Brix&apos;s core data.
              </p>
            </article>
            <article className="space-y-3 rounded-lg border border-border bg-card/40 p-6 backdrop-blur sm:col-span-2">
              <h2 className="text-base font-semibold text-foreground">
                Notes &amp; stack
              </h2>
              <Separator />
              <ul className="list-disc space-y-2 pl-5">
                <li>Next.js (App Router) with Tailwind for layout and styling</li>
                <li>Convex backend shaping realtime vendor queue and audit trails</li>
                <li>TanStack + Zustand to model vendor data and request flows</li>
                <li>Shadcn/UI primitives for cohesive interaction patterns</li>
              </ul>
            </article>
          </section>
        </div>
      </section>
    </main>
  );
}
