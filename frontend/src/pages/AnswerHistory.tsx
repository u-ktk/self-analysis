import React from 'react'
import { useParams } from 'react-router-dom';

const AnswerHistory = () => {
    let { id } = useParams<{ id: string }>();

    const currentId = parseInt(id ? id : "1");
    if (!currentId || currentId < 1 || currentId > 1000) {
        return <div>ページが存在しません。</div>;
    }

    return (
        <div>AnswerHistory</div>
    )
}

export default AnswerHistory