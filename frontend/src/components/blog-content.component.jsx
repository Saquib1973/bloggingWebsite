import React from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { stackoverflowDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const BlogContent = ({ block }) => {
  let { type, data } = block;
  if (type === "paragraph") {
    return <p dangerouslySetInnerHTML={{ __html: data.text }}></p>;
  } else if (type === "header") {
    if (data.level === 3) {
      return (
        <h3
          className="text-3xl font-bold"
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></h3>
      );
    } else {
      return (
        <h2
          className="text-4xl font-bold"
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></h2>
      );
    }
  } else if (type === "image") {
    return <Img url={data.file.url} caption={data.caption} />;
  } else if (type === "quote") {
    return <Quote quote={data.text} caption={data.caption} />;
  } else if (type === "code") {
    return (
      <div className="bg-dark-grey/20 rounded-md p-1 shadow-md">
        <SyntaxHighlighter language="auto" style={stackoverflowDark}>
          {data.code}
        </SyntaxHighlighter>
      </div>
    );
  } else if (type == "list") {
    return <List style={data.style} items={data.items} />;
  }
};

export default BlogContent;

const Img = ({ url, caption }) => {
  return (
    <div>
      <img src={url} alt="" className="p-1 rounded-md shadow-md" />
      {caption.length && (
        <p className="w-full text-center my-3 md:mb-12 text-base text-dark-grey">
          {caption}
        </p>
      )}
    </div>
  );
};

const Quote = ({ quote, caption }) => {
  return (
    <div className="bg-purple/10 p-3 pl-5 border-l-4 border-purple">
      <p className="text-xl leading-10 md:text-2xl">{quote}</p>
      {caption.length && (
        <p className="w-full text-center text-base text-purple">{caption}</p>
      )}
    </div>
  );
};
const List = ({ style, items }) => {
  return (
    <ol
      className={`pl-5 ${style === "ordered" ? "list-decimal" : "list-disc"}`}
    >
      {items.map((item, index) => {
        return (
          <li
            key={index}
            className="my-4"
            dangerouslySetInnerHTML={{ __html: item }}
          ></li>
        );
      })}
    </ol>
  );
};
