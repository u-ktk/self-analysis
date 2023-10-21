import React, { useState, useEffect, useRef } from 'react';
import { Question, Folder } from "../../types";
// import { addQuestionToFolder } from "../../features/SearchQuestions/AddQustionToFolder"
import { getDefaultQuestions, getDefaultQuestionDetail } from '../../components/api/DefaultQuestions';
import { addDefaultQToFolder } from '../../components/api/DefaultQuestions';
import { getFolderList } from '../../components/api/Folder';
import { useAuth } from '../../features/Auth/Token';
import { useParams, useNavigate } from 'react-router-dom';
import HeadTitle from '../../components/layouts/HeadTitle';
import loadStyles from '../../components/styles/Loading.module.css';
import listStyles from '../../components/styles/List.module.css';
import styles from '../../components/styles/Common.module.css';
import detailStyles from '../../components/styles/QuestionDetail.module.css';
import newFolder from '../../images/icon/newFolder.svg';
import plus from '../../images/icon/plus.svg';
import minus from '../../images/icon/minus.svg';
import checkMark from '../../images/checked.png';
import { Button } from 'react-bootstrap';



const DefaultQuestionsList = () => {
    const { accessToken, userId } = useAuth();
    const [defaultQuestions, setDefaultQuestions] = useState<Question[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [currentCategory, setCurrentCategory] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    let { page } = useParams<string>();

    const [showToast, setShowToast] = useState(false);
    const [toastPosition, setToastPosition] = useState({ x: 0, y: 0 });

    const [selectAddFolders, setSelectAddFolders] = useState<number[]>([]);
    const [folderList, setFolderList] = useState<Folder[]>([]);

    const selectQuestionRef = useRef<number>(0);

    // アコーディオンメニューの開閉
    const [openAge, setOpenAge] = useState<string | null>(null);


    const currentPage = parseInt(page ? page : "1");
    const navigate = useNavigate();

    const toggleAccordion = (age: string) => {
        if (openAge === age) {
            setOpenAge(null);
        } else {
            setOpenAge(age);
        }
    };



    // トーストメニューを開く
    const toggleToast = (e: React.MouseEvent, questionId: number) => {
        const x = e.clientX;
        const y = e.clientY;
        setToastPosition({ x, y });
        selectQuestionRef.current = questionId;
        const currentQuestion = defaultQuestions[questionId - 1];
        // console.log(currentQuestion)
        if (currentQuestions && currentQuestion.folders) {
            setSelectAddFolders(currentQuestion.folders);
        } else {
            setSelectAddFolders([]);
        }
        setShowToast(true);

    }

    // トーストメニュー閉じる
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

        const currentQuestion = defaultQuestions[selectQuestionRef.current - 1];
        const isOriginallyIncluded = currentQuestion?.folders?.includes(folderId) ?? false;

        setSelectAddFolders(prevFolders => {
            // もともと含まれているフォルダをクリックした場合
            if (isOriginallyIncluded) {
                // もし現在選択されているフォルダに含まれていれば削除、そうでなければ追加
                if (prevFolders.includes(folderId)) {
                    return prevFolders.filter(id => id !== folderId);
                } else {
                    return [...prevFolders, folderId];
                }
            } else {
                // もともと含まれていないフォルダをクリックした場合
                if (prevFolders.includes(folderId)) {
                    return prevFolders.filter(id => id !== folderId);
                } else {
                    return [...prevFolders, folderId];
                }
            }
        });

    };

    // チェックボックスの状態を返す
    const isFolderIncluded = (folderId: number): boolean => {
        const included = selectAddFolders.includes(folderId);
        return included;
    };


    // 完了ボタンをクリック後、選択したフォルダに質問を追加
    const handleAddQuestionToFolder = async () => {
        // console.log(selectAddFolders)

        if (selectQuestionRef.current) {
            let selectQuestion = selectQuestionRef.current;
            let selectFolders = selectAddFolders;
            // await addQuestionToFolder({ selectQuestion, selectFolders, accessToken, userId, Addfunction: addDefaultQToFolder });
            setShowToast(false);

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




    // アクセストークンを使って質問一覧を取得
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            if (!accessToken) {
                return;
            }
            try {
                const res = await getDefaultQuestions({ accessToken });
                if (res) {
                    setDefaultQuestions(res);
                    // カテゴリー名を取得
                    if (res[0])
                        setCurrentCategory(res[currentPage * 100 - 1].category_name);
                    else {
                        setCurrentCategory("No category");
                    }
                    setLoading(false);
                }
            } catch (err: any) {
                console.log(err.message)
                setErrorMessage(err.message)
                setLoading(false)
            }
        }
        fetchData();

    }, [accessToken, page]);

    // トーストメニューを開いた時、特定の質問だけを取得（フォルダ更新時に際レンダリングするため）
    useEffect(() => {
        const fetchData = async () => {
            if (!accessToken || selectQuestionRef.current === 0) {
                return;
            }
            try {
                const res = await getDefaultQuestionDetail({ accessToken }, selectQuestionRef.current.toString());
                if (res) {
                    setDefaultQuestions(prevQuestions => {
                        const newQuestions = [...prevQuestions];
                        newQuestions[selectQuestionRef.current - 1] = res;
                        return newQuestions;
                    });
                }
            } catch (err: any) {
                console.log(err.message);
                setErrorMessage(err.message);
            }
        };
        fetchData();

    }, [showToast, accessToken, selectAddFolders]);

    type AgeCount = { [key: string]: number };

    const countAnsweredQuestions = (questions: Question[]): number =>
        questions.filter(question => question.answers[0]).length;

    // 年代ごとのカウント
    const groupQuestionsByAge = (questions: Question[]): AgeCount =>
        questions.reduce((accum, question) => {
            accum[question.age] = (accum[question.age] || 0) + 1;
            return accum;
        }, {} as AgeCount);

    // 回答した質問の総数
    // console.log(countAnsweredQuestions(defaultQuestions.slice((currentPage - 1) * 100, (currentPage - 1) * 100 + 99)))


    const ageCounts: { [key: string]: number } = groupQuestionsByAge(defaultQuestions.slice((currentPage - 1) * 100, (currentPage - 1) * 100 + 99));

    // 回答済みの質問数を取得
    const answerdAgeCounts: { [key: string]: number } = groupQuestionsByAge(
        defaultQuestions.slice((currentPage - 1) * 100, (currentPage - 1) * 100 + 99).filter((question) => question.answers[0]));


    // 画面サイズが変更されたら再描画
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);


    const questionsPerPage = 100;
    //無効なページ番号の場合はエラーを表示
    if (!currentPage || currentPage < 1 || currentPage > 10) {
        return <div>ページが存在しません。</div>;
    }

    //ページに表示する質問を指定（例えば１ページ目なら1-100問目まで）
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = defaultQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);

    return (
        <>
            <HeadTitle title={currentCategory} />

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
                                <a href='/questions-list' className={styles.link}>用意された質問から選ぶ </a>
                                <span> &#62; </span>
                                <span style={{ fontSize: '120%' }}>レベル{currentPage}&nbsp;&nbsp;</span>
                                <span style={{ fontWeight: 'bold', fontSize: '120%' }}>{currentCategory}
                                    ({countAnsweredQuestions(defaultQuestions.slice((currentPage - 1) * 100, (currentPage - 1) * 100 + 99))}/100問回答済)</span>
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
                                                        key={`${folder.id}-${isFolderIncluded(folder.id)}`}
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

                                <>
                                    {currentQuestions.map((question: Question, index: number) => (
                                        <div key={question.id}>
                                            {/* 最初の質問 or カテゴリー名が前回と異なるときに表示 */}
                                            {(index === 0 || question.age !== currentQuestions[index - 1].age) ? (
                                                <div
                                                    className={detailStyles.accordion}
                                                    // アコーディオンメニュー
                                                    onClick={() => toggleAccordion(question.age)}
                                                >
                                                    <div >
                                                        <span
                                                        // style={{ fontWeight: 'bold' }}
                                                        >{question.age}&nbsp;&nbsp;</span>
                                                        <span>
                                                            {answerdAgeCounts[question.age] ? (
                                                                answerdAgeCounts[question.age]) : 0}
                                                            &nbsp;/&nbsp;
                                                            {ageCounts[question.age]}問回答済</span>
                                                    </div>
                                                    {openAge === question.age ? (
                                                        <span>
                                                            <img src={minus} className={detailStyles.openIcon} alt='閉じる' onClick={() => { }} />
                                                        </span>
                                                    ) : (
                                                        <span>
                                                            <img src={plus} className={detailStyles.openIcon} alt='開く' onClick={() => { }} />
                                                        </span>)

                                                    }
                                                </div>
                                            ) : null}


                                            {openAge === question.age && (
                                                <table className={detailStyles.questionGroup}>
                                                    <tbody>
                                                        <tr>
                                                            <td className={detailStyles.id}>{question.id}.</td>
                                                            <td>
                                                                {/* <a href={`/questions/default/${question.id}`} className={detailStyles.link}>
                                                                    {question.text}
                                                                </a> */}
                                                                <span onClick={() => navigate(`/questions/default/${question.id}`,
                                                                    { state: { previousTitle: `レベル${page}　${currentCategory}` } }
                                                                )} className={detailStyles.link}>{question.text}
                                                                </span>

                                                                <span>
                                                                    <img src={newFolder} className={listStyles.trashIcon} alt='フォルダに追加' onClick={(e) => toggleToast(e, question.id)} />

                                                                </span>
                                                            </td>


                                                            {(question.answers[0]) && (
                                                                <td>
                                                                    <img src={checkMark} alt='回答済' className={detailStyles.check} />
                                                                </td>

                                                            )}
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            )}
                                        </div>
                                    ))}
                                </>




                            </div>
                        </>
                    )}
                </div >
            ) : null}
        </>
    );
}


export default DefaultQuestionsList;