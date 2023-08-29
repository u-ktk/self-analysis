from django.urls import path, include
from .import views
# from rest_framework import routers
from rest_framework_nested import routers

# api/customquestions/
app_name = 'api'
router = routers.SimpleRouter()
router.register('customquestions', views.CustomQuestionViewSet)
router.register('defaultquestions', views.DefaultQuestionViewSet)
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
    path('auth/', include('dj_rest_auth.urls')),
    path('register/', views.UserRegister.as_view(), name='register'),
    # path('defaultquestions/', views.DefaultQuestionListView.as_view(),
    #      name='defaultquestions'),
    # path('defaultquestions/<int:pk>/',
    #      views.DefaultQuestionDetailView.as_view(), name='defaultquestion-detail'),
    # path('defaultquestions/<question_pk>/answers/', views.DefaultQuestionAnswerListView.as_view(),
    #      name='defaultquestions'),
    # path('defaultquestions/<question_pk>/answers/<pk>',
    #      views.DefaultQuestionAnswerDetailView.as_view(), name='defaultquestion-detail'),
    path('users/', views.UserList.as_view(), name='users'),
    path('users/<int:pk>/', views.UserDetail.as_view(), name='user-detail'),
]
