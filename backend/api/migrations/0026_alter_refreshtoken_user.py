# Generated by Django 4.2.4 on 2023-10-19 12:21

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0025_refreshtoken'),
    ]

    operations = [
        migrations.AlterField(
            model_name='refreshtoken',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='refresh_token', to=settings.AUTH_USER_MODEL),
        ),
    ]
