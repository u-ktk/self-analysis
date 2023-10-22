import React from 'react'
import styles from '../../components/styles/Common.module.css';
import helpStyles from '../../components/styles/Help.module.css';

import help2 from '../../images/help/help2.png'
import help3 from '../../images/help/help3.png'
import help4 from '../../images/help/help4.png'
import search from '../../images/help/searchIcon.png';
import folder from '../../images/help/folderIcon.png';
import create from '../../images/help/createIcon.png';
import newFolder from '../../images/icon/newFolder.svg';

const HowToUse = () => {
    return (
        <div>
            <div className={styles.bg}>
                <h4 className={styles.title}>
                    使い方
                </h4>
                <div className={helpStyles.contents}>
                    <div className={helpStyles.index}>
                        <div>
                            <span className={helpStyles.indexNumber}>&#10102;</span>
                            <span >回答する質問を選ぶ</span>
                        </div>
                        <div className={helpStyles.verticalLine}>|</div>
                        <div>
                            <span className={helpStyles.indexNumber}>&#10103;</span>
                            <span >質問に回答する</span>
                        </div>
                        <div className={helpStyles.verticalLine}>|</div>
                        <div>
                            <span className={helpStyles.indexNumber}>&#10104;</span>
                            <span >フォルダを活用する</span>
                        </div>
                        <div className={helpStyles.verticalLine}>|</div>
                        <div>
                            <span className={helpStyles.indexNumber}>&#10105;</span>
                            <span >オリジナルの質問を作る</span>
                        </div>
                    </div>
                    {/* 　１　　回答する質問を選ぶ */}
                    <div className={helpStyles.mark}>
                        <span className={helpStyles.indexNumber}>&#10102;</span>
                        <span >回答する質問を選ぶ</span>
                    </div>
                    <div className={helpStyles.description}>
                        <ul>
                            <li className={helpStyles.list}>１問目から順番に回答するもよし、今の自分にとって重要な質問を選ぶもよし。</li>
                            まずは1000問の中から、回答する質問を選びましょう。
                            <div>
                                <img alt="質問を探す" src={search} width="50" ></img>メニューで、
                                <strong>フリーワード</strong>、
                                <strong>年代</strong>、
                                <strong>カテゴリー</strong>
                                から質問を探すことができます。
                            </div>
                        </ul>
                    </div>
                    {/* ２　質問に回答する */}
                    <div className={helpStyles.mark}>
                        <span className={helpStyles.indexNumber}>&#10103;</span>
                        <span >質問に回答する</span>
                    </div>
                    <div className={helpStyles.description}>
                        <ul>
                            <li className={helpStyles.list}>質問をクリックすると、回答を作成することができます。</li>
                            「メモの魔力」p.136~p139を参考に
                            <strong>「標語（ファクトをまとめたもの）」「ファクト」「抽象」「転用」</strong>を意識して回答してみましょう。
                            （標語、ファクトは必須です）
                            <li className={helpStyles.list}>
                                １つの質問に対して複数回答することもできます。
                            </li>
                        </ul>
                        <img alt='「質問に回答する」の使い方' src={help2} className={helpStyles.img}>
                        </img>
                    </div>

                    {/* ３　フォルダを活用する */}
                    <div className={helpStyles.mark}>
                        <span className={helpStyles.indexNumber}>&#10104;</span>
                        <span >フォルダを活用する</span>
                    </div>
                    <div className={helpStyles.description}>
                        <ul>
                            <li className={helpStyles.list}>各質問の
                                <img alt='フォルダに追加' src={newFolder}></img>
                                を押すと、フォルダに追加することができます。</li>
                        </ul>
                        <img alt='「フォルダを活用する」の使い方' src={help3} className={helpStyles.img3} >
                        </img>
                        <ul>

                            <li className={helpStyles.list}>
                                <img alt='フォルダ一覧' src={folder} width="50"></img>
                                メニューでフォルダの管理や新規作成ができます。
                            </li>
                        </ul>
                    </div>

                    {/* 4 オリジナルの質問を作る */}
                    <div className={helpStyles.mark}>
                        <span className={helpStyles.indexNumber}>&#10105;</span>
                        <span >オリジナルの質問を作る</span>
                    </div>

                    <div className={helpStyles.description}>
                        <ul>
                            <li className={helpStyles.list}>各質問の
                                <img alt='質問を作る' src={create} width="50px"></img>
                                メニューで、オリジナルの質問を作ることができます。</li>
                            <li>
                                作成した質問は、
                                <img alt='質問を探す' src={search} width="50px"></img>
                                メニューから検索、一覧表示することができます。
                            </li>
                        </ul>
                        <img alt='「質問を作る」の使い方' src={help4} className={helpStyles.img4} >
                        </img>

                    </div>

                </div>
            </div>

        </div>
    )
}

export default HowToUse