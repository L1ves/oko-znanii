from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'role', 'phone', 'telegram_id', 'balance', 'frozen_balance',
            'date_joined', 'last_login'
        ]
        read_only_fields = ['email', 'date_joined', 'last_login']

class UserCreateSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    role = serializers.ChoiceField(choices=[('client', 'Клиент'), ('expert', 'Специалист')])
    phone = serializers.CharField(required=False, allow_blank=True)
    about = serializers.CharField(required=False, allow_blank=True)
    education = serializers.CharField(required=False, allow_blank=True)
    experience_years = serializers.IntegerField(required=False, min_value=0, max_value=50)
    hourly_rate = serializers.DecimalField(required=False, max_digits=10, decimal_places=2, min_value=0)
    specializations = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Пользователь с таким именем уже существует.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Пароли не совпадают"})
        
        # Валидация для специалистов
        if attrs.get('role') == 'expert':
            if not attrs.get('about'):
                raise serializers.ValidationError({"about": "Для специалистов обязательно указать информацию о себе"})
            if not attrs.get('education'):
                raise serializers.ValidationError({"education": "Для специалистов обязательно указать образование"})
            if attrs.get('experience_years') is None:
                raise serializers.ValidationError({"experience_years": "Для специалистов обязательно указать опыт работы"})
            if attrs.get('hourly_rate') is None:
                raise serializers.ValidationError({"hourly_rate": "Для специалистов обязательно указать часовую ставку"})
            if not attrs.get('specializations'):
                raise serializers.ValidationError({"specializations": "Для специалистов обязательно указать специализации"})
        
        return attrs

    def create(self, validated_data):
        # Извлекаем поля, которые не относятся к модели User
        specializations = validated_data.pop('specializations', [])
        about = validated_data.pop('about', '')
        education = validated_data.pop('education', '')
        experience_years = validated_data.pop('experience_years', 0)
        hourly_rate = validated_data.pop('hourly_rate', 0)
        validated_data.pop('password2')
        
        # Создаем пользователя
        user = User.objects.create_user(**validated_data)
        
        # Если это специалист, создаем специализации
        if user.role == 'expert' and specializations:
            from apps.catalog.models import Subject
            from apps.experts.models import Specialization
            
            for spec_name in specializations:
                # Ищем или создаем предмет
                subject, created = Subject.objects.get_or_create(
                    name=spec_name,
                    defaults={'description': f'Предмет: {spec_name}'}
                )
                
                # Создаем специализацию
                Specialization.objects.create(
                    expert=user,
                    subject=subject,
                    experience_years=experience_years,
                    hourly_rate=hourly_rate,
                    description=about
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