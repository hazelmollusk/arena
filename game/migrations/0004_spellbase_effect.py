# Generated by Django 4.0rc1 on 2021-12-12 16:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0003_creature_cast_alter_spellbase_target_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='spellbase',
            name='effect',
            field=models.PositiveSmallIntegerField(choices=[(0, 'Fireball')], default=0),
        ),
    ]
