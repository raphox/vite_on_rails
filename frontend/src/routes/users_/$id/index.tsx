import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

type User = {
  id: number;
  email_address: string;
  created_at: string;
  updated_at: string;
};

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export const Route = createFileRoute("/users_/$id/")({
  component: UserDetailsRoute,
});

function UserDetailsRoute() {
  const { id } = Route.useParams();
  const userQuery = useQuery({
    queryKey: ["users", id],
    queryFn: () => fetchUser(id),
  });

  if (userQuery.isLoading) {
    return <p>Loading user...</p>;
  }

  if (userQuery.isError) {
    return <p>Could not load user: {userQuery.error.message}</p>;
  }

  return (
    <section>
      <p>
        <Link to="/users">Back to users</Link>
      </p>
      <p>
        <Link to="/users/$id/edit" params={{ id }}>
          Edit user
        </Link>
      </p>
      <h2>User #{userQuery.data.id}</h2>
      <dl>
        <dt>Email</dt>
        <dd>{userQuery.data.email_address}</dd>
        <dt>Created at</dt>
        <dd>
          <time dateTime={userQuery.data.created_at}>
            {userQuery.data.created_at}
          </time>
        </dd>
        <dt>Updated at</dt>
        <dd>
          <time dateTime={userQuery.data.updated_at}>
            {userQuery.data.updated_at}
          </time>
        </dd>
      </dl>
    </section>
  );
}
