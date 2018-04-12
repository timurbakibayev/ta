import random

from django.db import models
from django.contrib.auth.models import User
from django.utils.datetime_safe import datetime
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from django.utils.datetime_safe import date

from cal.emails import send_verification_email
from cal.emails import send_invitation_email
from ta import settings


class Region(models.Model):
    name = models.CharField(max_length=100)


class Accident(models.Model):
    region = models.IntegerField(default=0)
    date = models.DateField()
    time = models.TimeField()
    description = models.TextField(max_length=5000)
    injured = models.IntegerField(default=0)
    killed = models.IntegerField(default=0)
    num_vehicles = models.IntegerField(default=2)
    num_persons = models.IntegerField(default=2)
    malfunction = models.BooleanField(default=False)
    alcohol = models.BooleanField(default=False)
    pedestrians = models.IntegerField(default=0)
    violation_code = models.CharField(max_length=10, blank=True, null=True)
    w_seat_belts = models.IntegerField(default=2)
    w_o_seat_belts = models.IntegerField(default=0)

    def __str__(self):
        return str(self.date)+": " + self.description[:50]

    class Meta:
        ordering = ["date","time"]
