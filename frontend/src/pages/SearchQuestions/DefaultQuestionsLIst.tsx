import React, { useState, useEffect, useRef } from 'react';
import { Question, Folder } from "../../types";
import { getDefaultQuestions, addDefaultQToFolder, removeDefaultQFromFolder } from '../../components/api/DefaultQuestions';
import { getFolderList } from '../../components/api/Folder';
import { useAuth } from '../../components/auth/Auth';
import { Toast, ProgressBar } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import HeadTitle from '../../components/layouts/HeadTitle';
import loadStyles from '../../components/styles/Loading.module.css';
import listStyles from '../../components/styles/List.module.css';
import styles from '../../components/styles/Common.module.css';
import detailStyles from '../../components/styles/QuestionDetail.module.css';
import newFolder from '../../images/icon/newFolder.svg';
import allowDown from '../../images/icon/allowDown.svg';
import checkMark from '../../images/checked.png';



const DefaultQuestionsList = () => {
    const { accessToken, userId } = useAuth();
    const [defaultQuestions, setDefaultQuestions] = useState<Question[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [currentCategory, setCurrentCategory] = useState<string>("");
    const tableRef = useRef<HTMLTableElement>(null);
    const [loading, setLoading] = useState<boolean>(true);
    let { page } = useParams<string>();
    const [selectFolder, setSelectFolder] = useState<number>(0);
    const [selectQuestion, setSelectQuestion] = useState<number>(0);
    const [showToast, setShowToast] = useState(false);
    const [folderList, setFolderList] = useState<Folder[]>([]);

    // アコーディオンメニュー
    const [openAge, setOpenAge] = useState<string | null>(null);

    const toggleAccordion = (age: string) => {
        if (openAge === age) {
            setOpenAge(null);
        } else {
            setOpenAge(age);
        }
    };

    const currentPage = parseInt(page ? page : "1");
    console.log(currentPage)

    // トーストメニューを開く
    const toggleToast = (questionId: number) => {
        console.log(questionId)
        setSelectQuestion(questionId);
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



    const handleCheckboxChange = (folderId: number) => {
        setSelectFolder(folderId);
    }

    // フォルダに追加
    const addFolderClick = async (questionId: number, folder: number) => {
        if (!accessToken || !userId) {
            return;
        }
        try {
            const res = await addDefaultQToFolder({ accessToken, questionId, folder });
            if (res) {
                console.log(res);
            }
        }
        catch (err: any) {
            console.log(err.message);
            setErrorMessage(err.message);
        }
    }

    const removeFolderClick = async (questionId: number, folder: number) => {
        if (!accessToken || !userId) {
            return;
        }
        try {
            const res = await removeDefaultQFromFolder({ accessToken, questionId, folder });
            if (res === null) {
                console.log(res);
            }
        }
        catch (err: any) {
            console.log(err.message);
            setErrorMessage(err.message);
        }
    }




    // フォルダから削除

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

    // 幼少期３件などの表示
    const countQuestionsByAge = (questions: Question[]) => {
        return questions.reduce((accum, question) => {
            accum[question.age] = (accum[question.age] || 0) + 1;
            return accum;
        }, {} as { [key: string]: number });
    };

    const ageCounts: { [key: string]: number } = countQuestionsByAge(defaultQuestions.slice(currentPage - 1, currentPage + 99));

    // 回答済みの質問数を取得
    const answerdCounts: { [key: string]: number } = countQuestionsByAge(
        defaultQuestions.slice(currentPage - 1, currentPage + 99).filter((question) => question.answers[0]));




    //画面サイズが変更されたら再描画
    // useEffect(() => {
    //     const handleResize = () => {
    //         setWindowWidth(window.innerWidth);
    //     };
    //     window.addEventListener('resize', handleResize);
    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     }
    // }, []);


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
                                <a href='/review-questions' className={styles.link}>カテゴリーから探す </a>
                                <span> &#62; </span>
                                <span style={{ fontSize: '120%' }}>レベル{currentPage}&nbsp;&nbsp;</span>
                                <span style={{ fontWeight: 'bold', fontSize: '120%' }}>{currentCategory}</span>
                            </div>

                            {showToast && (
                                <div className={detailStyles.toast}>
                                    {(folderList === null || folderList.length === 0) ? (
                                        <div className="toast-header">
                                            <strong className="me-auto">フォルダがありません</strong>
                                            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" onClick={() => setShowToast(false)}></button>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                                質問{selectQuestion}をフォルダに追加</div>
                                            {folderList.map(folder => (
                                                <div key={folder.name}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectFolder === folder.id || false}
                                                        onChange={() => handleCheckboxChange(folder.id)}
                                                    />
                                                    {folder.name}
                                                </div>
                                            ))}
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
                                                            {answerdCounts[question.age] ? (
                                                                answerdCounts[question.age]) : 0}
                                                            &nbsp;/&nbsp;
                                                            {ageCounts[question.age]}問回答済</span>
                                                    </div>
                                                    <span>
                                                        <img src={allowDown} className={detailStyles.openIcon} alt='開く' onClick={() => { }} />

                                                    </span>
                                                </div>
                                            ) : null}


                                            {openAge === question.age && (
                                                <table className={detailStyles.questionGroup}>
                                                    <tbody>
                                                        <tr>
                                                            <td className={detailStyles.id}>{question.id}.</td>
                                                            <td>
                                                                <a href={`/questions/default/${question.id}`} className={detailStyles.link}>
                                                                    {question.text}
                                                                </a>
                                                                <span>
                                                                    <img src={newFolder} className={listStyles.trashIcon} alt='フォルダに追加' onClick={() => toggleToast(question.id)} />

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
                </div>
            ) : null}
        </>
    );



}

export default DefaultQuestionsList;


