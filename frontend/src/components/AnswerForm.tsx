import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import { Question } from "../types";

type Props = {
    onSubmit: SubmitHandler<FormData>;
    errorMessage: string | null;
}

type FormData = {
    text: string;
    user: number;
    question: number;
}

const AnswerForm: React.FC<Props> = ({ onSubmit, errorMessage }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    return (
        <div>
            <Form className='w-100 mx-auto' onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="">回答</label>
                    <input type="textarea" className="form-control border"  {...register("text")} />
                </div>
                <Button type="submit" className="btn btn-primary">回答する</Button>

            </Form>
        </div>
    )
}

export default AnswerForm


// // 
// import React, { useState } from 'react';

// const AnswerForm = ({ questionId }) => {
//   const [answer, setAnswer] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // フォームの送信処理を実装
//     // 例: API経由で回答を送信
//     console.log('Answer submitted:', answer);
//     // フォームをクリア
//     setAnswer('');
//   };

//   return (
//     <div>
//       <h2>回答</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <textarea
//             className="form-control"
//             rows="4"
//             placeholder="回答を入力してください"
//             value={answer}
//             onChange={(e) => setAnswer(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" className="btn btn-primary">
//           回答する
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AnswerForm;
