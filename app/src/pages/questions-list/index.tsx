
import HeadTitle from "@/components/layouts/HeadTitle"

import Link from "next/link";
import React from "react";
import type { Question } from "@/types/index";

interface Props {
    questions: Question[];
}

  
const QuestionList: React.FC<Props> = ({ questions }) => {
    return (
        <div>
            <HeadTitle title="質問リスト" />
          <p>質問リスト</p>
            <ul>
                {questions.map((question) => (
                    <li key={question.id}>
                        <Link href={`/questions/${question.id}`}>
                            <a>{question.text}</a>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export async function getServerSideProps() {
    const res = await fetch('http://localhost:4010/api/questions');
    const questions = await res.json();
    return {
        props: {
            questions,
        },
    };
}

export default QuestionList;