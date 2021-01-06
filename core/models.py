from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()



class TweetLike(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    tweet = models.ForeignKey("Tweet",on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

class Tweet(models.Model):
    parent = models.ForeignKey("self",blank=True, null=True ,on_delete=models.SET_NULL)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    content = models.TextField(blank=True,null=True)
    image = models.ImageField(blank=True, null=True, upload_to = 'media')
    likes = models.ManyToManyField(User,related_name='tweet_user',through=TweetLike)
    timestamp = models.DateTimeField(auto_now_add=True) 

    class Meta:
        ordering = ['-id']



class Comment(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    tweet = models.ForeignKey(Tweet,on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
