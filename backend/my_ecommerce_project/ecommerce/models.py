from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from djmoney.models.fields import MoneyField
from django.utils.html import mark_safe
from django.contrib.auth.models import User

# Create your models here.


# class User(AbstractUser):
#     email = models.EmailField(_('email address'), unique=True)

#     def __str__(self):
#         return self.username
#     USERNAME_FIELD = 'email'
#     REQUIRED_FIELDS = ['username']


class Product(models.Model):
    STATUS_CHOICES = [
        ('on-sale', 'On Sale'),
        ('sold', 'Sold')
    ]
    # owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=100)
    description = models.TextField(max_length=300)
    price = MoneyField(
        decimal_places=2,
        default=0,
        default_currency='EUR',
        max_digits=11,
    )
    date_added = models.DateField(auto_now_add=True)
    image = models.ImageField(null=True, blank=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='on-sale')
    seller = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='items_for_sale')
    buyer = models.ForeignKey(User, on_delete=models.SET_NULL,
                              null=True, blank=True, related_name='purchased_items')

    @property
    def imageURL(self):
        try:
            url = self.image.url
        except:
            url = ''
        return url

    def __str__(self):
        return self.title


class Order(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True)
    date_ordered = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='Completed')
    total_price = MoneyField(
        decimal_places=2,
        default=0,
        default_currency='EUR',
        max_digits=11,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

    @property
    def get_cart_total(self):
        orderItems = self.orderitem_set.all()
        total = sum([item.product.price for item in orderItems])
        return total

    @property
    def get_total_cart_items(self):
        orderItems = self.orderitem_set.all()
        return orderItems.count()


class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name='order_items')
    price_at_purchase = MoneyField(
        decimal_places=2,
        default=0,
        default_currency='EUR',
        max_digits=11,
    )

    def __str__(self):
        return f"OrderItem {self.id} for Order {self.order.id}"


class Cart(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='cart')

    def __str__(self):
        return f"Cart of {self.user.username}"


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.title} in cart of {self.cart.user.username}"


class ShippingAddress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    address = models.CharField(max_length=200, null=False)
    city = models.CharField(max_length=200, null=False)
    state = models.CharField(max_length=200, null=False)
    zipcode = models.CharField(max_length=200, null=False)
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.address
