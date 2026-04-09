import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

type User = {
  id: number;
  email_address: string;
  created_at: string;
};

async function fetchUsers(): Promise<Array<User>> {
  const response = await fetch("/api/users");

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export const Route = createFileRoute("/users")({
  component: UsersRoute,
});

function UsersRoute() {
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (usersQuery.isLoading) {
    return <p>Loading users...</p>;
  }

  if (usersQuery.isError) {
    return <p>Could not load users: {usersQuery.error.message}</p>;
  }

  if (usersQuery.data.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <section>
      <h2>Users</h2>
      <ul>
        {usersQuery.data.map((user) => (
          <li key={user.id}>
            <Link to="/users/$id" params={{ id: String(user.id) }}>
              {user.email_address}
            </Link>
            {" - created at "}
            <time dateTime={user.created_at}>{user.created_at}</time>
          </li>
        ))}
      </ul>
    </section>
  );
}
