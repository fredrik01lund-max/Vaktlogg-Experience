"""Hvor havner objekter i sluttbildet? Skriver skjermposisjonene (andel av bredde og høyde) inn i en JSON-fil,
så presentasjonen kan legge tekst nøyaktig ved dem.

  blender --background --factory-startup --python blender/projiser.py -- <fil.blend> <ut.json> <nøkkel> <prefiks> [sekund]
Eksempel: … -- blender/hopping_spor.blend src/lib/hopping.json bonger "Bong " 11.9
"""

import json
import os
import sys

import bpy
from bpy_extras.object_utils import world_to_camera_view

args = sys.argv[sys.argv.index("--") + 1 :]
blend, ut, nokkel, prefiks = args[:4]
sekund = float(args[4]) if len(args) > 4 else None
bpy.ops.wm.open_mainfile(filepath=os.path.abspath(blend))
sc = bpy.context.scene
sc.frame_set(sc.frame_end if sekund is None else int(round(sekund * sc.render.fps)) + 1)
dg = bpy.context.evaluated_depsgraph_get()
cam = sc.camera.evaluated_get(dg)
punkter = []
for o in sorted((o for o in sc.objects if o.name.startswith(prefiks)), key=lambda o: o.name):
    oe = o.evaluated_get(dg)
    v = world_to_camera_view(sc, cam, oe.matrix_world.translation)
    punkter.append({"navn": o.name, "x": round(v.x, 4), "y": round(1 - v.y, 4)})
data = {}
if os.path.exists(ut):
    with open(ut, encoding="utf-8") as fh:
        data = json.load(fh)
data[nokkel] = punkter
with open(ut, "w", encoding="utf-8") as fh:
    json.dump(data, fh, indent=2, ensure_ascii=False)
print("projisert", len(punkter), "→", ut)
