from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not username:
            raise ValueError('ユーザー名の登録が必要です。')
        if not email:
            raise ValueError('Eメールの登録が必要です。')

        user = self.model(
            username=username,
            email=self.normalize_email(email),
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None):
        user = self.create_user(
            username=username,
            email=self.normalize_email(email),
        )
        user.set_password(password)
        user.is_superuser = True
        user.is_admin = True
        user.is_staff = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser,  PermissionsMixin):
    username = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True, blank=False, null=False)
    # passwordはAbstractBaseUserに含まれているから不要
    is_admin = models.BooleanField(default=False)
    # 管理画面にアクセスする際必要
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    # emailを用いて一意に識別
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    objects = UserManager()

    def __str__(self):
        return self.username


class QuestionCategory(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Question(models.Model):
    text = models.TextField(max_length=255, blank=False, null=False)
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, related_name="questions")
    category = models.ForeignKey(
        QuestionCategory, on_delete=models.CASCADE, related_name="questions")
    subcategory = models.CharField(max_length=255)
    created_at = models.DateTimeField(default=timezone.now)
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return self.text


class Answer(models.Model):
    text = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    # QuestionとAnswerは1対多の関係
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="answers")
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="answers")

    def __str__(self):
        return self.text


class Folder(models.Model):
    name = models.CharField(max_length=255)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="folders")
    answers = models.ManyToManyField(Answer, related_name="folders")

    def __str__(self):
        return self.name
