from rest_framework import authentication
from django.contrib.auth import get_user_model

User  = get_user_model()

class DevAuthenciation(authentication.BasicAuthentication):
    # this is predifind function
    def authentication(self,request):
        qs = User.objects.filter(id=2)
        user = qs.order_by(" ? ").first()
        return (user,None)
