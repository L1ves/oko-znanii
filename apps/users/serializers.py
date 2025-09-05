from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    specializations = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'role', 'phone', 'telegram_id', 'balance', 'frozen_balance',
            'date_joined', 'last_login', 'specializations'
        ]
        read_only_fields = ['email', 'date_joined', 'last_login']
    
    def get_specializations(self, obj):
        """Возвращает специализации только для экспертов"""
        if obj.role == 'expert':
            from apps.experts.serializers import SpecializationSerializer
            return SpecializationSerializer(obj.specializations.all(), many=True).data
        return []

class UserCreateSerializer(serializers.Serializer):
    # MVP: упрощенная регистрация
    email = serializers.EmailField(required=False)
    phone = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    role = serializers.ChoiceField(choices=[('client', 'Клиент'), ('expert', 'Специалист')])

    def validate(self, attrs):
        # Должен быть email или телефон
        if not attrs.get('email') and not attrs.get('phone'):
            raise serializers.ValidationError({"contact": "Укажите email или телефон"})
        # Пароли совпадают
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Пароли не совпадают"})
        # Уникальность email при наличии
        email = attrs.get('email')
        if email and User.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "Пользователь с таким email уже существует."})
        return attrs

    def create(self, validated_data):
        email = validated_data.get('email', '')
        phone = validated_data.get('phone', '')
        password = validated_data.get('password')
        role = validated_data.get('role')
        # Удаляем вспомогательные поля
        validated_data.pop('password2', None)

        # Генерируем username: email до @ или телефон
        if email:
            base_username = email.split('@')[0]
        elif phone:
            base_username = phone
        else:
            base_username = 'user'

        username = base_username
        suffix = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{suffix}"
            suffix += 1

        user = User.objects.create_user(
            username=username,
            email=email or None,
            phone=phone or None,
            password=password,
            role=role,
        )

        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'telegram_id']

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    new_password2 = serializers.CharField()

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Пароли не совпадают"})
        return attrs

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data 