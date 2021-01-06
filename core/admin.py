from django.contrib import admin
from .models import Tweet,Comment


class TweetDetail(admin.ModelAdmin):
    list_display = ['content']
    class Meta:
        model = Tweet

admin.site.register(Tweet,TweetDetail)

admin.site.register(Comment)