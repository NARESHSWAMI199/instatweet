from django.contrib import admin
from django.urls import path
from .views import( 
    user_profile_detail,
    user_profile_edit,
    user_profile_view,
    search_user_profile
)

app_name ='profiles'

urlpatterns = [
    path('<str:username>/',user_profile_detail,name="user_detail"),
    path('form/edit/',user_profile_edit,name='edit'),
    path('user/<str:username>/',user_profile_view),
    path('users/search/',search_user_profile)
]

