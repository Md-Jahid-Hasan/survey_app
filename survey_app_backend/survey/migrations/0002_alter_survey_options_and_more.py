# Generated by Django 5.0.4 on 2024-04-24 18:51

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('survey', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='survey',
            options={'ordering': ['started_at']},
        ),
        migrations.RenameField(
            model_name='survey',
            old_name='users',
            new_name='participants',
        ),
        migrations.AlterField(
            model_name='participatinguser',
            name='survey',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='survey.survey'),
        ),
        migrations.AlterField(
            model_name='response',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_responses', to='survey.participatinguser'),
        ),
    ]
