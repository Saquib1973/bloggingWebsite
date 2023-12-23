import React from "react";
import AnimationWrapper from "./../common/page-animation";
import { Link } from "react-router-dom";

const Help = () => {
  // FAQ data
  const faqs = [
    {
      summary: "Will my blog get deleted if i reload the page ?",
      desc: "The blog data which you fill is being stored in your session storage and will be reset if you refresh the page. This website is built pn React , the main point of using React was to avoid page reloading .If your query is not resolved mail us at below given mail address",
    },
    {
      summary: "Login/Register with normal forms issue",
      desc: "There are few bugs related to normal sign-in and sign-up .It will get resolved in future till then we recommend you to use google auth service to register/login",
    },
    {
      summary: "How does the billing work?",
      desc: " Springerdata offers a variety of billing options, including monthly and annual subscription plans, as well as pay-as-you-go pricing for certain services. Payment is typically made through a credit card or other secure online payment method.",
    },
    {
      summary: "Can I get a refund for my subscription?",
      desc: "  We offer a 30-day money-back guarantee for most of its subscription plans. If you are not satisfied with your subscription within the first 30 days, you can request a full refund. Refunds for subscriptions that have been active for longer than 30 days may be considered on a case-by-case basis.",
    },
    {
      summary: "Is there a free trial?",
      desc: "   We offer a free trial of our software for a limited time. During the trial period, you will have access to a limited set of features and functionality, but you will not be charged.",
    },
    {
      summary: "How do I contact support?",
      desc: "  If you need help with our platform or have any other questions, you can contact the company's support team by submitting a support request through the website or by emailing support@ourwebsite.com.",
    },
  ];
  // Send mail function
  const sendMail = () => {
    const email = "saquibali353@gmail.com";
    const subject = "I need some help";
    const body = "Hello , I need some help";
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };
  return (
    <AnimationWrapper>
      <section className="">
        <div className="relative w-full bg-white px-6 pt-10 pb-8 my-8 md:shadow-xl md:ring-1 ring-grey sm:mx-auto sm:max-w-2xl sm:rounded-lg sm:px-10">
          <div className="mx-auto px-5">
            <div className="flex flex-col items-center">
              <h2 className="mt-5 text-center text-3xl font-bold tracking-tight md:text-5xl">
                FAQ
              </h2>
              <p className="mt-3 text-lg text-neutral-500 md:text-xl">
                Frequenty asked questions
              </p>
            </div>
            <div className="mx-auto mt-8 grid max-w-xl divide-y divide-neutral-200">
              {faqs.map((faq, index) => (
                <div className="py-5" key={index}>
                  <details className="group">
                    <summary className=" flex cursor-pointer list-none items-center justify-between font-medium">
                      <span>{faq.summary}</span>
                      <span className="transition group-open:rotate-180">
                        <i className="fi fi-rr-caret-down text-2xl"></i>
                      </span>
                    </summary>
                    <p className="group-open:animate-fadeIn mt-3 text-neutral-600">
                      {faq.desc}
                    </p>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-dark-grey text-center md:mt-16">
          If your query doesn't gets resolved mail us at{" "}
          <span
            className="underline underline-offset-4 cursor-pointer"
            onClick={sendMail}
          >
            saquibali353@gmail.com
          </span>
        </p>
      </section>
    </AnimationWrapper>
  );
};

export default Help;
