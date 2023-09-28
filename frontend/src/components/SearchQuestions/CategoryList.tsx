import React, { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { useAuth } from '../auth/Auth';
import { getCategoryList } from '../api/DefaultQuestions';
import loadStyles from '../styles/Loading.module.css';

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
            {loading &&
                <div className={loadStyles.loading}>
                    <span className={loadStyles.text}>Loading...</span>
                </div>
            }
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
        </>
    )
}

export default CategoryList