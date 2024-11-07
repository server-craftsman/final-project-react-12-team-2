import React, { useMemo, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { message } from "antd";
import cloudinaryConfig from "../../../services/config/cloudinaryConfig";

// Import the Cloudinary widget script in your HTML or dynamically load it
// <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript"></script>

// Extend the Window interface to include cloudinary
declare global {
  interface Window {
    cloudinary: any;
  }
}

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

  const handleUpload = () => {
    // Ensure the Cloudinary widget script is loaded
    if (window.cloudinary) {
      window.cloudinary.openUploadWidget({ cloud_name: cloudinaryConfig.cloudName, upload_preset: cloudinaryConfig.uploadPreset, sources: ["local", "url"], resource_type: "auto" }, (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          const mediaUrl = result.info.secure_url;
          const quill = ReactQuill.Quill;
          const editorElement = document.querySelector(".ql-editor");
          if (editorElement) {
            const editor = quill.find(editorElement);
            const range = editor.getSelection();
            const type = result.info.resource_type === "image" ? "image" : "video";
            editor.insertEmbed(range.index, type, mediaUrl);
          } else {
            console.error("Editor element not found.");
          }
        } else if (error) {
          console.error("Upload error:", error);
          message.error("Upload failed. Please try again.");
        }
      });
    } else {
      console.error("Cloudinary widget script not loaded.");
    }
  };

  const defaultEditorConfig = useMemo(
    () => ({
      theme: "snow",
      modules: {
        toolbar: {
          container: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
            ["link", "image", "video"],
            ["clean"],
            ["upload"] // Add custom upload button
          ],
          handlers: {
            upload: handleUpload // Custom handler for upload
          }
        }
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
