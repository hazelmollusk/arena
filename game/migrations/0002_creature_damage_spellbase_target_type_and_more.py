# Generated by Django 4.0rc1 on 2021-12-06 19:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='creature',
            name='damage',
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='spellbase',
            name='target_type',
            field=models.PositiveSmallIntegerField(choices=[(0, 'None'), (1, 'Adjacent'), (2, 'LOS'), (3, 'Creature'), (4, 'Any')], default=0),
        ),
        migrations.AlterField(
            model_name='creature',
            name='hp',
            field=models.PositiveSmallIntegerField(default=10),
        ),
        migrations.AlterField(
            model_name='creature',
            name='moves',
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='creaturebase',
            name='damage',
            field=models.PositiveSmallIntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='creaturebase',
            name='hp',
            field=models.PositiveSmallIntegerField(default=10),
        ),
        migrations.AlterField(
            model_name='creaturebase',
            name='moves',
            field=models.PositiveSmallIntegerField(default=2),
        ),
    ]
