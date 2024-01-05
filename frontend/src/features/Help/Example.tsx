import React, { useState } from 'react'
import styles from '../../components/styles/Common.module.css';
import helpStyles from '../../components/styles/Help.module.css';
import detailStyles from '../../components/styles/QuestionDetail.module.css';
import listStyles from '../../components/styles/List.module.css';
import { AnswersExample } from './AnswersExample';

import example1 from '../../images/help/example1.png'
import example2 from '../../images/help/example2.png'
import example3 from '../../images/help/example3.png'
import example4 from '../../images/help/example4.png'
import example5 from '../../images/help/example5.png'

import plus from '../../images/icon/plus.svg';
import minus from '../../images/icon/minus.svg';
import editIcon from '../../images/icon/edit.svg';
import { renderMatches } from 'react-router-dom';



const Example = () => {
    const [openAnswer, setOpenAnswer] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        if (openAnswer === index) {
            setOpenAnswer(null);
        } else {
            setOpenAnswer(index);
        }
    }


    // HTML文字列をレンダリング
    const renderHTML = (escapedHTML: string) => {
        return <div dangerouslySetInnerHTML={{ __html: escapedHTML }} />;
    };


    return (
        <div>
            <div className={helpStyles.bg}>
                <h4 className={styles.title}>
                    自己分析を活かす方法
                </h4>
                <div className={helpStyles.contents}>
                    <div className={helpStyles.description} style={{ marginBottom: '-20px' }}>
                        <div>
                            自己分析の目的は人によって様々だと思いますが、ここでは自己分析を
                            <strong>就活</strong>
                            に活かす際の例を紹介します。
                        </div>
                        <div>
                            就活で自己分析を行う１番の目的は、
                            <strong>自分史をもとに志望業界・職種を決定し、説得力を持たせる</strong>
                            ことです。
                        </div>
                    </div>

                    {/* 　１　　自分史を作成する */}
                    <div className={helpStyles.mark}>
                        <span className={helpStyles.indexNumber}>&#10102;</span>
                        <span >自分史を作成する</span>
                    </div>
                    <div className={helpStyles.description}>
                        <ul>
                            <li className={helpStyles.list}>今の自分を形成してるのは、幼少期から現在の経験全てです。よって過去を振り返ってみることが重要です。
                            </li>
                            <li className={helpStyles.list}>
                                ただ、幼少期何してた？と漠然と聞かれてもなかなか思い出せないでしょう。
                            </li>
                            そこで、
                            <strong>用意された具体的な質問に答えていく</strong>
                            ことで、自分の経験を細かく思い出すことができます。
                        </ul>
                        <div className={helpStyles.descriptionBox2} >
                            <div>もちろん質問に答えたらその分だけ深く自分を知ることができますが、全問答える余裕がない人がほとんどだと思います。</div>
                            <div>そんな時は、
                                <strong>具体的なエピソードが答えられそうな質問だけ</strong>
                                、もしくは
                                <strong>ESや面接に直接活かせそうな質問だけ</strong>
                                という方法でも問題ありません！</div>
                        </div>
                    </div>
                    {/* 2. 「ファクト」→「抽象化」→「転用」を繰り返す */}
                    <div className={helpStyles.mark}>
                        <span className={helpStyles.indexNumber}>&#10103;</span>
                        <span >「ファクト」→「抽象化」→「転用」を繰り返す</span>
                    </div>
                    <div className={helpStyles.description}>
                        <ul>
                            <li className={helpStyles.list}>これによって
                                <strong>
                                    自分はどういう性格で、どういうことが好きなのか？
                                    <div>
                                        どういう時に頑張れて、逆にどういう時に頑張れないのか？
                                    </div>
                                </strong>
                                などが明確になり、就活の軸や理想のキャリアも明らかになっていきます。
                            </li>
                            <li className={helpStyles.list}>
                                就活軸の根拠がエピソードに裏付けられてるからこそ、面接でも
                                <strong>説得力を持って話す</strong>
                                ことができます。
                            </li>
                            <li className={helpStyles.list}>また、
                                <strong>１つ１つのファクトから得た学びをそれっきりにせず、次にも活かす</strong>
                                ことができます。</li>


                        </ul>
                        <div className={helpStyles.descriptionBox2} >
                            「抽象化」「転用」まで考えるのは大事ですが、どうしても思いつかない質問では省略してもOK!
                        </div>
                    </div>



                    {/*  自己分析の例 */}
                    <div className={helpStyles.mark}>
                        <span className={helpStyles.indexNumber} style={{ fontWeight: 'bold' }}>＊</span>

                        <span >自己分析の例</span>
                    </div>

                    <div className={helpStyles.description}>

                        {AnswersExample.map((answer) => (
                            <div key={answer.id}>
                                {/* アコーディオンメニュー */}
                                <div className={helpStyles.exampleQuestion}>
                                    {answer.question}
                                </div>
                                <div
                                    className={detailStyles.accordion}
                                    onClick={() => toggleAccordion(answer.id)}

                                >
                                    <div style={{ marginLeft: '10px' }}>
                                        <span style={{ fontWeight: 'bold', marginRight: '20px' }}>
                                            {answer.title}
                                        </span>
                                    </div>

                                    <div >
                                        {openAnswer === answer.id ? (
                                            <span>
                                                <img src={minus} className={detailStyles.openIcon} alt='閉じる' onClick={() => { }} />
                                            </span>
                                        ) : (
                                            <span>
                                                <img src={plus} className={detailStyles.openIcon} alt='開く' onClick={() => { }} />
                                            </span>)
                                        }
                                    </div>
                                </div>
                                {openAnswer === answer.id && (
                                    <div className={detailStyles.answerBox}>


                                        <div>
                                            <div className={detailStyles.mark4} style={{ marginTop: '40px' }}>ファクト</div>
                                            <div className={detailStyles.answerText}>{renderHTML(answer.text1)}</div>

                                            {answer.text2 && (<>
                                                <div style={{ textAlign: 'center' }}>
                                                </div>
                                                <div className={detailStyles.mark4}>抽象</div>
                                                <div className={detailStyles.answerText}>{answer.text2 && renderHTML(answer.text2)}</div>

                                            </>)}
                                            {answer.text3 && (<>
                                                <div style={{ textAlign: 'center' }}>
                                                </div>
                                                <div className={detailStyles.mark4}>転用</div>
                                                <div className={detailStyles.answerText}>{answer.text3 && renderHTML(answer.text3)}</div>
                                            </>)
                                            }
                                        </div>

                                    </div>

                                )}

                            </div>
                        ))}


                        {/* <img alt='自己分析例1' src={example1} className={helpStyles.img} style={{ marginBottom: '25px' }} />
                        <img alt='自己分析例2' src={example2} className={helpStyles.img} style={{ marginBottom: '25px' }} />
                        <img alt='自己分析例3' src={example3} className={helpStyles.img} style={{ marginBottom: '25px' }} />
                        <img alt='自己分析例4' src={example4} className={helpStyles.img} style={{ marginBottom: '25px' }} />
                        <img alt='自己分析例5' src={example5} className={helpStyles.img} style={{ marginBottom: '25px' }} /> */}

                    </div>

                </div>
            </div>

        </div >
    )
}


export default Example