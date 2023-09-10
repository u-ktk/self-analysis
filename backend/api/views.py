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

# 詳細取得はRetrieveAPIView


class UserDetail(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (authentication.JWTAuthentication,)
    queryset = User.objects.all()
    serializer_class = UserSerializer


class CustomQuestionViewSet(viewsets.ModelViewSet):
    # is_default == Falseの時
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (authentication.JWTAuthentication,)
    queryset = Question.objects.filter(is_default=False)
    serializer_class = QuestionSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = '__all__'
    pagination_class = LimitOffsetPagination

    # カスタム質問とユーザー紐付け
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # いずれデータ検索高速化したい（DBにインデックスを追加？）
    # def get_queryset(self):
    #     queryset = Question.objects.all()
    #     keyword = self.request.query_params.get('keyword', None)
    #     if keyword:
    #         queryset = queryset.filter(Q(text__icontains=keyword))
    #     return queryset


# class DefaultQuestionListView(generics.ListAPIView):
#     # is_default == Trueの時
#     permission_classes = (permissions.IsAuthenticated,)
#     authentication_classes = (authentication.JWTAuthentication,)
#     queryset = Question.objects.filter(is_default=True)
#     serializer_class = QuestionSerializer
#     filter_backends = [filters.DjangoFilterBackend]
#     filterset_fields = '__all__'
#     # limit, offsetはクライアントで設定
#     pagination_class = LimitOffsetPagination


# class DefaultQuestionDetailView(generics.RetrieveAPIView):
#     permission_classes = (permissions.IsAuthenticated,)
#     authentication_classes = (authentication.JWTAuthentication,)
#     queryset = Question.objects.filter(is_default=True)
#     serializer_class = QuestionSerializer

# デフォルト質問は回答以外作成、更新、削除不可能


class DefaultQuestionViewSet(viewsets.ModelViewSet):
    # is_default == Trueの時
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (authentication.JWTAuthentication,)
    queryset = Question.objects.filter(is_default=True)
    serializer_class = QuestionSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = '__all__'
    # limit, offsetはクライアントで設定
    pagination_class = LimitOffsetPagination

    def update(self, request, *args, **kwargs):
        # 質問文の更新は不可能
        if 'text' in request.data:
            raise exceptions.MethodNotAllowed(
                "PATCH", detail="あらかじめ用意された質問は更新できません")
        return super().update(request, *args, **kwargs)

    # 質問自体の削除不可能にしたい。回答の削除は可能
    # def destroy(self, request, *args, **kwargs):
    #     # 質問自体の削除は不可能
    #     if 'answer' in request.data:
    #         raise exceptions.ValidationError("Only answers can be updated.")
    #     raise exceptions.MethodNotAllowed(
    #         "DELETE", detail="質問の削除はできません")


# class DefaultQuestionAnswerListView(generics.ListCreateAPIView):
#     permission_classes = (permissions.IsAuthenticated,)
#     serializer_class = AnswerSerializer

#     def get_queryset(self):
#         return Answer.objects.filter(question__pk=self.kwargs['question_pk'])

#     def perform_create(self, serializer):
#         super().perform_create(serializer)
#         defaultquestion = Question.objects.get(pk=self.kwargs['question_pk'])
#         defaultquestion.answers.add(serializer.instance)


# class DefaultQuestionAnswerDetailView(generics.RetrieveUpdateDestroyAPIView):
#     permission_classes = (permissions.IsAuthenticated,)
#     serializer_class = AnswerSerializer

#     def get_queryset(self):
#         return super().get_queryset().filter(question__pk=self.kwargs['question_pk'])


class AnswerViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (authentication.JWTAuthentication,)
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_fields = '__all__'

    # 回答とユーザー紐付け
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FolderView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Folder.objects.all()
    serializer_class = FolderSerializer


class QuestionCategoryListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = QuestionCategory.objects.all()
    serializer_class = QuestionCategorySerializer
