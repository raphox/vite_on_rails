/// <reference types="vite/client" />
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Vite On Rails" },
    ],
  }),
  component: RootComponent,
});

function isUnauthorizedError(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    error.status === 401
  ) {
    return true;
  }

  return error instanceof Error && error.message.includes("status 401");
}

function handleRequestError(error: unknown) {
  if (!isUnauthorizedError(error) || window.location.pathname === "/session/new") {
    return;
  }

  window.location.assign("/session/new");
}

function RootComponent() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: handleRequestError,
        }),
        mutationCache: new MutationCache({
          onError: handleRequestError,
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </QueryClientProvider>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <h1>Vite On Rails</h1>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
        </ul>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
