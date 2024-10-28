export const getTinyMCEContent = (editorId: string): string | null => {
  const editor = (window as any).tinymce?.get(editorId);
  if (editor) {
    return editor.getContent();
  }
  return null;
};

export const updateTinyMCEContent = (editorId: string, content: string) => {
  const editor = (window as any).tinymce?.get(editorId);
  if (editor) {
    editor.setContent(content);
  }
};
