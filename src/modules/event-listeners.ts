// src/modules/event-listeners.ts

import { getElement } from "./dom-utils";
import { getUsers, saveUser, deleteUser } from "./api";
import { isUsernameAvailable } from "./user-management";
import { navigateToWall } from "./postsContainer";

// Funktioner för att hantera användargränssnittsinteraktioner
const initializeCreateAccount = () => {
  const createAccountButton = getElement(
    "create-account-button"
  ) as HTMLButtonElement;
  const usernameInput = getElement("username") as HTMLInputElement;
  const passwordInput = getElement("password") as HTMLInputElement;
  const accountCreated = document.createElement("h1");
  const errorMessage = document.createElement("p");

  createAccountButton.addEventListener("click", async () => {
    const userName = usernameInput.value;
    const password = passwordInput.value;

    if (!userName || !password) {
      errorMessage.textContent = "Username and/or password cannot be empty.";
      document.body.appendChild(errorMessage);
      return;
    }

    if (!(await isUsernameAvailable(userName))) {
      errorMessage.textContent = "Username is already taken.";
      document.body.appendChild(errorMessage);
      return;
    }

    const newUser = {
      userName: userName,
      password: password,
      status: "",
      imageurl: "",
      newUser: true,
    };

    await saveUser(newUser);
    accountCreated.textContent = "Account successfully created!";
    document.body.appendChild(accountCreated);
  });
};

const initializeLogin = () => {
  const submitButton = getElement("submit-button") as HTMLButtonElement;
  const usernameInput = getElement("username") as HTMLInputElement;
  const passwordInput = getElement("password") as HTMLInputElement;
  const errorMessage = document.createElement("p");

  submitButton.addEventListener("click", async (event) => {
    event.preventDefault();

    const userName = usernameInput.value;
    const password = passwordInput.value;
    const users = await getUsers();

    const user = users.find((u) => u.userName === userName);
    if (!user) {
      errorMessage.textContent = "User not found.";
      document.body.appendChild(errorMessage);
      return;
    }

    if (user.password !== password) {
      errorMessage.textContent = "Incorrect password.";
      document.body.appendChild(errorMessage);
      return;
    }

    // Anropa navigateToWall efter en lyckad inloggning
    navigateToWall(userName);
  });
};

const initializeEventListeners = () => {
  initializeCreateAccount();
  initializeLogin();
  // Lägg till fler event listeners och deras initialiseringar här
};

export { initializeEventListeners };
