from django.contrib import admin
from cal.models import Accident
from cal.models import Region

admin.site.register(Region)
admin.site.register(Accident)
