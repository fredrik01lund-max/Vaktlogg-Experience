"""Sekvens 3 – Prototype Reveal: en telefon kommer frem fra mørket, snur seg mot kameraet,
skjermen våkner med Vaktloggs startskjerm, og kameraet kjører inn til skjermen står rett foran oss.

Siste bilde er laget for å matche live-demoen i presentasjonen: skjermen står midt i bildet og
er SKJERM_ANDEL av bildehøyden. Presentasjonen leser tallene fra public/film/telefon.json og legger
den ekte prototypen (iframe) nøyaktig oppå før den toner over.

Kjør (Blender 5.2, ingen GPU nødvendig – rendres med Cycles på CPU):
  blender --background --factory-startup --python blender/telefon_reveal.py -- bygg      # lager telefon.blend
  blender --background --factory-startup --python blender/telefon_reveal.py -- test      # tre prøvebilder i blender/test/
  blender --background --factory-startup --python blender/telefon_reveal.py -- render    # alle bilder til blender/frames/
  blender --background --factory-startup --python blender/telefon_reveal.py -- film      # frames -> public/film/telefon.mp4

Bytt skjermbilde: legg et nytt blender/skjerm.png (1170 x 2532, telefonformat) og kjør bygg + render + film.
"""

import bpy
import bmesh
import json
import math
import os
import shutil
import sys

HER = os.path.dirname(os.path.abspath(__file__))
ROT = os.path.dirname(HER)
SKJERMBILDE = os.path.join(HER, "skjerm.png")
FRAMES = os.path.join(HER, "frames")
FILM = os.path.join(ROT, "public", "film")

FPS = 30
SLUTT = 300  # 10 sekunder
BREDDE, HOYDE = 1920, 1080
SKJERM_ANDEL = 0.86  # skjermens høyde som andel av bildehøyden i siste bilde
LINSE = 70.0  # mm, vertikal sensor 24 mm

# Telefonen (1 enhet = 10 cm): 71,6 x 147,6 x 7,8 mm
TW, TH, TD = 0.716, 1.476, 0.078
HJORNE = 0.095
SW, SH = 0.656, 1.416  # skjermen (samme forhold som skjermbildet 1170 x 2532)
SKJERM_HJORNE = 0.078
FRONT_Y = -TD / 2


def srgb(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c) + (1.0,)


def tom_scene():
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.samples = 48
    sc.cycles.use_adaptive_sampling = True
    sc.cycles.adaptive_threshold = 0.02
    sc.cycles.use_denoising = True
    try:
        sc.cycles.denoiser = "OPENIMAGEDENOISE"
    except Exception:
        pass
    sc.cycles.max_bounces = 6
    sc.render.resolution_x, sc.render.resolution_y = BREDDE, HOYDE
    sc.render.resolution_percentage = 100
    sc.render.fps = FPS
    sc.frame_start, sc.frame_end = 1, SLUTT
    # Standard: skjermbildets farger gjengis nøyaktig, så overgangen til den ekte prototypen blir sømløs
    sc.view_settings.view_transform = "Standard"
    sc.view_settings.look = "None"
    w = bpy.data.worlds.new("Mørke")
    sc.world = w
    try:
        w.use_nodes = True
    except Exception:
        pass
    bg = w.node_tree.nodes.get("Background")
    bg.inputs["Color"].default_value = (0, 0, 0, 1)
    bg.inputs["Strength"].default_value = 0
    return sc


def mat(navn, farge, metall=0.0, ruhet=0.5, coat=0.0):
    m = bpy.data.materials.new(navn)
    try:
        m.use_nodes = True
    except Exception:
        pass
    p = m.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value = farge
    p.inputs["Metallic"].default_value = metall
    p.inputs["Roughness"].default_value = ruhet
    if coat:
        p.inputs["Coat Weight"].default_value = coat
        p.inputs["Coat Roughness"].default_value = 0.05
    return m


