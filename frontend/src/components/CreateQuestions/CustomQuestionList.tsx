import React, { useEffect, useState } from 'react'
import { Question } from "../../types";
import { getCustomQuestions } from '../api/CustomQuestions';

type authInfo = {
    accessToken: string | null;
    userId: string | null;
}

type CustomQuestions = Question[]

const CustomQuestionList = (props: authInfo) => {
    const { accessToken, userId } = props;
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [questions, setQuestions] = useState<CustomQuestions | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            if (!accessToken || !userId) {
                return;
            }
            try {
                const res = await getCustomQuestions({ accessToken, userId });
                if (res) {
                    console.log(res)
                    setQuestions(res);
                    setLoading(false);
                }
            } catch (err: any) {
                console.log(err.message);
                setErrorMessage(err.message);
                setLoading(false);
            }

        };
        fetchData();
    }, [accessToken, userId])


    return (
        <>

        </>
    )
}

export default CustomQuestionList