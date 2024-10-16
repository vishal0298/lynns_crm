import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const TextEditor = () => {
  return <CKEditor editor={ClassicEditor} />;
};

export default TextEditor;
