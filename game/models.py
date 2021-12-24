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

PHASES = (
    (0, 'joining'),
    (1, 'play'),
    (2, 'ended')
)

WIZ_NAMES = ('Iskander', 'Crowley', 'Radagast', 'Raistlin')


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


class GamePlayer(models.Model):
    user = models.ForeignKey(USER, on_delete=models.CASCADE)
    game = models.ForeignKey('Game', on_delete=models.CASCADE)
    alive = models.BooleanField(default=True)


class Game(ArenaModel):
    name = models.CharField(max_length=32)
    owner = models.ForeignKey(
        USER, on_delete=models.CASCADE, related_name="arena_games_owned")
    phase = models.PositiveSmallIntegerField(default=0, choices=PHASES)
    max_players = models.PositiveSmallIntegerField(default=4)
    players = models.ManyToManyField(
        USER, blank=True, through='GamePlayer', related_name='arena_games')
    winner = models.ForeignKey(
        USER, on_delete=models.CASCADE, related_name="wins", null=True, blank=True
    )
    current = models.ForeignKey(
        USER, on_delete=models.CASCADE, related_name="turns", null=True, blank=True
    )

    size = models.PositiveSmallIntegerField(default=20)

    def __str__(self):
        return 'Game: %s' % self.name

    def get_tree(self):
        base, isnew = CreatureBase.objects.get_or_create(name='Tree')
        base.name = 'Tree'
        base.exp = 1
        base.hp = 1
        base.moves = 0
        base.icon = 'tree'
        base.save()
        tree = Creature.objects.create(base=base, hp=base.hp, game=self)
        return tree

    def get_mirk(self):
        base, isnew = CreatureBase.objects.get_or_create(name='Mirkwood')
        base.name = 'Mirkwood'
        base.exp = 5
        base.hp = 2
        base.moves = 0
        base.icon = 'mirkwood'
        base.save()
        tree = Creature.objects.create(base=base, hp=base.hp, game=self)
        return tree

    def get_wiz(self, x, y, user):
        base, isnew = CreatureBase.objects.get_or_create(name='Wizard')
        base.name = 'Wizard'
        base.exp = 0
        base.hp = 2
        base.moves = 2
        base.icon = 'wizard'
        base.save()
        wiz_name = WIZ_NAMES[randint(0, len(WIZ_NAMES)-1)]
        wiz = Creature.objects.create(
            base=base, hp=base.hp, game=self, name=wiz_name, x=x, y=y, user=user, moves=base.moves)
        spells = SpellBase.objects.all()
        if len(spells):
            for i in range(0, 30):
                base = spells[randint(0, len(spells)-1)]
                spell = Spell.objects.create(base=base, creature=wiz)

        return wiz

    def generate_board(self):
        grid = {}
        trees = []
        for x in range(1, self.size + 1):
            for y in range(1, self.size + 1):
                t = randint(0, len(TILES) * 2)
                if t >= len(TILES):
                    t = randint(0, 1)
                if ((x in [2, self.size - 1]) and
                        (y in [2, self.size - 1])):
                    t = 1
                # todo: this works only for <=4 players
                if not y in grid:
                    grid[y] = {}
                grid[y][x] = Cell.objects.create(game=self, x=x, y=y, tile=t)
        for i in range(1, randint(0, self.size)):
            tree = self.get_tree() if randint(0, 2) else self.get_mirk()
            tree.x = randint(1, self.size)
            tree.y = randint(1, self.size)
            if grid[tree.y][tree.x].tile < 2:
                tree.save()
                trees.append(tree)
                # fixme: check for existing tree

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        cells = Cell.objects.filter(game=self)
        if not cells:
            self.generate_board()

    @action
    def join(self, req):
        players = self.players.all()
        pp(['join', {'game': self, 'user': req.user,
           'current': len(players), 'max': self.max_players}])
        if len(self.players.all()) < self.max_players:
            self.players.add(req.user)
            print('joined!')
        else:
            print('game is full!')
            return 'no'
        return 'go'

    @action
    def start(self, req):
        players = self.players.all()
        self.current = players[0]
        # fixme add more than four
        positions = [
            (2, 2), (self.size-1, self.size-1), (2, self.size-1), (self.size-1, 2)
        ]
        for player in players:
            pos = positions.pop(0)
            wiz = self.get_wiz(*pos, user=player)
            pp([wiz, pos])
        self.phase = 1
        self.save()
        print('game is started!')
        return 'started'

    def set_current(self, player):
        pp(['setting player', player])
        self.current = player
        for creature in Creature.objects.filter(user=player, game=self, alive=True):
            creature.moves = creature.base.moves
            creature.cast = False
            pp(['resetting moves', creature, creature.moves])
            creature.save()

    def checkAlive(self):
        players = GamePlayer.objects.filter(
            game=self, alive=True)
        ret = []
        for player in players:
            dead = True
            creatures = Creature.objects.filter(game=self, user=player.user)
            for creature in creatures:
                if creature.name in WIZ_NAMES and creature.alive:
                    dead = False
            if dead:
                gp = GamePlayer.objects.filter(game=self, user=player.user)
                gp.dead = True
                gp.save()
            else:
                ret.append(player.user)
        # TODO check to see if game is over
        return ret

    @action
    def endturn(self, req):
        if req.user != self.current:
            pp([req.user, self.current])
            return 'not your turn'
        players = self.checkAlive()

        nextup = 0
        for i in range(0, len(players)):
            #player = w.obj.User.cached(i)
            if players == self.current:
                nextup = 0 if (i == len(players)-1) else i+1
        self.set_current(players[nextup])
        pp(['next turn', self.current])
        self.save()

        creatures = Creature.objects.filter(game=self, user=self.current)
        for creature in creatures:
            pp(['resetting moves', creature, creature.base.moves])
            creature.moves = creature.base.moves
        pp(['end turn, next up', self, self.current])
        return 'next'


