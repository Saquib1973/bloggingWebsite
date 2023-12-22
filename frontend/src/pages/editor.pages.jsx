import React, { createContext, useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";

const BlogStructure = {
  title: "",
  banner: "",
  content: [],
  tags: [],
  description: "",
  author: {
    personal_info: "",
  },
};

export const EditorContext = createContext({});

const Editor = () => {
  const [blog, setBlog] = useState(BlogStructure);
  let {
    userAuth: { access_token },
  } = useContext(UserContext);
  console.log(access_token);
  const [editorState, setEditorState] = useState("editor");
  return (
    <EditorContext.Provider
      value={{ blog, setBlog, editorState, setEditorState }}
    >
      {!access_token ? (
        <Navigate to={"/signin"} />
      ) : editorState === "editor" ? (
        <BlogEditor />
      ) : (
        <PublishForm />
      )}
    </EditorContext.Provider>
  );
};

export default Editor;
