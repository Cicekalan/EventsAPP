# Generated by Django 5.0.7 on 2024-08-03 17:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0002_event_address_event_city_event_latitude_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='event',
            name='address',
        ),
        migrations.RemoveField(
            model_name='event',
            name='city',
        ),
        migrations.RemoveField(
            model_name='event',
            name='latitude',
        ),
        migrations.RemoveField(
            model_name='event',
            name='longitude',
        ),
        migrations.RemoveField(
            model_name='event',
            name='state',
        ),
        migrations.RemoveField(
            model_name='event',
            name='zip_code',
        ),
    ]