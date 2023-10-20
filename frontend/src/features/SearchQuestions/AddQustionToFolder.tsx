import React from 'react'
import { Question } from "../../types";
import { addDefaultQToFolder } from '../../components/api/DefaultQuestions';
import { addCustomQToFolder } from '../../components/api/CustomQuestions';

type addFolderProps = {
    selectQuestion: number
    selectFolders: number[]
    accessToken: string | null
    userId: string | null
    Addfunction: Function
}

// APIを叩いて質問をフォルダに追加
const addQuestionToFolder = async (props: addFolderProps) => {

    if (!props.accessToken || !props.userId) {
        return;
    }
    try {
        if (props.Addfunction === addDefaultQToFolder) {
            const res = await addDefaultQToFolder({ accessToken: props.accessToken, questionId: props.selectQuestion, folders: props.selectFolders });
            if (res === null) {
                return `${props.selectFolders}に追加しました`;
            }
            else {
                console.log(res)
                return res
            }
        }
        else if (props.Addfunction === addCustomQToFolder) {
            const res = await addCustomQToFolder({ accessToken: props.accessToken, userId: props.userId, questionId: props.selectQuestion, folders: props.selectFolders });
            if (res === null) {
                console.log(`${props.selectFolders}に追加しました`)
                return `${props.selectFolders}に追加しました`;
            }
            else {
                console.log(res)
                return res
            }
        }
    } catch (error: any) {
        console.log(error.message);
        return error.message;
    }
}



export { addQuestionToFolder }