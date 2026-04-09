import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

type User = {
  id: number;
  email_address: string;
  created_at: string;
  updated_at: string;
};

type UpdateUserInput = {
  email_address: string;
};

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

async function updateUser(
  id: string,
  input: UpdateUserInput,
): Promise<User> {
  const response = await fetch(`/api/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: input }),
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export const Route = createFileRoute("/users_/$id/edit")({
  component: EditUserRoute,
});

function EditUserRoute() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userQuery = useQuery({
    queryKey: ["users", id],
    queryFn: () => fetchUser(id),
  });
  const [emailAddress, setEmailAddress] = useState("");

  const updateUserMutation = useMutation({
    mutationFn: (input: UpdateUserInput) => updateUser(id, input),
    onSuccess: async (user) => {
      queryClient.setQueryData(["users", id], user);
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      await navigate({ to: "/users/$id", params: { id } });
    },
  });

  if (userQuery.isLoading) {
    return <p>Loading user...</p>;
  }

  if (userQuery.isError) {
    return <p>Could not load user: {userQuery.error.message}</p>;
  }

  const currentEmail = emailAddress || userQuery.data.email_address;

  return (
    <section>
      <p>
        <Link to="/users/$id" params={{ id }}>
          Back to details
        </Link>
      </p>
      <h2>Edit user #{userQuery.data.id}</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          updateUserMutation.mutate({ email_address: currentEmail });
        }}
      >
        <label htmlFor="email_address">Email</label>
        <br />
        <input
          id="email_address"
          name="email_address"
          type="email"
          value={currentEmail}
          onChange={(event) => setEmailAddress(event.target.value)}
        />
        <br />
        <br />
        <button type="submit" disabled={updateUserMutation.isPending}>
          {updateUserMutation.isPending ? "Saving..." : "Save"}
        </button>
      </form>
      {updateUserMutation.isError ? (
        <p>Could not update user: {updateUserMutation.error.message}</p>
      ) : null}
    </section>
  );
}
