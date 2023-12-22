import React, { useContext, useEffect, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "./../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { uploadImage } from "../common/aws";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
const BlogEditor = () => {
  let {
    blog: { title, banner, content, tags, description },
    setEditorState,
    editorState,
    setBlog,
    blog,
    textEditor,
    setTextEditor,
  } = useContext(EditorContext);
  useEffect(() => {
    setTextEditor(
      new EditorJS({
        holderId: "textEditor",
        data: content,
        tools: tools,
        placeholder: "Lets write something",
      })
    );
  }, []);
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
    // console.log(e);
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
  const handlePublishForm = () => {
    if (!banner.length) {
      toast.error("Upload a Blog Banner to publish it");
      setTimeout(() => {
        return Navigate("/editor");
      }, 2000);
    }
    if (!title.length) {
      toast.error("Write Blog Title to publish it");
      setTimeout(() => {
        return Navigate("/editor");
      }, 2000);
    }
    if (textEditor.isReady) {
      textEditor
        .save()
        .then((data) => {
          if (data.blocks.length) {
            setBlog({ ...blog, content: data });
            setEditorState("publish");
          } else {
            toast.error("Write something to your blog to publish it");
            setTimeout(() => {
              return Navigate("/editor");
            }, 2000);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  useEffect(() => {
    setTimeout(() => {
      toast(
        <div
          className="w-full drop-shadow-md rounded-md p-4 bg-red/80 text-white"
          onClick={() => toast.remove()}
        >
          {"Dont reload ! before completing the blog . Data might be lost . "}
          <Link
            to={"/help"}
            className="font-medium underline underline-offset-4"
          >
            {"Need Help ?"}
          </Link>{" "}
          {/* <i
            className="fi fi-rr-rectangle-xmark absolute text-2xl -right-6 -top-6 text-black"
          ></i> */}
        </div>,
        {
          duration: 10000,
          position: "bottom-right",
          // id: toast,
        }
      );
    }, 2000);
  }, []);

  return (
    <>
      <Toaster gutter={10} />

      <nav className="navbar">
        <Link to={"/"} className="flex-none w-10">
          <img src={logo} alt="" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>
        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublishForm}>
            Publish
          </button>
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
              defaultValue={title}
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
