import Image from 'next/image'
import styles from "../styles/HomePage.module.css";
import { Inter } from 'next/font/google'
import Header from '@/components/layouts/Header';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] })


type Props = {
  title: string;
};


export default function Home() {
  return (
    <div>
      <Head>
      <title>メモの魔力 自己分析サイト</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <h1 className="text-4xl font-bold text-center">Hello World</h1>

    </div>
  )
}
