from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.conf import settings

# we need can add for fields like first name , last_name etc..
# but we have a User class allready in django get Data from both class going use
# Django singnals


User = settings.AUTH_USER_MODEL


# we can a short history or shortcut for wich profile following which user

class FollowReation(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    Profile = models.ForeignKey("Profile",on_delete=models.CASCADE)
    timestmap = models.DateTimeField(auto_now_add=True)

class Profile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    image = models.ImageField(default="media/unnamed.png",upload_to='media')
    bio = models.TextField(blank=True,null=True)
    location = models.TextField(blank=True,null=True)
    followers = models.ManyToManyField(User,related_name='following') 
    timestmap = models.DateTimeField(auto_now_add=True)


'''
project_obj = Profile.objects.first()
project_obj.followers.all() -> All users following this profile
user.following.all() ->  All  users profiles I follow
'''

# get data from user class using singnals
def user_did_save(sender,instance,created,*args,**kwargs):
    if created:
        Profile.objects.get_or_create(user=instance)
post_save.connect(user_did_save,sender=User)
