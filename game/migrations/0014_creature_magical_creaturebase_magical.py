# Generated by Django 4.0rc1 on 2021-12-25 23:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0013_creature_flying_creaturebase_flying'),
    ]

    operations = [
        migrations.AddField(
            model_name='creature',
            name='magical',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='creaturebase',
            name='magical',
            field=models.BooleanField(default=False),
        ),
    ]
