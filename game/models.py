from django.db import models
from django.db.models.fields import UUIDField
from walax.models import WalaxModel
import uuid
from django.contrib.auth import get_user_model

USER = get_user_model()


class UUIDPrimaryKeyMixin(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class ArenaModel(WalaxModel, UUIDPrimaryKeyMixin):
    class Meta:
        abstract = True


class Player(ArenaModel):
    name = models.CharField(max_length=32)
    user = models.ForeignKey(USER, on_delete=models.CASCADE)


class Game(ArenaModel):
    owner = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="games")
    active = models.BooleanField(default=True)
    winner = models.ForeignKey(
        Player, on_delete=models.CASCADE, related_name="wins", null=True, blank=True
    )


class CreatureBase(ArenaModel):
    name = models.CharField(max_length=32)
    exp = models.IntegerField(default=0)
    hp = models.IntegerField(default=10)
    alignment = models.IntegerField(default=50)
    damage = models.IntegerField(default=1)


class Wizard(ArenaModel):
    base = models.ForeignKey(CreatureBase, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    player = models.ForeignKey(Player, on_delete=models.CASCADE)


class Creature(ArenaModel):
    base = models.ForeignKey(CreatureBase, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    wizard = models.ForeignKey(
        Wizard, on_delete=models.CASCADE, related_name="creatures"
    )
    hp = models.IntegerField(default=10)


class SpellBase(ArenaModel):
    name = models.CharField(max_length=32)
    alignment = models.IntegerField(default=0)
    exp = models.IntegerField(default=0)
    summon = models.BooleanField(default=False)
    creature = models.ForeignKey(
        CreatureBase, on_delete=models.CASCADE, null=True, blank=True
    )


class Spell(ArenaModel):
    base = models.ForeignKey(SpellBase, on_delete=models.CASCADE)
    wizard = models.ForeignKey(Wizard, on_delete=models.CASCADE)
    used = models.BooleanField(default=False)
