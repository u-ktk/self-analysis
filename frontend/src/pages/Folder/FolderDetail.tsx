import React, { useEffect, useState } from 'react'
import HeadTitle from '../../components/layouts/HeadTitle'
import { Folder, Question, Answer } from '../../types'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../components/auth/Auth'
import { getFolderDetail } from '../../components/api/Folder'
import { removeCustomQFromFolder } from '../../components/api/CustomQuestions'
import { removeDefaultQFromFolder } from '../../components/api/DefaultQuestions'
import styles from '../../components/styles/Common.module.css'
import loadStyles from '../../components/styles/Loading.module.css'
import detailStyles from '../../components/styles/QuestionDetail.module.css'
import noteIcon from '../../images/icon/note.svg'
import { Table } from 'react-bootstrap'
import checkMark from '../../images/checked.png'
import listStyles from '../../components/styles/List.module.css'
import trashIcon from '../../images/icon/trash.svg'



const FolderDetail = () => {
    const { accessToken } = useAuth()
    const searchParams = new URLSearchParams(useLocation().search)
    const userParams = searchParams.get('user')
    const nameParams = searchParams.get('name')
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

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

            }
        } catch (err: any) {
            console.log(err.message)
        }
    }

    // const removeDefaultQClick = async (folderDetail: number, questionId: number) => {
    //     if (!accessToken || !userParams) {
    //         console.log('質問を削除できませんでした')
    //         return
    //     }
    //     try {
    //         const res =  await removeDefaultQFromFolder({ accessToken, userId: userParams }, questionId)
    //         if (res) {
    //             fetchData()
    //         }
    //     } catch (err: any) {
    //         console.log(err.message)
    //         setErrorMessage(err.message)
    //     }
    // }

    const removeQuestionClick = async (removalFunction: Function, folder: number, questionId: number) => {
        if (!accessToken || !userParams) {
            console.log('質問を削除できませんでした');
            return;
        }
        try {
            if (removalFunction === removeCustomQFromFolder) {

                const res = await removeCustomQFromFolder({ accessToken, userId: userParams, folder, questionId });
                // 質問を削除した後、フォルダーの詳細を再取得
                if (res === null) {
                    fetchData();
                }
            } else {
                const res = await removeDefaultQFromFolder({ accessToken, folder, questionId });
                if (res === null) {
                    fetchData();
                }
            }



        } catch (err: any) {
            console.log(err.message);
            setErrorMessage(err.message);
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
                                {folderDetail.questions && folderDetail.questions.map((question: Question, index: number) => (
                                    <div key={question.id}>
                                        {/* 最初の質問 or カテゴリー名が前回と異なるときに表示 */}
                                        {(question.category_name && index === 0) || (index > 0 && folderDetail.questions[index - 1] && question.category_name !== folderDetail.questions[index - 1].category_name) ? (
                                            <div className={detailStyles.category}>{question.category_name}</div>
                                        ) : null}

                                        {/* [自分で作成した質問]も初回のみ表示 */}
                                        {index > 0 && folderDetail.questions[index].category_name == null && folderDetail.questions[index - 1].category_name !== null ? (
                                            <div className={detailStyles.category}>自分で作成した質問</div>
                                        ) : null}

                                        {/* デフォルト質問なら質問の番号表示、カスタム質問ならメモアイコン追加 */}
                                        <table className={detailStyles.questionGroup}>
                                            <tbody >
                                                <tr>
                                                    {question.category_name ? (
                                                        <td className={detailStyles.id}>{question.id}.</td>
                                                    ) : (
                                                        <td className={detailStyles.id}>
                                                            {/* <img src={noteIcon} alt='memo' className={detailStyles.icon} width="20" height="20" /> */}
                                                            ・
                                                        </td>
                                                    )}
                                                    <td className={detailStyles.text}>
                                                        <a href={`/questions/detail/?id=${question.id}`} className={detailStyles.link}>{question.text}
                                                            ({question.age})
                                                        </a>


                                                        {question.category_name ? (
                                                            <span >
                                                                <img src={trashIcon} className={listStyles.trashIcon} alt='削除' onClick={() => { removeQuestionClick(removeDefaultQFromFolder, folderDetail.id, question.id) }} />
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                <img src={trashIcon} className={listStyles.trashIcon} alt='削除' onClick={() => { removeQuestionClick(removeCustomQFromFolder, folderDetail.id, question.id) }} />

                                                            </span>
                                                        )}


                                                    </td>
                                                    {(question.answers[0]) && (
                                                        <td>

                                                            <img src={checkMark} alt='回答済' className={detailStyles.check} />
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