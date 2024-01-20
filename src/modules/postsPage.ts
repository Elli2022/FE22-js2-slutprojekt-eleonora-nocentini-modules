// postsPage.ts

import { getUserPosts, savePost } from "./api";
import { initializeLoginPage } from "./loginPage"; // Importera funktionen

export function navigateToPostsPage(userName: string) {
  document.body.innerHTML = "";

  const header = document.createElement("h1");
  header.textContent = `Välkommen till din Wall, ${userName}!`;
  document.body.appendChild(header);

  const postInput = document.createElement("textarea");
  postInput.placeholder = `Vad gör du just nu, ${userName}?`;
  document.body.appendChild(postInput);

  const postButton = document.createElement("button");
  postButton.textContent = "Posta";
  document.body.appendChild(postButton);

  const postsContainer = document.createElement("div");
  postsContainer.id = "posts";
  document.body.appendChild(postsContainer);

  getUserPosts(userName).then((posts) => {
    posts.forEach((post) => {
      const postElement = document.createElement("p");
      postElement.textContent = post.text;
      postsContainer.appendChild(postElement);
    });
  });

  postButton.addEventListener("click", async () => {
    if (postInput.value) {
      await savePost(userName, postInput.value);
      const postElement = document.createElement("p");
      postElement.textContent = postInput.value;
      postsContainer.appendChild(postElement);
      postInput.value = "";
    }
  });

  // Skapa och konfigurera "Logga ut"-knappen
  const logoutButton = document.createElement("button");
  logoutButton.textContent = "Logga ut";
  logoutButton.addEventListener("click", () => {
    initializeLoginPage(); // Återgå till inloggningssidan
  });

  document.body.appendChild(logoutButton);
}
