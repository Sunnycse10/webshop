from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin
from .forms import *
# Register your models here.

class CustomAdmin(admin.ModelAdmin):
    list_display = ('id', '__str__')  

admin.site.register(Product,CustomAdmin)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
admin.site.register(Cart)
admin.site.register(CartItem)



