# Generated by Django 3.2.8 on 2021-10-31 14:01

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Creature',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, max_length=32, null=True)),
                ('hp', models.IntegerField(default=10)),
                ('moves', models.IntegerField(default=0)),
                ('x', models.PositiveSmallIntegerField(default=0)),
                ('y', models.PositiveSmallIntegerField(default=0)),
                ('alive', models.BooleanField(default=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='CreatureBase',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=32)),
                ('hp', models.IntegerField(default=10)),
                ('alignment', models.IntegerField(default=50)),
                ('damage', models.IntegerField(default=1)),
                ('moves', models.IntegerField(default=2)),
                ('icon', models.CharField(max_length=20)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=32)),
                ('phase', models.PositiveSmallIntegerField(choices=[(0, 'joining'), (1, 'play'), (2, 'ended')], default=0)),
                ('max_players', models.PositiveSmallIntegerField(default=4)),
                ('size', models.PositiveSmallIntegerField(default=20)),
                ('current', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='turns', to=settings.AUTH_USER_MODEL)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='arena_games_owned', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SpellBase',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=32)),
                ('alignment', models.IntegerField(default=0)),
                ('summons', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='spellbase', to='game.creaturebase')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Spell',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('used', models.BooleanField(default=False)),
                ('base', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='game.spellbase')),
                ('creature', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='spells', to='game.creature')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='GamePlayer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='game.game')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='game',
            name='players',
            field=models.ManyToManyField(blank=True, related_name='arena_games', through='game.GamePlayer', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='game',
            name='winner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='wins', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='creaturebase',
            name='spells',
            field=models.ManyToManyField(blank=True, null=True, to='game.SpellBase'),
        ),
        migrations.AddField(
            model_name='creature',
            name='base',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='game.creaturebase'),
        ),
        migrations.AddField(
            model_name='creature',
            name='game',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='game.game'),
        ),
        migrations.AddField(
            model_name='creature',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='creatures', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Cell',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('x', models.PositiveSmallIntegerField()),
                ('y', models.PositiveSmallIntegerField()),
                ('tile', models.PositiveSmallIntegerField(choices=[(0, 'Grass'), (1, 'Plains'), (2, 'Water'), (3, 'Rock')])),
                ('burnt', models.BooleanField(default=False)),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='game.game')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
