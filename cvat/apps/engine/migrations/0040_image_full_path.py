# Generated by Django 3.1.1 on 2021-03-23 04:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('engine', '0039_data_dataset_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='full_path',
            field=models.CharField(default='', max_length=1024),
        ),
    ]
