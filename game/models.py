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

    def get_tree(self):
        base, isnew = CreatureBase.objects.get_or_create(name='Tree')
        base.name = 'Tree'
        base.exp = 1
        base.hp = 2
        base.move = 0
        base.save()
        tree = Creature.objects.create(base=base, hp=base.hp, game=self)
        return tree

    def get_mirk(self):
        base, isnew = CreatureBase.objects.get_or_create(name='Mirkwood')
        base.name = 'Mirkwood'
        base.exp = 1
        base.hp = 2
        base.move = 0
        base.save()
        tree = Creature.objects.create(base=base, hp=base.hp, game=self)
        return tree

    def generate_board(self):
        grid = {}
        for x in range(1, self.size + 1):
            for y in range(1, self.size + 1):
                t = randint(0, len(TILES) * 2)
                if t >= len(TILES):
                    t = randint(0, 1)
                if ((x in [2, self.size - 1]) and
                        (y in [2, self.size - 1])):
                    t = 1
                    pp(['wizard square', x, y, [2, self.size-1]])
                # todo: this works only for <=4 players
                pp([x, y, t])
                if not y in grid:
                    grid[y] = {}
                grid[y][x] = Cell.objects.create(game=self, x=x, y=y, tile=t)
        for i in range(1, randint(1, self.size)):
            tree = self.get_tree()
            tree.x = randint(1, self.size)
            tree.y = randint(1, self.size)
            if grid[tree.y][tree.x].tile < 2:
                tree.save()

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        cells = Cell.objects.filter(game=self)
        if not cells:
            self.generate_board()

    @action
    def go(self, req):
        return Response('go')


class CreatureBase(ArenaModel):
    name = models.CharField(max_length=32)
    exp = models.IntegerField(default=0)
    hp = models.IntegerField(default=10)
    alignment = models.IntegerField(default=50)
    damage = models.IntegerField(default=1)
    move = models.IntegerField(default=2)


class Creature(ArenaModel):
    base = models.ForeignKey(CreatureBase, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    user = models.ForeignKey(USER, null=True, blank=True,
                             on_delete=models.CASCADE,
                             related_name="creatures")
    hp = models.IntegerField(default=10)
    move = models.IntegerField(default=2)
    exp = models.IntegerField(default=0)
    x = models.PositiveSmallIntegerField(default=0)
    y = models.PositiveSmallIntegerField(default=0)


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
