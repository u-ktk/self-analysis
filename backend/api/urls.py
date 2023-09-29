from django.urls import path, include
from .import views
# from rest_framework import routers
from rest_framework_nested import routers

# api/customquestions/
app_name = 'api'
router = routers.SimpleRouter()
router.register('customquestions', views.CustomQuestionViewSet)
router.register('defaultquestions', views.DefaultQuestionViewSet)
router.register('folders', views.FolderViewSet)

custom_questions_router = routers.NestedSimpleRouter(
    router, 'customquestions')
custom_questions_router.register('answers', views.AnswerViewSet)
default_questions_router = routers.NestedSimpleRouter(
    router, 'defaultquestions')
default_questions_router.register('answers', views.AnswerViewSet)



urlpatterns = [
    path('', include(router.urls)),
    path('', include(custom_questions_router.urls)),
    path('', include(default_questions_router.urls)),
    # ユーザー情報取得
    path('auth/', include('dj_rest_auth.urls')),
    path('register/', views.UserRegister.as_view(), name='register'),
    path('users/', views.UserList.as_view(), name='users'),
    path('users/<uuid:pk>/', views.UserDetail.as_view(), name='user-detail'),
    path('users/<uuid:pk>/update/', views.UserUpdate.as_view(), name='user-update'),
    
    path('questioncategories/', views.QuestionCategoryListView.as_view(),
         name='questioncategories'),
    path('customquestions/<int:question_id>/add_folder/', views.update_folders_for_custom_question,
         name='add_folder_custom'),
    path('customquestions/<int:question_id>/remove_folder/', views.remove_folder_from_custom_question,
         name='remove_folder_custom'),
      path('defaultquestions/<int:question_id>/add_folder/', views.update_folders_for_default_question,
         name='add_folder_default'),
    path('defaultquestions/<int:question_id>/remove_folder/', views.remove_folder_from_default_question,
         name='remove_folder_default'),
    path('token/', views.CustomTokenObtainPairView.as_view(),
         name='token_obtain_pair'),

    # path('defaultquestions/', views.DefaultQuestionListView.as_view(),
    #      name='defaultquestions'),
    # path('defaultquestions/<int:pk>/',
    #      views.DefaultQuestionDetailView.as_view(), name='defaultquestion-detail'),
    # path('defaultquestions/<question_pk>/answers/', views.DefaultQuestionAnswerListView.as_view(),
    #      name='defaultquestions'),
    # path('defaultquestions/<question_pk>/answers/<pk>',
    #      views.DefaultQuestionAnswerDetailView.as_view(), name='defaultquestion-detail'),
]
