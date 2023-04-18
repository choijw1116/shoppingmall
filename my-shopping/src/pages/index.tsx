import Head from "next/head";
import Header from "../components/common/header";
import MainLayout from "../components/mainLayout";
import ProductList from "../components/productList";
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  console.log("inter", inter);
  return (
    <MainLayout>
      <Head>
        <title>My Shopping</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProductList />
    </MainLayout>
  );
}

{
  /* <div id='wrapper'>
  <div>
    content
  </div>
</div>
<footer></footer>
CSS

#wrapper{
  height: auto;
  min-height: 100%;
  padding-bottom: (footer높이);
}
footer{
  height: (footer높이);
  position : relative;
  transform : translateY(-100%);
} */
}
