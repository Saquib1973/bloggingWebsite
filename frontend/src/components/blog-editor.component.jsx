import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "./../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { uploadImage } from "../common/aws";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
const BlogEditor = () => {
  useEffect(() => {
    let editor = new EditorJS({
      holderId: "textEditor",
      data: "",
      tools: tools,
      placeholder: "Lets write something",
    });
  }, []);

  let {
    blog: { title, banner, content, tags, description },
    setBlog,
    blog,
  } = useContext(EditorContext);
  const handleBannerUpload = (e) => {
    let img = e.target.files[0];
    if (img) {
      let loadingToast = toast.loading("Uploading image...");
      uploadImage(img)
        .then((url) => {
          if (url) {
            toast.dismiss(loadingToast);
            toast.success("Uploaded 👍");
            setBlog({ ...blog, banner: url });
          }
        })
        .catch((err) => {
          toast.dismiss(loadingToast);
          return toast.error(err.message);
        });
    }
  };
  const handleTitleKeyDown = (e) => {
    console.log(e);
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };
  const handleTitleChange = (e) => {
    let input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
    setBlog({
      ...blog,
      title: input.value,
    });
  };
  return (
    <>
      <Toaster />
      <nav className="navbar">
        <Link to={"/"} className="flex-none w-10">
          <img src={logo} alt="" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>
        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2">Publish</button>
          <button className="btn-light py-2">Save Draft</button>
        </div>
      </nav>
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-width-[900px] w-full">
            <div className="aspect-video  bg-white border-4 border-grey rounded-md hover:opacity-80">
              <label htmlFor="uploadBanner">
                <img
                  src={banner ? banner : defaultBanner}
                  alt=""
                  className="z-20 cursor-pointer"
                />
                <input
                  type="file"
                  accept=".png, .jpg , .jpeg"
                  hidden
                  id="uploadBanner"
                  onChange={handleBannerUpload}
                />
              </label>
            </div>
            <textarea
              placeholder="Blog Title"
              className="text-4xl outline-none font-medium w-full h-20 resize-none mt-10 leading-tight placeholder:opacity-40"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>
            <hr className="w-full opacity-10 my-5" />
            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
