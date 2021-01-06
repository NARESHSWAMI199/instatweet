from django import forms
from .models import Tweet,Comment


MAX_LENGTH = 120

class TweetCreate(forms.ModelForm):
    class Meta:
        model = Tweet
        fields = ['content' ,'image']


    def clean_content(self):
        value = self.cleaned_data.get('content')
        if len(value) > MAX_LENGTH:
            raise forms.ValidationError("tweet is to large ...")
        return value
    
class ReweetCreate(forms.ModelForm):
    class Meta:
        model = Tweet
        fields = ['content']


    def clean_content(self):
        value = self.cleaned_data.get('content')
        if len(value) > MAX_LENGTH:
            raise forms.ValidationError("tweet is to large ...")
        return value
    
class CommentForm(forms.Form):
    t_id = forms.CharField()
    message = forms.CharField()

    def clean_message(self):
        value = self.cleaned_data.get('message')
        if len(value) > MAX_LENGTH:
            raise forms.ValidationError("comment is to large ...")
        return value