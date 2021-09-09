# Generated by Django 3.2.6 on 2021-09-08 17:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0002_game_size'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='phase',
            field=models.PositiveSmallIntegerField(choices=[(0, 'joining'), (1, 'play'), (2, 'ended')], default=0),
        ),
        migrations.AddField(
            model_name='game',
            name='players',
            field=models.PositiveSmallIntegerField(default=4),
        ),
        migrations.AlterField(
            model_name='spellbase',
            name='summon_creature',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='summons', to='game.creaturebase'),
        ),
    ]
