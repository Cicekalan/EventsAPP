# Generated by Django 5.0.7 on 2024-08-05 13:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0004_userevet'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserEvent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('userId', models.CharField(max_length=100)),
                ('eventId', models.IntegerField()),
            ],
        ),
        migrations.DeleteModel(
            name='UserEvet',
        ),
    ]
