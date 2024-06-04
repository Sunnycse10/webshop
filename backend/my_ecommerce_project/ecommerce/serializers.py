from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from . models import *


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(
        required=True, validators=[validate_password])

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is not correct")
        return value

    def update(self, instance, validated_data):
        instance.set_password(validated_data['new_password'])
        instance.save()
        return instance


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class ProductUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ["price"]

    def validate(self, data):
        product = self.instance
        if product.status != "on-sale":
            raise serializers.ValidationError(
                "can not update price of a sold product")
        return data


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ['product']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items']


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'


class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['title', 'description', 'price']

    def create(self, validated_data):
        request = self.context.get('request', None)
        if request and hasattr(request, 'user'):
            validated_data['seller'] = request.user
        return super().create(validated_data)


class UserInventorySerializer(serializers.ModelSerializer):
    item_on_sale = serializers.SerializerMethodField()
    item_sold = serializers.SerializerMethodField()
    item_purchased = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["item_on_sale", "item_sold", "item_purchased"]

    def get_item_on_sale(self, obj):
        products = Product.objects.filter(seller=obj, status='on-sale')
        return ProductSerializer(products, many=True).data

    def get_item_sold(self, obj):
        products = Product.objects.filter(seller=obj, status='sold')
        return ProductSerializer(products, many=True).data

    def get_item_purchased(self, obj):
        products = Product.objects.filter(buyer=obj)
        return ProductSerializer(products, many=True).data


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = ["address", "city", "state", "zipcode"]

    def create(self, validated_data):
        request = self.context.get("request", None)
        if request and hasattr(request, "user"):
            validated_data["user"] = request.user

        return super().create(validated_data)
