export const fetchUsers = async () => {
  const usersResult = await fetch("/api/users");
  console.log("Retrieved usersResult");
  return usersResult;
};

export const fetchUser = async (userId: string) => {
  const usersResult = await fetch(`/users/${userId}`);
  return usersResult;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const postUser = async (formData: any) => {
  const json = JSON.stringify(formData);
  const postResult = await fetch("/api/users", {
    method: "POST",
    body: json,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return postResult;
};
