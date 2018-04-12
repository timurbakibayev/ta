from django.conf.urls import url, include
from django.contrib import admin
from cal import views
from cal import views_jwt
from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
    url(r'^$', views.index, name="index"),
    url(r'^index$', views.index, name="index"),
    url(r'^login', views.login, name="index"),
    url(r'^admin/', admin.site.urls),
    url(r'^auth-api/$', views_jwt.auth_api),
    url(r'^auth-api-default/$', obtain_jwt_token),
    url(r'^accidents/$', views.accident_list),
    url(r'^accidents/(?P<pk>[0-9]+)/$', views.accident_detail),
]
