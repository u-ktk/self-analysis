import React from 'react'
import styles from '../../components/styles/Common.module.css';
import helpStyles from '../../components/styles/Help.module.css';

import openIcon from '../../images/icon/openBrown.svg'


const AboutThisSite = () => {
    return (
        <div className={helpStyles.bg}>
            <h4 className={styles.title}>
                このサイトについて
            </h4>
            <div className={helpStyles.contents}>
                <ul >
                    <li className={helpStyles.list}>このサイトは、前田裕二氏著「メモの魔力」の内容を実践するために作成しました。</li>
                    巻末の1000問の自己分析をより
                    <span style={{ color: '#E6914C' }}>簡単に記録</span>
                    し、
                    <span style={{ color: '#E6914C' }}>振り返る</span>
                    ことができます。

                    <li className={helpStyles.list}>
                        さらに、オリジナルの質問を作って回答することもできます。
                    </li>
                </ul>

                <div className={helpStyles.descriptionBox} >
                    <span className='mr-5' id='column'>「メモの魔力」を購入する</span>
                    <span>
                        <a
                            href='https://www.amazon.co.jp/dp/4344034082?tag=maftracking452963-22&linkCode=ure&creative=6339'
                            className={helpStyles.link}
                            target='_blank'>Amazon
                            <span>
                                <img alt="開く" src={openIcon} width="20" height="20"></img>
                            </span>
                        </a>
                    </span>
                    <span>

                        <a
                            href='https://books.rakuten.co.jp/rb/15724433/?scid=af_pc_etc&sc2id=af_103_1_10000645'
                            className={helpStyles.link}
                            target='_blank'>楽天ブックス
                            <span>
                                <img alt="開く" src={openIcon} width="20" height="20"></img>
                            </span>
                        </a>
                    </span>
                    <span>
                        <a
                            href='https://shopping.yahoo.co.jp/search?p=%E3%83%A1%E3%83%A2%E3%81%AE%E9%AD%94%E5%8A%9B&sc_e=afvc_shp_3634236'
                            className={helpStyles.link}
                            target='_blank'>Yahoo!ショッピング
                            <span>
                                <img alt="開く" src={openIcon} width="20" height="20"></img>
                            </span>
                        </a>
                    </span>

                </div>
            </div>
        </div>
    )
}

export default AboutThisSite