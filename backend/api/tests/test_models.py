from django.test import TestCase

from ..models import Question, Answer, QuestionCategory, User, Folder


class UserModelTest(TestCase):

    def test_create_user(self):
        user = User.objects.create(
            username="testuser", email="test@example.com")
        self.assertEqual(user.email, "test@example.com")
        self.assertTrue(User.objects.filter(email="test@example.com").exists())

    def test_create_user_with_no_email(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(username="testuser", email="")

        self.assertEqual(User.objects.count(), 0)
        context = "Eメールの登録が必要です。"
        self.assertEqual(context, "Eメールの登録が必要です。")

    def test_user_folders(self):
        user = User.objects.create(
            username="testuser", email="test@example.com")
        folder = Folder.objects.create(name="Sample Folder", user=user)
        user.folders.add(folder)
        self.assertTrue(folder in user.folders.all())


class QuestionCategoryModelTest(TestCase):

    def test_create_category(self):
        category = QuestionCategory.objects.create(name="勉強")
        self.assertEqual(category.name, "勉強")


class QuestionTest(TestCase):
    def setUp(self):
        # Create questions
        self.user = User.objects.create(
            username="testuser", email="test@example.com")
        self.category = QuestionCategory.objects.create(name="ごはん")

    def test_create_question(self):
        question = Question.objects.create(
            text="今日の朝ごはんは？", user=self.user, category=self.category, subcategory="ごはん")
        self.assertEqual(question.text, "今日の朝ごはんは？")
        self.assertEqual(question.user, self.user)
        self.assertEqual(question.category, self.category)
        self.assertEqual(question.subcategory, "ごはん")


class AnswerTest(TestCase):
    def setUp(self):
        # Create questions
        self.user = User.objects.create(
            username="testuser", email="test@example.com")
        self.category = QuestionCategory.objects.create(name="testcategory")
        self.question = Question.objects.create(
            text="今日の朝ごはんは？", user=self.user, category=self.category, subcategory="ごはん")

    def test_create_answer(self):
        answer = Answer.objects.create(
            text="納豆ごはん", question=self.question, user=self.user)
        self.assertEqual(answer.text, "納豆ごはん")
        self.assertEqual(answer.question, self.question)
        self.assertEqual(answer.user, self.user)

    def test_answer_folder(self):
        folder = Folder.objects.create(name="今日の回答", user=self.user)
        answer = Answer.objects.create(
            text="納豆ごはん", question=self.question, user=self.user)
        folder.answers.add(answer)
        self.assertTrue(answer in folder.answers.all())
