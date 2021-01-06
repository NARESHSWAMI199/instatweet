from django.contrib import admin
from django.urls import path,re_path,include
from django.conf.urls.static import static
from django.conf import settings
from core.views import home_view
from rest_framework import routers
from accounts.views import (
    login_view,
    logout_view,
    resgiter_view,
)
router = routers.SimpleRouter()

urlpatterns = [
    path("",home_view),
    path('tweet/',include('core.urls')),
    path('accounts/login/',login_view),
    path('accounts/logout/',logout_view),
    path('accounts/resigter/',resgiter_view),
    path('admin/', admin.site.urls),
    re_path(r'profiles?/',include('profiles.urls'),name="profiles"),
]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)

