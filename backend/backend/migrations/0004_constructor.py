# Generated by Django 5.1 on 2024-08-14 20:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0003_result'),
    ]

    operations = [
        migrations.CreateModel(
            name='Constructor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('constructor_id', models.IntegerField()),
                ('constructorRef', models.CharField(max_length=100)),
                ('constructor_name', models.CharField(max_length=100)),
            ],
        ),
    ]
