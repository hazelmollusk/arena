# Generated by Django 4.0rc1 on 2021-12-25 16:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0009_alter_creature_hp_alter_creature_moves'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='creaturebase',
            name='summon_name',
        ),
    ]
