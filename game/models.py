from django.db import models
from django.db.models.fields import UUIDField
from walax.models import WalaxModel
from walax.decorators import action
import uuid
from django.contrib.auth import get_user_model
from datetime import timedelta
from rest_framework.response import Response
from pprint import pp
from random import randint

USER = get_user_model()

TILES = (
    (0, 'Grass'),
    (1, 'Plains'),
    (2, 'Water'),
    (3, 'Rock'),
)


class UUIDPrimaryKeyMixin(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class ArenaModel(WalaxModel, UUIDPrimaryKeyMixin):
    class Meta:
        abstract = True


class Cell(ArenaModel):
    game = models.ForeignKey('Game', on_delete=models.CASCADE)
    x = models.PositiveSmallIntegerField()
    y = models.PositiveSmallIntegerField()
    tile = models.PositiveSmallIntegerField(choices=TILES)
    burnt = models.BooleanField(default=False)

    def __str__(self):
        return '%s, %s' % (self.x, self.y)


PHASES = (
    (0, 'joining'),
    (1, 'play'),
    (2, 'ended')
)


class Game(ArenaModel):
    name = models.CharField(max_length=32)
    owner = models.ForeignKey(
        USER, on_delete=models.CASCADE, related_name="games")
    active = models.BooleanField(default=True)
    phase = models.PositiveSmallIntegerField(default=0, choices=PHASES)
    players = models.PositiveSmallIntegerField(default=4)
    winner = models.ForeignKey(
        USER, on_delete=models.CASCADE, related_name="wins", null=True, blank=True
    )
    size = models.PositiveSmallIntegerField(default=20)

    def generate_board(self):
        for x in range(1, self.size + 1):
            for y in range(1, self.size + 1):
                t = randint(0, len(TILES) * 2)
                if t >= len(TILES):
                    t = randint(0, 1)
                c = Cell.objects.create(game=self, x=x, y=y, tile=t)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        cells = Cell.objects.filter(game=self)
        if not cells:
            self.generate_board()

    @ action
    def start(self, req):
        print('starting')
        return 'start'

    @ action
    def join(self, req):
        print('joining')
        pp(req.user)
        return 'joining'

    @ action
    def asdf(self, req):
        print('asdf')
        return 'asdf'


class CreatureBase(ArenaModel):
    name = models.CharField(max_length=32)
    exp = models.IntegerField(default=0)
    hp = models.IntegerField(default=10)
    alignment = models.IntegerField(default=50)
    damage = models.IntegerField(default=1)


class Creature(ArenaModel):
    base = models.ForeignKey(CreatureBase, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    user = models.ForeignKey(
        USER, on_delete=models.CASCADE, related_name="creatures")
    hp = models.IntegerField(default=10)
    exp = models.IntegerField(default=0)
    x = models.PositiveSmallIntegerField()
    y = models.PositiveSmallIntegerField()


class Wizard(Creature):
    name = models.CharField(max_length=32)


class SpellBase(ArenaModel):
    name = models.CharField(max_length=32)
    alignment = models.IntegerField(default=0)
    exp = models.IntegerField(default=0)
    summon = models.BooleanField(default=False)
    summon_creature = models.ForeignKey(
        CreatureBase,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="summons",
    )


class Spell(ArenaModel):
    base = models.ForeignKey(SpellBase, on_delete=models.CASCADE)
    used = models.BooleanField(default=False)
    creature = models.ForeignKey(
        Creature, on_delete=models.CASCADE, related_name="spells"
    )
