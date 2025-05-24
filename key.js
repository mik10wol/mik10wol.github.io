<script>
document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("h1 input");
  const button = document.querySelector("button");
  const paragraph = document.querySelector("p");

  button.addEventListener("click", async () => {
    const userInput = input.value.trim();
    paragraph.textContent = "Loading...";

    try {
      const response = await fetch("keys.txt");
      if (!response.ok) throw new Error("Unable to load keys.txt");

      const text = await response.text();
      const keys = text.split(/\r?\n/).map(k => k.trim());
      const found = keys.includes(userInput);

      if (found) {
        window.location.href = "https://example.com/success"; // change this to your target URL
      } else {
        paragraph.textContent = "Did not find any similar keys. Make sure it legetete and spelt right. Keys refresh every 2 months so check with the owner for your new one";
      }
    } catch (err) {
      paragraph.textContent = "Error loading keys. Please try again later.";
      console.error(err);
    }
  });
});
</script>
