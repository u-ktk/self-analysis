from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from ..models import Question, Answer, QuestionCategory, User, Folder
from rest_framework import status


# あらかじめカスタム質問、デフォルト質問を1問ずつ用意
class BaseTest(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create(
            username="user1", email="sample1@example.com", password="password"
        )
        token = str(RefreshToken.for_user(self.user).access_token)
        self.client.credentials(HTTP_AUTHORIZATION=("JWT " + token))

        self.question_category = QuestionCategory.objects.create(
            name="category1")
        # デフォルトで用意された質問（更新、削除不可）
        self.default_question = Question.objects.create(
            text="question1", user=self.user, category=self.question_category, is_default=True)
        # ユーザーが作成したカスタム質問（更新、削除可）
        self.custom_question = Question.objects.create(
            text="question2", user=self.user, category=self.question_category, age="20代", is_default=False,)
        self.folder1 = Folder.objects.create(name = "就活", user = self.user)
        self.folder2 = Folder.objects.create(name = "あとでみる", user = self.user)
        self.custom_question.folders.set([self.folder1, self.folder2]) 
        


# カスタム質問の新規作成(question3)
class TestCreateQuestion(BaseTest):
    TARGET_CREATE_URL = "/api/customquestions/"

    def test_custom_question_create_success(self):
        params = {"text": "question3", "user": self.user.id,
                  "category": self.question_category.id, "subcategory": "sub"}
        response = self.client.post(
            self.TARGET_CREATE_URL, params, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Question.objects.count(), 3)


# カスタム質問(question2)に紐づいた回答作成、更新、削除
class TestCreateAnswer(BaseTest):
    TARGET_CREATE_URL = "/api/customquestions/{}/"
    TARGET_NEW_URL = "/api/customquestions/{}/answers/"

    def setUp(self):
        super().setUp()
        self.answer = Answer.objects.create(
            text="answer1", user=self.user, question=self.custom_question)

    def test_custom_question_create_answers(self):
        # 回答をカスタム質問に紐付けて入力
        params = {"answer": self.answer.id}
        response = self.client.patch(
            self.TARGET_CREATE_URL.format(self.custom_question.id), params, format="json")
        self.assertEqual(response.status_code, 200)
        # answersの出力確認
        self.assertEqual(self.custom_question.answers.count(), 1)
        # /api/customquestions/{}/answers/にアクセス可能か確認
        response = self.client.get(self.TARGET_NEW_URL.format(
            self.custom_question.id), format="json")
        self.assertEqual(response.status_code, 200)

    def test_custom_question_delete_answers(self):
        response = self.client.delete(
            self.TARGET_CREATE_URL.format(self.custom_question.id, self.answer.id), format="json")
        self.assertEqual(response.status_code, 204)
        self.assertEqual(self.custom_question.answers.count(), 0)


# カスタム質問の詳細取得、更新、削除
class TestQuestionOperations(BaseTest):
    TARGET_URL = "/api/customquestions/{}/"

    def setUp(self):
        super().setUp()
        self.question = Question.objects.create(
            text="Initial question", user=self.user,
            category=self.question_category, subcategory="Initial subcategory"
        )
        self.answer1 = Answer.objects.create(
            text="first answer", question=self.custom_question,
            user=self.user
        )
        self.answer2 = Answer.objects.create(
            text="second answer", question=self.custom_question,
            user=self.user
        )
        self.custom_question.answers.add(self.answer1, self.answer2)
        self.custom_question.save()

    # カスタム質問の詳細取得（回答も複数含まれる）
    def test_question_detail_with_answers(self):
        response = self.client.get(
            self.TARGET_URL.format(self.custom_question.id))
        self.assertEqual(response.status_code, 200)
        self.assertIn('answers', response.data)
        self.assertEqual(len(response.data['answers']), 2)
        self.assertEqual(response.data['answers']
                         [0]['text'], self.answer1.text)

    def test_question_update_success(self):
        update_params = {"text": "Updated question"}
        response = self.client.patch(
            self.TARGET_URL.format(self.custom_question.id),
            update_params, format="json"
        )
        self.assertEqual(response.status_code, 200)
        updated_question = Question.objects.get(id=self.custom_question.id)
        self.assertEqual(updated_question.text, "Updated question")

    def test_question_delete_success(self):
        response = self.client.delete(
            self.TARGET_URL.format(self.question.id)
        )
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Question.objects.filter(
            id=self.question.id).exists())


# カスタム質問のフィルタリング
class TestFilterQuestion(BaseTest):

    TARGET_GET_URL = "/api/customquestions/"

    def test_filter_question(self):
        params = {'text': 'question2'}
        response = self.client.get(
            self.TARGET_GET_URL, params, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['text'], 'question2')


# デフォルト質問の一覧取得
class TestDefaultQuestion(BaseTest):
    TARGET_GET_URL = "/api/defaultquestions/"

    def test_get_default_question(self):
        response = self.client.get(self.TARGET_GET_URL)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["text"], "question1")


