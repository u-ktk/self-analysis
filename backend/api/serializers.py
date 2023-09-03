from rest_framework import serializers
from .models import Question, Answer, Folder, QuestionCategory, User


class UserSerializer(serializers.ModelSerializer):
    # questions = serializers.PrimaryKeyRelatedField(
    #     many=True, queryset=Question.objects.all())
    # answers = serializers.PrimaryKeyRelatedField(
    #     many=True, queryset=Answer.objects.all())
    # folders = serializers.PrimaryKeyRelatedField(
    #     many=True, queryset=Folder.objects.all())

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        # パスワードが表示されないようにする
        extra_kwargs = {
            'password': {
                'write_only': True,
                'error_messages': {
                    'blank': 'passwordは空にできません',
                },
            },
            'username': {
                'error_messages': {
                    'blank': 'usernameは空にできません',
                },
            },
            'email': {
                'error_messages': {
                    'blank': 'emailは空にできません',
                },
            }
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class QuestionCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionCategory
        fields = ['id', 'name']


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text', 'created_at', 'question', 'user']
        extra_kwargs = {
            'text': {
                'error_messages': {
                    'blank': '回答は空にできません',
                }
            }
        }


class AnswerListSerializer(serializers.ListSerializer):
    child = AnswerSerializer()


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerListSerializer(required=False)

    class Meta:
        model = Question
        fields = ['id', 'text', 'user', 'category',
                  'subcategory', 'is_default', 'answers']
        # バリデーションメッセージの追加
        extra_kwargs = {
            'text': {
                'error_messages': {
                    'blank': '質問は空にできません',
                    'max_length': '質問は255文字以下にしてください',
                }
            }
        }


class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = ['id', 'name', 'user', 'answers']
        extra_kwargs = {
            'name': {
                'error_messages': {
                    'blank': 'フォルダ名は空にできません',
                }
            }
        }
