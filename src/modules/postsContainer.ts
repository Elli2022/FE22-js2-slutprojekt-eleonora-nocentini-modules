import { getUserPosts, savePost } from "./api";

export async function navigateToWall(userName: string) {
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

  // Ladda in och visa användarens tidigare sparade poster
  const posts = await getUserPosts(userName);
  posts.forEach((post) => {
    const postElement = document.createElement("div");
    const textElement = document.createElement("p");
    const dateTimeElement = document.createElement("p");

    textElement.textContent = post.text;
    dateTimeElement.textContent = `Postad: ${post.dateTime}`;

    postElement.appendChild(textElement);
    postElement.appendChild(dateTimeElement);

    postsContainer.appendChild(postElement);
  });

  // Event listener för postknappen
  postButton.addEventListener("click", async () => {
    if (postInput.value) {
      // Anropa savePost för att spara inlägget i Firebase
      await savePost(userName, postInput.value);

      // Skapa element för det nya inlägget
      const postElement = document.createElement("div");
      const textElement = document.createElement("p");
      const dateTimeElement = document.createElement("p");

      textElement.textContent = postInput.value;
      dateTimeElement.textContent = `Postad: ${new Date().toLocaleString()}`;

      postElement.appendChild(textElement);
      postElement.appendChild(dateTimeElement);

      postsContainer.appendChild(postElement);
      postInput.value = ""; // Rensa textfältet efter postning
    }
  });

  // Skapa en utloggningsknapp
  const logoutButton = document.createElement("button");
  logoutButton.textContent = "Logga ut";
  document.body.appendChild(logoutButton);

  // Event listener för utloggningsknappen
  logoutButton.addEventListener("click", () => {});
}
