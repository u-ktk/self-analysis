import React, { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { useAuth } from '../auth/Auth';
import { getCategoryList } from '../api/DefaultQuestions';
import loadStyles from '../styles/Loading.module.css';
import styles from '../styles/Common.module.css';
import detailStyles from '../styles/QuestionDetail.module.css';

const CategoryList = () => {
    const [categoryList, setCategoryList] = useState<string[] | null>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const { accessToken } = useAuth();


    useEffect(() => {
        if (!accessToken) {
            return;
        }
        getCategoryList(accessToken)
            .then((data) => {
                setCategoryList(data);
                setLoading(false);

            })
            .catch((err) => {
                setErrorMessage(err.message);
                setLoading(false);
            });
    }
        , [accessToken]);



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
                    {categoryList?.map((category, index) => (
                        <table key={index}>
                            <tbody>
                                <tr key={category} >
                                    <td className={styles.id}>レベル{index + 1}. </td>
                                    <td><a href={`/questions-list/default/${index + 1}/`} className="text-dark">{category}</a></td>
                                </tr>
                            </tbody>
                        </table>
                    ))}

                </div>

            </div>

        </>
    )
}

export default CategoryList