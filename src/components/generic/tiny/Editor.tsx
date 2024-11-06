import React, { useMemo, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface EditorProps {
  initialValue: string;
  onEditorChange: (value: string) => void;
  editorConfig?: any;
}

const Editor: React.FC<EditorProps> = ({ initialValue, onEditorChange, editorConfig }) => {
  const [text, setText] = useState(initialValue);

  useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

  const defaultEditorConfig = useMemo(
    () => ({
      theme: "snow",
      modules: {
        toolbar: [[{ header: "1" }, { header: "2" }, { font: [] }], [{ size: [] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["link", "image", "video"], ["clean"]]
      }
    }),
    []
  );

  const handleChange = (value: string) => {
    setText(value);
    onEditorChange(value);
  };

  return (
    <div className="card">
      <ReactQuill
        value={text}
        onChange={handleChange}
        modules={editorConfig?.modules || defaultEditorConfig.modules}
        theme={editorConfig?.theme || defaultEditorConfig.theme}
        style={
          {
            height: "250px",
            marginTop: "20px",
            marginBottom: "50px",
            "--ql-primary": "#1a237e",
            "--ql-active": "#1a237e",
            "--ql-border": "#1a237e"
          } as React.CSSProperties
        }
      />
    </div>
  );
};

export default Editor;
