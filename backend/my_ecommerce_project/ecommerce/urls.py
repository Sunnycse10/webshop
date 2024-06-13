from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', obtain_auth_token, name='login'),
    path('api/products/', ProductListView.as_view(), name='product-list'),
    path('api/products/create/', ProductCreateView.as_view(), name='product-create'),
    path('api/change-password/', ChangePasswordView.as_view(),
         name='change-password'),
    path('api/myItems/', UserInventoryView.as_view(), name='user-inventory'),
    path('api/shippingAddress/',
         ShippingAddressView.as_view(), name='user-inventory'),
    path('api/cart/add/', AddToCartView.as_view(), name='add-to-cart'),
    path('api/cart/remove/', RemoveFromCartView.as_view(), name='remove-from-cart'),
    path('api/cart/', CartView.as_view(), name="view-cart"),
    path('api/products/<int:pk>/update/',
         ProductUpdateView.as_view(), name='product-update'),
    path('api/populate-db/', PopulateDatabaseView.as_view(), name='populate-db'),
    path('api/pay/', PayView.as_view(), name='pay'),
    path('api/product/<int:productId>/', ProductView.as_view(), name='product details'),
    path('api/user/', UserDetailsView.as_view(), name='user-details'),
]
