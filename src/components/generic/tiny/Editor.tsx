import React, { useMemo, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { message } from "antd";
import cloudinaryConfig from "../../../services/config/cloudinaryConfig";
import Quill from "quill";

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

  // Update the handleUpload function in the Editor component
  const handleUpload = () => {
    if (window.cloudinary) {
      window.cloudinary.openUploadWidget(
        {
          cloud_name: cloudinaryConfig.cloudName,
          upload_preset: cloudinaryConfig.uploadPreset,
          sources: ["local", "url"],
          resource_type: "auto"
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            const mediaUrl = result.info.secure_url;
            const quill = ReactQuill.Quill;
            const editorElement = document.querySelector(".ql-editor");
            if (editorElement) {
              const editor = quill.find(editorElement);
              const range = editor.getSelection(true);
              const type = result.info.resource_type === "image" ? "image" : "video";
              if (range) {
                editor.insertEmbed(range.index, type, mediaUrl);
                editor.insertText(range.index + 1, `\n${mediaUrl}\n`); // Insert URL as text
                editor.setSelection(range.index + 2);
                const newText = `${text}\n${mediaUrl}`;
                setText(newText);
                onEditorChange(newText);
                // Save URL for Editor
                localStorage.setItem("editorMediaUrl", mediaUrl);
              } else {
                console.error("No selection range found.");
              }
            } else {
              console.error("Editor element not found.");
            }
          } else if (error) {
            console.error("Upload error:", error);
            message.error("Upload failed. Please try again.");
          } else {
            console.log("Upload result:", result);
          }
        }
      );
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
            ["link", "video"],
            ["clean"],
            ["upload"] // Custom upload button
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
  const icons = Quill.import("ui/icons");
  icons["upload"] = '<svg viewBox="64 64 896 896" focusable="false" data-icon="upload" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 00-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"></path></svg>';

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
