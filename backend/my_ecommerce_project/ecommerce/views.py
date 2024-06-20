from . models import *
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import generics
from rest_framework.response import Response
from .serializers import *
from .filters import ProductFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework.exceptions import PermissionDenied
from django.views import View
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView


# Create your views here.


User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class AddToCartView(generics.UpdateAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        product_id = request.data.get("product_id")
        try:
            product = Product.objects.get(id=product_id)
            if product.seller == request.user:
                return Response({"detail": "You cannot add your own product to the cart."}, status=status.HTTP_400_BAD_REQUEST)
            cart, created = Cart.objects.get_or_create(user=request.user)
            if CartItem.objects.filter(cart=cart, product=product).exists():
                return Response({"detail": "Product already exists in the cart"}, status=status.HTTP_400_BAD_REQUEST)
            cart_item = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={'price_at_addition': product.price}
            )
            serializer = CartSerializer(cart)
            return Response({"detail": "Product added to cart.", "cart": serializer.data}, status=status.HTTP_200_OK)
        except product.DoesNotExist:
            return Response({"detail": "Product not found"}, status=status.HTTP_400_BAD_REQUEST)


class RemoveFromCartView(generics.UpdateAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        product_id = request.data.get("product_id")
        try:
            product = Product.objects.get(id=product_id)
            cart = Cart.objects.get(user=request.user)
            cart_item = CartItem.objects.get(cart=cart, product=product)
            cart_item.delete()
            return Response({"detail": "Product removed from cart"}, status=status.HTTP_200_OK)
        except product.DoesNotExist:
            return Response({"detail": "product not found"}, status=status.HTTP_404_NOT_FOUND)
        except cart.DoesNotExist:
            return Response({"detail": "cart not found"}, status=status.HTTP_404_NOT_FOUND)
        except cart_item.DoesNotExist:
            return Response({"detail": "cart item not found"}, status=status.HTTP_404_NOT_FOUND)


class CartView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        cart, created = Cart.objects.get_or_create(user=user)
        return cart


class PayView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user
        cart = Cart.objects.get(user=user)
        cart_items = cart.items.all()

        price_changes = []
        unavailable_items = []

        for item in cart_items:
            if item.product.price != item.price_at_addition:
                price_changes.append(item.product)
                #item.price_at_addition = item.product.price
                #item.save()
            elif item.product.status != 'on-sale':
                unavailable_items.append(item.product)

        if price_changes or unavailable_items:
            return Response({
                'price_changes': ProductSerializer(price_changes, many=True).data,
                'unavailable_items': ProductSerializer(unavailable_items, many=True).data
            }, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(
            user=user,
            total_price=cart.get_cart_total,
            status="completed")

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                price_at_purchase=item.product.price,

            )
            item.product.status = 'sold'
            item.product.buyer = user
            item.product.save()

        cart.items.all().delete()
        return Response({'detail': 'payment is successful and items are purchased',
                        'orders': OrderSerializer(order).data
                         }, status=status.HTTP_201_CREATED)


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = ProductFilter
    search_fields = ['title']
    permission_classes = [AllowAny]

    # def get_queryset(self):
    #     user = self.request.user
    #     if user.is_authenticated:
    #         return Product.objects.exclude(seller=user)
    #     else:
    #         return Product.objects.all()
    
class ProductView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, productId,format=None):
        try:
            product = Product.objects.get(id=productId)
            serializer = ProductSerializer(product)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
            
    


class ProductCreateView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductCreateSerializer
    permission_classes = [IsAuthenticated]


class ProductUpdateView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductUpdateSerializer
    permission_classes = [IsAuthenticated]

    # return the products owned by current user
    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user, status='on-sale')

    def perform_update(self, serializer):
        product = self.get_object()
        if product.seller != self.request.user:
            raise PermissionDenied(
                "you donot have permission to edit this product")
        serializer.save()


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.update(request.user, serializer.validated_data)
            return Response({"detail": "password changed successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserInventoryView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserInventorySerializer

    def get_object(self):
        return self.request.user


class PopulateDatabaseView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def post(self, request, *args, **kwargs):
        # clear existing data
        try:
            OrderItem.objects.all().delete()
            Order.objects.all().delete()
            CartItem.objects.all().delete()
            Cart.objects.all().delete()
            ShippingAddress.objects.all().delete()
            Product.objects.all().delete()
            User.objects.all().delete()
            
            for i in range(6):
                username = f"testuser{i+1}"
                email = f"{username}@shop.aa"
                password = f"pass{i+1}"
                user = User.objects.create_user(username=username, email= email, password= password)
                
                if i<3:
                    for j in range(10):
                        Product.objects.create(
                            title=f"product {j+1} from {username}",
                            description=f"description for product {j+1}",
                            price=f"{(j+1)*10}.00",
                            seller=user
                        )
            return JsonResponse({"message": "database populated with test data"})
        except Exception as e:
            print(e)
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
    

def populate_database(request):
    if request.method == "POST":
        try:
            OrderItem.objects.all().delete()
            Order.objects.all().delete()
            CartItem.objects.all().delete()
            Cart.objects.all().delete()
            ShippingAddress.objects.all().delete()
            Product.objects.all().delete()
            User.objects.all().delete()
            
            for i in range(6):
                username = f"testuser{i+1}"
                email = f"{username}@shop.aa"
                password = f"pass{i+1}"
                user = User.objects.create_user(username=username, email= email, password= password)
                
                if i<3:
                    for j in range(10):
                        Product.objects.create(
                            title=f"product {j+1} from {username}",
                            description=f"description for product {j+1}",
                            price=f"{(j+1)*10}.00",
                            seller=user
                        )

            return JsonResponse({"message": "Database populated with test data"})
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        
    
    
    
def landing_page(request):
    context = {}
    return render(request, 'main.html', context)


class ShippingAddressView(generics.CreateAPIView):
    queryset = Product.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ShippingAddressSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer