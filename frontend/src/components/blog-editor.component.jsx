import React, { useContext, useEffect } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import logo from "../imgs/logo.png";
import AnimationWrapper from "./../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { uploadImage } from "../common/aws";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
import axios from "axios";
import { UserContext, scrollToTop } from "../App";
const BlogEditor = () => {
  let { blog_id } = useParams();
  // constants
  const navigate = useNavigate();
  // Context imports
  let {
    userAuth: { access_token },
  } = useContext(UserContext);
  let {
    blog: { title, banner, content, tags, description },
    setEditorState,
    editorState,
    setBlog,
    blog,
    textEditor,
    setTextEditor,
  } = useContext(EditorContext);
  // UseEffect to establish EditorJs for once
  useEffect(() => {
    if (!textEditor.isReady) {
      setTextEditor(
        new EditorJS({
          holderId: "textEditor",
          data: Array.isArray(content) ? content[0] : content,
          tools: tools,
          placeholder: "Lets write something",
        })
      );
    }
  }, []);
  // Function to handle banner upload
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
  // Function to handle key down , not letting user use enter key in title section
  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };
  // Function to handle title change
  const handleTitleChange = (e) => {
    let input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
    setBlog({
      ...blog,
      title: input.value,
    });
  };
  // Function to Publish a form
  const handlePublishForm = () => {
    // Validations
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
  // function to save draft
  const handleSaveDraft = (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }
    if (!title.length) {
      return toast.error("Write blog title before Saving it as a draft");
    }
    let loadingToast = toast.loading("Saving Draft...");
    e.target.classList.add("disable");
    if (textEditor.isReady) {
      textEditor.save().then((content) => {
        let blogObj = {
          title,
          banner,
          description,
          tags,
          content,
          draft: true,
        };
        axios
          .post(
            import.meta.env.VITE_SERVER_DOMAIN + "/create-blog",
            { ...blogObj, id: blog_id },
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            }
          )
          .then(() => {
            e.target.classList.remove("disable");
            toast.dismiss(loadingToast);
            toast.success("Saved");
            setTimeout(() => {
              navigate("/");
            }, 500);
          })
          .catch(({ response }) => {
            e.target.classList.remove("disable");
            toast.dismiss(loadingToast);
            return toast.error(response.data.error);
          });
      });
    }
  };
  // Message for user using Toast
  useEffect(() => {
    setTimeout(() => {
      toast(
        <div
          className="w-full text-sm md:text-lg drop-shadow-md rounded-md p-2 md:p-4 bg-red/80 text-white"
          onClick={() => toast.remove()}
        >
          {"Dont reload ! before completing the blog . Data might be lost . "}
          <Link
            to={"/help"}
            // target="_blank"
            className="font-medium underline underline-offset-4"
          >
            {"Need Help ?"}
          </Link>{" "}
        </div>,
        {
          duration: 10000,
          position: "top-center",
        }
      );
    }, 1000);
  }, []);
  return (
    <>
      <Toaster gutter={10} />
      {/* Navbar component for Editor section */}
      <nav className="navbar">
        <Link to={"/"} className="flex-none w-10">
          <img src={logo} alt="" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>
        <div className="flex gap-4 ml-auto">
          <button
            className="btn-dark py-2"
            onClick={() => {
              handlePublishForm();
              scrollToTop();
            }}
          >
            Publish
          </button>
          <button className="btn-light py-2" onClick={handleSaveDraft}>
            Save Draft
          </button>
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