def rundet_flate(navn, b, h, r, y, segmenter=14):
    """Avrundet rektangel i XZ-planet som vender mot -Y, med UV fra 0 til 1 over hele flaten."""
    me = bpy.data.meshes.new(navn)
    bm = bmesh.new()
    v = [bm.verts.new((x, y, z)) for x, z in ((-b / 2, -h / 2), (b / 2, -h / 2), (b / 2, h / 2), (-b / 2, h / 2))]
    bm.faces.new(v)
    bmesh.ops.bevel(bm, geom=list(bm.verts), offset=r, segments=segmenter, affect="VERTICES", profile=0.5)
    uv = bm.loops.layers.uv.new("UVMap")
    for f in bm.faces:
        for lp in f.loops:
            x, _, z = lp.vert.co
            lp[uv].uv = ((x + b / 2) / b, (z + h / 2) / h)
    # Normalen skal peke mot kameraet (-Y)
    for f in bm.faces:
        if f.normal.y > 0:
            f.normal_flip()
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(navn, me)
    bpy.context.scene.collection.objects.link(o)
    return o


def kropp():
    me = bpy.data.meshes.new("Kropp")
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= TW
        v.co.y *= TD
        v.co.z *= TH
    loddrett = [e for e in bm.edges if abs(e.verts[0].co.y - e.verts[1].co.y) > 1e-6]
    bmesh.ops.bevel(bm, geom=loddrett, offset=HJORNE, segments=18, affect="EDGES", profile=0.5)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new("Kropp", me)
    bpy.context.scene.collection.objects.link(o)
    bev = o.modifiers.new("Kant", "BEVEL")
    bev.width = 0.016
    bev.segments = 8
    bev.limit_method = "ANGLE"
    bev.angle_limit = math.radians(60)
    bev.harden_normals = True
    for p in me.polygons:
        p.use_smooth = True
    return o


def knapp(navn, x, z, h, materiale, foreldre):
    bpy.ops.mesh.primitive_cube_add(size=1, location=(x, 0, z))
    o = bpy.context.active_object
    o.name = navn
    o.scale = (0.012, 0.03, h)
    b = o.modifiers.new("Rund", "BEVEL")
    b.width = 0.006
    b.segments = 4
    o.data.materials.append(materiale)
    o.parent = foreldre
    return o


