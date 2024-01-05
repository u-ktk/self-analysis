import React, { useEffect, useState } from 'react'
import { getFolderList, createFolder, deleteFolder } from '../../components/api/Folder';
import { Folder } from '../../types';
import loadStyles from '../../components/styles/Loading.module.css';
import styles from '../../components/styles/Common.module.css';
import listStyles from '../../components/styles/List.module.css';
import { Button, Modal } from 'react-bootstrap';

import newFolderIcon from '../../images/icon/newFolder.svg'
import trashIcon from '../../images/icon/trash.svg'


type authInfo = {
    accessToken: string | null;
    userId: string | null;
}
const FolderList = (props: authInfo) => {
    const { accessToken, userId } = props;
    const [newFolder, setNewFolder] = useState<string>("");
    const [folders, setFolders] = useState<Folder[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isFolderAdding, setIsFolderAdding] = useState<boolean>(false);
    const [deleteFolderId, setDeleteFolderId] = useState<number>(0);
    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!accessToken || !userId) {
                return;
            }
            try {
                const res = await getFolderList({ userId, accessToken });
                if (res) {
                    setFolders(res);
                    setLoading(false);
                }
            } catch (err: any) {
                
                setErrorMessage(err.message);
                setLoading(false);
            }
        };
        fetchData();
    }, [accessToken, userId]);

    // フォルダー追加後、getFolderListを再度実行してフォルダー一覧を更新
    const addFolderAndUpdateList = async (newFolderName: string) => {
        if (!accessToken || !userId) {
            return;
        }
        try {
            const response = await createFolder({ accessToken, userId }, newFolderName);
            if (response) {
                const updatedFolders = await getFolderList({ userId, accessToken });
                if (updatedFolders) {
                    setFolders(updatedFolders);
                    setNewFolder("");
                    setIsFolderAdding(false);
                }
            }
        } catch (error: any) {
            
            setErrorMessage(error.message);
        }
    };

    const folderAddClick = () => {
        setIsFolderAdding(!isFolderAdding);
    };

    const handleDeleteClick = (id: number) => {
        setDeleteFolderId(id);
        setShowModal(true);
    }

    const folderDeleteClick = async (id: number) => {
        if (!accessToken || !userId || !id) {
            return;
        }
        try {
            const response = await deleteFolder({ accessToken, userId }, id.toString());
            if (response === null) {
                const updatedFolders = await getFolderList({ userId, accessToken });
                if (updatedFolders) {
                    setFolders(updatedFolders);
                    setNewFolder("");
                    setShowModal(false);
                }
            }
        } catch (error: any) {
            
            setErrorMessage(error.message);
        }

    }


    return (
        <>
            {loading &&
                <div className={loadStyles.loading}>
                    <span className={loadStyles.text}>Loading...</span>
                </div>
            }

            <div className={styles.bg}>
                <h4 className={styles.title}>フォルダ一覧</h4>
                <div className={listStyles.contents}>

                    {/* フォルダを表示 */}
                    {folders.map((folder) => (
                        <div key={folder.id} className={listStyles.row} >
                            <a href={`/folders/detail/${userId}/${folder.name}`}
                                className={listStyles.link}>
                                {folder.name}
                                ({folder.questions.length})
                            </a>
                            {/* フォルダの削除アイコン　　質問が入っていなかったらそのまま削除、入っていたらModalを出す*/}
                            <span >
                                <img onClick={() => {
                                    folder.questions.length !== 0 ?
                                        handleDeleteClick(folder.id) : folderDeleteClick(folder.id)
                                }
                                } src={trashIcon} className={listStyles.trashIcon} alt='削除' />
                            </span>
                        </div>
                    ))}

                    {/* フォルダ追加 */}
                    <div>
                        {!isFolderAdding ? (
                            <div className={`mt-3 ${listStyles.row}`}>
                                <img src={newFolderIcon} alt='check' className={listStyles.folderIcon} />
                                <span
                                    onClick={folderAddClick} className={styles.onClickText}>新規作成
                                </span>
                            </div>
                        ) : (
                            <div className={`mt-3 ${listStyles.row}`}>
                                <input
                                    type="text"
                                    value={newFolder || ""}
                                    onChange={(e) => setNewFolder(e.target.value)}
                                    placeholder="フォルダ名を入力"
                                    className={`form-control border ${listStyles.form}`}
                                />
                                <Button onClick={() => addFolderAndUpdateList(newFolder)} className={styles.darkButton} size="sm" >追加</Button>
                                <Button onClick={folderAddClick} className={styles.lightButton} size="sm" >キャンセル</Button>

                            </div>

                        )}
                    </div>

                    {/* フォルダ削除確認のモーダル */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>フォルダ削除の確認</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            このフォルダには質問が入っています。削除しますか？
                        </Modal.Body>
                        <Modal.Footer>
                            <Button className={styles.button} variant="warning" onClick={() => setShowModal(false)}>
                                キャンセル
                            </Button>
                            <Button className={styles.button} variant="danger" onClick={() => folderDeleteClick(deleteFolderId)}>
                                削除
                            </Button>
                        </Modal.Footer>
                    </Modal>

                </div>

                {errorMessage &&
                    <div className={styles.errorMsg}>
                        <span className={styles.text}>{errorMessage}</span>
                    </div>
                }

            </div >

        </>
    )
}


export default FolderList