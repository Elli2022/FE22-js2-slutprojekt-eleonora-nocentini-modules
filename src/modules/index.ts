// src/modules/index.ts

import { getElement } from "./dom-utils";
import { initializeEventListeners } from "./event-listeners";
import { getUsers, saveUser, deleteUser, savePost, getUserPosts } from "./api";
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

// Rensa meddelanden
function clearMessage() {
  messageElement.textContent = "";
}

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

// Funktion för att återställa till förstasidan
function resetToFirstPage() {
  document.body.innerHTML = ""; // Rensa innehållet först

  // Återskapa inloggningsformuläret och andra förstasidans element
  document.body.appendChild(form);
  document.body.appendChild(createAccountButton);
  document.body.appendChild(submitButton);
}

// Funktion för att byta till "wall"-sidan efter inloggning
// Funktion för att byta till "wall"-sidan efter inloggning
async function navigateToWall(userName: string) {
  document.body.innerHTML = "";

  const header = document.createElement("h1");
  header.textContent = `Välkommen till din Wall, ${userName}!`;
  document.body.appendChild(header);

  const postInput = document.createElement("textarea");
  postInput.placeholder = `Vad gör du just nu? , ${userName}`;
  document.body.appendChild(postInput);

  const postButton = document.createElement("button");
  postButton.textContent = "Posta";
  document.body.appendChild(postButton);

  const postsContainer = document.createElement("div");
  postsContainer.id = "posts";
  document.body.appendChild(postsContainer);

  // Ladda in och visa användarens tidigare sparade poster
  const posts = await getUserPosts(userName);
  posts.forEach((post) => {
    const postElement = document.createElement("p");
    postElement.textContent = post.text;
    postsContainer.appendChild(postElement);
  });

  // Event listener för postknappen
  postButton.addEventListener("click", async () => {
    if (postInput.value) {
      await savePost(userName, postInput.value);

      const postElement = document.createElement("p");
      postElement.textContent = postInput.value;
      postsContainer.appendChild(postElement);

      postInput.value = ""; // Rensa textfältet efter postning
    }
  });

  const logoutButton = document.createElement("button");
  logoutButton.textContent = "Logga ut";
  document.body.appendChild(logoutButton);

  logoutButton.addEventListener("click", () => {
    resetToFirstPage();
  });
}
