# Generated by Django 3.1.4 on 2021-01-06 05:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('profiles', '0010_auto_20210106_0505'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='image',
            field=models.ImageField(default='media/unnamed.png', upload_to='media'),
        ),
    ]
