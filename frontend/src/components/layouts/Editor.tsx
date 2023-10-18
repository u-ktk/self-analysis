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
        [{ 'background': ['#ffffff', '#ac8d7337', '#F299502a', '#FFFECC6d', '#CBE7CB6d', '#CCE0F66d', '#EAD7FF6d'] }],

        ['link'],

        ['clean']
    ]


    return <ReactQuill
        style={{
            marginBottom: '20px', backgroundColor: '#ffffff',
        }}
        className={editorStyles.editor}
        theme="snow"
        value={value}
        onChange={(content) => onChange(content)}
        modules={{ toolbar: toolbarOptions }}
    />;
}

const SimpleEditor = ({ value, onChange }: editorProps) => {

    return <ReactQuill
        style={{ height: '50px', marginBottom: '10px', backgroundColor: '#ffffff' }}
        theme="snow"
        value={value}
        onChange={(content) => onChange(content)}
        modules={{ toolbar: false }}
    />;

}


export { Editor, SimpleEditor };