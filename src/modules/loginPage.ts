// loginPage.ts

import { getElement } from "./dom-utils";
import { getUsers, saveUser } from "./api";
import { isUsernameAvailable } from "./user-management";
import { navigateToPostsPage } from "./postsPage"; // Antag att denna funktion finns

export function initializeLoginPage() {
  document.body.innerHTML = ""; // Rensar sidans innehåll

  // Skapar inloggningsformuläret
  const form = document.createElement("form");
  form.id = "login-form";

  // Användarnamnsfält
  const usernameInput = document.createElement("input");
  usernameInput.id = "username";
  usernameInput.placeholder = "Användarnamn";

  // Lösenordsfält
  const passwordInput = document.createElement("input");
  passwordInput.id = "password";
  passwordInput.type = "password";
  passwordInput.placeholder = "Lösenord";

  // Inloggningsknapp
  const submitButton = document.createElement("button");
  submitButton.textContent = "Logga in";
  submitButton.type = "submit";

  // Skapa konto-knapp
  const createAccountButton = document.createElement("button");
  createAccountButton.textContent = "Skapa konto";

  form.appendChild(usernameInput);
  form.appendChild(passwordInput);
  form.appendChild(submitButton);
  form.appendChild(createAccountButton);

  document.body.appendChild(form);

  // Event listener för inloggning
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const userName = usernameInput.value;
    const password = passwordInput.value;
    const users = await getUsers();

    const user = users.find((u) => u.userName === userName);
    if (user && user.password === password) {
      navigateToPostsPage(userName);
    } else {
      alert("Felaktigt användarnamn eller lösenord.");
    }
  });

  // Event listener för att skapa konto
  createAccountButton.addEventListener("click", async () => {
    const userName = usernameInput.value;
    const password = passwordInput.value;

    if (!userName || !password) {
      alert("Användarnamn och lösenord kan inte vara tomma.");
      return;
    }

    if (await isUsernameAvailable(userName)) {
      const newUser = {
        userName,
        password,
        status: "", // Lägg till en standardvärde eller relevant värde för status
        imageurl: "", // Lägg till en standardvärde eller relevant värde för imageurl
        newUser: true, // Om detta är en boolean för att indikera nya användare
      };

      await saveUser(newUser);
      alert("Konto skapades framgångsrikt. Du kan nu logga in.");
    } else {
      alert("Användarnamnet är redan taget.");
    }
  });
}
