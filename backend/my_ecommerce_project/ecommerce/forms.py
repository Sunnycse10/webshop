#from django import forms
#from django.contrib.auth.forms import UserCreationForm
#from .models import Customer

#class UserRegistrationForm(UserCreationForm):
#    email = forms.EmailField(required=True)
#    class Meta:
#        model = Customer
#        fields = ['email',  'password1', 'password2']

from typing import Any
from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import User

class UserCreationForm(UserCreationForm):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self.fields['password1'].validators = []
    class Meta:
        model = User
        fields = ['username', 'email']
        
        
class UserChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = ['username','email']