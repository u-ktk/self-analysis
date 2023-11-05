import React, { useState, useEffect } from 'react'
import { Question } from "../../types";
import { addDefaultQToFolder } from '../../components/api/DefaultQuestions';
import { addCustomQToFolder } from '../../components/api/CustomQuestions';
import { Folder } from '../../types';
import { getFolderList } from '../../components/api/Folder';
import { Button } from 'react-bootstrap';
import styles from '../../components/styles/Common.module.css';
import detailStyles from '../../components/styles/QuestionDetail.module.css';


type addFolderProps = {
    selectQuestion: Question
    isDefault: boolean
    accessToken: string | null
    userId: string | null
    Addfunction: Function
    fetchQuestion?: () => void
    fetchQuestionDetail: (questionId?: number) => void | Promise<void>
    showToast: boolean
    setShowToast: React.Dispatch<React.SetStateAction<boolean>>

}


const AddQuestionToFolder = (props: addFolderProps) => {

    const [folderList, setFolderList] = useState<Folder[] | null>(null);
    const [selectAddFolders, setSelectAddFolders] = useState<number[]>([]);
    let selectQuestion = props.selectQuestion;


    // 特定の質問の取得（フォルダ変更するたびに更新）
    useEffect(() => {
        if (props.fetchQuestionDetail === undefined) return;
        try {
            props.fetchQuestionDetail(selectQuestion.id);
        }
        catch (error) {
            console.log(error);
        }
    }
        , [props.accessToken, selectAddFolders]);

    // フォルダの取得
    const fetchFolders = async () => {
        if (!props.accessToken || !props.userId) return;
        const accessToken = props.accessToken;
        const userId = props.userId;
        try {
            const res = await getFolderList({ accessToken, userId });
            if (res) {
                setFolderList(res);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!props.accessToken || !props.userId) return;
        fetchFolders();
    }
        , [props.accessToken, props.userId]);

    // トーストメニュー開いてるとき、フォルダの選択できるように
    const selectFolders = () => {
        if (selectQuestion && selectQuestion.folders) {
            setSelectAddFolders(selectQuestion.folders);
        } else {
            setSelectAddFolders([]);
        }
        // console.log(selectQuestion.folders)
        // console.log(selectAddFolders)
    }

    useEffect(() => {
        if (props.showToast) {
            selectFolders();
        }
    }, [props.showToast])

    // トーストメニュー閉じる
    useEffect(() => {
        // Escapeキーを押した場合
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                props.setShowToast(false);
            }
        };
        // トースト以外の部分をクリックした場合
        const handleClickOutside = (event: MouseEvent) => {
            const toastElement = document.querySelector(`.${detailStyles.toast}`);
            if (props.showToast && toastElement && !toastElement.contains(event.target as Node)) {
                props.setShowToast(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [props.showToast]);


    // チェックボックスをクリック
    const handleCheckboxChange = (folderId: number) => {
        const isOriginallyIncluded = selectQuestion?.folders?.includes(folderId) ?? false;

        // チェックされていない部分をクリックしたら
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


    // フォルダに質問を追加
    const fetchData = async () => {
        if (!props.accessToken || !props.userId) {
            return;
        }
        try {
            if (props.Addfunction === addDefaultQToFolder) {
                const res = await addDefaultQToFolder({ accessToken: props.accessToken, questionId: selectQuestion.id, folders: selectAddFolders });
                if (res === null) {
                    console.log(`${selectAddFolders}に追加しました`)
                    return `${selectAddFolders}に追加しました`;
                }
                else {
                    console.log(res)
                    return res
                }
            }
            else if (props.Addfunction === addCustomQToFolder) {
                const res = await addCustomQToFolder({ accessToken: props.accessToken, userId: props.userId, questionId: selectQuestion.id, folders: selectAddFolders });
                if (res === null) {
                    console.log(`${selectAddFolders}に追加しました`)
                    return `${selectAddFolders}に追加しました`;
                }
                else {
                    console.log(res)
                    return res
                }
            }
        } catch (error: any) {
            console.log(error.message);
            console.log(selectAddFolders)
            return error.message;
        }
    }

    const handleAddQuestionToFolder = async () => {
        const res = await fetchData();
        if (res) {
            props.setShowToast(false);
            selectQuestion.folders = selectAddFolders;
            // console.log(selectAddFolders)
            // console.log(selectQuestion.folders)
        }
        else {
            console.log('質問を追加できませんでした');
        }
    }





    return (
        <>

            {(folderList === null) ? (
                <div className="toast-header">
                    <span className="me-auto" style={{ 'color': '#AC8D73' }}>Loading...</span>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="toast"
                        aria-label="Close"
                        onClick={() => props.setShowToast(false)}
                    ></button>
                </div>
            ) : (
                (folderList.length === 0) ? (
                    <div className="toast-header">
                        <strong className="me-auto">フォルダがありません</strong>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="toast"
                            aria-label="Close"
                            onClick={() => props.setShowToast(false)}
                        ></button>
                    </div>
                ) : (
                    <>
                        <div style={{ fontWeight: 'bold', marginBottom: '5px', color: "#4b4b4b" }}>
                            {props.isDefault ?
                                `質問${selectQuestion.id}をフォルダに追加` :
                                `質問をフォルダに追加`
                            }
                        </div>
                        {folderList.map(folder => (
                            <div key={folder.name}>
                                <input
                                    type="checkbox"
                                    style={{ accentColor: '#AC8D73' }}
                                    checked={isFolderIncluded(folder.id)}
                                    onChange={() => handleCheckboxChange(folder.id)}
                                />
                                {folder.name}
                            </div>
                        ))}
                        <Button
                            size="sm"
                            className={`mt-2 ${styles.darkButton}`}
                            onClick={handleAddQuestionToFolder}
                        >
                            完了
                        </Button>
                    </>
                )
            )}


        </>
    )
}






export default AddQuestionToFolder;