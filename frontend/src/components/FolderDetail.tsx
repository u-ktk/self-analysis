import React, { useEffect, useState } from 'react'
import HeadTitle from './layouts/HeadTitle'
import { Folder, Question } from '../types'
import { useLocation } from 'react-router-dom'
import { useAuth } from './auth/Auth'
import { getFolderDetail } from './api/Folder'
import styles from './styles/Common.module.css'
import loadStyles from './styles/Loading.module.css'


const FolderDetail = () => {
    const { accessToken } = useAuth()
    const searchParams = new URLSearchParams(useLocation().search)
    const userParams = searchParams.get('user')
    const nameParams = searchParams.get('name')
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    const [folderDetail, setFolderDetail] = useState<Folder | null>(null)

    const fetchData = async () => {
        if (!accessToken || (!userParams || !nameParams)) {
            console.log('フォルダの詳細を取得できませんでした')
            return
        }
        try {
            let res;
            if (userParams && nameParams) {
                res = await getFolderDetail({ accessToken, userId: userParams }, nameParams)
            }
            if (res) {
                console.log(res)
                setFolderDetail(res)
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
                <h4 className={styles.title}>{nameParams}</h4>

                {folderDetail?.questions ? (
                    <>
                        <p>フォルダに含まれる質問</p>
                        <div>
                            {folderDetail.questions.map((question: Question) => (
                                <div key={question.id}>
                                    <a href={`/questions/detail/?id=${question.id}`}>{question.text}</a>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div>まだ質問がありません。</div>
                )}




            </div>
        </>
    )
}

export default FolderDetail