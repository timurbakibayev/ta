from django.utils.datetime_safe import datetime
from rest_framework import serializers
from cal.models import Region
from cal.models import Accident
from django.contrib.auth.models import Group
from django.contrib.auth.models import User


class AccidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Accident
        fields = ('id',
                  'date',
                  'time',
                  'description',
                  'injured',
                  'killed',
                  'num_vehicles',
                  'num_persons',
                  'malfunction',
                  'alcohol',
                  'pedestrians',
                  'violation_code',
                  'w_seat_belts',
                  'w_o_seat_belts',
                  )
        read_only_fields = ('id',)


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Accident
        fields = ('id',
                  'name',
                  )
        read_only_fields = ('id', )

