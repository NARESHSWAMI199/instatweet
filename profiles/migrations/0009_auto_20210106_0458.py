# Generated by Django 3.1.4 on 2021-01-06 04:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0008_auto_20210102_0424'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='image',
            field=models.ImageField(default='tweeter/media/profile/unnamed.png', upload_to='media'),
        ),
    ]