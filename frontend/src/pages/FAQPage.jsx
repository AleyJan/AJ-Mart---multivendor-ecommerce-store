import { useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";

const faqData = [
  {
    id: 1,
    question: "What is your return policy?",
    answer:
      "If you're not satisfied with your purchase, we accept returns within 30 days of delivery. To be eligible for a return, your item must be unused and in the same condition that you received it, with the original packaging and tags.",
  },
  {
    id: 2,
    question: "How do I track my order?",
    answer:
      "You can track your order by clicking the tracking link in your shipping confirmation email, or by visiting our website and entering your order number and email address on the Track Order page.",
  },
  {
    id: 3,
    question: "How do I contact customer support?",
    answer:
      "Our customer support team is available 24/7 to assist you. You can reach us by email at support@ajmart.com, by phone at 1-800-123-4567, or by live chat on our website.",
  },
  {
    id: 4,
    question: "Can I change or cancel my order?",
    answer:
      "Unfortunately, once an order has been placed, we are unable to make changes or cancellations. If you no longer want the items in your order, you can return them for a refund within the return window.",
  },
  {
    id: 5,
    question: "Do you offer international shipping?",
    answer:
      "Yes, we offer international shipping to most countries. Shipping costs and delivery times vary depending on the destination. You can see the options available at checkout.",
  },
  {
    id: 6,
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit/debit cards (Visa, Mastercard, American Express) via Stripe, as well as Cash on Delivery.",
  },
];

const FAQPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const toggleTab = (tab) => {
    setActiveTab(activeTab === tab ? 0 : tab);
  };

  return (
    <div>
      <Header activeHeading={5} />
      <div className="w-full bg-[#f5f5f5] min-h-screen">
        <div className={`${styles.section} py-10`}>
          <h2 className="text-[28px] font-[600] mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="mx-auto space-y-4 800px:w-[80%]">
            {faqData.map((item) => (
              <div key={item.id} className="border-b border-gray-200 pb-4">
                <button
                  className="flex items-center justify-between w-full"
                  onClick={() => toggleTab(item.id)}
                >
                  <span className="text-lg font-medium text-gray-900 text-left">
                    {item.question}
                  </span>
                  {activeTab === item.id ? (
                    <AiOutlineMinus size={20} className="text-gray-600 shrink-0" />
                  ) : (
                    <AiOutlinePlus size={20} className="text-gray-600 shrink-0" />
                  )}
                </button>

                {activeTab === item.id ? (
                  <div className="mt-4">
                    <p className="text-base text-gray-600">{item.answer}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQPage;
