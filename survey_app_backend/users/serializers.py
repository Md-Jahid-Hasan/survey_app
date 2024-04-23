from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model as User


class UserDetailsSerializer(serializers.ModelSerializer):
    """Serializer for user details. Returns fields with username, email and is_staff."""
    class Meta:
        model = User()
        fields = ['name', 'email', 'is_staff']


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Serializer for the user token/login. As a login user will get a new token and user details by using
    UserDetailsSerializer."""
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserDetailsSerializer(self.user).data

        for k, v in serializer.items():
            data[k] = v

        return data


class UserCreateSerializer(serializers.ModelSerializer):
    """User create serializer. Recieve data email, name, password and password1(same as password). Override validate
    method to check if both password are same."""
    password1 = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = User()
        fields = ['pk', 'name', 'email', 'password', 'password1']
        extra_kwargs = {
            'password': {'write_only': True},
            'pk': {'read_only': True}
        }

    def validate(self, attrs):
        if attrs['password1'] != attrs['password']:
            raise serializers.ValidationError({'password': "Password Don't match"})
        return attrs

    def create(self, validated_data):
        """Remove password1 field because this is not part of model"""
        validated_data.pop('password1')
        return super().create(validated_data)


