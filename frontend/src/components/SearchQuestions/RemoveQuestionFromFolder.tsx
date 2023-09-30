import React from 'react'
import { Question } from "../../types";
import { removeDefaultQFromFolder } from '../../components/api/DefaultQuestions';


// const removeFolderClick = async (questionId: number, folder: number) => {
//     if (!accessToken || !userId) {
//         return;
//     }
//     try {
//         const res = await removeDefaultQFromFolder({ accessToken, questionId, folder });
//         if (res === null) {
//             console.log(res);
//         }
//     }
//     catch (err: any) {
//         console.log(err.message);
//         setErrorMessage(err.message);
//     }
// }

type removeFolderProps = {
    defaultQuestions: Question[]
    selectQuestion: number
    selectFolder: number
    accessToken: string | null
    userId: string | null
}

const RemoveQuestionFromFolder = async (props: removeFolderProps) => {
    if (!props.accessToken || !props.userId) {
        return;
    }
    try {
        const res = await removeDefaultQFromFolder({ accessToken: props.accessToken, questionId: props.selectQuestion, folder: props.selectFolder });
        if (res === null) {
            return `${props.selectFolder}から削除しました`;
        }
    }
    catch (error: any) {
        console.log(error.message);
        return error.message;
    }



}

export { RemoveQuestionFromFolder }