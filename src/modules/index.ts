// src/modules/index.ts

import { getElement } from "./DOM-utils";
import { initializeEventListeners } from "./event-listeners";
import { getUsers, saveUser, deleteUser } from "./api";
import { isUsernameAvailable } from "./user-management";

const submitButton = getElement("submit-button") as HTMLButtonElement;
const createAccountButton = getElement(
  "create-account-button"
) as HTMLButtonElement;
const usernameInput = getElement("username") as HTMLInputElement;
const passwordInput = getElement("password") as HTMLInputElement;
const form = getElement("form") as HTMLFormElement;
const messageElement = document.createElement("p");

// Funktion för att visa meddelanden
function showMessage(message: string, color: string = "red") {
  messageElement.textContent = message;
  messageElement.style.color = color;
  form.appendChild(messageElement);
}

// Rensa meddelanden
function clearMessage() {
  messageElement.textContent = "";
}

// Logik för att skapa konto
createAccountButton.addEventListener("click", async () => {
  clearMessage();
  const userName = usernameInput.value;
  const password = passwordInput.value;

  if (!userName || !password) {
    showMessage("Username and/or password cannot be empty.");
    return;
  }

  if (await isUsernameAvailable(userName)) {
    const newUser = {
      userName,
      password,
      status: "",
      imageurl: "",
      newUser: true,
    };
    await saveUser(newUser);
    showMessage("Account successfully created! You may now log in.", "green");
  } else {
    showMessage("Username is already taken.");
  }
});

// Logik för inloggning
submitButton.addEventListener("click", async (event) => {
  event.preventDefault();
  clearMessage();
  const userName = usernameInput.value;
  const password = passwordInput.value;
  const users = await getUsers();

  const user = users.find((u) => u.userName === userName);
  if (!user) {
    showMessage(
      "No account found for this user. Please create an account first."
    );
    return;
  }

  if (user.password !== password) {
    showMessage("Incorrect password. Please try again.");
    return;
  }

  // Logga in användaren och navigera till wall
  showMessage(`Welcome ${userName}!`, "green");
  navigateToWall(userName); // Använd 'userName' som definierades i detta scope
});

// Initiera event listeners
initializeEventListeners();

// Funktion för att byta till "wall"-sidan efter inloggning
function navigateToWall(userName: any) {
  // Rensa innehållet i body och skapa en ny layout för wall
  document.body.innerHTML = "";

  // Skapa en header med välkomstmeddelande
  const header = document.createElement("h1");
  header.textContent = `Välkommen till din Wall, ${userName}!`;
  document.body.appendChild(header);

  // Textfält för att skriva inlägg
  const postInput = document.createElement("textarea");
  postInput.placeholder = "Skriv ett inlägg...";
  document.body.appendChild(postInput);

  // Knapp för att posta inlägg
  const postButton = document.createElement("button");
  postButton.textContent = "Posta";
  document.body.appendChild(postButton);

  // Behållare för inlägg
  const postsContainer = document.createElement("div");
  postsContainer.id = "posts";
  document.body.appendChild(postsContainer);

  // Event listener för postknappen
  postButton.addEventListener("click", () => {
    if (postInput.value) {
      const post = document.createElement("p");
      post.textContent = postInput.value;
      postsContainer.appendChild(post);
      postInput.value = ""; // Rensa textfältet efter postning
    }
  });
}

// Modifiera inloggningslogiken för att navigera till wall
submitButton.addEventListener("click", async (event) => {
  // Din befintliga inloggningslogik
});
