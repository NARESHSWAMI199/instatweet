from django.contrib import admin
from django.urls import path
from .views import (
    home_view,
    tweet_json_list,
    tweet_create,
    tweets_action,
    tweet_delete_view,
    tweet_detail_view,
    tweet_feed_view,
    comment_view,
    show_comment
)

app_name="core"

urlpatterns = [
    path("",tweet_json_list),
    path("form/",tweet_create),
    path('action/',tweets_action),
    path('delete/<int:tweet_id>/',tweet_delete_view),
    path('<int:tweet_id>/',tweet_detail_view),
    path('feed/',tweet_feed_view),
    path('comment/',comment_view),
    path('show/comment/',show_comment),
]

