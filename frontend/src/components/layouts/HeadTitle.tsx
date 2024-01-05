import { Helmet } from 'react-helmet';

type Props = {
    title: string;
};

const HeadTitle: React.FC<Props> = ({ title }) => {
    return (
        <Helmet>
            <title>{`${title} | メモの魔力 自己分析サイト`}</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Helmet>
    );
};

export default HeadTitle;