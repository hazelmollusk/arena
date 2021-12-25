# Generated by Django 4.0rc1 on 2021-12-24 21:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0007_spellbase_repeat'),
    ]

    operations = [
        migrations.AddField(
            model_name='creaturebase',
            name='summon_message',
            field=models.CharField(blank=True, max_length=64, null=True),
        ),
        migrations.AddField(
            model_name='creaturebase',
            name='summon_name',
            field=models.CharField(blank=True, max_length=32, null=True),
        ),
        migrations.AddField(
            model_name='spellbase',
            name='level',
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='creaturebase',
            name='alignment',
            field=models.SmallIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='creaturebase',
            name='hp',
            field=models.PositiveSmallIntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='spellbase',
            name='alignment',
            field=models.SmallIntegerField(default=0),
        ),
    ]
