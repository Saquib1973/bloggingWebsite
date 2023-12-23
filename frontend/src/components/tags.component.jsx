import React, { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";

const Tag = ({ tag, tagIndex }) => {
  // @Context
  let {
    blog: { tags },
    blog,
    setBlog,
  } = useContext(EditorContext);
  // @Functions
  // Function to delete tag
  const handleTagDelete = () => {
    tags = tags.filter((item) => item != tag);
    setBlog({ ...blog, tags });
  };
  // Function to handle tag editing
  const handleTagEdit = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();
      let currentTag = e.target.innerText;
      tags[tagIndex] = currentTag;
      setBlog({ ...blog, tags });
      e.target.setAttribute("contentEditable", false);
    }
  };
  // Function to enable tag editable functionality
  const setEditable = (e) => {
    e.target.setAttribute("contentEditable", true), e.target.focus();
  };
  return (
    <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">
      <p
        className="outline-none"
        onClick={setEditable}
        onKeyDown={handleTagEdit}
      >
        {tag}
      </p>
      <button
        className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2"
        onClick={handleTagDelete}
      >
        <i className="fi fi-br-cross text-sm pointer-events-none"></i>
      </button>
    </div>
  );
};

export default Tag;