def kurve(navn, punkter, tykkelse, materiale, foreldre, sirkel_radius=None, slutt=1.0):
    cu = bpy.data.curves.new(navn, "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = tykkelse
    cu.bevel_resolution = 6
    cu.use_fill_caps = True
    if sirkel_radius:
        sp = cu.splines.new("NURBS")
        n = 64
        sp.points.add(n - 1)
        for i in range(n):
            a = 2 * math.pi * i / n
            sp.points[i].co = (sirkel_radius * math.cos(a), sirkel_radius * math.sin(a), 0, 1)
        sp.use_cyclic_u = True
        sp.order_u = 4
        cu.bevel_factor_mapping_end = "SPLINE"
        cu.bevel_factor_end = slutt
    else:
        sp = cu.splines.new("POLY")
        sp.points.add(len(punkter) - 1)
        for i, (x, y) in enumerate(punkter):
            sp.points[i].co = (x, y, 0, 1)
    o = bpy.data.objects.new(navn, cu)
    bpy.context.scene.collection.objects.link(o)
    o.data.materials.append(materiale)
    o.parent = foreldre
    return o


def skjerm_materiale():
    m = bpy.data.materials.new("Skjerm")
    try:
        m.use_nodes = True
    except Exception:
        pass
    nt = m.node_tree
    p = nt.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value = (0.0, 0.0, 0.0, 1)
    p.inputs["Roughness"].default_value = 0.035
    p.inputs["Specular IOR Level"].default_value = 0.25
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = bpy.data.images.load(SKJERMBILDE)
    tex.interpolation = "Cubic"
    nt.links.new(tex.outputs["Color"], p.inputs["Emission Color"])
    p.inputs["Emission Strength"].default_value = 0.0
    return m, p


def bakteppe_materiale():
    """Bakteppet: skrå pastellovergang fersken → rosa (som prototypens --dock-grad) med et lysere midtparti.
    Lyser selv med styrke 1, så fargene gjengis nøyaktig (Standard-visning) – presentasjonen bruker de
    samme fargene rundt telefonen etter filmen."""
    m = bpy.data.materials.new("Bakteppe")
    try:
        m.use_nodes = True
    except Exception:
        pass
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    ut = nt.nodes.new("ShaderNodeOutputMaterial")
    tc = nt.nodes.new("ShaderNodeTexCoord")
    # Skrå overgang: lokal x (−0,5…0,5) dreid og flyttet til 0…1
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Location"].default_value = (0.5, 0.5, 0)
    mp.inputs["Rotation"].default_value = (0, 0, math.radians(-28))
    mp.inputs["Scale"].default_value = (1.6, 1.6, 1)
    gr = nt.nodes.new("ShaderNodeTexGradient")
    gr.gradient_type = "LINEAR"
    cr = nt.nodes.new("ShaderNodeValToRGB")
    cr.color_ramp.elements[0].position = 0.25
    cr.color_ramp.elements[0].color = srgb("#FFD2AC")
    cr.color_ramp.elements[1].position = 0.75
    cr.color_ramp.elements[1].color = srgb("#F7BBD2")
    em = nt.nodes.new("ShaderNodeEmission")
    em.inputs["Strength"].default_value = 1.0
    # Lyst midtparti bak telefonen
    mp2 = nt.nodes.new("ShaderNodeMapping")
    mp2.inputs["Scale"].default_value = (2.6, 3.6, 1)
    kule = nt.nodes.new("ShaderNodeTexGradient")
    kule.gradient_type = "SPHERICAL"
    em2 = nt.nodes.new("ShaderNodeEmission")
    em2.inputs["Color"].default_value = srgb("#FFF6EE")
    legg = nt.nodes.new("ShaderNodeAddShader")
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
    nt.links.new(mp.outputs["Vector"], gr.inputs["Vector"])
    nt.links.new(gr.outputs["Fac"], cr.inputs["Fac"])
    nt.links.new(cr.outputs["Color"], em.inputs["Color"])
    nt.links.new(tc.outputs["Object"], mp2.inputs["Vector"])
    nt.links.new(mp2.outputs["Vector"], kule.inputs["Vector"])
    svak = nt.nodes.new("ShaderNodeMath")
    svak.operation = "MULTIPLY"
    svak.inputs[1].default_value = 0.22
    nt.links.new(kule.outputs["Fac"], svak.inputs[0])
    nt.links.new(svak.outputs["Value"], em2.inputs["Strength"])
    nt.links.new(em.outputs["Emission"], legg.inputs[0])
    nt.links.new(em2.outputs["Emission"], legg.inputs[1])
    nt.links.new(legg.outputs["Shader"], ut.inputs["Surface"])
    return m


def lys(navn, plass, farge, styrke, storrelse, mal):
    l = bpy.data.lights.new(navn, "AREA")
    l.shape = "RECTANGLE"
    l.size, l.size_y = storrelse
    l.color = farge[:3]
    l.energy = styrke
    o = bpy.data.objects.new(navn, l)
    bpy.context.scene.collection.objects.link(o)
    o.location = plass
    c = o.constraints.new("TRACK_TO")
    c.target = mal
    c.track_axis = "TRACK_NEGATIVE_Z"
    c.up_axis = "UP_Y"
    return o


def nokkel(ting, egenskap, verdier):
    """verdier: [(bilde, verdi), ...] – Bezier med myk inn/ut mellom nøklene."""
    for f, v in verdier:
        if isinstance(ting, bpy.types.NodeSocket):
            ting.default_value = v
            ting.keyframe_insert("default_value", frame=f)
        else:
            setattr(ting, egenskap, v)
            ting.keyframe_insert(egenskap, frame=f)


def bygg():
    sc = tom_scene()

    tel = bpy.data.objects.new("Telefon", None)
    sc.collection.objects.link(tel)

    # Prototypens farger: lys aluminium, bakside i pastell rosa (--pink-fill), merket som appikonet
    # (hvit ring, plommefarget V)
    ramme = mat("Ramme", srgb("#E8E1DA"), metall=1.0, ruhet=0.28)
    glass = mat("Frontglass", (0, 0, 0, 1), ruhet=0.03)
    bak = mat("Bakglass", srgb("#F6C2D6"), ruhet=0.5, coat=0.6)
    logo = mat("Logo", srgb("#FFFFFF"), ruhet=0.18, coat=1.0)
    logo_v = mat("LogoV", srgb("#8A3352"), ruhet=0.2, coat=1.0)
    linse = mat("Linse", srgb("#0B0D12"), ruhet=0.02, coat=1.0)

    k = kropp()
    k.data.materials.append(ramme)
    k.parent = tel

    f = rundet_flate("Front", TW - 0.018, TH - 0.018, HJORNE - 0.008, FRONT_Y - 0.0004)
    f.data.materials.append(glass)
    f.parent = tel

    sk_mat, sk_bsdf = skjerm_materiale()
    s = rundet_flate("Skjerm", SW, SH, SKJERM_HJORNE, FRONT_Y - 0.0008)
    s.data.materials.append(sk_mat)
    s.parent = tel

    b = rundet_flate("Bakside", TW - 0.018, TH - 0.018, HJORNE - 0.008, FRONT_Y - 0.0004)  # snus 180° rundt Z under
    b.rotation_euler = (0, 0, math.pi)
    b.data.materials.append(bak)
    b.parent = tel

    # Kameraøy på baksiden (oppe til venstre sett bakfra)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0.17, -FRONT_Y + 0.006, 0.52))
    oy = bpy.context.active_object
    oy.name = "Kameraøy"
    oy.scale = (0.3, 0.012, 0.3)
    bv = oy.modifiers.new("Rund", "BEVEL")
    bv.width = 0.06
    bv.segments = 10
    oy.data.materials.append(ramme)
    oy.parent = tel
    for i, (x, z) in enumerate(((0.10, 0.60), (0.10, 0.44), (0.25, 0.52))):
        bpy.ops.mesh.primitive_cylinder_add(radius=0.058, depth=0.02, vertices=48, location=(x, -FRONT_Y + 0.016, z), rotation=(math.pi / 2, 0, 0))
        c = bpy.context.active_object
        c.name = f"Linse{i}"
        c.data.materials.append(linse)
        c.parent = tel
        bpy.ops.object.shade_smooth()

    # Vaktlogg-merket i blankt metall på baksiden: ring nesten rundt + V
    ring = kurve("LogoRing", None, 0.011, logo, tel, sirkel_radius=0.13, slutt=0.78)
    ring.location = (0, -FRONT_Y + 0.004, -0.02)
    ring.rotation_euler = (math.pi / 2, math.radians(-35), 0)
    v = kurve("LogoV", [(-0.052, 0.042), (0, -0.054), (0.052, 0.042)], 0.014, logo_v, tel)
    v.location = (0, -FRONT_Y + 0.004, -0.02)
    v.rotation_euler = (math.pi / 2, 0, 0)

    knapp("Av/på", TW / 2 + 0.004, 0.26, 0.11, ramme, tel)
    knapp("Volum opp", -TW / 2 - 0.004, 0.30, 0.07, ramme, tel)
    knapp("Volum ned", -TW / 2 - 0.004, 0.14, 0.07, ramme, tel)
    knapp("Handling", -TW / 2 - 0.004, 0.46, 0.035, ramme, tel)

    # Bakteppe i prototypens pastell (som demolinjens --dock-grad: fersken → rosa), lyser selv
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 7.0, 0.4), rotation=(math.pi / 2, 0, 0))
    gp = bpy.context.active_object
    gp.name = "Bakteppe"
    gp.scale = (40, 26, 1)
    gp.data.materials.append(bakteppe_materiale())

    # Fire pastellringer – fargene på appens fire bokser: Helse rosa, Salg oransje, Konkurranse gul, Gjester grønn
    ringer = []
    for i, (farge, plass, r, vri) in enumerate(
        (
            ("#F4A6C2", (-1.55, -1.4, 0.55), 0.42, (70, 20, 10)),
            ("#FFC48E", (1.75, 1.6, -0.45), 0.6, (60, -30, 40)),
            ("#F7D774", (1.25, -2.4, 1.05), 0.3, (20, 60, 0)),
            ("#9EDDBE", (-1.9, 2.3, -0.95), 0.55, (80, 10, -30)),
        )
    ):
        bpy.ops.mesh.primitive_torus_add(major_radius=r, minor_radius=r * 0.24, major_segments=96, minor_segments=32, location=plass, rotation=tuple(math.radians(a) for a in vri))
        ring_o = bpy.context.active_object
        ring_o.name = f"Pastellring{i}"
        bpy.ops.object.shade_smooth()
        ring_o.data.materials.append(mat(f"Ring{i}", srgb(farge), ruhet=0.38, coat=0.35))
        ringer.append(ring_o)

    # Kamera
    cd = bpy.data.cameras.new("Kamera")
    cd.lens = LINSE
    cd.sensor_fit = "VERTICAL"
    cd.sensor_height = 24
    cd.dof.use_dof = True
    cd.dof.aperture_fstop = 2.2
    cam = bpy.data.objects.new("Kamera", cd)
    sc.collection.objects.link(cam)
    sc.camera = cam
    mal = bpy.data.objects.new("Mål", None)
    sc.collection.objects.link(mal)
    cd.dof.focus_object = mal
    tt = cam.constraints.new("TRACK_TO")
    tt.target = mal
    tt.track_axis = "TRACK_NEGATIVE_Z"
    tt.up_axis = "UP_Y"

    vfov = 2 * math.atan(12 / LINSE)
    avstand = (SH / SKJERM_ANDEL / 2) / math.tan(vfov / 2)
    slutt_y = FRONT_Y - 0.0008 - avstand

    # Lys: lyst og mykt (høy nøkkel), med fersken og rosa kantlys bak og et feiende striplys bak kameraet
    hoved = lys("Hovedlys", (-4.5, -5.5, 4.0), srgb("#FFF1E4"), 0, (4.0, 4.0), tel)
    fyll = lys("Fyllys", (5.0, -6.0, -1.0), srgb("#FDE3EC"), 0, (5.0, 5.0), tel)
    kant_v = lys("Kantlys venstre", (-3.2, 2.6, 0.8), srgb("#FFC48E"), 0, (0.35, 5.0), tel)
    kant_h = lys("Kantlys høyre", (3.2, 2.6, 0.2), srgb("#F4A6C2"), 0, (0.35, 5.0), tel)
    feie = lys("Feiende lys", (-9.0, -16.0, 1.2), srgb("#FFFFFF"), 0, (0.8, 9.0), mal)
    # Lys verden: myke refleksjoner i aluminiumen
    bg = sc.world.node_tree.nodes.get("Background")
    bg.inputs["Color"].default_value = srgb("#FFF3EA")
    bg.inputs["Strength"].default_value = 0.4

    # --- Tidslinje (30 bilder/s) ---
    # 0–1,5 s lyset kommer på, ringene svever · 1,5–4,6 s telefonen stiger og snur seg mot oss
    # 4,7–5,6 s skjermen våkner · 4,6–9,4 s kameraet kjører inn, ringene glir ut av bildet
    # 9,4–10 s står helt stille (presentasjonen toner over her)
    nokkel(tel, "location", [(1, (0.0, 0.0, -0.55)), (138, (0.0, 0.0, 0.0))])
    nokkel(tel, "rotation_euler", [(1, (math.radians(-9), 0, math.radians(205))), (138, (0, 0, 0))])
    nokkel(kant_v.data, "energy", [(1, 0), (36, 900), (150, 700), (280, 250)])
    nokkel(kant_h.data, "energy", [(6, 0), (44, 900), (150, 700), (280, 250)])
    nokkel(hoved.data, "energy", [(1, 250), (40, 1100), (282, 900)])
    nokkel(fyll.data, "energy", [(1, 120), (40, 500), (282, 400)])
    nokkel(feie, "location", [(96, (-5.0, -16.0, 1.2)), (146, (3.0, -16.0, 1.2))])
    nokkel(feie.data, "energy", [(94, 0), (104, 4000), (136, 4000), (148, 0)])
    nokkel(sk_bsdf.inputs["Emission Strength"], None, [(140, 0.0), (168, 1.0)])
    # Ingen refleks i glasset på siste bilde – skjermen skal være nøyaktig som prototypen
    nokkel(sk_bsdf.inputs["Specular IOR Level"], None, [(138, 0.25), (166, 0.06), (262, 0.0)])
    # Ringene snurrer sakte og driver utover, og er ute av bildet før kameraet står stille
    for i, ring_o in enumerate(ringer):
        x, y, z = ring_o.location
        rx, ry, rz = ring_o.rotation_euler
        ut_x = 3.2 if x > 0 else -3.2
        nokkel(ring_o, "location", [(1, (x, y, z - 0.3)), (150, (x * 1.05, y, z)), (262, (x + ut_x, y - 1.0, z * 1.6))])
        nokkel(ring_o, "rotation_euler", [(1, (rx, ry, rz)), (262, (rx + math.radians(70 + 25 * i), ry + math.radians(40), rz + math.radians(90)))])
    nokkel(cam, "location", [(1, (1.6, -13.5, 1.3)), (138, (0.45, -9.2, 0.3)), (282, (0.0, slutt_y, 0.0)), (SLUTT, (0.0, slutt_y, 0.0))])
    # Fokus følger telefonen; blenderen strammes inn mot slutten så hele skjermen er skarp
    nokkel(cd.dof, "aperture_fstop", [(1, 1.8), (150, 2.4), (270, 16.0)])

    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HER, "telefon.blend"))

    meta = {
        "fps": FPS,
        "bilder": SLUTT,
        "varighet": SLUTT / FPS,
        "bredde": BREDDE,
        "hoyde": HOYDE,
        "skjermAndel": SKJERM_ANDEL,
        "skjermForhold": SW / SH,
        "skjermHjorne": SKJERM_HJORNE / SH,
        "stilleFra": 282 / FPS,
    }
    os.makedirs(FILM, exist_ok=True)
    # Presentasjonen leser tallene ved bygging (src/lib/telefon.json); kopien i public/film er for oversikt
    for sti in (os.path.join(FILM, "telefon.json"), os.path.join(ROT, "src", "lib", "telefon.json")):
        with open(sti, "w", encoding="utf-8") as fh:
            json.dump(meta, fh, indent=2)
    print("bygget", meta)


