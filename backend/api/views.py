from django.shortcuts import render
from .models import Question, User, Answer, Folder, QuestionCategory
from .serializers import UserSerializer, QuestionSerializer, AnswerSerializer, FolderSerializer, CustomTokenObtainPairSerializer, QuestionCategorySerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate, login
from django.http import HttpResponse
from rest_framework_simplejwt import authentication
from rest_framework import permissions, generics, viewsets, exceptions, status
from rest_framework.pagination import LimitOffsetPagination
from django_filters import rest_framework as filters
from rest_framework.decorators import api_view
from django.db.models import Subquery, OuterRef
# エディターで入力されたHTMLをサニタイズする
from .utils import sanitize_html

# from django.db.models import Q


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    # エラーメッセージをカスタマイズ
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return response


class UserRegister(generics.CreateAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = User.objects.all()
    serializer_class = UserSerializer
    success_url = '/'


class UserList(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (authentication.JWTAuthentication,)
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetail(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (authentication.JWTAuthentication,)
    queryset = User.objects.all()
    serializer_class = UserSerializer

# ユーザー情報更新も可能


class UserUpdate(generics.UpdateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (authentication.JWTAuthentication,)
    queryset = User.objects.all()
    serializer_class = UserSerializer


class CustomQuestionsFilter(filters.FilterSet):

    class Meta:
        model = Question
        fields = {
            'text': ['icontains'],
            'age': ['icontains'],
            'user': ['exact'],
        }


@api_view(['POST'])
def refresh_token_save(request):
    if request.method == 'POST':
        refresh_token = request.data.get('refresh')
        if refresh_token:
            request.user.refresh_token = refresh_token
            request.user.save()
            print(request.user.refresh_token)
            return HttpResponse(status=status.HTTP_200_OK)
        else:
            return HttpResponse(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def refresh_token_get(request):
    if request.method == 'POST':
        user_id = request.data.get('user')
        if user_id:
            refresh_token = User.objects.get(id=user_id).refresh_token
            return HttpResponse(refresh_token, status=status.HTTP_200_OK)
        else:
            return HttpResponse(status=status.HTTP_400_BAD_REQUEST)


class CustomQuestionViewSet(viewsets.ModelViewSet):
    # is_default == Falseの時
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (authentication.JWTAuthentication,)
    queryset = Question.objects.filter(is_default=False)
    serializer_class = QuestionSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = 'text', 'age', 'user'
    filterset_class = CustomQuestionsFilter
    pagination_class = LimitOffsetPagination

    # カスタム質問とユーザー紐付け
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# 質問に複数のフォルダ追加(ただのPATCHだと１つずつしかできない？)
@api_view(['PATCH'])
def update_folders_for_custom_question(request, question_id):
    folders = request.data.get('folders')
    # JSON文字列のリストをPythonのリストに変換
    if isinstance(folders, str):
        try:
            import json
            folders = json.loads(folders)
        except json.JSONDecodeError:
            return HttpResponse({"error": "Invalid format for folders"}, status=status.HTTP_400_BAD_REQUEST)
    # if not folders:
    #   return HttpResponse({"error": "folder_ids are required"}, status=status.HTTP_400_BAD_REQUEST)
    if folders is None:
        return HttpResponse({"error": "folder_ids are required"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        question = Question.objects.get(pk=question_id)
        # current_folders = list(question.folders.values_list('id', flat=True))
        # combined_folders = list(set(current_folders + folders))
        question.folders.set(folders)
    except Question.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    return HttpResponse(status=status.HTTP_200_OK)


# 質問からフォルダを１つずつ削除
@api_view(['POST'])
def remove_folder_from_custom_question(request, question_id):
    folder = request.data.get('folder')
    if not folder:
        return HttpResponse({"error": "folder_id is required"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        question = Question.objects.get(pk=question_id)
        folder = Folder.objects.get(pk=folder)
        question.folders.remove(folder)
    except (Question.DoesNotExist, Folder.DoesNotExist):
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    return HttpResponse(status=status.HTTP_200_OK)


"""
デフォルト質問も同じように実装（重複コードが多いので後でリファクタリング）
"""


class DefaultQuestionsFilter(filters.FilterSet):

    class Meta:
        model = Question
        fields = {
            'text': ['icontains'],
            'age': ['icontains'],
        }


# デフォルト質問は回答以外作成、更新、削除不可能
class DefaultQuestionViewSet(viewsets.ModelViewSet):
    # is_default == Trueの時
    queryset = Question.objects.filter(is_default=True)
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (authentication.JWTAuthentication,)
    serializer_class = QuestionSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = DefaultQuestionsFilter
    filterset_fields = '__all__'
    # limit, offsetはクライアントで設定
    pagination_class = LimitOffsetPagination

    def update(self, request, *args, **kwargs):
        # 質問文の更新は不可能
        if 'text' in request.data:
            raise exceptions.MethodNotAllowed(
                "PATCH", detail="あらかじめ用意された質問は更新できません")
        return super().update(request, *args, **kwargs)


# 質問に複数のフォルダ追加
@api_view(['PATCH'])
def update_folders_for_default_question(request, question_id):
    folders = request.data.get('folders')
    # JSON文字列のリストをPythonのリストに変換
    if isinstance(folders, str):
        try:
            import json
            folders = json.loads(folders)
        except json.JSONDecodeError:
            return HttpResponse({"error": "Invalid format for folders"}, status=status.HTTP_400_BAD_REQUEST)
    if not folders:
        return HttpResponse({"error": "folder_ids are required"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        question = Question.objects.get(pk=question_id)
        # current_folders = list(question.folders.values_list('id', flat=True))
        # combined_folders = list(set(current_folders + folders))
        question.folders.set(folders)
    except Question.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    return HttpResponse(status=status.HTTP_200_OK)

# 質問にフォルダを１つずつ追加


@api_view(['POST'])
def add_folder_to_default_question(request, question_id):
    folder = request.data.get('folder')
    if not folder:
        return HttpResponse({"error": "folder_id is required"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        question = Question.objects.get(pk=question_id)
        folder = Folder.objects.get(pk=folder)
        question.folders.add(folder)
    except (Question.DoesNotExist, Folder.DoesNotExist):
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    return HttpResponse(status=status.HTTP_200_OK)

# 質問からフォルダを１つずつ削除


@api_view(['POST'])
def remove_folder_from_default_question(request, question_id):
    folder = request.data.get('folder')
    if not folder:
        return HttpResponse({"error": "folder_id is required"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        question = Question.objects.get(pk=question_id)
        folder = Folder.objects.get(pk=folder)
        question.folders.remove(folder)
    except (Question.DoesNotExist, Folder.DoesNotExist):
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)
    return HttpResponse(status=status.HTTP_200_OK)

    # 質問自体の削除不可能にしたい。回答の削除は可能
    # def destroy(self, request, *args, **kwargs):
    #     # 質問自体の削除は不可能
    #     if 'answer' in request.data:
    #         raise exceptions.ValidationError("Only answers can be updated.")
    #     raise exceptions.MethodNotAllowed(
    #         "DELETE", detail="質問の削除はできません")


class AnswerViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (authentication.JWTAuthentication,)
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = '__all__'

    def get_queryset(self):
        # URLからQuestionのIDを取得
        # print("Kwargs:", self.kwargs)
        question_id = self.kwargs.get('nested_1_pk')
        return Answer.objects.filter(question_id=question_id)

    # 回答とユーザー紐付け

    def perform_create(self, serializer):

        validated_data = serializer.validated_data
        if 'text1' in validated_data:
            validated_data['text1'] = sanitize_html(validated_data['text1'])
        if 'text2' in validated_data:
            validated_data['text2'] = sanitize_html(validated_data['text2'])
        if 'text3' in validated_data:
            validated_data['text3'] = sanitize_html(validated_data['text3'])

        serializer.save(user=self.request.user)


class FolderFilter(filters.FilterSet):
    class Meta:
        model = Folder
        fields = {
            'user': ['exact'],
            'name': ['exact']
        }


class FolderViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (authentication.JWTAuthentication,)
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = 'user', 'name'
    filterset_class = FolderFilter

    # フォルダーとユーザー紐付け
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class QuestionCategoryListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = QuestionCategory.objects.all()
    serializer_class = QuestionCategorySerializer
