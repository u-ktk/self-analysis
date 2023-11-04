import React, { useState, useEffect } from 'react'
import { useAuth } from '../Auth/Token';
import { getCategoryOverView } from '../../components/api/DefaultQuestions';
import loadStyles from '../../components/styles/Loading.module.css';
import styles from '../../components/styles/Common.module.css';
import listStyles from '../../components/styles/List.module.css';
import { Category } from '../../types';

import { ProgressBar } from 'react-bootstrap';

const CategoryList = () => {
    const [categoryList, setCategoryList] = useState<Category[] | null>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const { accessToken } = useAuth();

    useEffect(() => {
        if (!accessToken) {
            return;
        }
        const fetchCategoryList = async () => {
            try {
                const res = await getCategoryOverView(accessToken);
                if (!res) {
                    throw new Error("Failed to get category list");
                }
                setCategoryList(res);
                setLoading(false);
                console.log(res)
            } catch (error: any) {
                console.log(error);
                setErrorMessage(error.message);
            }
        }
        fetchCategoryList();
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
                                <tr key={category.id}>
                                    <td className={styles.id}>レベル{index + 1}. </td>
                                    <td><a href={`/questions-list/default/${index + 1}/`} className={listStyles.link}>{category.name}</a></td>
                                    <td>
                                        <span className={listStyles.progressBarWrapper}>
                                            <ProgressBar
                                                now={category.answer_counts ? category.answer_counts : 0}
                                                className={listStyles.progress}
                                                variant='secondary'
                                                style={{ width: '100%' }}
                                            />
                                            <span className={listStyles.progressBarLabel}>{`${category.answer_counts ? category.answer_counts : 0}%`}</span>
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