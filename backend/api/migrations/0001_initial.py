
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('password', models.CharField(
                    max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(
                    blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False,
                 help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(max_length=255)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('id', models.UUIDField(default=uuid.uuid4,
                 editable=False, primary_key=True, serialize=False)),
                ('is_admin', models.BooleanField(default=False)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('refresh_token', models.CharField(
                    blank=True, max_length=255, null=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
                 related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.',
                 related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Folder',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                 related_name='folders', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('name', 'user')},
            },
        ),
        migrations.CreateModel(
            name='QuestionCategory',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(max_length=255)),
                ('age', models.CharField(max_length=255)),
                ('created_at', models.DateTimeField(
                    default=django.utils.timezone.now)),
                ('is_default', models.BooleanField(default=False)),
                ('category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE,
                 related_name='questions', to='api.questioncategory')),
                ('folders', models.ManyToManyField(blank=True,
                 related_name='questions', to='api.folder')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL,
                 related_name='questions', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.BigAutoField(auto_created=True,
                 primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField(blank=True, max_length=255, null=True)),
                ('text1', models.TextField(blank=True, null=True)),
                ('text2', models.TextField(blank=True, null=True)),
                ('text3', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(
                    default=django.utils.timezone.now)),
                ('question', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE, related_name='answers', to='api.question')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE,
                 related_name='answers', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]