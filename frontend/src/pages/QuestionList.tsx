import React, { useState, useEffect } from 'react';
import { getCategoryList } from '../components/api/DefaultQuestions';
import SearchQuestions from '../components/SearchQuestions';
import { useAuth } from '../components/auth/Auth';
import { Table, Pagination } from 'react-bootstrap';
import HeadTitle from '../components/layouts/HeadTitle';
import loadStyles from '../components/styles/Loading.module.css';
import NoLogin from '../components/NoLogin';
import style from '../components/styles/Common.module.css';

const QuestionList = () => {
    const [categoryList, setCategoryList] = useState<string[] | null>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const { accessToken } = useAuth();

    // const fetchData = async () => {
    //     if (!accessToken) {
    //         return;
    //     }
    //     try {
    //         let response;
    //         response = await getCategoryList(accessToken);
    //         if (response) {
    //             setCategoryList(response);
    //             setLoading(false);
    //         }
    //     } catch (error: any) {
    //         setErrorMessage(error.message);
    //         setLoading(false);
    //     }
    // }

    // fetchData();




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
            <HeadTitle title='質問一覧' />
            {accessToken ? (
                <div>
                    {loading &&
                        <div className={loadStyles.loading}>
                            <span className={loadStyles.text}>Loading...</span>
                        </div>
                    }
                    {/* <DefaultQuestionsList /> */}

                    <div className={style.bg}>
                        <h4 className={style.title}>質問を検索</h4>
                        <SearchQuestions />
                    </div>

                    <div className={style.bg}>
                        <h4 className={style.title}>用意された質問から選ぶ</h4>
                        <Table striped bordered hover responsive className=" m-4">
                            <thead>
                                <tr>
                                    <th>レベル</th>
                                    <th>カテゴリー</th>
                                    {/* <th>Category</th> */}
                                </tr>
                            </thead>
                            <tbody >
                                {categoryList?.map((category, index) => (
                                    <tr key={index} >
                                        <td>{index + 1}</td>
                                        <td><a href={`/questions-list/default/${index + 1}/`} className="text-dark">{category}</a></td>
                                        {/* <td>{question.category_name}</td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    <div className={style.bg}>
                        <h4 className={style.title}>作成した質問から選ぶ</h4>
                    </div>



                </div>
            ) : (
                <NoLogin />
            )
            }

        </>
    )
}

export default QuestionList;
