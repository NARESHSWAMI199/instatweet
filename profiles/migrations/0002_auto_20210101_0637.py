# Generated by Django 3.1.4 on 2021-01-01 06:37

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('profiles', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='followers',
            field=models.ManyToManyField(related_name='following', to=settings.AUTH_USER_MODEL),
        ),
    ]
