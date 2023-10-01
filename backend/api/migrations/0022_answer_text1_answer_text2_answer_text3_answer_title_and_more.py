# Generated by Django 4.2.4 on 2023-10-01 03:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_alter_question_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='answer',
            name='text1',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='answer',
            name='text2',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='answer',
            name='text3',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='answer',
            name='title',
            field=models.TextField(default=1, max_length=255),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='answer',
            name='text',
            field=models.TextField(blank=True, null=True),
        ),
    ]
