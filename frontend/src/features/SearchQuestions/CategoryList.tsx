import React, { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { useAuth } from '../Auth/Token';
import { getCategoryList } from '../../components/api/DefaultQuestions';
import loadStyles from '../../components/styles/Loading.module.css';
import styles from '../../components/styles/Common.module.css';
import listStyles from '../../components/styles/List.module.css';

import { ProgressBar } from 'react-bootstrap';

const CategoryList = () => {
    const [categoryList, setCategoryList] = useState<string[] | null>([]);
    const [counts, setCounts] = useState<number[] | null>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const { accessToken } = useAuth();


    useEffect(() => {
        if (!accessToken) {
            return;
        }

        getCategoryList(accessToken)
            .then((data) => {
                if (data) {
                    setCategoryList(data.categories);
                    setCounts(data.counts);
                }
                setLoading(false);
            })
            .catch((err) => {
                setErrorMessage(err.message);
                setLoading(false);
            });
    }
        , [accessToken]);


    // console.log(counts)

    return (
        <>


            <div className={styles.bg}>
                {loading &&
                    <div className={loadStyles.loading}>
                        <span className={loadStyles.text}>Loading...</span>
                    </div>
                }
                <h4 className={styles.title}>用意された質問から選ぶ</h4>

                <div className={styles.contents}>
                    <table className={listStyles.categoryList}>
                        <tbody>
                            {categoryList?.map((category, index) => (
                                <tr key={category}>
                                    <td className={styles.id}>レベル{index + 1}. </td>
                                    <td><a href={`/questions-list/default/${index + 1}/`} className={listStyles.link}>{category}</a></td>
                                    <td>
                                        <span className={listStyles.progressBarWrapper}>
                                            <ProgressBar now={counts ? counts[index] : 0}
                                                className={listStyles.progress}
                                                variant='secondary'
                                                style={{ width: '100%' }}
                                            />
                                            <span className={listStyles.progressBarLabel}>{`${counts ? counts[index] : 0}%`}</span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

        </>
    )
}

export default CategoryList