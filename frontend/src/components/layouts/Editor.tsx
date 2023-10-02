import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import editorStyles from '../styles/Editor.module.css';

type editorProps = {
    value: string;
    onChange: (value: string) => void;
}




const Editor = ({ value, onChange }: editorProps) => {

    const toolbarOptions = [
        ['bold', 'italic', 'underline'],

        [{ 'list': 'ordered' }, { 'list': 'bullet' }],

        [{ 'header': [1, 2, 3, false] }],
        // 背景に薄い色だけを選択できるようにする
        [{ 'background': ['#ffffff', '#FACBCB', '#FEEACC', '#FFFECC', '#CBE7CB', '#CCE0F6', '#EAD7FF'] }],

        ['link'],

        ['clean']
    ]


    return <ReactQuill
        style={{ height: '120px', marginBottom: '70px' }}
        className={editorStyles.editor}
        theme="snow"
        value={value}
        onChange={(content) => onChange(content)}
        modules={{ toolbar: toolbarOptions }}
    />;
}

const SimpleEditor = ({ value, onChange }: editorProps) => {

    return <ReactQuill
        style={{ height: '50px', marginBottom: '10px' }}
        theme="snow"
        value={value}
        onChange={(content) => onChange(content)}
        modules={{ toolbar: false }}
    />;

}


export { Editor, SimpleEditor };