def bruk_gpu():
    """Render på grafikkortet (OptiX, ellers CUDA) når «gpu» står på kommandolinjen – mange ganger raskere enn CPU."""
    if "gpu" not in sys.argv:
        return
    prefs = bpy.context.preferences.addons["cycles"].preferences
    for typ in ("OPTIX", "CUDA"):
        try:
            prefs.compute_device_type = typ
        except TypeError:
            continue
        prefs.get_devices()
        gpuer = [d for d in prefs.devices if d.type == typ]
        if gpuer:
            for d in prefs.devices:
                d.use = d.type == typ
            sc = bpy.context.scene
            sc.cycles.device = "GPU"
            # Støyfjerning og lagring var flaskehalsen: fjern støy på kortet, og lagre PNG med lett komprimering
            if hasattr(sc.cycles, "denoising_use_gpu"):
                sc.cycles.denoising_use_gpu = True
            sc.render.use_persistent_data = True
            sc.render.image_settings.compression = 15
            print("rendrer på", typ, [d.name for d in gpuer], flush=True)
            return
    print("fant ingen GPU – rendrer på CPU")


def test():
    bruk_gpu()
    sc = bpy.context.scene
    sc.render.resolution_percentage = 50
    sc.cycles.samples = 32
    ut = os.path.join(HER, "test")
    os.makedirs(ut, exist_ok=True)
    for f in (25, 55, 85, 120, 150, 300):
        sc.frame_set(f)
        sc.render.filepath = os.path.join(ut, f"bilde_{f:03d}.png")
        bpy.ops.render.render(write_still=True)


