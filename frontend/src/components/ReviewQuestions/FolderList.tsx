import React, { useEffect, useState } from 'react'
import { getFolderList, createFolder } from '../api/Folder';
import { Folder } from '../../types';
import loadStyles from '../styles/Loading.module.css';
import styles from '../styles/Common.module.css';
import { Button } from 'react-bootstrap';

import newFolderIcon from '../../images/icon/newFolder.svg'



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
                console.log(err.message);
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
                    console.log(updatedFolders);
                }
            }
        } catch (error: any) {
            console.log(error.message);
            setErrorMessage(error.message);
        }
    };

    const folderAddClick = () => {
        setIsFolderAdding(!isFolderAdding);
    };

    return (
        <>
            {loading &&
                <div className={loadStyles.loading}>
                    <span className={loadStyles.text}>Loading...</span>
                </div>
            }
            {errorMessage &&
                <div className={loadStyles.loading}>
                    <span className={loadStyles.text}>{errorMessage}</span>
                </div>
            }

            <div className={styles.bg}>
                <h4 className={styles.title}>フォルダ一覧</h4>
                <div className={styles.contents}>
                    {folders.length > 0 && folders.map((folder) => (
                        <div key={folder.id}>
                            <a href={`/folders/detail/?user=${userId}&name=${folder.name}`}>{folder.name}({folder.questions.length})
                            </a>
                        </div>
                    ))}
                </div>

                <div>
                    {!isFolderAdding ? (
                        <>
                            <img src={newFolderIcon} alt='check' style={{ width: '20px' }} />
                            <div onClick={folderAddClick}>追加</div>
                        </>
                    ) : (
                        <>
                            <input
                                type="text"
                                value={newFolder || ""}
                                onChange={(e) => setNewFolder(e.target.value)}
                            />
                            <Button onClick={() => addFolderAndUpdateList(newFolder)} className={styles.miniButton} size="sm">追加</Button>
                            <Button onClick={folderAddClick} className={styles.miniButton} size="sm" variant="warning">キャンセル</Button>

                        </>

                    )}
                </div>

            </div>

        </>
    )
}


export default FolderList