export const parseEditor = (content: string) => {
  if (!content) return "";

  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = content;

  // Remove any script tags for security
  const scriptTags = tempDiv.getElementsByTagName("script");
  while (scriptTags.length > 0) {
    scriptTags[0].parentNode?.removeChild(scriptTags[0]);
  }

  // Clean and format the content
  const cleanContent = tempDiv.innerHTML
    .replace(/<p>&nbsp;<\/p>/g, "") // Remove empty paragraphs
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();

  // Convert HTML entities to readable text
  const decodedContent = cleanContent
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Keep HTML formatting tags and add luxury styling
  const formattedContent = decodedContent
    .replace(/<p>/g, '<p class="text-gray-600 leading-relaxed mb-4">')
    .replace(/<h1>/g, '<h1 class="text-3xl font-bold text-gray-800 mb-6">')
    .replace(/<h2>/g, '<h2 class="text-2xl font-semibold text-gray-800 mb-4">')
    .replace(/<h3>/g, '<h3 class="text-xl font-medium text-gray-800 mb-3">')
    .replace(/<ul>/g, '<ul class="list-disc list-inside mb-4 space-y-2">')
    .replace(/<ol>/g, '<ol class="list-decimal list-inside mb-4 space-y-2">')
    .replace(/<li>/g, '<li class="text-gray-600">')
    .replace(/<strong>/g, '<strong class="font-semibold text-gray-800">')
    .replace(/<em>/g, '<em class="italic text-gray-700">')
    .replace(/<u>/g, '<u class="underline decoration-2 decoration-indigo-500">')
    .replace(/<\/?(?!(?:b|i|u|em|strong|p|h[1-6]|br|ul|ol|li)\b)[^>]*>/g, "");

  return formattedContent;
};