def render():
    bruk_gpu()
    sc = bpy.context.scene
    os.makedirs(FRAMES, exist_ok=True)
    sc.render.filepath = os.path.join(FRAMES, "####")
    sc.render.image_settings.file_format = "PNG"
    sc.render.use_overwrite = False  # kan avbrytes og fortsettes
    sc.render.use_placeholder = True
    bpy.ops.render.render(animation=True)


def film():
    """Setter bildene sammen til H.264 (MP4) med Blenders egen ffmpeg, og lagrer start/sluttbilde."""
    sc = bpy.context.scene
    sc.render.resolution_x, sc.render.resolution_y = BREDDE, HOYDE
    sc.render.resolution_percentage = 100
    sc.render.fps = FPS
    filer = sorted(f for f in os.listdir(FRAMES) if f.endswith(".png"))
    se = sc.sequence_editor_create()
    stripes = se.strips if hasattr(se, "strips") else se.sequences
    st = stripes.new_image("Bilder", os.path.join(FRAMES, filer[0]), 1, 1)
    for f in filer[1:]:
        st.elements.append(f)
    sc.frame_start, sc.frame_end = 1, len(filer)
    sc.render.use_sequencer = True
    # Bildene er ferdig fargebehandlet – ingen ny visningstransform (AgX gjorde filmen grå og flat)
    sc.view_settings.view_transform = "Standard"
    sc.view_settings.look = "None"
    sc.sequencer_colorspace_settings.name = "sRGB"
    im = sc.render.image_settings
    try:
        im.media_type = "VIDEO"
    except Exception:
        pass
    im.file_format = "FFMPEG"
    ff = sc.render.ffmpeg
    ff.format = "MPEG4"
    ff.codec = "H264"
    ff.constant_rate_factor = "HIGH"
    ff.ffmpeg_preset = "BEST"
    ff.gopsize = 15
    ff.audio_codec = "NONE"
    os.makedirs(FILM, exist_ok=True)
    sc.render.filepath = os.path.join(FILM, "telefon_")
    bpy.ops.render.render(animation=True)
    laget = [f for f in os.listdir(FILM) if f.startswith("telefon_") and f.endswith(".mp4")]
    if laget:
        mal = os.path.join(FILM, "telefon.mp4")
        if os.path.exists(mal):
            os.remove(mal)
        os.replace(os.path.join(FILM, laget[0]), mal)
    shutil.copy(os.path.join(FRAMES, filer[-1]), os.path.join(HER, "telefon-slutt.png"))
    print("film ferdig", laget)


steg = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "bygg"
if steg == "bygg":
    bygg()
elif steg in ("test", "render"):
    bpy.ops.wm.open_mainfile(filepath=os.path.join(HER, "telefon.blend"))
    test() if steg == "test" else render()
elif steg == "film":
    film()
