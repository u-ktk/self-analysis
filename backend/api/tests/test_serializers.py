from django.test import TestCase
from django.contrib.auth import get_user_model
# タイムゾーンインポート
from django.utils import timezone
from ..models import Question, Answer, QuestionCategory, User, Folder
from ..serializers import QuestionSerializer, AnswerSerializer, UserSerializer, FolderSerializer, QuestionCategorySerializer


class BaseTest(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create(
            username="user1", email="sample1@example.com", password="password"
        )
        # token = str(RefreshToken.for_user(self.user).access_token)
        # self.client.credentials(HTTP_AUTHORIZATION=("JWT " + token))

        self.question_category = QuestionCategory.objects.create(
            name="category1")
        self.question = Question.objects.create(
            text="question1", user=self.user, category=self.question_category)


class TestQuestionSerializer(BaseTest):

    def test_input_valid_with_answers(self):
        input_data = {
            'text': 'question100',
            'user': self.user.id,
            'age': '20代',

            # 複数の回答を質問に紐付けて入力
            'answers': [{'title': 'answer1', 'text1': 'aaa', 'text2': 'aa', 'text3': 'a', 'user': self.user.id, 'question': self.question.id},
                        {'title': 'answer2', 'text1': 'bbb', 'text2': 'bb', 'text3': 'b', 'user': self.user.id, 'question': self.question.id}]
        }
        serilizer = QuestionSerializer(data=input_data)
        self.assertEqual(serilizer.is_valid(), True)
        self.assertEqual(serilizer.validated_data['user'], self.user)

    # textが空の場合、バリデーションエラー
    def test_input_empty_text(self):
        input_data = {
            'text': '',
            'user': self.user.id,
        }
        serilizer = QuestionSerializer(data=input_data)

        self.assertEqual(serilizer.is_valid(), False)
        # 設定したエラーメッセージが出力される
        self.assertEqual(serilizer.errors['text'][0], '質問は空にできません')

    def test_input_long_text(self):
        input_data = {
            'text': 'a' * 256,
            'user': self.user.id,
            'category': self.question_category.id,
            'subcategory': 'subcategory1',
        }
        serilizer = QuestionSerializer(data=input_data)
        self.assertEqual(serilizer.is_valid(), False)
        # 設定したエラーメッセージが出力される
        self.assertEqual(
            serilizer.errors['text'][0], '質問は255文字以下にしてください')
