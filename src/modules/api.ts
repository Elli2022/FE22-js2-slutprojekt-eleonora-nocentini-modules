// api.ts
// Hanterar alla API-anrop och interaktioner med Firebase databasen

export interface UserInfo {
  userName: string;
  password: string;
  status: string;
  imageurl: string;
  newUser: boolean;
}

interface FirebaseResponse {
  [key: string]: UserInfo;
}

const baseUrl =
  "https://social-media-68d76-default-rtdb.europe-west1.firebasedatabase.app/";

export const getUsers = async (): Promise<UserInfo[]> => {
  try {
    const response = await fetch(`${baseUrl}users.json`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const users: FirebaseResponse | null = await response.json();
    return users ? Object.values(users) : [];
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch users");
  }
};

export const saveUser = async (user: UserInfo): Promise<void> => {
  try {
    const response = await fetch(`${baseUrl}users/${user.userName}.json`, {
      method: "PUT",
      body: JSON.stringify(user),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  } catch (err) {
    console.error(err);
    throw new Error("Failed to save user information.");
  }
};

export const deleteUser = async (username: string): Promise<void> => {
  try {
    const response = await fetch(`${baseUrl}users/${username}.json`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  } catch (err) {
    console.error(err);
    throw new Error("Failed to delete user.");
  }
};
