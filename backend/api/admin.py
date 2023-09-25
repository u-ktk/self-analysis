from django.contrib import admin
from .models import User, QuestionCategory, Question, Answer, Folder


class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_admin', 'is_staff')
    search_fields = ('username', 'email')
    list_filter = ('is_admin', 'is_staff')
    ordering = ('username',)


class QuestionCategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)


class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'user', 'category', 'created_at', 'is_default')
    search_fields = ('text',)
    list_filter = ('category', 'created_at')
    ordering = ('-created_at',)


class AnswerAdmin(admin.ModelAdmin):
    list_display = ('text', 'question', 'user', 'created_at')
    search_fields = ('text',)
    list_filter = ('created_at',)


class FolderAdmin(admin.ModelAdmin):
    list_display = ('name', 'user')
    search_fields = ('name',)
    filter_horizontal = ('questions',)


# 各モデルを管理サイトに登録
admin.site.register(User, UserAdmin)
admin.site.register(QuestionCategory, QuestionCategoryAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Answer, AnswerAdmin)
admin.site.register(Folder, FolderAdmin)
