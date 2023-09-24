import React, { useState, useEffect } from 'react';
import { getCategoryList } from '../components/api/GetDefaultQuestions';
import SearchQuestions from '../components/SearchQuestions';
import { useAuth } from '../components/auth/Auth';
import { Table, Pagination } from 'react-bootstrap';
import HeadTitle from '../components/layouts/HeadTitle';
import loadStyles from '../components/styles/Loading.module.css';

const QuestionList = () => {
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
            <HeadTitle title='質問一覧' />
            {accessToken ? (
                <div>
                    {loading &&
                        <div className={loadStyles.loading}>
                            <span className={loadStyles.text}>Loading...</span>
                        </div>
                    }
                    {/* <DefaultQuestionsList /> */}
                    <h3>質問を検索</h3>
                    <SearchQuestions />
                    <h3>用意された質問から選ぶ</h3>
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

                    <h3>作成した質問から選ぶ</h3>



                </div>
            ) : (
                <>
                    <p>自己分析サイトを利用するには、ログインする必要があります。</p>
                    <a href="/register" className="m-5">登録</a>
                    <a href="/login" className="m-5">ログイン</a>
                </>
            )
            }

        </>
    )
}

export default QuestionList;
