document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("input");
  const button = document.querySelector("button");
  const paragraph = document.querySelector("p");

  button.addEventListener("click", async () => {
    const userInput = input.value.trim();
    paragraph.textContent = "Loading...";

    try {
      const response = await fetch("keys.txt", {
        cache: "no-store" // prevents browser from using an old cached file
      });

      if (!response.ok) {
        throw new Error("Unable to load keys.txt");
      }

      const text = await response.text();
      const keys = text.split(/\r?\n/).map(k => k.trim()).filter(k => k !== "");

      const found = keys.includes(userInput);

      if (found) {
        window.location.href = "https://mik10wol.github.io/start.html";
      } else {
        paragraph.textContent =
          "Did not find any similar keys. Make sure it is legitimate and spelled right. Keys refresh every 2 months, so check with the owner for your new one.";
      }
    } catch (err) {
      paragraph.textContent = "Error loading keys. Please try again later.";
      console.error("Fetch error:", err);
    }
  });
});
