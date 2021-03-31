# Generated by Django 3.1.1 on 2021-03-16 11:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('engine', '0036_auto_20201119_1841'),
    ]

    operations = [
        migrations.CreateModel(
            name='DatasetId',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.CharField(max_length=1024)),
                ('data', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='dataset_ids', to='engine.data')),
            ],
            options={
                'default_permissions': (),
            },
        ),
    ]