# Generated by Django 3.1.4 on 2021-01-06 05:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0009_auto_20210106_0458'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='image',
            field=models.ImageField(default='media/profile/unnamed.png', upload_to='media'),
        ),
    ]