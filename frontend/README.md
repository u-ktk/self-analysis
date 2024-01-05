フロントエンドのディレクトリ構成図
src配下
```
src
├ components //機能に依存しないComponent
├ features //機能に依存するComponentなど
├ images
├ pages　// URLに対応するComponent
├ routes
├ sass
├ types
├ App.tsx
├ index.css
└ index.tsx
```

features配下
```
features //機能に依存するComponentなど
├ Auth（認証）
│ ├ LoginForm.tsx
│ ├ FetchToken.tsx
│ ├ LogoutModal.tsx
│ ├ NoLogin.tsx
│ ├ RegisterForm.tsx
│ └ Token.tsx
├ Answer //回答の新規作成や一覧表示
│ ├ AnswerForm.tsx
│ ├ AnswerList.tsx
│ └ CreateNewAnswer.tsx
├ CreateQuestions //メニューバーの「質問を作る」に対応
│ └ CreateQuestionForm.tsx 
├ Help //メニューバーの「使い方ガイド」に対応
├ MyPage //メニューバーの「マイページ」に対応　ユーザー情報更新、ログアウト
│ └ EditUserInfo.tsx
├ Folder //メニューバーの「フォルダ一覧」に対応
│ └ FolderList.tsx
└ SearchQuestions　//メニューバーの「質問を探す」に対応　
　 ├ AddQuestionToFolder.tsx
　 ├ CategoryList.tsx
　 ├ CustomQuestionOverview.tsx
　 ├ RemoveQuestionFromFolder.tsx
　 └ SearchQuestionsByWords.tsx 
```

pages配下
```
pages　
├ BeforeLoginPage　//新規登録、ログイン
│ ├ Login.tsx
│ └ Register.tsx
├ CreateQuestionsPage　//メニューバーの「質問を作る」に対応
│ └ Top.tsx
├ FolderPage　//メニューバーの「フォルダ一覧」に対応
│ ├ AnsewrHistory.tsx　
│ ├ FolderDetails.tsx
│ └ Top.tsx
├ HelpPage　//メニューバーの「使い方ガイド」に対応
│ └ Top.tsx
├ MyPage　//メニューバーの「マイページ」に対応
│ └ Top.tsx
├ QuestionDetailPage　//各質問の詳細ページ　メニューバーにはない
│ ├ CustomQuestionDetails.tsx
│ └ DefaultQuestionDetail.tsx
└ SearchQuestionsPage　//メニューバーの「質問を探す」に対応　ログイン後はTop.tsxに遷移
　 ├ CustomQuestionList.tsx
　 ├ DefaultQuestionList.tsx
　 ├ SearchResults.tsx
　 └ Top.tsx
```