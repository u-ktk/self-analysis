
import HeadTitle from "@/components/layouts/HeadTitle"
import { useAuth } from "@/components/auth/auth";
import Link from "next/link";
import React, { useEffect } from "react";
import type { Question } from "@/types/index";
import { useRouter } from "next/router";

const NEXT_AUTH_URL = process.env.NEXTAUTH_URL;

interface Props {
    questions: Question[];
}


const QuestionList: React.FC<Props> = ({ questions }) => {
    const router = useRouter();
    const { accessToken, setAccessToken } = useAuth();
    useEffect(() => {
        // const token = localStorage.getItem("accessToken")
        if (!accessToken) {
            router.push("/login")
        }

    }, []);
    return (

        <div>
            <HeadTitle title="質問リスト" />
            <p>質問リスト</p>
            {/* <ul>
                {questions.map((question) => (
                    <li key={question.id}>
                        <Link href={`/questions/${question.id}`}>
                            <a>{question.text}</a>
                        </Link>
                    </li>
                ))}
            </ul> */}
        </div>
    );
}

// export async function getServerSideProps() {
//     const res = await fetch(`${NEXT_AUTH_URL}questions`);
//     const questions = await res.json();
//     return {
//         props: {
//             questions,
//         },
//     };
// }

export default QuestionList;