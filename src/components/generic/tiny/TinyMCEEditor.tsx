import React, { useMemo } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { TINY_API_KEY } from "../../../services/config/apiClientTiny";

interface TinyMCEEditorProps {
  initialValue: string;
  onEditorChange: (value: string, editor: any) => void;
  editorConfig?: any;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({ initialValue, onEditorChange, editorConfig }) => {
  const defaultEditorConfig = useMemo(
    () => ({
      height: 300,
      menubar: true,
      plugins: ["advlist", "autolink", "lists", "link", "image", "charmap", "preview", "anchor", "searchreplace", "visualblocks", "code", "fullscreen", "insertdatetime", "media", "table", "help", "wordcount"],
      toolbar: "undo redo | formatselect | " + "bold italic backcolor | alignleft aligncenter " + "alignright alignjustify | bullist numlist outdent indent | " + "removeformat | help",
      content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background-color:#1a237e; color:white; }",
      tracking: false,
      promotion: false,
      skin: "oxide-dark",
      content_css: "dark"
    }),
    []
  );

  return <Editor apiKey={TINY_API_KEY} id="description-editor" initialValue={initialValue} init={editorConfig || defaultEditorConfig} onEditorChange={onEditorChange} />;
};

export default TinyMCEEditor;
