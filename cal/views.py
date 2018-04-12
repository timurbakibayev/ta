from django.shortcuts import render
from django.db.models import Q
from django.utils.datetime_safe import datetime
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from cal.serializers import RegionSerializer
from cal.serializers import AccidentSerializer
from rest_framework.response import Response
from rest_framework import status, permissions
from cal.models import Region
from cal.models import Accident
from django.utils.deprecation import MiddlewareMixin


class DisableCsrfCheck(MiddlewareMixin):
    def process_request(self, req):
        attr = '_dont_enforce_csrf_checks'
        if not getattr(req, attr, False):
            setattr(req, attr, True)


def login(request):
    context = {"message": "Hello, world!"}
    return render(request, "login.html", context)


def index(request):
    context = {"today": datetime.now(), "autocomplete" : []}
    return render(request, "index.html", context)


@api_view(['GET', 'POST'])
@permission_classes((AllowAny,))
def accident_list(request):
    if request.method == 'GET':
        accidents = Accident.objects.all()
        if request.GET.get("search"):
            txt = request.GET.get("search")
            for word in txt.lower().split():
                accidents = accidents.filter(Q(description__contains=word))
        if request.GET.get("date_from"):
            date_from = request.GET.get("date_from").strip()
            accidents = accidents.filter(date__gte=date_from)
        if request.GET.get("date_to"):
            date_to = request.GET.get("date_to").strip()
            accidents = accidents.filter(date__lte=date_to)
        if request.GET.get("time_from"):
            time_from = request.GET.get("time_from").strip()
            accidents = accidents.filter(time__gte=time_from)
        if request.GET.get("time_to"):
            time_to = request.GET.get("time_to").strip()
            accidents = accidents.filter(time__lte=time_to)
        serializer = AccidentSerializer(accidents, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = AccidentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def accident_detail(request, pk):
    try:
        accident = Accident.objects.get(pk=pk)
    except Accident.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = AccidentSerializer(accident)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = AccidentSerializer(accident, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        accident.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
