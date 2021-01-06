from django.shortcuts import render,redirect
from .models import Tweet,Comment
from .forms import TweetCreate,ReweetCreate,CommentForm
from .serialzers import TweetActionsSerializer,TweetSerializer,TweetCreateSerializer,TweetComment
from rest_framework.decorators import permission_classes,api_view
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required
from django.db.models import Q

@login_required
def home_view(request,*args,**kwargs):
    user = request.user
    follower = user.profile.followers.count()
    return render(request,"pages/home.html",context={'username':user,'follower':follower})


@api_view(['GET'])
@login_required
def tweet_feed_view(request,*args,**kwargs):
    user = request.user
    followed_user_id = []  
    profile_exist = user.following.exists()
    if profile_exist:
        # If you want only one attribute then you can use 
        #flat=True to suggest to return just list of values. However, make sure in what order the list will 
        followed_user_id = user.following.values_list("user__id", flat=True) 
    # in key word provide the value using list
    tweet_obj = Tweet.objects.filter(Q(user__id__in=followed_user_id)|Q(user=user)).distinct().order_by('-timestamp')
    serializer = TweetSerializer(tweet_obj,many=True)
    return Response(serializer.data,status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def tweet_json_list(request,*args,**kwargs):
    # you must need a query set for sending your data
    tweet_obj = Tweet.objects.all()
    serializer = TweetSerializer(tweet_obj,many=True)
    return Response(serializer.data,status=200)



@api_view(['GET'])
@login_required
def tweet_delete_view(request,tweet_id,*args,**kwargs):
    qs = Tweet.objects.filter(id=tweet_id)
    if qs.exists():
        qs.delete()
        return Response({"message":"you have succesully removed your data"})
    return Response({"message":"tweet not found"})
    


@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def tweet_detail_view(request,tweet_id,*args,**kwargs):
    qs = Tweet.objects.filter(id=tweet_id)
    if qs.exists():
        serializer = TweetSerializer(qs,many=True)
        return Response(serializer.data, 200)
    return Response({"message":"tweet not found"})
    

@login_required
def tweet_create(request,*args,**kwargs):
    user = request.user
    form = TweetCreate(request.POST or None , request.FILES)
    if form.is_valid():
        obj = form.save(commit=False)
        obj.user = user
        obj.save()
    return render(request,"pages/form.html",context={'form':form})


@api_view(['POST'])
@login_required  # in django you can use  @login_requried 
def tweets_action(request,*args,**kwargs):
    '''
    USER ID 
    CONTENT
    ACTION
    '''
    # print("the data is : ",request.data)
    serializer = TweetActionsSerializer(data=request.data)
    # form = ReweetCreate(request.POST or None)
    if serializer.is_valid(raise_exception=True):
        tweet_id = serializer.validated_data.get('id')
        action = serializer.validated_data.get('action')
    # if form.is_valid():
        content = serializer.validated_data.get('content')

        tweet_obj = Tweet.objects.get(id=tweet_id)
        me = request.user
        if action == "like":
            tweet_obj.likes.add(me)
            return Response({'message': "you have succesfully liked the post"},status=200)
        if action == "unlike":
            tweet_obj.likes.remove(me)
            return Response({'message': "you have succesfully unliked the post"},status=200)

        if action == "retweet":
            retweet = Tweet.objects.create(
                user = request.user,
                parent = tweet_obj,
                content = content,
            )
            retweet.save()
            new_serializer = TweetSerializer(retweet)
            return Response(new_serializer.data,status=200)
    return Response({},status=200)
        
    



# This is a pure django function 
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def pure_django_tweet_json_list(request,*args,**kwargs):
    data = { }
    satus = 400
    try :
        tweet_obj = Tweet.objects.all()
        response  = [ { 'content': x.content,"likes":x.likes.count(),"id": x.id  } for x in tweet_obj ] 
        data = {
            "tweets": response
        }
    except:
            return Response({"message": "something went wrong with tweet tweet_json_list"},status=401)
    return Response(data,status=200)




@api_view(['POST'])
def comment_view(request,*args,**kwargs):
    me = request.user
    form = CommentForm(request.POST or None)
    if form.is_valid():
        tweet_id = form.cleaned_data.get('t_id')
        message = form.cleaned_data.get('message')
        qs = Tweet.objects.get(id=tweet_id)
        print("the object = ",tweet_id )
        comment = Comment (
            user = me,
            tweet = qs,
            message = message
        )
        comment.save()
        return redirect('/')
    return JsonResponse({"message" : "something went wrong"},status=200)



@api_view(['GET'])
def show_comment(request,*args,**kwargs):
    qs = Comment.objects.all()
    if qs.exists():
        serializer = TweetComment(qs,many=True)
        return Response(serializer.data,status=200)
    return Response({},status=200)
    
