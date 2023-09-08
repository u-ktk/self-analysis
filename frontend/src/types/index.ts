export type Question = {
    id: number;
    category: string;
    text: string;
    answers: Answer
};

// 回答の型定義
export type Answer = {
    id: number;
    questionId: number;
    content: string;
    createdAt: Date;
};

// フォルダの型定義
export type Folder = {
    id: number;
    name: string;
    questions: Question[];
};

// ユーザーの型定義
export type User = {
    id: number;
    username: string;
    email: string;
    password: string;
    questions?: Question[];
    folders?: Folder[];
};