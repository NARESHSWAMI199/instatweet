# Generated by Django 3.1.4 on 2021-01-01 10:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0005_auto_20210101_0959'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='bio',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='profile',
            name='location',
            field=models.TextField(blank=True, null=True),
        ),
    ]