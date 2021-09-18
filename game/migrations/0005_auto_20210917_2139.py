# Generated by Django 3.2.6 on 2021-09-17 21:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('game', '0004_auto_20210917_1807'),
    ]

    operations = [
        migrations.AddField(
            model_name='creature',
            name='move',
            field=models.IntegerField(default=2),
        ),
        migrations.AddField(
            model_name='creaturebase',
            name='move',
            field=models.IntegerField(default=2),
        ),
        migrations.AlterField(
            model_name='cell',
            name='tile',
            field=models.PositiveSmallIntegerField(choices=[(0, 'Grass'), (1, 'Plains'), (2, 'Water'), (3, 'Rock')]),
        ),
        migrations.AlterField(
            model_name='creature',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='creatures', to=settings.AUTH_USER_MODEL),
        ),
    ]
