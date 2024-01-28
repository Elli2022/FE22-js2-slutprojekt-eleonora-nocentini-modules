// api.ts
// Hanterar alla API-anrop och interaktioner med Firebase databasen

// Uppdaterat UserInfo-gränssnitt
export interface UserInfo {
  userName: string;
  password: string;
  status: string;
  imageurl: string;
  newUser: boolean;
  posts?: { text: string; dateTime: string }[]; // Uppdatera här
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

// Funktion för att spara ett nytt inlägg med datum och tid
export const savePost = async (
  userName: string,
  postText: string
): Promise<void> => {
  try {
    const postDateTime = new Date().toLocaleString(); // Skapa en sträng med datum och tid
    const post = {
      text: postText,
      dateTime: postDateTime,
    };

    // Hämtar nuvarande användarinformation
    const response = await fetch(`${baseUrl}users/${userName}.json`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const user: UserInfo | null = await response.json();

    if (!user) {
      throw new Error("User not found");
    }

    // Uppdatera användarens inlägg
    const updatedUser = {
      ...user,
      posts: user.posts ? [...user.posts, post] : [post],
    };

    // Spara den uppdaterade användaren
    await saveUser(updatedUser);
  } catch (err) {
    console.error(err);
    throw new Error("Failed to save post");
  }
};

// Funktion för att hämta alla inlägg för en specifik användare
export const getUserPosts = async (
  userName: string
): Promise<{ text: string; dateTime: string }[]> => {
  try {
    const response = await fetch(`${baseUrl}users/${userName}.json`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const user: UserInfo | null = await response.json();

    return user && user.posts ? user.posts : [];
  } catch (err) {
    console.error(err);
    return [];
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

// Ny funktion för att hämta de senaste inläggen från alla användare
export const getLatestPostsFromAllUsers = async (): Promise<
  { userName: string; lastPost: { text: string; dateTime: string } }[]
> => {
  try {
    const response = await fetch(`${baseUrl}users.json`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    const users: FirebaseResponse | null = await response.json();
    if (!users) return [];
    console.log("Latest posts from all users:", Object.values(users));

    return Object.values(users).map((user) => {
      const lastPost = user.posts ? user.posts[user.posts.length - 1] : null;
      return {
        userName: user.userName,
        lastPost: lastPost
          ? { text: lastPost.text, dateTime: lastPost.dateTime }
          : { text: "Inget inlägg", dateTime: "" },
      };
    });
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch latest posts from all users");
  }
};
