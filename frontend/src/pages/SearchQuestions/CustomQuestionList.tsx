import React, { useEffect, useState, useRef } from 'react'
import { Question, Folder } from "../../types";
import { getCustomQuestions, addCustomQToFolder, getCustomQuestionDetail } from '../../components/api/CustomQuestions';
import { addQuestionToFolder } from '../../components/SearchQuestions/AddQustionToFolder';
import { getFolderList } from '../../components/api/Folder';
import { useAuth } from '../../components/auth/Auth';
import styles from '../../components/styles/Common.module.css'
import loadStyles from '../../components/styles/Loading.module.css'
import listStyles from '../../components/styles/List.module.css'
import detailStyles from '../../components/styles/QuestionDetail.module.css'
import HeadTitle from '../../components/layouts/HeadTitle';
import { Button } from 'react-bootstrap';

import trashIcon from '../../images/icon/trash.svg'
import newFolder from '../../images/icon/newFolder.svg'
import checkMark from '../../images/checked.png'


type CustomQuestions = Question[]

const CustomQuestionList = () => {
    const { accessToken, userId } = useAuth()
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [questions, setQuestions] = useState<CustomQuestions>([]);
    // 作成日時の降順に並び替え
    const [reverseQuestions, setReverseQuestions] = useState<CustomQuestions>([]);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastPosition, setToastPosition] = useState({ x: 0, y: 0 });
    const selectQuestionRef = useRef<number>(0);
    const [selectAddFolders, setSelectAddFolders] = useState<number[]>([]);
    const [folderList, setFolderList] = useState<Folder[]>([]);


    // トーストメニューを開く (以降の処理はDefaultQuestionList.tsxと同じだからコンポーネントにまとめたい...)
    const toggleToast = (e: React.MouseEvent, questionId: number) => {
        const x = e.clientX;
        const y = e.clientY;
        setToastPosition({ x, y });
        selectQuestionRef.current = questionId;
        setShowToast(true);
    }

    // トーストメニューを閉じる
    useEffect(() => {
        // Escapeキーを押した場合
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowToast(false);
            }
        };
        // トースト以外の部分をクリックした場合
        const handleClickOutside = (event: MouseEvent) => {
            const toastElement = document.querySelector(`.${detailStyles.toast}`);
            if (showToast && toastElement && !toastElement.contains(event.target as Node)) {
                setShowToast(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showToast, detailStyles.toast]);


    // チェックボックスをクリック
    const handleCheckboxChange = (folderId: number) => {
        // チェックされていない部分をクリックしたら
        setSelectAddFolders(prevFolders => {
            if (prevFolders.includes(folderId)) {
                return prevFolders.filter(id => id !== folderId);
            } else {
                return [...prevFolders, folderId];
            }
        });
    };

    // チェックボックスの状態を返す
    const isFolderIncluded = (folderId: number): boolean => {
        // 普通順の質問リストから質問を取得　でいいよね？？
        const currentQuestion = questions[selectQuestionRef.current - 1];
        const isOriginallyIncluded = currentQuestion?.folders?.includes(folderId) ?? false;
        const isNowSelected = selectAddFolders.includes(folderId);

        // もともと含まれていて、現在選択されていない場合、または、もともと含まれていなくて現在選択されている場合は、trueを返す
        return (isOriginallyIncluded && !isNowSelected) || (!isOriginallyIncluded && isNowSelected);
    };


    // 完了ボタンをクリック後、選択したフォルダに質問を追加
    const handleAddQuestionToFolder = async () => {
        if (selectQuestionRef.current) {
            let selectQuestion = selectQuestionRef.current;
            let selectFolders = selectAddFolders;
            // console.log('selectQuestion:' + selectQuestion)
            // console.log('selectFolders:' + selectFolders)
            await addQuestionToFolder({ questions, selectQuestion, selectFolders, accessToken, userId, Addfunction: addCustomQToFolder });
            setSelectAddFolders([]);
        }
    };


    // フォルダー一覧を取得
    useEffect(() => {
        const fetchData = async () => {
            if (!accessToken || !userId) {
                return;
            }
            try {
                const res = await getFolderList({ accessToken, userId });
                if (res) {
                    setFolderList(res);
                    setLoading(false);
                }
            }
            catch (err: any) {
                console.log(err.message);
                setErrorMessage(err.message);
                setLoading(false);
            }
        }
        fetchData();
    }
        , [accessToken, userId]);

    // トーストメニューを開いた時、特定の質問だけを取得（フォルダ更新時に際レンダリングするため）
    useEffect(() => {
        const fetchData = async () => {
            if (!accessToken || !userId) {
                return;
            }
            try {
                const res = await getCustomQuestionDetail({ accessToken, userId }, selectQuestionRef.current.toString());
                if (res) {
                    setQuestions(prevQuestions => {
                        const newQuestions = [...prevQuestions];
                        newQuestions[selectQuestionRef.current - 1] = res;
                        return newQuestions;
                    });
                    setReverseQuestions(prevQuestions => {
                        const newQuestions = [...prevQuestions];
                        newQuestions[prevQuestions.length - selectQuestionRef.current] = res;
                        return newQuestions;
                    })
                }

            } catch (err: any) {
                console.log(err.message);
                setErrorMessage(err.message);
            }
        };
        if (showToast) {
            fetchData();
        }
    }, [showToast, accessToken, selectAddFolders]);




    // カスタム質問を取得
    useEffect(() => {
        const fetchData = async () => {
            if (!accessToken || !userId) {
                return;
            }
            try {
                const res = await getCustomQuestions({ accessToken, userId });
                if (res) {
                    console.log(res)
                    setQuestions(res);
                    setReverseQuestions(res.slice().reverse());
                    setLoading(false);
                }
            } catch (err: any) {
                console.log(err.message);
                setErrorMessage(err.message);
                setLoading(false);
            }
        };
        fetchData();
    }, [accessToken, userId])

    // 画面サイズが変更されたら再レンダリング
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);




    return (
        <>
            <HeadTitle title='作成した質問' />
            {accessToken ? (
                <div className={styles.bg}>
                    {loading ? (
                        <div className={loadStyles.loading}>
                            <div className={loadStyles.text}>loading...</div>
                        </div>
                    ) : (
                        <>
                            {/* 見出し */}
                            <div className={`${styles.menu} mb-4 `}>
                                <a href='/review-questions' className={styles.link}>作成した質問から探す </a>
                                <span> &#62; </span>
                            </div>

                            {/* トーストメニュー */}
                            {showToast && (
                                <div
                                    className={detailStyles.toast}
                                    style={
                                        {
                                            // クリックした位置によって表示場所を変更
                                            left: windowWidth < 960
                                                ? `${toastPosition?.x - 50}px`
                                                : `${toastPosition?.x + 50}px`,
                                            top: toastPosition?.y - 200 < 0
                                                ? `${toastPosition?.y}px`
                                                : `${toastPosition?.y - 100}px`,
                                            transform: 'none'
                                        }
                                    }
                                >
                                    {(folderList === null || folderList.length === 0) ? (
                                        <div className="toast-header">
                                            <strong className="me-auto">フォルダがありません</strong>
                                            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" onClick={() => setShowToast(false)}></button>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ fontWeight: 'bold', marginBottom: '5px', color: "#4b4b4b" }}>
                                                質問{selectQuestionRef.current}をフォルダに追加</div>
                                            {folderList.map(folder => (
                                                <div key={folder.name}>
                                                    <input
                                                        type="checkbox"
                                                        style={{ accentColor: '#AC8D73' }}
                                                        checked={isFolderIncluded(folder.id)}
                                                        // {defaultQuestions[selectQuestionRef.current - 1].folders?.includes(folder.id)}
                                                        onChange={() => handleCheckboxChange(folder.id)}
                                                    />
                                                    {folder.name}
                                                </div>
                                            ))}
                                            <Button size="sm" className={`mt-2 ${styles.darkButton}`} onClick={handleAddQuestionToFolder}>完了</Button>



                                        </>
                                    )}
                                </div>
                            )}


                            <div className={detailStyles.contents}>
                                {(!questions || questions.length === 0) ? (
                                    <div className={styles.errorMsg}>
                                        <strong className="m-2">質問がありません</strong>
                                        <div className={detailStyles.noQuestion}>「質問を作る」メニューから作成できます。</div>
                                    </div>
                                ) : (
                                    reverseQuestions.map((question, index) => (
                                        <div key={question.id}>
                                            {(index === 0
                                                || new Date(question.created_at).getMonth() !== new Date(reverseQuestions[index - 1].created_at).getMonth()
                                                || new Date(question.created_at).getFullYear() !== new Date(reverseQuestions[index - 1].created_at).getFullYear()) &&
                                                <div className={detailStyles.category}>
                                                    {new Date(question.created_at).getFullYear()}年{new Date(question.created_at).getMonth() + 1}月
                                                </div>
                                            }


                                            <table className={detailStyles.questionGroup}>
                                                <tbody>
                                                    <tr>
                                                        <td className={detailStyles.id}>・</td>
                                                        <td className={detailStyles.text}>
                                                            <a href={`/questions/custom/${userId}/${question.id}`} className={detailStyles.link}>
                                                                {question.text} ({question.age})
                                                            </a>
                                                            <span>
                                                                <img src={newFolder} className={listStyles.trashIcon} alt='フォルダに追加'
                                                                    onClick={(e) => toggleToast(e, question.id)}
                                                                />
                                                            </span>
                                                            {(question.answers[0]) && (
                                                                <img src={checkMark} alt='回答済' className={detailStyles.check} />
                                                            )}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    ))
                                )}
                            </div>

                        </>

                    )}
                </div>
            ) : null}


        </>
    )
}

export default CustomQuestionList