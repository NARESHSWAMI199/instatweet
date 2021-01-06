from django.shortcuts import render,redirect
from django.contrib.auth.forms import AuthenticationForm,UserCreationForm # here the UserCreationForm is a model form but not AuthenticationForm
from django.contrib.auth import login,logout

def login_view(request,*args,**kwargs):
    form  = AuthenticationForm(request, data = request.POST or None)
    if form.is_valid():
        user_ = form.get_user()
        login(request,user_)
        return redirect('/')
    else:
        print("something went wrong")
    context = {
        'form':form,
        'title':'Login',
        'btn_label':'Login'
    }
    return render(request,"pages/auth.html",context)


def resgiter_view(request,*args,**kwargs):
    form = UserCreationForm(request.POST or None)
    if form.is_valid():
        obj = form.save(commit=False)
        obj.save()
        print("succesfully submit")
        return redirect("/")
    context = {
        'form':form,
        'title':'Singup',
        'btn_label':'Save'
    }
    return render(request,'pages/auth.html',context)




def logout_view(request,*args,**kwargs):
    if request.method == "POST":    
        logout(request)
        return redirect('/')
    context = {
        'form':None,
        'title':'Logout',
        'btn_label': 'Logout'
    }
    return render(request,'pages/auth.html',context)