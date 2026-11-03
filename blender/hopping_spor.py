"""Frem og tilbake – kula spretter mellom innsikt og prototype (erstatter hopping.py fra 3.11).

Regi (12 s):
  N1 0–1,4 s   Lav vinkel langs de to banene i varmt kveldslys fra venstre (samme lysretning som åpningen).
               Banene går ut av bildet i begge ender. Kula faller inn og klemmes ved første nedslag.
  N2 1,4–8,6 s Ti nedslag, fem par: innsikt → prototype. Hvert nedslag på prototypebanen skriver ut en liten bong
               med datoen (22.10, 27.10, 28.10, 30.10) – samme bong som i resten av presentasjonen. Innsiktsnedslagene
               setter et mintfarget stempel. Kameraet følger, et par bilder etter kula.
  N3 8,6–10,4 s Kranen går opp og legger seg rett over sporet. Sporet gløder sterkere.
  N4 10,4–12 s Hvile ovenfra: hele flettemønsteret i øvre del av bildet. Presentasjonen legger parene
               «vi så → vi endret» under (src/scenes/Del3.tsx), med de samme datoene.

Kjør:
  blender --background --factory-startup --python blender/hopping_spor.py -- bygg
  blender --background --factory-startup --python blender/hopping_spor.py -- test gpu [sekunder …]
  blender --background --factory-startup --python blender/hopping_spor.py -- render gpu
  blender --background --factory-startup --python blender/hopping_spor.py -- film     # -> public/film/hopping.mp4
"""

import json
import math
import os
import sys

import bpy
from mathutils import Vector

HER = os.path.dirname(os.path.abspath(__file__))
ROT = os.path.dirname(HER)
sys.path.insert(0, HER)
import studio as st  # noqa: E402

FPS = 30
LENGDE = 12.0
FRAMES = os.path.join(HER, "frames_hopping")
FILM = os.path.join(ROT, "public", "film")
FONT = r"C:\Windows\Fonts\courbd.ttf"

# Fire par: innsikt → prototype. Datoene er milepælene i Dok. A §8.
NEDSLAG = [
    ("innsikt", None),
    ("prototype", "TIDLIG"),
    ("innsikt", None),
    ("prototype", "22.10"),
    ("innsikt", None),
    ("prototype", "27.10"),
    ("innsikt", None),
    ("prototype", "28.10"),
    ("innsikt", None),
    ("prototype", "30.10"),
]
BANE_Y = {"innsikt": 1.25, "prototype": -1.25}
DX = 2.4
R_KULE = 0.2
PLATE_H = 0.22


def F(t):
    return int(round(t * FPS)) + 1


def nk(ting, egenskap, verdier, interp=None):
    st.nokler(ting, egenskap, verdier, fps=FPS, interpolasjon=interp)


def tekst(navn, body, storrelse, plass, materiale, rot_z=0.0, align="LEFT"):
    tc = bpy.data.curves.new(navn, "FONT")
    tc.body = body
    tc.font = bpy.data.fonts.load(FONT, check_existing=True)
    tc.size = storrelse
    tc.align_x = align
    tc.align_y = "CENTER"
    tc.extrude = 0.004
    o = bpy.data.objects.new(navn, tc)
    bpy.context.scene.collection.objects.link(o)
    o.location = plass
    o.rotation_euler = (0, 0, rot_z)
    o.data.materials.append(materiale)
    return o


def tider_for_nedslag():
    """Rytme: rolig først, så tettere – men ikke etter en formel; pausene følger omtrent avstanden mellom datoene."""
    gap = [1.05, 0.95, 0.85, 0.8, 0.72, 0.7, 0.66, 0.62, 0.6]
    t = [1.3]
    for g in gap:
        t.append(t[-1] + g)
    return t


