import React, { useEffect, useState } from 'react'
import { getFolderList } from '../api/Folder';
import { Folder } from '../../types';
import loadStyles from '../styles/Loading.module.css';
import styles from '../styles/Common.module.css';


type authInfo = {
    accessToken: string | null;
    userId: string | null;
}

const FolderList = (props: authInfo) => {
    const { accessToken, userId } = props
    const [folders, setFolders] = useState<Folder[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        if (!accessToken || !userId) {
            return;
        }
        getFolderList({ userId, accessToken }).then((res) => {
            if (res) {
                setFolders(res);
                setLoading(false)

            }
        }
        ).catch((err) => {
            console.log(err.message);
        }
        )
    }, [accessToken, userId]);


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
                    {folders.map((folder) => (
                        <div key={folder.id}>
                            <a href={`/folders/detail/?user=${userId}&name=${folder.name}`}>{folder.name}({folder.questions.length})
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}


export default FolderList