# Generated by Django 4.0rc1 on 2021-12-05 22:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0002_spellbase_level'),
    ]

    operations = [
        migrations.AddField(
            model_name='creature',
            name='damage',
            field=models.IntegerField(default=1),
        ),
    ]
