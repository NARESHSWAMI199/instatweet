from django.shortcuts import render
from .serializers import ProfileSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from .models import Profile
from rest_framework.response import Response
from .forms import ProfileFrom,SearchForm
from django.contrib.auth.decorators import login_required
from core.serialzers import TweetActionsSerializer
from django.http import JsonResponse


app_name = 'profiles'


@api_view(['POST','GET'])
def user_profile_detail(request,username,*args,**kwargs):

    qs = Profile.objects.filter(user__username=username)
    if not qs.exists():
       return Response({"message":"User Profile not Found"},status=404)
    qs = qs.first()
    profile_serializer = ProfileSerializer(qs,context= {'request':request})

    me = request.user
    data = request.data or {}
    action = data.get("action")
    print('action',action)
    if qs.user != me:
        if action =="follow":
            qs.followers.add(me)
            return Response(profile_serializer.data,status=200)
        if action =='unfollow':
            qs.followers.remove(me)
            return Response(profile_serializer.data,status=200)
    return Response(profile_serializer.data,status=200)


@login_required
def user_profile_edit(request,*args,**kwargs):
    print(request.POST)
    user = request.user 
    my_profile = user.profile
    # if you have allready value in your data base
    # passing instance insert an unique value in any form 
    form = ProfileFrom(request.POST or None ,request.FILES or None ,instance=my_profile)
    print(request.FILES, request.POST)
    if form.is_valid():
        obj = form.save(commit=False)
        first_name = form.cleaned_data.get('first_name')
        last_name =  form.cleaned_data.get('last_name')
        email = form.cleaned_data.get('email')
        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        obj.user = user
        user.save()
        obj.save()
        print("succesfully submitted")
    return render(request,'pages/edit.html')





def user_profile_view(request,username,*args,**kwargs):
    return render(request,"pages/userprofile.html",context={'username': username,'me':request.user})





# filter data for search bar
def search_user_profile(request,*args,**kwargs):
    form = SearchForm(request.POST or None)
    if form.is_valid():
        username = form.cleaned_data.get("search")
        profile_qs = Profile.objects.filter(user__username__icontains = username)
        context = {}
        if profile_qs.exists():
            context.update({'profiles':profile_qs})
            print("profies : ", profile_qs)
        else:
            return JsonResponse({"message" : "profile not found"},status="404")
    else:
        print("Not a valid Form")
    return render(request,"pages/detail.html",context)
        

