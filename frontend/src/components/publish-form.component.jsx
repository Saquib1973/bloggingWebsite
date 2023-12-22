import React, { useContext } from "react";
import AnimationWrapper from "../common/page-animation";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";

const PublishForm = () => {
  const characterLimit = 200;
  const tagLimit = 10;
  let {
    setBlog,
    blog,
    setEditorState,
    blog: { banner, title, tags, description },
  } = useContext(EditorContext);
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
  const handleTitleKeyDown = (e) => {
    // console.log(e);
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
  return (
    <AnimationWrapper>
      <section className="w-auto items-center min-h-screen grid justify-center lg:grid-cols-2 py-16 lg:gap-4">
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
            <img src={banner} alt="" />
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
            placeholder="Enter blog title"
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
          <button className="btn-dark px-8">Publish</button>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default PublishForm;