# デフォルト質問の詳細取得可能、更新不可能　　削除不可能にしたいけど実装できてない
class TestDefaultQuestionDetail(BaseTest):
    TARGET_GET_URL = "/api/defaultquestions/{}/"

    def test_get_default_question_detail(self):
        response = self.client.get(
            self.TARGET_GET_URL.format(self.default_question.id))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["text"], "question1")

    def test_update_default_question(self):
        update_params = {"text": "Updated question1"}
        response = self.client.patch(
            self.TARGET_GET_URL.format(self.default_question.id),
            update_params, format="json"
        )
        self.assertEqual(response.status_code, 405)
        updated_question = Question.objects.get(id=self.default_question.id)
        self.assertEqual(updated_question.text, "question1")

    # def test_delete_default_question(self):
    #     response = self.client.delete(
    #         self.TARGET_GET_URL.format(self.default_question.id)
    #     )
    #     self.assertEqual(response.status_code, 405)
    #     self.assertTrue(Question.objects.filter(
    #         id=self.default_question.id).exists())


# デフォルト質問のページネーション　テスト用データ100問用意したい
class TestPaginateDefaultQuestion(BaseTest):
    def setUp(self):
        super().setUp()
        for i in range(100):
            Question.objects.create(
                text="question{}".format(i), user=self.user, category=self.question_category, is_default=True)
        self.assertEqual(Question.objects.count(), 102)

    TARGET_GET_URL = "/api/defaultquestions/"

    def test_paginate_default_question(self):
        params = {'limit': 20, 'offset': 20}
        response = self.client.get(self.TARGET_GET_URL, params, format="json")
        # print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["results"]), 20)
        self.assertEqual(response.data["results"][0]["text"], "question19")


# デフォルト質問(question1)に紐づいた回答作成、更新、削除
class TestCreateAnswer(BaseTest):
    TARGET_CREATE_URL = "/api/defaultquestions/{}/"
    TARGET_NEW_URL = "/api/defaultquestions/{}/answers/"

    def setUp(self):
        super().setUp()
        self.answer = Answer.objects.create(
            text="answer1", user=self.user, question=self.default_question)

    def test_default_question_create_answers(self):
        # 回答をカスタム質問に紐付けて入力
        params = {"answer": self.answer.id}
        response = self.client.patch(
            self.TARGET_CREATE_URL.format(self.default_question.id), params, format="json")
        # print(response.data)

        self.assertEqual(response.status_code, 200)
        # answersの出力確認
        self.assertEqual(self.default_question.answers.count(), 1)
        response = self.client.get(self.TARGET_NEW_URL.format(
            self.default_question.id), format="json")
        self.assertEqual(response.status_code, 200)

    def test_default_question_delete_answers(self):
        response = self.client.delete(
            self.TARGET_CREATE_URL.format(self.default_question.id, self.answer.id), format="json")
        self.assertEqual(response.status_code, 204)
        self.assertEqual(self.default_question.answers.count(), 0)

# 質問に新しくフォルダを追加
class TestAddFolder(BaseTest):
    TARGET_CREATE_URL = "/api/customquestions/{}/"
    
    def setUp(self):
        super().setUp()
        self.folder3 = Folder.objects.create(name = "面接", user = self.user)
        
    def test_add_folder(self):
        existing_folders = self.custom_question.folders.all()
        folder_ids = list(existing_folders.values_list('id', flat=True))

        # 新しいフォルダを追加
        folder_ids.append(self.folder3.id)
        params = {"folders": folder_ids}
        response = self.client.patch(
            self.TARGET_CREATE_URL.format(self.custom_question.id), params, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.custom_question.folders.count(), 3)
        self.assertEqual(self.custom_question.folders.all()[2].name, "面接")
        
# カスタム質問のフォルダを削除
class TestRemoveFolder(BaseTest):
    TARGET_URL = "/api/customquestions/{}/"
    
    def setUp(self):
        super().setUp()
    
    def test_remove_folder(self):
        existing_folders = self.custom_question.folders.all()
        folder_ids = list(existing_folders.values_list('id', flat=True))
        print(folder_ids)
        folder_ids.remove(self.folder1.id)
        folder_ids.remove(self.folder2.id)
        
        params = {"folders":folder_ids}
        self.assertEqual(self.custom_question.folders.count(), 2)
        print(self.custom_question.folders.all())
        response = self.client.delete(
            self.TARGET_URL.format(self.custom_question.id), params, format="json")
        self.assertEqual(response.status_code, 204)
        print(self.custom_question.folders.all())
        self.assertEqual(self.custom_question.folders.count(), 0)
        
# フォルダを新規作成
class TestCreateFolder(BaseTest):
    
    def setUp(self):
        super().setUp()
        
    def test_create_folder(self):
        params = {"name": "面接", "user": self.user.id}
        response = self.client.post(
            "/api/folders/", params, format="json")
        print(response.data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Folder.objects.count(), 5)
        self.assertEqual(Folder.objects.get(id=5).name, "面接")
        
# フォルダの一覧取得
class TestGetFolder(BaseTest):
    
    def setUp(self):
        super().setUp()
        
    def test_get_folder(self):
        response = self.client.get("/api/folders/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 4)
        self.assertEqual(response.data[0]["name"], "お気に入り")
        self.assertEqual(response.data[1]["name"], "あとで回答する")
        self.assertEqual(response.data[2]["name"], "就活")
        self.assertEqual(response.data[3]["name"], "あとでみる")