# Generated by Django 3.1.1 on 2021-03-19 03:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('engine', '0038_data_tag'),
    ]

    operations = [
        migrations.AddField(
            model_name='data',
            name='dataset_id',
            field=models.PositiveIntegerField(blank=True, default=None, null=True),
        ),
    ]
