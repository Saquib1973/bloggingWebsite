import React, { useContext } from "react";
import AnimationWrapper from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";
import axios from "axios";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

const PublishForm = () => {
  // constants
  const characterLimit = 200;
  const minimumDescriptionLength = 50;
  const tagLimit = 10;
  const navigate = useNavigate();
  // Context
  let {
    userAuth: { access_token },
  } = useContext(UserContext);
  let {
    setBlog,
    blog,
    setEditorState,
    blog: { banner, title, tags, description, content },
  } = useContext(EditorContext);
  // Events Functions
  const handleCloseEvent = () => {
    setEditorState("editor");
  };
  const handleBlogTitleChange = (e) => {
    let input = e.target;
    setBlog({ ...blog, title: input.value });
  };
  const handleDescriptionChange = (e) => {
    let input = e.target;
    setBlog({ ...blog, description: input.value });
  };
  // Keydown functions
  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };
  const handleKeyDown = (e) => {
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();
      let tag = e.target.value;
      if (tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
          setBlog({ ...blog, tags: [...tags, tag] });
        }
      } else {
        toast.error(
          `Either you are not writing a tag or you have reached the tag limit`
        );
      }
      e.target.value = "";
    }
  };
  const publishBlog = (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }
    if (!title.length) {
      return toast.error("Write blog title before publishing it");
    }
    if (
      !description.length &&
      description.length > characterLimit &&
      description.length < minimumDescriptionLength
    ) {
      return toast.error(
        "Write blog description before publishing it , it should be of length 50 - 200 words"
      );
    }
    if (!tags.length && tags.length > tagLimit) {
      return toast.error("Write blog tags before publishing it");
    }
    let loadingToast = toast.loading("Publishing...");
    e.target.classList.add("disable");
    let blogObj = {
      title,
      banner,
      description,
      tags,
      content,
      draft: false,
    };
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogObj, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then(() => {
        e.target.classList.remove("disable");
        toast.dismiss(loadingToast);
        toast.success("Published");
        setTimeout(() => {
          navigate("/");
        }, 500);
      })
      .catch(({ response }) => {
        e.target.classList.remove("disable");
        toast.dismiss(loadingToast);
        return toast.error(response.data.error);
      });
  };
  return (
    <AnimationWrapper>
      <section className="w-auto items-center h-screen grid justify-center lg:grid-cols-2 py-16 lg:gap-4">
        <Toaster />
        <button
          className="w-12 h-12 absolute right-[3vw] lg:right-[8vw] z-10 top-[2%] lg:top-[15vh]"
          onClick={handleCloseEvent}
        >
          <i className="fi fi-br-cross 2xl:text-3xl"></i>
        </button>
        <div className="max-w-[550px] center md:bg-transparent bg-grey/40 md:shadow-none shadow-md p-4 md:px-8 rounded-md">
          <p className="text-dark-grey mb-1">Preview</p>
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
            <img src={banner} alt="" className="p-0.5 shadow-sm rounded-md" />
          </div>
          <h1 className=" text-2xl md:text-4xl mt-4 leading-tight font-medium line-clamp-2">
            {title}
          </h1>
          <p className="font-gelasio line-clamp-2 text-base md:text-xl leading-7 mt-4">
            {description}
          </p>
          <div className="flex gap-2">
            {tags.map((tag) => (
              <p className="text-dark-grey">#{tag}</p>
            ))}
          </div>
        </div>
        <div className="border-grey lg:pl-8 mt-20">
          <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
          <input
            type="text"
            placeholder="Enter blog title"
            defaultValue={title}
            className="input-box pl-4"
            onChange={handleBlogTitleChange}
          />
          <p className="text-dark-grey mb-2 mt-9">
            Short Description about yourr blog
          </p>
          <textarea
            maxLength={characterLimit}
            type="text"
            placeholder="Enter blog description"
            defaultValue={description}
            className="input-box pl-4 resize-none h-40 leading-7"
            onChange={handleDescriptionChange}
            onKeyDown={handleTitleKeyDown}
          />
          <p className="mt-1 text-dark-grey text-sm text-right">
            {characterLimit - description.length} characters left
          </p>
          <p className="text-dark-grey mt-9 mb-2">
            Topics- (Helps in ranking your blogpost)
          </p>
          <div className="relative input-box px-2 pb-4">
            <input
              type="text"
              placeholder="Topics"
              className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
              onKeyDown={handleKeyDown}
            />
            {tags.map((tag, index) => (
              <Tag tag={tag} key={index} tagIndex={index} />
            ))}
          </div>
          <p className="mt-1 text-dark-grey text-sm text-right">
            {tagLimit - tags.length} tag left
          </p>
          <button className="btn-dark px-8" onClick={publishBlog}>
            Publish
          </button>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default PublishForm;
