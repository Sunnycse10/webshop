from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin
from .forms import *
# Register your models here.


# class UserAdmin(UserAdmin):
#     add_form = UserCreationForm
#     form = UserChangeForm
#     model = User
#     list_display = ["email", "username",]
    
    
# admin.site.register(User)
admin.site.register(Product)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
admin.site.register(Cart)
admin.site.register(CartItem)



