# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2018-04-12 20:35
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cal', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='accident',
            name='region',
            field=models.IntegerField(default=0),
        ),
    ]