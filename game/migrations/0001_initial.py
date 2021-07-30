# Generated by Django 3.2.5 on 2021-07-30 13:06

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=32)),
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
                ('exp', models.IntegerField(default=0)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Wizard',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=32)),
                ('alignment', models.IntegerField(default=50)),
                ('exp', models.IntegerField(default=0)),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='game.game')),
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
                ('wizard', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='game.wizard')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='game',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='game.player'),
        ),
    ]
