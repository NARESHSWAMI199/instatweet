from rest_framework import serializers
from .models import Tweet,Comment
from profiles.serializers import ProfileSerializer
ACTIONS_LIST = ['like', 'unlike','retweet']



class TweetActionsSerializer(serializers.Serializer):
    id = serializers.CharField()
    action = serializers.CharField()
    content = serializers.CharField(required=False)
    def validate_action(self,value):
        if value not in ACTIONS_LIST:
            raise Exception("this is not a valid action")
        return value




class TweetCreateSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(source="user.profile",read_only=True)
    likes = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Tweet
        fields = ['profile','content','image','id','likes']

    def validate_content(self,value):
        if len(value) > 124:
            raise serializers.ValidationError("this conenet is so long")
        return value

    def get_likes(self,obj):
        return obj.likes.count()

    

class TweetSerializer(serializers.ModelSerializer):
    # user = serialziers.SerializerMethodField(read_only=)
    profile = ProfileSerializer(source="user.profile",read_only=True)
    parent = TweetCreateSerializer(read_only=True)
    likes = serializers.SerializerMethodField(read_only=True)
    parent = TweetCreateSerializer(read_only=True)
    class Meta:
        model = Tweet
        fields = ['profile','content','image','id','likes','parent']

    def validate_content(self,value):
        if len(value) > 124:
            raise serializers.ValidationError("this content is so long")
        return value

    def get_likes(self,obj):
        return obj.likes.count()

class TweetComment(serializers.ModelSerializer):
    tweet_id = serializers.SerializerMethodField()
    profile = ProfileSerializer(source="user.profile",read_only=True)
    og_tweet = TweetCreateSerializer(source="tweet",read_only=True)
    class Meta:
        model = Comment
        fields = ['profile','og_tweet','tweet_id','message']

    
    def get_tweet_id(self,obj):
        return obj.tweet.id
    