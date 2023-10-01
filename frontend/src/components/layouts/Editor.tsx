import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import editorStyles from '../styles/Editor.module.css';

type editorProps = {
    value: string;
    onChange: (value: string) => void;
}

function Editor({ value, onChange }: editorProps) {

    const toolbarOptions = [
        ['bold', 'italic', 'underline'],

        [{ 'list': 'ordered' }, { 'list': 'bullet' }],

        [{ 'header': [1, 2, 3, false] }],
        [{ 'color': [] }, { 'background': [] }],

        ['link'],

        ['clean']
    ]


    return <ReactQuill
        style={{ height: '150px', marginBottom: '50px' }}
        className={editorStyles.editor}
        theme="snow"
        value={value}
        onChange={(content) => onChange(content)}
        modules={{ toolbar: toolbarOptions }}
    />;
}

export default Editor;