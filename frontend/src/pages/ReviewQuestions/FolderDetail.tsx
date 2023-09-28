import React, { useEffect, useState } from 'react'
import HeadTitle from '../../components/layouts/HeadTitle'
import { Folder, Question, Answer } from '../../types'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../components/auth/Auth'
import { getFolderDetail } from '../../components/api/Folder'
import styles from '../../components/styles/Common.module.css'
import loadStyles from '../../components/styles/Loading.module.css'
import detailStyles from '../../components/styles/QuestionDetail.module.css'
import noteIcon from '../../images/icon/note.svg'
import { Table } from 'react-bootstrap'
import checkMark from '../../images/checked.png'



const FolderDetail = () => {
    const { accessToken } = useAuth()
    const searchParams = new URLSearchParams(useLocation().search)
    const userParams = searchParams.get('user')
    const nameParams = searchParams.get('name')
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const [folderDetail, setFolderDetail] = useState<Folder | null>(null)

    const fetchData = async () => {
        if (!accessToken || !userParams || !nameParams) {
            console.log('フォルダの詳細を取得できませんでした')
            return
        }
        try {
            let res;
            if (userParams && nameParams) {
                res = await getFolderDetail({ accessToken, userId: userParams }, nameParams)
            }
            if (res) {
                setFolderDetail(res[0])
                console.log(folderDetail)

            }
        } catch (err: any) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        fetchData()
    }, [accessToken, userParams, nameParams])

    return (
        <>
            <HeadTitle title={`${nameParams}`} />
            <div className={styles.bg}>
                {!folderDetail && (
                    <div className={loadStyles.loading}>
                        <span className={loadStyles.text}>Loading...</span>
                    </div>
                )}

                <div className={`${styles.menu} mb-4 `}>
                    <a href='/review-questions' className={styles.link}>フォルダ一覧 </a>
                    <span> &#62; </span>
                    <span style={{ fontWeight: 'bold' }}>{nameParams}({folderDetail?.questions.length})</span>
                </div>

                <div className={detailStyles.contents}>
                    {folderDetail?.questions ? (
                        <>
                            <div>
                                {folderDetail.questions.map((question: Question, index: number) => (
                                    <div key={question.id}>
                                        {/* 最初の質問 or カテゴリー名が前回と異なるときに表示 */}
                                        {index === 0 || question.category_name !== folderDetail.questions[index - 1].category_name ? (
                                            <div className={detailStyles.category}>{question.category_name}</div>

                                        ) : null}

                                        {/* [自分で作成した質問]も初回のみ表示 */}
                                        {folderDetail.questions[index].category_name == null && folderDetail.questions[index - 1].category_name !== null ? (
                                            <div className={detailStyles.category}>自分で作成した質問</div>

                                        ) : null}

                                        {/* デフォルト質問なら質問の番号表示、カスタム質問ならメモアイコン追加 */}
                                        <table className={detailStyles.questionGroup}>
                                            <tbody >
                                                <tr>
                                                    {question.category_name ? (
                                                        <td className={detailStyles.id}>{question.id}.</td>
                                                    ) : (
                                                        <td >
                                                            <img src={noteIcon} alt='memo' className={detailStyles.icon} width="20" height="20" />
                                                        </td>
                                                    )}
                                                    <td className={detailStyles.text}>
                                                        <a href={`/questions/detail/?id=${question.id}`} className={detailStyles.link}>{question.text}
                                                            ({question.age})
                                                        </a>

                                                    </td>
                                                    {(question.answers[0]) && (
                                                        <td>

                                                            <img src={checkMark} alt='check' className={detailStyles.check} />
                                                        </td>

                                                    )}
                                                </tr>
                                            </tbody>
                                        </table>


                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className={styles.description}>まだ質問がありません。</div>
                    )}
                </div>
            </div>
        </>
    );
}
export default FolderDetail