class CreatureBase(ArenaModel):
    name = models.CharField(max_length=32)
    summon_name = models.CharField(max_length=32, blank=True, null=True)
    summon_message = models.CharField(max_length=64, blank=True, null=True)
    hp = models.PositiveSmallIntegerField(default=1)
    alignment = models.SmallIntegerField(default=0)
    damage = models.PositiveSmallIntegerField(default=1)
    moves = models.PositiveSmallIntegerField(default=2)
    icon = models.CharField(max_length=20)
    spells = models.ManyToManyField('SpellBase', null=True, blank=True)

    def __str__(self):
        return 'CreatureBase: %s' % self.name

    def get_creature(self):
        creature = Creature()
        creature.base = self
        creature.hp = self.hp
        creature.moves = self.moves
        creature.damage = self.damage
        if self.summon_name:
            creature.name = self.summon_name
        return creature


class Creature(ArenaModel):

    name = models.CharField(max_length=32, blank=True, null=True)
    base = models.ForeignKey(CreatureBase, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    user = models.ForeignKey(USER, null=True, blank=True,
                             on_delete=models.CASCADE,
                             related_name="creatures")
    hp = models.PositiveSmallIntegerField(default=1)
    moves = models.PositiveSmallIntegerField(default=0)
    damage = models.PositiveSmallIntegerField(default=0)
    x = models.PositiveSmallIntegerField(default=0)
    y = models.PositiveSmallIntegerField(default=0)
    alive = models.BooleanField(default=True)
    cast = models.BooleanField(default=False)
    align = models.IntegerField(default=0)

    def __str__(self):
        return '%s' % self.name if self.name else self.base.name

    @action
    def move(self, req):
        xx, yy = int(req.query_params['x']), int(req.query_params['y'])
        newx, newy = self.x + xx, self.y + yy
        game = self.game

        pp(['moving to', xx, newx, yy, newy])
        if ((abs(xx) > 1) or (abs(yy) > 1)):
            pp(['move : invalid move', xx, yy])
            return 'no'
        if newx < 1 or newy < 1:
            pp('move : off grid')
            return 'no'
        if newx > game.size or newy > game.size:
            pp('move : off grid')
            return 'no'
        # what about tiles that take 2 moves TODO
        if not self.moves:
            pp('move : no moves')
            return 'no'
        cells = Cell.objects.filter(game=game)
        creatures = Creature.objects.filter(game=game)
        safe = False
        for cell in cells:
            if cell.x == newx and cell.y == newy:
                if cell.tile < 2:
                    safe = True
        for creature in Creature.objects.filter(game=game):
            if newx == creature.x and newy == creature.y:
                safe = False
                if creature.user != self.user:
                    return self.combat(creature)
                return 'fail'
        if not safe:
            print('move : not safe square')
            return 'no'
        self.x, self.y = newx, newy
        self.moves -= 1  # todo terrain
        self.save()
        print('move : moved!')
        return 'yes'

    def combat(self, creature):
        # TODO special features?
        creature.take_damage(self.damage)
        print('combat')
        self.moves = 0
        self.save()
        return "fought"

    def take_damage(self, damage):
        pp(['damage', self.hp, damage])
        self.hp -= damage
        if self.hp <= 0:
            self.alive = False
        self.save()


TARGET_TYPES = (
    (0, 'Summon'),
    (1, 'Adjacent'),
    (2, 'LOS'),
    (3, 'Creature'),
    (4, 'Any'),
    (5, 'None'),
)

EFFECT_TYPES = (
    (0, 'Summon'),
    (1, 'Fireball'),
    (2, 'Strength')
)


class SpellBase(ArenaModel):
    name = models.CharField(max_length=32)
    alignment = models.SmallIntegerField(default=0)
    level = models.PositiveSmallIntegerField(default=0)
    target_type = models.PositiveSmallIntegerField(
        choices=TARGET_TYPES, default=0)
    summons = models.ForeignKey(
        CreatureBase,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="spellbase",
    )
    effect = models.PositiveSmallIntegerField(
        choices=EFFECT_TYPES, default=0)
    repeat = models.BooleanField(default=False)

    def __str__(self):
        return 'SpellBase: %s' % self.name


class Spell(ArenaModel):
    base = models.ForeignKey(SpellBase, on_delete=models.CASCADE)
    used = models.BooleanField(default=False)
    creature = models.ForeignKey(
        Creature, on_delete=models.CASCADE, related_name="spells"
    )

    def __str__(self):
        return '%s/%s' % (self.base.name, self.creature)

    @action
    def cast(self, req):
        base, creature = self.base, self.creature
        if creature.cast or creature.moves < 1:
            return 'fail'
        xx, yy = 0, 0
        if base.target_type != 5:
            xx, yy = int(req.query_params['x']), int(req.query_params['y'])
            pp(['casting', self.base.name, xx, yy])
            if base.target_type in (0, 1):
                dx = abs(creature.x - xx)
                dy = abs(creature.y - yy)
                if dx > 1 or dy > 1:
                    print('summon too far')
                    return 'fail'
            elif base.target_type == 2:
                pass  # FIXME
            elif base.target_type == 3:
                target = Creature.objects.get(
                    game=self.creature.game, x=xx, y=yy)
                if not target:
                    return 'fail'
        else:
            print('no target '+base.name)
        ret = self.cast_real(creature, xx, yy)
        if not self.base.repeat:
            self.used = True
        self.save()
        creature.cast = True
        creature.save()
        if not ret:
            return 'fail'
        return ret

    def check_cast(self, creature):
        if not self.creature.base.name == 'Wizard':
            print('not a wizard')
            return True
        return True

    def cast_real(self, creature, x, y):
        pp(['casting', creature, self, x, y])
        if not self.check_cast(creature):
            return False
        base = self.base
        # summons
        if base.target_type == 0:
            # should use get_creature FIXME
            newc = Creature.objects.create(
                base=self.base.summons,
                game=self.creature.game,
                user=self.creature.user,
                hp=self.base.summons.hp,
                moves=0,
                damage=self.base.summons.damage,
                x=x,
                y=y,
                cast=False if base.repeat else True
            )
            if base.repeat:
                newc.cast = False
            newc.save()
            return True
        else:
            # non-summon spells
            try:
                target = Creature.objects.get(
                    game=creature.game, x=x, y=y)
            except:
                target = False
            pp(['cast_real', base.name, base.effect])
            if base.effect == 1:
                print('fireball', base.name)
                target.take_damage(3)
            elif base.effect == 2:
                print('strength', target)
                target.damage += 3
                target.hp += 3
                print(target.damage, target.hp)
                target.save()
                target = Creature.objects.get(
                    game=creature.game, x=x, y=y)
                print(target.damage, target.hp)
            return True