def bygg():
    sc = st.ny_scene(fps=FPS, sekunder=LENGDE)
    # Standard (som appen): AgX bleket ut pastellbanene og den rosa kula
    st.himmel(sc, "#2A1D16", 0.22)

    n = len(NEDSLAG)
    tider = tider_for_nedslag()
    punkter = [Vector((i * DX, BANE_Y[b], PLATE_H + R_KULE)) for i, (b, _) in enumerate(NEDSLAG)]
    x0, x1 = -14.0, (n - 1) * DX + 14.0

    # Gulvet: mørk eik, og de to banene som lakkerte plater (avfaset, med navnet malt på i Courier)
    st.kloss("Gulv", (x1 - x0 + 40, 60, 0.2), ((x0 + x1) / 2, 0, -0.1), st.tre("Gulv", lys="#5A4030", mork="#3E2B1E", skala=0.25), avfasing=0.0)
    farger = {"innsikt": ("#BFE9D3", "#2A8A5F"), "prototype": ("#FFD9B3", "#C0661A")}
    for bane, y in BANE_Y.items():
        lys_f, merk_f = farger[bane]
        st.kloss(f"Bane {bane}", (x1 - x0, 1.6, PLATE_H), ((x0 + x1) / 2, y, PLATE_H / 2), st.matt(f"Bane {bane}", lys_f, ruhet=0.42, coat=0.35), avfasing=0.03)
        tekst(f"Navn {bane}", "INNSIKT" if bane == "innsikt" else "PROTOTYPE", 0.42, (-4.6, y, PLATE_H + 0.001), st.matt(f"Navn {bane}", merk_f, ruhet=0.5))

    # Kula og sporet
    kule = bpy.data.objects.new("Kule-rot", None)
    sc.collection.objects.link(kule)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=R_KULE, segments=64, ring_count=32)
    kulekropp = bpy.context.active_object
    kulekropp.name = "Kule"
    bpy.ops.object.shade_smooth()
    kulekropp.data.materials.append(st.lysende("Kule", "#F08FB0", 0.85, base="#F08FB0"))
    kulekropp.parent = kule
    kulelys_d = bpy.data.lights.new("Kulelys", "POINT")
    kulelys_d.color = st.farge("#F7A8C6")[:3]
    kulelys_d.energy = 18
    kulelys_d.shadow_soft_size = 0.2
    kulelys = bpy.data.objects.new("Kulelys", kulelys_d)
    sc.collection.objects.link(kulelys)
    kulelys.parent = kule

    start = Vector((-DX * 1.1, 0.0, PLATE_H + 3.2))  # faller inn ovenfra
    buer = []
    alle = [start] + punkter
    alle_t = [tider[0] - 0.7] + tider
    PR = 48  # punkter per bue (glatt kurve, ingen knekker)
    for i in range(1, len(alle)):
        a, b = alle[i - 1], alle[i]
        hoyde = 1.45 if i > 1 else 0.0
        if i >= len(alle) - 2:
            hoyde = 0.95  # de siste hoppene er lavere – farten går ut
        for j in range(1, PR + 1):
            u = j / PR
            p = a.lerp(b, u)
            if i == 1:
                p.z = a.z + (b.z - a.z) * (u * u)  # fritt fall inn
            else:
                p.z = a.z + (b.z - a.z) * u + math.sin(u * math.pi) * hoyde
            buer.append((alle_t[i - 1] + (alle_t[i] - alle_t[i - 1]) * u, p))

    cu = bpy.data.curves.new("Spor", "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = 0.05
    cu.bevel_resolution = 6
    cu.use_fill_caps = True
    cu.bevel_factor_mapping_end = "SPLINE"
    sp = cu.splines.new("POLY")
    sp.points.add(len(buer) - 1)
    for i, (_, p) in enumerate(buer):
        sp.points[i].co = (*p, 1)
    spor_mat = st.lysende("Spor", "#F08FB0", 0.4, base="#F08FB0")
    cu.materials.append(spor_mat)
    spor = bpy.data.objects.new("Spor", cu)
    sc.collection.objects.link(spor)

    # Kula og sporets ende følger buene i takt
    pref = bpy.context.preferences.edit
    pref.keyframe_new_interpolation_type = "LINEAR"
    for i, (t, p) in enumerate(buer):
        kule.location = p
        kule.keyframe_insert("location", frame=F(t))
        cu.bevel_factor_end = i / (len(buer) - 1)
        cu.keyframe_insert("bevel_factor_end", frame=F(t))
    pref.keyframe_new_interpolation_type = "BEZIER"
    kule.keyframe_insert("location", frame=F(LENGDE))

    # Klem ved hvert nedslag (2–3 bilders kontakt), strekk i lufta
    skala = [(0.0, (1, 1, 1))]
    for t in tider:
        skala += [(t - 0.07, (0.94, 0.94, 1.1)), (t, (1.16, 1.16, 0.8)), (t + 0.07, (1.06, 1.06, 0.93)), (t + 0.15, (1, 1, 1))]
    nk(kulekropp, "scale", skala)

    # Spor etter hvert nedslag: mintstempel på innsiktsbanen, en bong med dato på prototypebanen
    stempel_mat = st.matt("Stempel", "#2A8A5F", ruhet=0.6)
    papir = st.papir("Bong", "#FBF7EE")
    blekk = st.matt("Blekk", "#262220", ruhet=0.7)
    for i, ((bane, dato), t) in enumerate(zip(NEDSLAG, tider)):
        p = punkter[i]
        if bane == "innsikt":
            bpy.ops.mesh.primitive_torus_add(major_radius=0.36, minor_radius=0.035, location=(p.x, p.y, PLATE_H + 0.012))
            ring = bpy.context.active_object
            ring.name = f"Stempel {i}"
            ring.scale = (1, 1, 0.25)
            ring.data.materials.append(stempel_mat)
            nk(ring, "scale", [(t - 0.02, (0.01, 0.01, 0.25)), (t + 0.1, (1.25, 1.25, 0.25)), (t + 0.22, (1, 1, 0.25))])
        else:
            holder = bpy.data.objects.new(f"Bong {i}", None)
            sc.collection.objects.link(holder)
            holder.location = (p.x + 0.85, p.y - 0.1, PLATE_H + 0.004)
            holder.rotation_euler = (0, 0, math.radians(-6 + (i % 3) * 5))
            bpy.ops.mesh.primitive_plane_add(size=1)
            ark = bpy.context.active_object
            ark.name = f"Bongark {i}"
            ark.scale = (1.5, 0.95, 1)
            bpy.ops.object.transform_apply(scale=True)
            ark.location = (0, -0.47, 0)  # vokser «ut av skriveren» fra toppkanten
            sol = ark.modifiers.new("Tykkelse", "SOLIDIFY")
            sol.thickness = 0.004
            ark.data.materials.append(papir)
            ark.parent = holder
            tx = tekst(f"Dato {i}", dato, 0.36, (0, -0.47, 0.006), blekk, align="CENTER")
            tx.parent = holder
            # Skrives ut: vokser i lengderetningen fra toppkanten, med en liten overshoot
            nk(holder, "scale", [(t - 0.02, (1, 0.01, 1)), (t + 0.22, (1, 1.08, 1)), (t + 0.34, (1, 1, 1))])

    # Lys: lav, varm kveldssol fra venstre (som i åpningen), kjølig fyll fra høyre, og et kantlys bakfra
    mal = bpy.data.objects.new("Mål", None)
    sc.collection.objects.link(mal)
    sol_d = bpy.data.lights.new("Sol", "SUN")
    sol_d.energy = 3.4
    sol_d.angle = math.radians(5)
    sol_d.color = st.farge("#FFC890")[:3]
    sol = bpy.data.objects.new("Sol", sol_d)
    sc.collection.objects.link(sol)
    sol.rotation_euler = Vector((0.9, 0.35, -0.42)).normalized().to_track_quat("-Z", "Y").to_euler()
    fyll_d = bpy.data.lights.new("Fyll", "SUN")
    fyll_d.energy = 0.6
    fyll_d.color = st.farge("#B9C8E8")[:3]
    fyll = bpy.data.objects.new("Fyll", fyll_d)
    sc.collection.objects.link(fyll)
    fyll.rotation_euler = Vector((-0.6, 0.2, -0.75)).normalized().to_track_quat("-Z", "Y").to_euler()

    # Sporet gløder sterkere når kameraet løfter seg
    nk(spor_mat.node_tree.nodes.get("Principled BSDF").inputs["Emission Strength"], None, [(0.0, 0.4), (tider[-1], 0.55), (10.4, 1.1), (LENGDE, 1.1)])

    # Kamera: lav vinkel som følger kula (litt etter), så kran opp til rett ovenfra med banene i øvre del
    cam = st.kamera(sc, linse=40, mal=mal, blender=2.8, sensor=36.0)
    cx = (punkter[0].x + punkter[-1].x) / 2
    folg = [(0.0, punkter[0].x - 1.6)] + [(t + 0.15, p.x + 0.4) for t, p in zip(tider, punkter)]
    nk(cam, "location", [(t, (x - 2.2, -7.8, 2.6)) for t, x in folg] + [(10.2, (cx + 0.4, -0.9, 30.0)), (LENGDE, (cx + 0.4, -0.85, 30.5))])
    nk(mal, "location", [(t, (x, 0.2, 0.95)) for t, x in folg] + [(10.2, (cx + 0.4, 0.0, 0.0)), (LENGDE, (cx + 0.4, 0.0, 0.0))])
    # Linseforskyvning: banene skal ligge i øvre del av bildet på slutten (presentasjonen legger tekst under)
    nk(cam.data, "shift_y", [(tider[-1], 0.0), (10.2, -0.13), (LENGDE, -0.13)])
    nk(cam.data.dof, "aperture_fstop", [(0.0, 2.4), (tider[-1], 2.8), (9.6, 22.0), (LENGDE, 22.0)])

    st.kvalitet(sc, samples=128, lukker=0.5)
    sc.frame_start, sc.frame_end = 1, int(LENGDE * FPS)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HER, "hopping_spor.blend"))
    meta = {"fps": FPS, "varighet": LENGDE, "nedslag": [{"bane": b, "dato": d, "tid": round(t, 2)} for (b, d), t in zip(NEDSLAG, tider)]}
    for sti in (os.path.join(FILM, "hopping.json"), os.path.join(ROT, "src", "lib", "hopping.json")):
        with open(sti, "w", encoding="utf-8") as fh:
            json.dump(meta, fh, indent=2, ensure_ascii=False)
    print("bygget", len(NEDSLAG), "nedslag, siste ved", round(tider[-1], 2))


def test():
    st.bruk_gpu()
    sc = bpy.context.scene
    st.provekvalitet(sc, prosent=50, samples=40)
    ut = os.path.join(HER, "test_hopping")
    os.makedirs(ut, exist_ok=True)
    i = sys.argv.index("--")
    tider = [float(a) for a in sys.argv[i + 3:]] if len(sys.argv) > i + 3 else [0.6, 1.4, 3.0, 5.0, 7.0, 8.6, 9.6, 11.5]
    for t in tider:
        sc.frame_set(F(t))
        sc.render.filepath = os.path.join(ut, f"t{t:04.1f}.png")
        bpy.ops.render.render(write_still=True)


steg = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "bygg"
if steg == "bygg":
    bygg()
elif steg in ("test", "render"):
    bpy.ops.wm.open_mainfile(filepath=os.path.join(HER, "hopping_spor.blend"))
    if steg == "test":
        test()
    else:
        st.bruk_gpu()
        st.render_bilder(bpy.context.scene, FRAMES)
elif steg == "film":
    st.film(bpy.context.scene, FRAMES, os.path.join(FILM, "hopping.mp4"), fps=FPS)
