# apps/users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class Roles(models.TextChoices):
    CLIENT = 'client'
    EXPERT = 'expert'
    ARBITRATOR = 'arbitrator'
    ADMIN = 'admin'
    FRANCHISEE = 'franchisee'

class User(AbstractUser):
    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.CLIENT)
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Телефон")
    telegram_id = models.BigIntegerField(null=True, blank=True)
    franchisee = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='clients')
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    frozen_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)


