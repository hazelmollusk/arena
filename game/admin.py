from django.contrib import admin
from .models import *

# Register your models here.
for model in [
    Game,
    Cell,
    CreatureBase,
    Creature,
    Spell,
    SpellBase,
]:
    admin.site.register(model)
