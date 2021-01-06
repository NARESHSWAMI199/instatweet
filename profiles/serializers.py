from rest_framework import serializers
from .models import Profile




class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    first_name = serializers.SerializerMethodField(read_only=True)
    last_name = serializers.SerializerMethodField(read_only=True)
    followers = serializers.SerializerMethodField(read_only=True)
    following = serializers.SerializerMethodField(read_only=True)
    user_following = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Profile
        fields = [
            'id',
            "username",
            'first_name',
            'last_name',
            'bio',
            'image',
            'location',
            'followers',
            'user_following',
            'following'
        ]

    def get_user_following(self,obj):
       is_follow = False
       request = self.context.get('request')
       if request:
            user = request.user
            is_follow = user in obj.followers.all()
       return is_follow


    def get_username(self,obj):
        return obj.user.username

    def get_first_name(self,obj):
        return obj.user.first_name

    def get_last_name(self,obj):
        return obj.user.last_name

    def get_followers(self,obj):
        return obj.followers.count()
    
    def get_following(self,obj):
        return obj.user.following.count()

    

