from django import forms
from .models import Profile


class ProfileFrom(forms.ModelForm):
    first_name = forms.CharField()
    last_name = forms.CharField()
    email = forms.CharField()
    class Meta:
        model = Profile
        fields = ['image','bio','location']


class SearchForm(forms.Form):
    search = forms.CharField()
    