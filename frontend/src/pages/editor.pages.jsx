import React, { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { Navigate, useParams } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";
import Loader from "../components/loader.component";
import axios from "axios";

// Blog Structure
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
// Editor Context
export const EditorContext = createContext({});
const Editor = () => {
  let { blog_id } = useParams();
  // UseStates
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState(BlogStructure);
  const [editorState, setEditorState] = useState("editor");
  const [textEditor, setTextEditor] = useState({ isReady: false });
  // Context Imports
  let {
    userAuth,
    userAuth: { access_token },
  } = useContext(UserContext);
  // console.log("Accesstoken @ EditorPage.jsx :", access_token);
  useEffect(() => {
    if (!blog_id) {
      return setLoading(false);
    }
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", {
        blog_id,
        draft: true,
        mode: "edit",
      })
      .then(({ data: { blog } }) => {
        setBlog(blog);
        // console.log(blog);
        setLoading(false);
        // console.log("Fetched blog data:", blog);
      })
      .catch((err) => {
        console.log(err);
        setBlog(BlogStructure);
        setLoading(false);
      });
  }, []);
  return (
    <EditorContext.Provider
      value={{
        blog,
        setBlog,
        editorState,
        setEditorState,
        textEditor,
        setTextEditor,
      }}
    >
      {!access_token ? (
        <Navigate to={"/auth/signin"} />
      ) : loading ? (
        <Loader />
      ) : editorState === "editor" ? (
        <BlogEditor />
      ) : (
        <PublishForm />
      )}
    </EditorContext.Provider>
  );
};

export default Editor;
