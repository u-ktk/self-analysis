import Head from "next/head";

type Props = {
  title: string;
};

const HeadTitle: React.FC<Props> = ({ title }) => {
  return (
    <Head>
      <title>{`${title} | メモの魔力 自己分析サイト`}</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
  );
};

export default HeadTitle;