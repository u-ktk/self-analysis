import React from 'react'
import { Question } from "../../types";
import { addDefaultQToFolder } from '../../components/api/DefaultQuestions';

type addFolderProps = {
    defaultQuestions: Question[]
    selectQuestion: number
    selectFolders: number[]
    accessToken: string | null
    userId: string | null
}

const addQuestionToFolder = async (props: addFolderProps) => {

    if (!props.accessToken || !props.userId) {
        return;
    }
    try {
        const res = await addDefaultQToFolder({ accessToken: props.accessToken, questionId: props.selectQuestion, folders: props.selectFolders });
        if (res === null) {
            return `${props.selectFolders}に追加しました`;
        }
    }
    catch (error: any) {
        console.log(error.message);
        return error.message;
    }
}



export { addQuestionToFolder }