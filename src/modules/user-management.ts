// src/modules/user-management.ts

import { getUsers, saveUser, deleteUser } from "./api";

export interface UserInfo {
  userName: string;
  password: string;
  status: string;
  imageurl: string;
  newUser: boolean;
}

// Kontrollera om ett användarnamn är tillgängligt
export const isUsernameAvailable = async (
  username: string
): Promise<boolean> => {
  const users = await getUsers();
  return !users.some((user) => user.userName === username);
};

// Skapa en ny användare
export const createUser = async (userInfo: UserInfo): Promise<void> => {
  if (await isUsernameAvailable(userInfo.userName)) {
    await saveUser(userInfo);
  } else {
    throw new Error("Användarnamnet är redan taget.");
  }
};

// Ta bort en användare
export const removeUser = async (username: string): Promise<void> => {
  await deleteUser(username);
};

// Ytterligare funktioner för användarhantering kan inkluderas här.
// Till exempel, uppdatera användare, hantera lösenordsåterställningar, etc.
