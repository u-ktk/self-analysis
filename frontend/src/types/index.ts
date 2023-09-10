export type Question = {
    id: number;
    category: number;
    category_name: string;
    subcategory: string;
    text: string;
    answers?: Answer
};

export type Category = {
    id: number;
    name: string;
}

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