import React from "react";
import Header from "./common/header";
import Footer from "./common/footer";

type Props = {
  children: React.ReactNode;
};

export default function MainLayout(props: Props) {
  return (
    <div className="mx-auto max-w-7xl px-6 flex flex-col h-screen">
      <div className="flex-1">
        <Header />
        {props.children}
      </div>
      <Footer />
    </div>
  );
}
