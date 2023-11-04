from collections import OrderedDict
from rest_framework import serializers
from .models import Question, Answer, Folder, QuestionCategory, User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    user = serializers.SerializerMethodField()
    default_error_messages = {
        'no_active_account': 'emailもしくはパスワードが間違っています。',
    }


class UserSerializer(serializers.ModelSerializer):
    # questions = serializers.PrimaryKeyRelatedField(
    #     many=True, queryset=Question.objects.all())
    # answers = serializers.PrimaryKeyRelatedField(
    #     many=True, queryset=Answer.objects.all())
    # folders = serializers.PrimaryKeyRelatedField(
    #     many=True, queryset=Folder.objects.all())

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'refresh_token']
        # パスワードが表示されないようにする
        extra_kwargs = {
            'password': {
                'write_only': True,
                "error_messages": {
                    "required": "パスワードは必須です",
                    'blank': 'パスワードは空にできません',
                }
            },
            'refresh_token': {
                'write_only': True,
            },
            'username': {
                'error_messages': {
                    'required': 'ユーザー名は必須です',
                    'blank': 'ユーザー名は空にできません',
                    'max_length': 'ユーザー名は255文字以下にしてください',
                },
            },
            'email': {
                'error_messages': {
                    'required': 'emailは必須です',
                    'blank': 'emailは空にできません',
                    'invalid': 'emailの形式が正しくありません',
                    'unique': 'このemailはすでに登録されています',
                },
            }
        }

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("パスワードは6文字以上にしてください。")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)

        return user


class QuestionCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionCategory
        fields = ['id', 'name']


class QuestionCategoryListSerializer(serializers.ModelSerializer):
    child = QuestionCategorySerializer()


# カテゴリーごとの回答数を取得する
class CategoryOverViewSerializer(serializers.ModelSerializer):
    answer_counts = serializers.SerializerMethodField()

    class Meta:
        model = QuestionCategory
        fields = ['id', 'name', 'answer_counts']

    def get_answer_counts(self, obj):
        user = self.context['request'].user
        # categoryから全ての質問を取得し、それに紐づくユーザーの回答数をカウント
        answer_count = Answer.objects.filter(
            question__category=obj,
            user=user
        ).count()
        return answer_count


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'title', 'text1', 'text2',
                  'text3', 'created_at', 'question', 'user']
        extra_kwargs = {
            'title': {
                'error_messages': {
                    'blank': 'タイトルは空にできません',
                }
            }
        }


class AnswerListSerializer(serializers.ListSerializer):
    child = AnswerSerializer()


class QuestionSerializer(serializers.ModelSerializer):
    answers = serializers.SerializerMethodField(required=False)
    category_name = serializers.SerializerMethodField()
    folders_name = serializers.SerializerMethodField()

    class Meta:
        model = Question
        user_answer = serializers.CharField(read_only=True)
        fields = ['id', 'text', 'user', 'category', 'category_name', 'created_at',
                  'age', 'folders', 'folders_name', 'is_default', 'answers']
        # バリデーションメッセージの追加
        extra_kwargs = {
            'text': {
                'error_messages': {
                    'blank': '質問は空にできません',
                    'max_length': '質問は255文字以下にしてください',
                }
            },
            'age': {
                'error_messages': {
                    'blank': '年代は空にできません',
                }
            },
            # フォルダーnull許可
            'folders': {
                'required': False
            },
            # カスタム質問ではカテゴリーを選択しない
            'category': {
                'required': False
            }
        }

    def get_category_name(self, obj):
        if obj.category is None:
            return None
        return obj.category.name

    def get_folders_name(self, obj):
        if obj.folders is None:
            return None
        return obj.folders.name

    # ユーザーが回答した回答のみを取得
    def get_answers(self, obj):
        user = self.context['request'].user
        answers = Answer.objects.filter(question=obj, user=user)
        return AnswerSerializer(answers, many=True).data


class QuestionListSerializer(serializers.ListSerializer):
    child = QuestionSerializer()


class FolderSerializer(serializers.ModelSerializer):

    questions = QuestionListSerializer(
        required=False,  source='get_ordered_questions')

    class Meta:
        model = Folder
        fields = ['id', 'name', 'user', 'questions']
        extra_kwargs = {
            'name': {
                'error_messages': {
                    'blank': 'フォルダ名は空にできません',
                }
            },
            'questions': {
                'required': False
            }
        }
