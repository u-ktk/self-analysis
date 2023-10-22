from django.test import TestCase, override_settings
from ..models import Question, Answer, QuestionCategory, User, Folder
from django.db.models.signals import post_save


class UserModelTest(TestCase):
    def test_create_user(self):
        user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password"
        )
        self.assertEqual(user.username, "testuser")
        self.assertEqual(user.email, "test@example.com")
        self.assertTrue(user.check_password("password"))
        self.assertFalse(user.is_superuser)
        self.assertFalse(user.is_staff)
        self.assertTrue(user.is_active)
        self.assertTrue(User.objects.filter(email="test@example.com").exists())

    def test_create_user_with_no_email(self):
        with self.assertRaises(ValueError):
            User.objects.create_user(
                username="testuser",
                email="",
                password="password")
        self.assertEqual(User.objects.count(), 0)

    def test_user_folders(self):
        user = User.objects.create(
            username="testuser",
            email="test@example.com",
            password="password")
        folder = Folder.objects.create(name="Sample Folder", user=user)
        user.folders.add(folder)
        self.assertTrue(folder in user.folders.all())


class QuestionCategoryModelTest(TestCase):

    def test_create_category(self):
        category = QuestionCategory.objects.create(name="勉強")
        self.assertEqual(category.name, "勉強")


class QuestionTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            username="testuser", email="test@example.com", password="password")

    def test_create_question(self):
        question = Question.objects.create(
            text="今日の朝ごはんは？", user=self.user)
        self.assertEqual(question.text, "今日の朝ごはんは？")
        self.assertEqual(question.user, self.user)


class AnswerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(
            username="testuser", email="test@example.com", password="password")
        self.category = QuestionCategory.objects.create(name="testcategory")
        self.question = Question.objects.create(
            text="今日の朝ごはんは？", user=self.user, category=self.category, )

    def test_create_answer(self):
        answer = Answer.objects.create(
            title="納豆ごはん", question=self.question, user=self.user)
        self.assertEqual(answer.title, "納豆ごはん")
        self.assertEqual(answer.question, self.question)
        self.assertEqual(answer.user, self.user)


@override_settings(DEBUG=True)
class FolderTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="password"
        )

    def test_confirm_default_folder(self):
        folders = self.user.folders.all()
        self.assertTrue(folders.exists())
        self.assertEqual(folders[0].name, "お気に入り")
        self.assertEqual(folders[1].name, "あとで回答する")

    def test_create_folder(self):
        folders = self.user.folders.all()
        folder = Folder.objects.create(name="あとでみる", user=self.user)
        self.assertEqual(folder.name, "あとでみる")
        self.assertEqual(folder.user, self.user)
        self.assertEqual(folders[0].name, "お気に入り")
        self.assertEqual(folders[1].name, "あとで回答する")
        self.assertTrue(folders[2].name, "あとでみる")
