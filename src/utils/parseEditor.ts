export const parseEditor = (content: string) => {
  if (!content) return "";

  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;

  // Return the formatted content with preserved HTML structure
  // Ensure to handle both textContent and innerText for different browsers
  return tempDiv.textContent || tempDiv.innerText || "";
};
