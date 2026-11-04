"""Sekvens 1 – «Vakten ovenfra»: åpningen av presentasjonen, uten ord.

Vi starter tett på telefonen i hånda til servitøren: hun stempler inn (16:00). Så trekker kameraet seg
bakover over skulderen hennes, hun tar brettet, og kameraet løfter seg over en miniatyrrestaurant i
prototypens pastellfarger mens kvelden tar av: gjester setter seg ved bord 11–17 (Emmas seksjon ved
vinduene, som bordkartet i appen), bongene spretter opp over bordet og flyr til bongskinnen på
kjøkkenet, kokkene jobber bak passet, tallerkenene kommer ut på brettet hennes, bordene skifter farge
som i appen (grønn = aktiv, gul = betalt), og hun legger igjen et lysende spor – skrittene.
Ettermiddagssola faller inn gjennom vinduene, skumringen kommer, stearinlysene tennes. Ved stengetid
slukkes lysene bord for bord, hun stempler ut ved døra (23:30), og igjen står bare sporet, rett ovenfra.

Kjør (legg til «gpu» etter steget for å rendre på grafikkortet, f.eks. «-- render gpu»):
  blender --background --factory-startup --python blender/apning_vakt.py -- bygg
  blender --background --factory-startup --python blender/apning_vakt.py -- test gpu
  blender --background --factory-startup --python blender/apning_vakt.py -- render gpu
  blender --background --factory-startup --python blender/apning_vakt.py -- film      # -> public/film/apning.mp4

Tidspunktene presentasjonen trenger (klokka og tittelen) skrives til src/lib/apning.json.
Skjermbildene til stempelklokka er blender/stempel-*.png (nøytral app – Vaktlogg avsløres senere).
"""

import bpy
import json
import math
import os
import shutil
import sys
from mathutils import Vector

HER = os.path.dirname(os.path.abspath(__file__))
ROT = os.path.dirname(HER)
sys.path.insert(0, HER)
import studio as st  # noqa: E402
FRAMES = os.path.join(HER, "frames_apning")
FILM = os.path.join(ROT, "public", "film")

FPS = 30
LENGDE = 17.5
SLUTT = int(LENGDE * FPS)
BREDDE, HOYDE = 1920, 1080

# Innstemplingen tar de første sekundene; restaurantens tidslinje (S) starter T0 sekunder senere
T0 = 1.4
K = 0.72  # restaurantens tid går fortere enn før (25 s → 17,5 s): etter cirka 8 s kommer det ikke ny informasjon
STEMPLE_INN = 1.55  # 16:00 – trykket på telefonen
VAKT_START = 2.6  # (restaurant-tid) servitøren begynner å gå


def S(t):
    """Tid i restaurantens fortelling → tid i filmen."""
    return T0 + t * K


LYS_AV = S(18.6)
FRYS = S(9.2)  # stillbildet til «Nøkkelfunn»: midt i kvelden, servitøren med brett, gjester ved bordene


def F(t):
    return int(round(t * FPS)) + 1


def srgb(h, a=1.0):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c) + (a,)


# Prototypens farger
FARGE = {
    "gulv_a": "#DDCBB6",
    "gulv_b": "#CDB8A0",
    "vegg": "#F8F2EA",
    "bord_ledig": "#ECE6DE",
    "bord_aktiv": "#BFE9D3",  # --green-fill
    "bord_betalt": "#FBE6A2",  # --yellow-fill
    "bord_annen": "#DCD6CE",
    "stol": "#E2CBB2",
    "servitor": "#94284C",  # Emma-fargen (--pink-ink)
    "forkle": "#FFFFFF",
    "hud": "#F0CFB6",
    "brett": "#E4E4E6",
    "kjokken": "#6E2A3C",  # --primary-ink
    "spor": "#F08FB0",  # --pink-strong (Helse/aktivitet = rosa)
    "plante": "#7CC9A1",  # --green-strong
}
GJESTEFARGER = ["#D4DCEB", "#CAE3D6", "#F2E6BD", "#F3DCC5", "#EDD0DB", "#E7DFF0"]  # prototypens farger, dempet 40 %
HARFARGER = ["#2B1D17", "#6B4A35", "#B88A5A", "#8C8C8C"]
FLASKER = ["#F5B46E", "#F08FB0", "#7CC9A1", "#94B0E6", "#F0CC5C", "#E8829F"]


# ── hjelpere ───────────────────────────────────────────────────────────────────

def mat(navn, farge, ruhet=0.55, metall=0.0, emisjon=None, styrke=0.0):
    m = bpy.data.materials.new(navn)
    try:
        m.use_nodes = True
    except Exception:
        pass
    p = m.node_tree.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value = srgb(farge) if isinstance(farge, str) else farge
    p.inputs["Roughness"].default_value = ruhet
    p.inputs["Metallic"].default_value = metall
    if emisjon:
        p.inputs["Emission Color"].default_value = srgb(emisjon)
        p.inputs["Emission Strength"].default_value = styrke
    return m


def bsdf(m):
    return m.node_tree.nodes.get("Principled BSDF")


def lenk(o, parent=None):
    bpy.context.scene.collection.objects.link(o)
    if parent:
        o.parent = parent
    return o


def tom(navn, sted=(0, 0, 0), parent=None):
    o = lenk(bpy.data.objects.new(navn, None), parent)
    o.location = sted
    return o


def boks(navn, sted, storrelse, materiale, avrund=0.0, parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=sted)
    o = bpy.context.active_object
    o.name = navn
    o.scale = storrelse
    if avrund:
        b = o.modifiers.new("Rund", "BEVEL")
        b.width = avrund
        b.segments = 4
    o.data.materials.append(materiale)
    if parent:
        o.parent = parent
    return o


def sylinder(navn, sted, r, h, materiale, parent=None, avrund=0.0, hjorner=40):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=h, vertices=hjorner, location=sted)
    o = bpy.context.active_object
    o.name = navn
    if avrund:
        b = o.modifiers.new("Rund", "BEVEL")
        b.width = avrund
        b.segments = 3
    bpy.ops.object.shade_smooth()
    o.data.materials.append(materiale)
    if parent:
        o.parent = parent
    return o


def kule(navn, sted, r, materiale, parent=None):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=sted, segments=24, ring_count=12)
    o = bpy.context.active_object
    o.name = navn
    bpy.ops.object.shade_smooth()
    o.data.materials.append(materiale)
    if parent:
        o.parent = parent
    return o


def nokkel(ting, egenskap, verdier):
    tider = [t for t, _ in verdier]
    assert tider == sorted(tider), f"nøklene må stå i tidsrekkefølge: {tider}"
    for t, v in verdier:
        if isinstance(ting, bpy.types.NodeSocket):
            ting.default_value = v
            ting.keyframe_insert("default_value", frame=F(t))
        else:
            setattr(ting, egenskap, v)
            ting.keyframe_insert(egenskap, frame=F(t))


def popp(o, inn, ut=None, skala=1.0):
    """Spretter inn (0 → litt for stor → full størrelse) og forsvinner igjen."""
    o.scale = (0, 0, 0)
    o.keyframe_insert("scale", frame=1)
    for t, s in ((inn - 0.01, 0.0), (inn + 0.12, 1.15 * skala), (inn + 0.22, skala)):
        o.scale = (s, s, s)
        o.keyframe_insert("scale", frame=F(t))
    if ut is not None:
        for t, s in ((ut - 0.15, skala), (ut + 0.05, 0.0)):
            o.scale = (s, s, s)
            o.keyframe_insert("scale", frame=F(t))


def synlig(o, intervaller, skala=1.0):
    """Synlig (skala) i hvert intervall [(fra, til), …], ellers borte."""
    o.scale = (0, 0, 0)
    o.keyframe_insert("scale", frame=1)
    for a, b in intervaller:
        nokler = ((a - 0.02, 0.0), (a + 0.08, skala)) if a > 0.1 else ((0.0, skala),)
        for t, s in nokler + ((b - 0.06, skala), (b + 0.04, 0.0)):
            o.scale = (s, s, s)
            o.keyframe_insert("scale", frame=F(t))


def bild_materiale(navn, filer, styrke=1.1):
    """Telefonskjerm: bytter mellom bildene i «filer» med nøkler på blandingene. Returnerer (materiale, blandere)."""
    m = bpy.data.materials.new(navn)
    try:
        m.use_nodes = True
    except Exception:
        pass
    nt = m.node_tree
    for n in list(nt.nodes):
        nt.nodes.remove(n)
    ut = nt.nodes.new("ShaderNodeOutputMaterial")
    em = nt.nodes.new("ShaderNodeEmission")
    em.inputs["Strength"].default_value = styrke
    tex = []
    for f in filer:
        t = nt.nodes.new("ShaderNodeTexImage")
        t.image = bpy.data.images.load(os.path.join(HER, f))
        t.interpolation = "Cubic"
        tex.append(t)
    forrige = tex[0].outputs["Color"]
    blandere = []
    for t in tex[1:]:
        mx = nt.nodes.new("ShaderNodeMix")
        mx.data_type = "RGBA"
        mx.inputs["Factor"].default_value = 0.0
        nt.links.new(forrige, mx.inputs[6])
        nt.links.new(t.outputs["Color"], mx.inputs[7])
        forrige = mx.outputs[2]
        blandere.append(mx.inputs["Factor"])
    nt.links.new(forrige, em.inputs["Color"])
    nt.links.new(em.outputs["Emission"], ut.inputs["Surface"])
    return m, blandere, em.inputs["Strength"]


# ── restauranten ───────────────────────────────────────────────────────────────

# Emmas seksjon (bord 11–17): fire ved vinduene, tre i midten. De andre bordene er grå, som i appens bordkart.
BORD = {
    11: (-3.3, 1.95), 12: (-1.75, 1.95), 13: (-0.2, 1.95), 14: (1.35, 1.95),
    15: (-2.55, 0.35), 16: (-1.0, 0.35), 17: (0.55, 0.35),
}
ANDRE = [(-3.0, -1.45), (-1.3, -1.45), (0.4, -1.45), (2.1, -1.45)]
KJOKKEN = Vector((3.05, 1.05, 0))  # der servitøren henter og leverer
DOR = Vector((-4.25, -2.45, 0))
BORDHOYDE = 0.36
SKALA_SERV = 1.2


def stoler(bx, by, mat_stol, antall=4):
    """Bistrostoler: sete, rygg (på yttersiden) og fire tynne bein."""
    plass = []
    for i in range(antall):
        a = math.pi / 2 * i + math.pi / 4
        x, y = bx + math.cos(a) * 0.52, by + math.sin(a) * 0.52
        stol = tom(f"Stol {bx:.1f}{by:.1f}{i}", (x, y, 0))
        stol.rotation_euler = (0, 0, a)
        boks(f"Stolsete {bx:.1f}{by:.1f}{i}", (0, 0, 0.2), (0.21, 0.21, 0.03), mat_stol, avrund=0.012, parent=stol)
        boks(f"Stolrygg {bx:.1f}{by:.1f}{i}", (0.095, 0, 0.32), (0.025, 0.2, 0.2), mat_stol, avrund=0.01, parent=stol)
        for bi, (lx, ly) in enumerate(((-0.08, -0.08), (-0.08, 0.08), (0.08, -0.08), (0.08, 0.08))):
            sylinder(f"Stolbein {bx:.1f}{by:.1f}{i}{bi}", (lx, ly, 0.095), 0.012, 0.19, mat_stol, parent=stol, hjorner=12)
        plass.append((x, y, a))
    return plass


def bord_mobel(navn, x, y, m_plate, m_fot, r=0.38):
    """Bistrobord: tynn plate, én fot og en rund sokkel."""
    sylinder(f"{navn} plate", (x, y, BORDHOYDE - 0.02), r, 0.04, m_plate, avrund=0.012, hjorner=64)
    sylinder(f"{navn} fot", (x, y, (BORDHOYDE - 0.04) / 2), 0.03, BORDHOYDE - 0.04, m_fot, hjorner=24)
    sylinder(f"{navn} sokkel", (x, y, 0.012), 0.17, 0.024, m_fot, avrund=0.008, hjorner=48)


def plante(navn, x, y, m_potte, m_blad, hoyde=0.5):
    sylinder(f"{navn} potte", (x, y, 0.13), 0.15, 0.26, m_potte, avrund=0.02)
    for i in range(7):
        a = i * 2.4
        r = 0.08 + (i % 3) * 0.035
        kule(f"{navn} blad {i}", (x + math.cos(a) * r, y + math.sin(a) * r, 0.3 + hoyde * (0.35 + (i % 4) * 0.17)), 0.1 + (i % 2) * 0.03, m_blad)


def bygg():
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.samples = 128
    sc.cycles.use_adaptive_sampling = True
    sc.cycles.adaptive_threshold = 0.008
    sc.cycles.use_denoising = True
    try:
        sc.cycles.denoiser = "OPENIMAGEDENOISE"
    except Exception:
        pass
    sc.cycles.max_bounces = 6
    sc.cycles.volume_bounces = 0
    sc.cycles.caustics_reflective = False
    sc.cycles.caustics_refractive = False
    sc.render.use_persistent_data = True
    # Litt bevegelsesuskarphet – som et ekte kamera
    sc.render.use_motion_blur = True
    sc.render.motion_blur_shutter = 0.15
    sc.render.resolution_x, sc.render.resolution_y = BREDDE, HOYDE
    sc.render.fps = FPS
    sc.frame_start, sc.frame_end = 1, SLUTT
    sc.view_settings.view_transform = "Standard"  # samme grading som telefon- og hoppefilmen
    sc.view_settings.look = "None"

    # Verden: himmelen lyser opp rommet, men kameraet ser en rolig, varm bakgrunn (som et fotostudio)
    w = bpy.data.worlds.new("Himmel")
    sc.world = w
    try:
        w.use_nodes = True
    except Exception:
        pass
    wn = w.node_tree
    himmel = wn.nodes.get("Background")
    kamerabg = wn.nodes.new("ShaderNodeBackground")
    sti = wn.nodes.new("ShaderNodeLightPath")
    bland = wn.nodes.new("ShaderNodeMixShader")
    wut = wn.nodes.get("World Output")
    wn.links.new(sti.outputs["Is Camera Ray"], bland.inputs[0])
    wn.links.new(himmel.outputs["Background"], bland.inputs[1])
    wn.links.new(kamerabg.outputs["Background"], bland.inputs[2])
    wn.links.new(bland.outputs["Shader"], wut.inputs["Surface"])

    # ── Rommet ──
    m_vegg = mat("Vegg", FARGE["vegg"], ruhet=0.8)
    m_stol = st.tre("Stol", lys="#C99A6B", mork="#9A6E48", skala=3.0, ruhet=0.5, lakk=0.12)
    m_fot = mat("Bordfot", "#3B3530", ruhet=0.35, metall=0.6)
    m_plate = st.matt("Bordplate", "#2E2724", ruhet=0.35, coat=0.3)
    m_kjokken = mat("Kjøkken", FARGE["kjokken"], ruhet=0.45)
    m_hvit = mat("Hvit", "#FFFFFF", ruhet=0.35)
    m_tallerken = mat("Tallerken", "#FFFFFF", ruhet=0.2)
    m_glass = mat("Glass", "#F6E7EE", ruhet=0.1)
    m_brettglass = st.glass("Brettglass")
    m_metall = mat("Stål", "#D8D8DC", ruhet=0.25, metall=0.9)
    m_potte = mat("Potte", "#E9D9C6", ruhet=0.6)
    m_blad = mat("Blad", FARGE["plante"], ruhet=0.7)

    # Flisgulv i to lyse toner (sjakkmønster) – gir målestokk og bistro-følelse
    m_gulv = mat("Gulv", FARGE["gulv_a"], ruhet=0.6)
    gn = m_gulv.node_tree
    sjakk = gn.nodes.new("ShaderNodeTexChecker")
    sjakk.inputs["Color1"].default_value = srgb(FARGE["gulv_a"])
    sjakk.inputs["Color2"].default_value = srgb(FARGE["gulv_b"])
    sjakk.inputs["Scale"].default_value = 3.33
    geo = gn.nodes.new("ShaderNodeNewGeometry")
    kart = gn.nodes.new("ShaderNodeMapping")
    kart.inputs["Scale"].default_value = (1.0, 1.0, 0.0)
    gn.links.new(geo.outputs["Position"], kart.inputs["Vector"])
    gn.links.new(kart.outputs["Vector"], sjakk.inputs["Vector"])
    gn.links.new(sjakk.outputs["Color"], bsdf(m_gulv).inputs["Base Color"])
    boks("Gulv", (0, 0, -0.05), (9.4, 6.4, 0.1), m_gulv)

    # Bakvegg med fire vinduer (ved bord 11–14) – ettermiddagssola faller inn her
    for x0, x1 in ((-4.7, -3.9), (-2.7, -2.35), (-1.15, -0.8), (0.4, 0.75), (1.95, 4.7)):
        boks(f"Vegg {x0}", ((x0 + x1) / 2, 3.15, 0.65), (x1 - x0, 0.18, 1.3), m_vegg)
    boks("Vegg under vinduene", (0, 3.15, 0.12), (9.4, 0.18, 0.24), m_vegg)
    boks("Vegg over vinduene", (0, 3.15, 1.22), (9.4, 0.18, 0.16), m_vegg)
    boks("Vegg venstre", (-4.75, 0.2, 0.3), (0.18, 5.9, 0.6), m_vegg)
    boks("Vegg bak kjøkkenet", (4.62, 0.95, 0.65), (0.18, 4.6, 1.3), m_vegg)
    # Utsikten gjennom vinduene: dagslys → skumring → natt
    m_ute = mat("Ute", "#FFF1DC", ruhet=1.0, emisjon="#FFF1DC", styrke=2.0)
    # rett bak veggen og ikke høyere enn vindusåpningene, så den bare synes gjennom vinduene (ikke som en plate over veggen ovenfra)
    ute = boks("Ute", (0, 3.3, 0.69), (9.3, 0.02, 0.9), m_ute)
    ute.visible_shadow = False  # sola og himmelen skal inn gjennom vinduene
    m_karm = mat("Karm", "#3B3530", ruhet=0.5)
    for x0, x1 in ((-3.9, -2.7), (-2.35, -1.15), (-0.8, 0.4), (0.75, 1.95)):
        boks(f"Sprosse {x0}", ((x0 + x1) / 2, 3.15, 0.69), (0.03, 0.06, 0.9), m_karm)
        boks(f"Losholt {x0}", ((x0 + x1) / 2, 3.15, 0.86), (x1 - x0, 0.06, 0.03), m_karm)
    # Taket stenger himmelen ute, så lyset kommer inn gjennom vinduene som flekker på gulvet (kameraet ser det ikke)
    tak = boks("Tak", (0, 0, 1.32), (9.4, 6.4, 0.04), m_vegg)
    tak.visible_camera = False
    tak.visible_glossy = False
    tak.keyframe_insert("scale", frame=1)
    tak.keyframe_insert("scale", frame=F(LYS_AV - 0.15))
    tak.scale = (0, 0, 0)
    tak.keyframe_insert("scale", frame=F(LYS_AV - 0.1))
    # Mørke kapper på veggtoppene og gulvkanten: modellen leses som et bevisst snitt, ikke som en modell i et tomt rom
    m_snitt = mat("Snitt", "#241C18", ruhet=0.7)
    boks("Kappe bakvegg", (0, 3.15, 1.305), (9.4, 0.18, 0.01), m_snitt)
    boks("Kappe venstre", (-4.75, 0.2, 0.605), (0.18, 5.9, 0.01), m_snitt)
    boks("Kappe kjøkken", (4.62, 0.95, 1.305), (0.18, 4.6, 0.01), m_snitt)
    boks("Gulvkant", (0, 0, -0.052), (9.44, 6.44, 0.1), m_snitt)

    # Planter i hjørnene og ved døra
    plante("Plante bak venstre", -4.35, 2.75, m_potte, m_blad, 0.55)
    plante("Plante bak høyre", 2.3, 2.75, m_potte, m_blad, 0.45)
    plante("Plante ved døra", -4.35, -1.9, m_potte, m_blad, 0.6)

    # Kjøkkenpasset og disken, med kokker, bongskinne, tallerkener og en liten bar med flasker
    boks("Disk", (3.75, 0.9, 0.24), (0.6, 3.2, 0.48), m_kjokken, avrund=0.03)
    boks("Disk topp", (3.75, 0.9, 0.49), (0.66, 3.26, 0.03), m_hvit)
    m_pass = mat("Passlys", "#FFE4C2", emisjon="#FFD6A6", styrke=6.0)
    boks("Passlys", (4.15, 0.9, 0.95), (0.06, 2.8, 0.08), m_pass)
    sylinder("Bongskinne", (3.98, 1.05, 0.9), 0.012, 2.6, m_metall).rotation_euler = (math.radians(90), 0, 0)
    for i in range(4):
        sylinder(f"Tallerken pass {i}", (3.75, 0.55 + i * 0.45, 0.52), 0.11, 0.02, m_tallerken)
    for i in range(6):
        sylinder(f"Flaske {i}", (3.62 + (i % 2) * 0.2, -0.55 + (i // 2) * 0.16, 0.6), 0.03, 0.2, mat(f"Flaske {i}", FLASKER[i], ruhet=0.15))
    m_kokk = mat("Kokk", "#FFFFFF", ruhet=0.5)
    for i, ky in enumerate((0.35, 1.75)):
        kokk = tom(f"Kokk {i}", (4.32, ky, 0))
        sylinder(f"Kokk kropp {i}", (0, 0, 0.36), 0.12, 0.5, m_kokk, parent=kokk, avrund=0.05)
        kule(f"Kokk hode {i}", (0, 0, 0.72), 0.1, mat(f"Kokk hud {i}", "#E8C8AE"), parent=kokk)
        sylinder(f"Kokkelue {i}", (0, 0, 0.86), 0.085, 0.12, m_kokk, parent=kokk)
        d = kokk.driver_add("location", 1).driver
        d.type = "SCRIPTED"
        d.expression = f"{ky}+0.18*sin(frame*0.045+{i * 2.1})"

    # ── Bordene, med stearinlys ──
    m_lys = mat("Stearinlys", "#FFFDF6", ruhet=0.5)
    m_flamme = mat("Flamme", "#FFC070", emisjon="#FFB25A", styrke=0.0)
    bordmat = {}
    stolplass = {}
    alle_bord = list(BORD.items()) + [(f"a{i}", p) for i, p in enumerate(ANDRE)]
    for nr, (x, y) in alle_bord:
        if isinstance(nr, int):
            m = mat(f"Bord {nr}", FARGE["bord_ledig"], ruhet=0.4)
            bordmat[nr] = m
            bord_mobel(f"Bord {nr}", x, y, m_plate, m_fot)
            sylinder(f"Brikke {nr}", (x, y, BORDHOYDE + 0.002), 0.12, 0.004, m, hjorner=48)
            stolplass[nr] = stoler(x, y, m_stol)
        else:
            bord_mobel(f"Annet bord {nr}", x, y, m_plate, m_fot, r=0.36)
            stolplass[nr] = stoler(x, y, m_stol)
        sylinder(f"Lys {nr}", (x, y, BORDHOYDE + 0.03), 0.022, 0.06, m_lys)
        kule(f"Flamme {nr}", (x, y, BORDHOYDE + 0.075), 0.014, m_flamme)

    # De andre seksjonene: grå bord, men fulle av gjester – det er en travel kveld
    m_gjest_annen = mat("Gjest annen seksjon", "#D9D3CB", ruhet=0.6)
    m_har = [mat(f"Hår {i}", f, ruhet=0.6) for i, f in enumerate(HARFARGER)]
    m_hud_annen = mat("Hud annen seksjon", "#E8DCD2", ruhet=0.6)
    for i, (x, y) in enumerate(ANDRE):
        for g, (sx, sy, _a) in enumerate(stolplass[f"a{i}"][: 2 + (i % 3)]):
            rot = tom(f"Annen gjest {i}-{g}", (sx, sy, 0))
            rot.rotation_euler = (0, 0, _a)
            sylinder(f"Annen gjest kropp {i}-{g}", (0, 0, 0.32), 0.1, 0.34, m_gjest_annen, parent=rot, avrund=0.04).scale = (0.85, 1.25, 1.0)
            kule(f"Annen gjest hode {i}-{g}", (0, 0, 0.56), 0.085, m_hud_annen, parent=rot)
            kule(f"Annen gjest hår {i}-{g}", (0, 0, 0.585), 0.088, m_har[(i + g) % 4], parent=rot).scale = (1.0, 1.0, 0.75)
            popp(rot, S(4.6 + i * 0.5 + g * 0.07), S(14.2 + i * 0.45 + g * 0.05))

    # ── Kvelden: bordsettinger (bord, ankommer, varighet – i restaurant-tid) ──
    settinger = [
        (14, 3.0, 6.2), (13, 3.5, 5.8), (12, 4.2, 5.6), (15, 4.9, 5.2), (11, 5.5, 6.0),  # første tur til nærmeste bord, så kameraet rekker å følge henne
        (16, 6.2, 4.8), (17, 6.8, 5.0), (11, 9.9, 4.6), (15, 10.6, 4.0), (12, 10.4, 4.3),
        # (13, 10.0, 4.2), (16, 11.6, 3.4), (17, 12.3, 3.0) – tatt ut: hun rakk ikke alt uten å teleportere
    ]
    besok = []  # (tid i filmen, sted, hva)
    serveringer = []  # (sted, bord) der hun setter fra seg maten
    OPPHOLD = 0.05  # kort stopp ved bordet eller passet
    GANG = 16.0  # meter (modell) per sekund film når hun går mellom bordet og kjøkkenet
    leveringer = []  # (hentes på kjøkkenet, leveres) – tallerkener på brettet
    for s_i, (nr, ank, var) in enumerate(settinger):
        bx, by = BORD[nr]
        ank = S(ank)
        bestill = ank + 0.45
        mat_t = ank + 0.45 + var * 0.36
        betal = ank + var - 0.55
        drar = ank + var
        # Bordet skifter farge som i appens bordkart
        p = bsdf(bordmat[nr])
        for t, farge in ((bestill - 0.08, FARGE["bord_ledig"]), (bestill, FARGE["bord_aktiv"]), (betal - 0.08, FARGE["bord_aktiv"]), (betal, FARGE["bord_betalt"]), (drar - 0.05, FARGE["bord_betalt"]), (drar + 0.15, FARGE["bord_ledig"])):
            p.inputs["Base Color"].default_value = srgb(farge)
            p.inputs["Base Color"].keyframe_insert("default_value", frame=F(t))
        # Gjester, tallerkener og glass
        antall = 2 + (s_i % 3)
        for g in range(antall):
            sx, sy, a = stolplass[nr][g]
            farge = GJESTEFARGER[(s_i * 3 + g) % len(GJESTEFARGER)]
            rot = tom(f"Gjest {s_i}-{g}", (sx, sy, 0))
            rot.rotation_euler = (0, 0, a)
            sylinder(f"Gjest kropp {s_i}-{g}", (0, 0, 0.32), 0.1, 0.34, mat(f"Gjest {s_i}-{g}", farge, ruhet=0.5), parent=rot, avrund=0.04).scale = (0.85, 1.25, 1.0)
            kule(f"Gjest hode {s_i}-{g}", (0, 0, 0.56), 0.085, mat(f"Gjest hud {s_i}-{g}", "#F3DCCB"), parent=rot)
            kule(f"Gjest hår {s_i}-{g}", (0, 0, 0.585), 0.088, m_har[(s_i + g) % 4], parent=rot).scale = (1.0, 1.0, 0.75)
            popp(rot, ank + g * 0.06, drar - 0.1 + g * 0.05)
            tx, ty = bx + (sx - bx) * 0.48, by + (sy - by) * 0.48
            popp(sylinder(f"Tallerken {s_i}-{g}", (tx, ty, BORDHOYDE + 0.012), 0.085, 0.018, m_tallerken), mat_t + g * 0.05, drar - 0.25)
            if g % 2 == 0:
                popp(sylinder(f"Glass {s_i}-{g}", (tx + 0.09, ty + 0.05, BORDHOYDE + 0.06), 0.025, 0.12, m_glass), bestill + 0.5, drar - 0.25)
        # Bongen: spretter opp over bordet, flyr til bongskinnen på kjøkkenet, henger der til maten går ut
        bong = tom(f"Bong {s_i}", (bx, by, 0.95))
        boks(f"Bongkort {s_i}", (0, 0, 0), (0.2, 0.012, 0.27), mat(f"Bong {s_i}", "#FFFDF8", ruhet=0.6, emisjon="#FFFDF8", styrke=0.25), parent=bong)
        for li in range(3):
            boks(f"Bonglinje {s_i}-{li}", (0, -0.008, 0.07 - li * 0.05), (0.14 if li else 0.1, 0.003, 0.016), mat(f"Bonglinje {s_i}-{li}", "#3A322E"), parent=bong)
        slot = Vector((3.99, -0.05 + (s_i % 8) * 0.3, 0.8))
        nokkel(bong, "location", [(bestill, (bx, by, 0.95)), (bestill + 0.75, (bx, by, 1.0)), (bestill + 1.35, (slot.x, slot.y, slot.z + 0.25)), (bestill + 1.55, tuple(slot))])
        nokkel(bong, "rotation_euler", [(bestill, (math.radians(55), 0, 0)), (bestill + 0.75, (math.radians(55), 0, 0)), (bestill + 1.45, (math.radians(90), 0, math.radians(90)))])
        popp(bong, bestill, mat_t - 0.25, skala=0.8)
        # Servitøren: bestilling, til kjøkkenet, mat ut, betaling
        side = Vector((bx + ((s_i * 37) % 7 - 3) * 0.05, (1.2 if by > 1 else -0.42) + ((s_i * 53) % 5 - 2) * 0.07, 0))
        # (Betalingen vises bare som bordfarge – et eget besøk ga for tett tidslinje i den kortere filmen)
        tur = 0.12 + (side - KJOKKEN).length / GANG
        besok += [(bestill, side, "bestill"), (bestill + tur, KJOKKEN, "kjokken"), (mat_t - tur, KJOKKEN, "kjokken"), (mat_t, side, "mat")]
        leveringer.append((mat_t - tur, mat_t))
        serveringer.append((side.copy(), nr))

    # ── Servitørens rute: i gangene mellom bordene, med stopp ved bordene og kjøkkenet ──
    besok.sort(key=lambda b: b[0])
    visit = [(S(VAKT_START), KJOKKEN.copy())]
    for t, sted, _ in besok:
        t = max(t, visit[-1][0] + OPPHOLD + (sted - visit[-1][1]).length / GANG)
        if (sted - visit[-1][1]).length < 0.05:
            continue
        visit.append((t, sted.copy()))
    visit.append((max(visit[-1][0] + 0.7, S(16.4)), Vector((-4.25, -0.42, 0))))
    visit.append((visit[-1][0] + 0.8, DOR.copy()))
    ved_dora = visit[-1][0]
    stemple_ut = ved_dora + 0.6  # 23:30

    GAP_X = [-3.45, -1.78, -0.22, 1.25]
    tilfeldig = [0.37]

    def rnd():
        tilfeldig[0] = (tilfeldig[0] * 9301 + 49297) % 233280 / 233280
        return tilfeldig[0] - 0.5

    def rykk(p, dx, dy):
        return Vector((p.x + rnd() * 2 * dx, p.y + rnd() * 2 * dy, 0))

    def sone(p):
        if (p - KJOKKEN).length < 0.05:
            return "kjokken"
        if p.y > 0.8:
            return "vindu"
        if p.y > -1.0 and p.x > -4.0:
            return "midt"
        return "vegg"

    def mellom(a, b):
        ra, rb = sone(a), sone(b)
        if {ra, rb} == {"midt", "kjokken"}:
            return [rykk(Vector((2.2, -0.55, 0)), 0.25, 0.35)]
        if {ra, rb} == {"midt", "vindu"}:
            m, v = (a, b) if ra == "midt" else (b, a)
            gx = min(GAP_X, key=lambda g: abs(g - m.x) + abs(g - v.x)) + rnd() * 0.8
            p = [rykk(Vector((gx, -0.55, 0)), 0.0, 0.35), rykk(Vector((gx, 1.15, 0)), 0.0, 0.25)]
            return p if ra == "midt" else p[::-1]
        if {ra, rb} == {"vindu", "vegg"}:
            return [Vector((-3.45, 1.2, 0)), Vector((-3.45, -0.55, 0))] if ra == "vindu" else [Vector((-3.45, -0.55, 0)), Vector((-3.45, 1.2, 0))]
        if {ra, rb} == {"kjokken", "vegg"}:
            return [rykk(Vector((2.2, -0.55, 0)), 0.2, 0.3)]
        return []

    def avrund_hjorner(pkt, d=0.11):
        """Skråskjærer hjørnene, så hun svinger mykere."""
        if len(pkt) < 3:
            return pkt
        ut = [pkt[0]]
        for i in range(1, len(pkt) - 1):
            a, b, c = pkt[i - 1], pkt[i], pkt[i + 1]
            inn, ut_ = (b - a), (c - b)
            if inn.length < 2.5 * d or ut_.length < 2.5 * d:
                ut.append(b)
                continue
            ut += [b - inn.normalized() * d, b + ut_.normalized() * d]
        ut.append(pkt[-1])
        return ut

    FART = 3.4  # meter (modell) per sekund film
    rute = [(0.0, KJOKKEN + Vector((0.03, 0, 0)))]  # 3 cm bak: gir retning (mot salen) fra første bilde
    for i in range(len(visit)):
        t, p = visit[i]
        if i == 0:
            rute.append((t, p.copy()))
            continue
        forrige_t, forrige_p = visit[i - 1]
        punkter = mellom(forrige_p, p) + [p]
        if sone(forrige_p) == sone(p) and sone(p) in ("vindu", "midt"):
            midt = (forrige_p + p) / 2
            punkter = [rykk(Vector((midt.x, midt.y, 0)), 0.6, 0.24)] + punkter
        alle = avrund_hjorner([forrige_p] + punkter)
        delt = [0.0]
        for j in range(1, len(alle)):
            delt.append(delt[-1] + (alle[j] - alle[j - 1]).length)
        lengde = delt[-1]
        varighet = min(max(lengde / FART, 0.18), t - forrige_t - 0.08)
        start = t - varighet
        if start - rute[-1][0] > 0.05:
            rute.append((start, forrige_p.copy()))
        for j in range(1, len(alle)):
            rute.append((start + varighet * delt[j] / max(lengde, 1e-6), alle[j].copy()))

    frys_t = FRYS
    beste = 0.0
    for k in range(len(rute) - 1):
        t, p = rute[k]
        if not (7.5 <= t <= 9.5) or (rute[k + 1][1] - p).length > 1e-6:
            continue
        if any((p - sd).length < 1e-6 and nr in (16, 17) for sd, nr in serveringer):
            ro = rute[k + 1][0] - t
            if ro > beste:
                beste, frys_t = ro, t + min(0.12, ro / 2)
    print("frysbilde", round(frys_t, 2), "står stille", round(beste, 2), "s")

    lengder = [0.0]
    for i in range(1, len(rute)):
        lengder.append(lengder[-1] + (rute[i][1] - rute[i - 1][1]).length)
    total = lengder[-1]

    cu = bpy.data.curves.new("Rute", "CURVE")
    cu.dimensions = "3D"
    cu.use_path = True
    sp = cu.splines.new("POLY")
    sp.points.add(len(rute) - 1)
    for i, (_, p) in enumerate(rute):
        sp.points[i].co = (p.x, p.y, 0.025, 1)
    rute_o = lenk(bpy.data.objects.new("Rute", cu))

    # Sporet: samme kurve, med lysende rosa rør som vokser bak servitøren
    # Egen kurve uten stillestående punkter: nullange biter fikk «bevel factor» til å tegne hele etapper
    # før hun hadde gått dem. Lengden langs kurven er den samme, så nøklene (lengde / total) treffer fortsatt.
    spor_cu = bpy.data.curves.new("Spor", "CURVE")
    spor_cu.dimensions = "3D"
    spor_pkt = [rute[0][1]]
    for _, p in rute[1:]:
        if (p - spor_pkt[-1]).length > 1e-4:
            spor_pkt.append(p)
    ssp = spor_cu.splines.new("POLY")
    ssp.points.add(len(spor_pkt) - 1)
    for i, p in enumerate(spor_pkt):
        ssp.points[i].co = (p.x, p.y, 0.025, 1)
    spor_cu.bevel_depth = 0.009
    spor_cu.bevel_resolution = 3
    spor_cu.bevel_factor_mapping_end = "SPLINE"
    # Additivt lys: der hun har gått mange ganger, legger strekene seg oppå hverandre og gløder sterkere –
    # sluttbildet viser hvor mye hun gikk, ikke bare hvor
    m_spor = bpy.data.materials.new("Spor")
    try:
        m_spor.use_nodes = True
    except Exception:
        pass
    snt = m_spor.node_tree
    for n in list(snt.nodes):
        snt.nodes.remove(n)
    s_ut = snt.nodes.new("ShaderNodeOutputMaterial")
    s_em = snt.nodes.new("ShaderNodeEmission")
    s_em.inputs["Color"].default_value = srgb("#E0457B")
    s_gj = snt.nodes.new("ShaderNodeBsdfTransparent")
    s_sum = snt.nodes.new("ShaderNodeAddShader")
    snt.links.new(s_em.outputs[0], s_sum.inputs[0])
    snt.links.new(s_gj.outputs[0], s_sum.inputs[1])
    snt.links.new(s_sum.outputs[0], s_ut.inputs["Surface"])
    spor_styrke = s_em.inputs["Strength"]
    spor_cu.materials.append(m_spor)
    lenk(bpy.data.objects.new("Spor", spor_cu))

    # ── Servitøren (Emma-fargen, hvitt forkle, rosa sokkel så hun er lett å følge ovenfra) ──
    serv = tom("Servitør")
    serv.scale = (SKALA_SERV,) * 3
    m_serv = mat("Servitør", FARGE["servitor"], ruhet=0.45)
    m_hud = mat("Servitør hud", FARGE["hud"])
    sylinder("Sokkel", (0, 0, 0.006), 0.2, 0.012, mat("Sokkel", FARGE["spor"], ruhet=0.4, emisjon=FARGE["spor"], styrke=0.6), parent=serv)
    sylinder("Servitør kropp", (0, 0, 0.36), 0.12, 0.5, m_serv, parent=serv, avrund=0.05)
    sylinder("Forkle", (0, 0.0, 0.25), 0.124, 0.22, mat("Forkle", FARGE["forkle"]), parent=serv)
    kule("Servitør hode", (0, 0, 0.72), 0.1, m_hud, parent=serv)
    m_har_serv = mat("Hår", "#4A2C24", ruhet=0.6)
    har = kule("Hår", (0, -0.01, 0.745), 0.104, m_har_serv, parent=serv)
    har.scale = (1.0, 1.0, 0.9)
    kule("Hårknute", (0, -0.1, 0.70), 0.04, m_har_serv, parent=serv)

    # Brettet (tas opp etter innstemplingen) – glass, og tallerkener når hun bærer mat ut
    brett = tom("Brett", (0, 0, 0), serv)
    sylinder("Arm", (0.15, 0.05, 0.52), 0.035, 0.22, m_serv, parent=brett).rotation_euler = (math.radians(70), 0, 0)
    sylinder("Brettplate", (0.2, 0.16, 0.66), 0.16, 0.015, mat("Brett", FARGE["brett"], ruhet=0.25, metall=0.8), parent=brett)
    for i, (gx, gy) in enumerate(((0.16, 0.12), (0.25, 0.2), (0.22, 0.08))):
        sylinder(f"Brettglass {i}", (gx, gy, 0.71), 0.02, 0.07, m_brettglass, parent=brett)
    brettmat = tom("Brettmat", (0.2, 0.16, 0.68), brett)
    for i, (dx, dy) in enumerate(((-0.06, -0.03), (0.07, 0.05))):
        sylinder(f"Brett-tallerken {i}", (dx, dy, 0.0), 0.075, 0.016, m_tallerken, parent=brettmat)
        kule(f"Mat {i}", (dx, dy, 0.016), 0.035, mat(f"Mat {i}", "#F5B46E" if i else "#9EDDBE", ruhet=0.7), parent=brettmat)
    popp(brett, 3.0)
    # Tallerkener på brettet fra kjøkkenet til bordet (slå sammen overlappende turer)
    turer = []
    for a, b in sorted(leveringer):
        if turer and a <= turer[-1][1] + 0.05:
            turer[-1] = (turer[-1][0], max(turer[-1][1], b))
        else:
            turer.append((a, b))
    synlig(brettmat, turer)

    # Telefonen med stempelklokka (venstre hånd), og høyre hånd som trykker
    tlf = tom("Telefon", (-0.07, 0.17, 0.55), serv)
    tlf.rotation_euler = (math.radians(-38), 0, 0)
    boks("Telefon kropp", (0, 0, 0), (0.075, 0.008, 0.155), mat("Telefon kropp", "#1B1B1F", ruhet=0.3), avrund=0.004, parent=tlf)
    skjerm_mat, skjerm_bland, skjerm_styrke = bild_materiale("Stempelskjerm", ["stempel-inn.png", "stempel-inne.png", "stempel-ut.png"])
    # Skjermen vender mot henne (−Y); telefonen heller bort fra henne, så skjermen peker opp mot ansiktet
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, -0.0045, 0))
    skjerm = bpy.context.active_object
    skjerm.name = "Stempelskjerm"
    skjerm.scale = (0.068, 0.147, 1)
    skjerm.rotation_euler = (math.radians(90), 0, 0)
    skjerm.data.materials.append(skjerm_mat)
    skjerm.parent = tlf
    venstre = boks("Venstre hånd", (0.0, 0.022, -0.05), (0.065, 0.035, 0.07), m_hud, avrund=0.016, parent=tlf)
    _ = venstre
    hoyre = tom("Høyre hånd", (0.06, 0.12, 0.47), serv)
    boks("Høyre hånd form", (0, 0, 0), (0.045, 0.06, 0.035), m_hud, avrund=0.015, parent=hoyre)
    # Trykket: høyre hånd til knappen (nederst på skjermen) og tilbake
    knapp = (-0.06, 0.128, 0.548)  # rett over knappen, på skjermsiden
    nokkel(hoyre, "location", [(0.0, (0.06, 0.1, 0.47)), (1.15, (0.0, 0.1, 0.56)), (STEMPLE_INN - 0.02, knapp), (STEMPLE_INN + 0.14, (-0.02, 0.1, 0.575)), (2.1, (0.06, 0.1, 0.47))])
    nokkel(skjerm_bland[0], None, [(STEMPLE_INN, 0.0), (STEMPLE_INN + 0.08, 1.0)])
    # Telefonen i lomma (forkleet), høyre hånd tar brettet
    nokkel(tlf, "location", [(2.15, (-0.07, 0.17, 0.55)), (2.7, (-0.05, 0.1, 0.3)), (S(17.3), (-0.05, 0.1, 0.3)), (ved_dora + 0.35, (-0.07, 0.17, 0.55))])
    synlig(tlf, [(0.0, 2.7), (ved_dora + 0.2, LENGDE - 2.5)])
    synlig(hoyre, [(0.0, 2.6)])
    # Utstempling ved døra: skjermen bytter, og lyser opp i mørket
    nokkel(skjerm_bland[1], None, [(stemple_ut, 0.0), (stemple_ut + 0.08, 1.0)])
    nokkel(skjerm_styrke, None, [(0, 1.1), (ved_dora, 1.1), (ved_dora + 0.4, 4.0), (LENGDE - 2.6, 4.0), (LENGDE - 2.5, 0.0)])

    dorlys_d = bpy.data.lights.new("Dørlys", "POINT")
    dorlys_d.color = srgb("#FFD9C8")[:3]
    dorlys_d.shadow_soft_size = 0.3
    dorlys = lenk(bpy.data.objects.new("Dørlys", dorlys_d))
    dorlys.location = (DOR.x + 0.25, DOR.y + 0.2, 0.9)
    nokkel(dorlys_d, "energy", [(0, 0.0), (ved_dora, 0.0), (stemple_ut, 30.0), (LENGDE - 2.6, 30.0), (LENGDE - 2.5, 0.0)])

    fp = serv.constraints.new("FOLLOW_PATH")
    fp.name = "Følg"
    fp.target = rute_o
    fp.use_curve_follow = True
    fp.use_fixed_location = True
    fp.forward_axis = "FORWARD_Y"
    fp.up_axis = "UP_Z"
    # Gange-hopp bare når hun går (ikke mens hun stempler inn)
    d = serv.driver_add("location", 2).driver
    d.type = "SCRIPTED"
    d.expression = f"0.025*abs(sin(frame*0.7))*min(1,max(0,frame-{F(S(VAKT_START))}))"

    pref = bpy.context.preferences.edit
    pref.keyframe_new_interpolation_type = "LINEAR"
    vei = 'constraints["Følg"].offset_factor'
    for i, (t, _) in enumerate(rute):
        f = lengder[i] / total
        fp.offset_factor = f
        serv.keyframe_insert(vei, frame=F(t))
        spor_cu.bevel_factor_end = f
        spor_cu.keyframe_insert("bevel_factor_end", frame=F(t))
    pref.keyframe_new_interpolation_type = "BEZIER"

    # ── Lys: ettermiddag → kveld → natt ──
    sol_d = bpy.data.lights.new("Sol", "SUN")
    sol_d.angle = math.radians(2)
    sol = lenk(bpy.data.objects.new("Sol", sol_d))
    sol.rotation_euler = Vector((0.35, -0.9, -0.3)).normalized().to_track_quat("-Z", "Y").to_euler()
    nokkel(sol_d, "energy", [(0, 0.0), (0.4, 0.0), (1.6, 6.0), (S(6.0), 5.0), (S(9.5), 1.6), (S(11.5), 0.0)])
    nokkel(sol_d, "color", [(0, srgb("#FFD7A8")[:3]), (S(6.0), srgb("#FFC890")[:3]), (S(10.0), srgb("#FF9468")[:3])])
    nokkel(himmel.inputs["Color"], None, [(0, srgb("#DCE6F2")), (S(7.0), srgb("#F2D6CE")), (S(11.5), srgb("#1C2233")), (S(19.5), srgb("#0B0E16"))])
    nokkel(himmel.inputs["Strength"], None, [(0, 0.05), (0.4, 0.05), (1.6, 0.35), (S(8.0), 0.3), (S(11.5), 0.08), (S(19.5), 0.04)])
    # Kameraet ser et varmt, mørkt rom rundt restauranten hele veien (som et modellbord i en mørk sal)
    nokkel(kamerabg.inputs["Color"], None, [(0, srgb("#2A201A")), (S(11.5), srgb("#16110E")), (S(19.5), srgb("#0B0908"))])
    nokkel(kamerabg.inputs["Strength"], None, [(0, 0.15), (0.4, 0.15), (1.6, 1.0), (LENGDE, 1.0)])
    nokkel(bsdf(m_ute).inputs["Emission Color"], None, [(0, srgb("#FFF1DC")), (S(6.5), srgb("#FFD9B0")), (S(9.5), srgb("#FF9F86")), (S(12.0), srgb("#2A3358")), (S(19.5), srgb("#141A30"))])
    nokkel(bsdf(m_ute).inputs["Emission Strength"], None, [(0, 0.3), (0.4, 0.3), (1.6, 1.3), (S(9.5), 1.1), (S(12.0), 0.6), (S(19.5), 0.35)])

    # Taklampene og stearinlysene: tennes i skumringen, slukkes bord for bord ved stengetid
    alle_pos = [p for _, p in alle_bord]
    for i, (x, y) in enumerate(alle_pos):
        pa = S(8.2 + i * 0.12)
        av = S(16.6 + (i % 7) * 0.22 + (0.4 if i >= len(BORD) else 0))
        l = bpy.data.lights.new(f"Lampe {i}", "POINT")
        l.color = srgb("#FFCF9A")[:3]
        l.shadow_soft_size = 0.18
        lo = lenk(bpy.data.objects.new(f"Lampe {i}", l))
        lo.location = (x, y, 1.2)
        nokkel(l, "energy", [(pa - 0.05, 0.0), (pa + 0.35, 9.0), (av - 0.05, 9.0), (av + 0.1, 0.0)])
        c = bpy.data.lights.new(f"Stearinlys {i}", "POINT")
        c.color = srgb("#FFB868")[:3]
        c.shadow_soft_size = 0.03
        co = lenk(bpy.data.objects.new(f"Stearinlys {i}", c))
        co.location = (x, y, BORDHOYDE + 0.1)
        nokkel(c, "energy", [(pa + 0.1, 0.0), (pa + 0.3, 1.2), (av - 0.05, 1.2), (av + 0.1, 0.0)])
    nokkel(bsdf(m_flamme).inputs["Emission Strength"], None, [(S(8.2), 0.0), (S(8.7), 4.0), (S(16.6), 4.0), (S(18.3), 0.0)])
    pass_l = bpy.data.lights.new("Pass", "AREA")
    pass_l.size, pass_l.size_y = 0.4, 3.0
    pass_l.color = srgb("#FFDDB4")[:3]
    pl = lenk(bpy.data.objects.new("Pass", pass_l))
    pl.location = (3.6, 0.9, 1.5)
    nokkel(pass_l, "energy", [(0, 0.0), (0.3, 140.0), (S(18.2), 140.0), (S(18.5), 0.0)])
    nokkel(bsdf(m_pass).inputs["Emission Strength"], None, [(0, 0.0), (0.3, 2.5), (S(18.2), 2.5), (S(18.5), 0.0)])
    # Sporet gløder mer når det blir mørkt
    nokkel(spor_styrke, None, [(0, 1.4), (S(11.0), 1.1), (S(16.5), 0.9), (S(19.0), 0.8)])

    # ── Kamera: telefonen tett på → over skulderen → kran opp → rett ovenfra ──
    cd = bpy.data.cameras.new("Kamera")
    cd.sensor_fit = "VERTICAL"
    cd.sensor_height = 24
    cd.dof.use_dof = True
    cam = lenk(bpy.data.objects.new("Kamera", cd))
    sc.camera = cam
    mal = tom("Mål")
    tt = cam.constraints.new("TRACK_TO")
    tt.target = mal
    tt.track_axis = "TRACK_NEGATIVE_Z"
    tt.up_axis = "UP_Y"
    # Telefonen i verden: hun står ved passet og ser mot salen (−x)
    tlf_v = Vector((KJOKKEN.x - 0.17 * SKALA_SERV, KJOKKEN.y - 0.07 * SKALA_SERV, 0.6 * SKALA_SERV))
    nokkel(cam, "location", [
        (0, (3.30, 0.75, 1.02)), (1.75, (3.26, 0.77, 1.00)), (2.15, (3.42, 0.82, 1.32)), (2.6, (3.6, 1.3, 1.35)),
        # ut og opp over skulderen hennes mens hun går ut i salen
        (3.6, (3.95, 1.35, 1.45)),
        (S(7.0), (2.4, -5.0, 4.2)), (S(12.5), (-0.6, -5.4, 6.4)), (S(18.5), (-0.3, -1.65, 9.2)), (LENGDE, (-0.3, -1.6, 9.3)),
    ])
    nokkel(mal, "location", [
        (0, tuple(tlf_v)), (1.75, tuple(tlf_v)), (2.15, (2.5, 1.0, 0.62)), (2.6, (1.9, 1.15, 0.5)),
        (3.6, (0.8, 1.1, 0.4)),
        (S(7.0), (0.6, 1.0, 0.2)), (S(12.5), (-0.4, 0.8, 0.0)), (S(18.5), (-0.3, 0.08, 0.0)), (LENGDE, (-0.3, 0.05, 0.0)),
    ])
    nokkel(cd, "lens", [(0, 46.0), (1.75, 46.0), (3.6, 30.0)])
    nokkel(cd.dof, "focus_distance", [(0, 0.59), (1.75, 0.54), (2.6, 1.6), (3.6, 2.6), (S(7.0), 6.5), (S(12.5), 8.4), (S(18.5), 9.35)])
    # Liten dybdeskarphet under kranen gir miniatyrpreg («tilt-shift»)
    nokkel(cd.dof, "aperture_fstop", [(0, 3.2), (1.75, 3.2), (3.6, 2.8), (S(6.0), 4.0), (S(12.5), 5.0), (S(16.5), 16.0)])

    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HER, "apning.blend"))

    meta = {"fps": FPS, "varighet": LENGDE, "vaktStart": STEMPLE_INN, "vaktSlutt": round(stemple_ut, 2), "lysAv": round(LYS_AV, 2), "frys": round(frys_t, 2), "rutepunkter": len(rute)}
    for sti_ut in (os.path.join(FILM, "apning.json"), os.path.join(ROT, "src", "lib", "apning.json")):
        with open(sti_ut, "w", encoding="utf-8") as fh:
            json.dump(meta, fh, indent=2)
    print("bygget", meta, "rute", round(total, 1), "m")


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
    sc.cycles.samples = 24
    ut = os.path.join(HER, "test_apning")
    os.makedirs(ut, exist_ok=True)
    i = sys.argv.index("--")
    tider = [float(a) for a in sys.argv[i + 3:]] if len(sys.argv) > i + 3 else [0.6, 1.75, 2.8, 4.6, 6.4, 8.0, 10.5, 12.6, 14.0, 15.2, 17.2]
    for t in tider:
        sc.frame_set(F(t))
        sc.render.filepath = os.path.join(ut, f"t{t:04.1f}.png")
        bpy.ops.render.render(write_still=True)


def render():
    bruk_gpu()
    sc = bpy.context.scene
    os.makedirs(FRAMES, exist_ok=True)
    sc.render.filepath = os.path.join(FRAMES, "####")
    sc.render.image_settings.file_format = "PNG"
    sc.render.use_overwrite = False
    sc.render.use_placeholder = True
    bpy.ops.render.render(animation=True)


def film():
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
    sc.render.filepath = os.path.join(FILM, "apning_")
    bpy.ops.render.render(animation=True)
    laget = [f for f in os.listdir(FILM) if f.startswith("apning_") and f.endswith(".mp4")]
    if laget:
        mal = os.path.join(FILM, "apning.mp4")
        if os.path.exists(mal):
            os.remove(mal)
        os.replace(os.path.join(FILM, laget[0]), mal)
    # Siste bilde ligger bak tittelen i neste scene, så overgangen blir sømløs
    shutil.copy(os.path.join(FRAMES, filer[-1]), os.path.join(FILM, "apning-slutt.png"))
    print("film ferdig", laget)


def frys():
    """Stillbildet til «Nøkkelfunn» (full kvalitet), og hvor servitøren, baren og gjestene står i det."""
    from bpy_extras.object_utils import world_to_camera_view

    bpy.ops.wm.open_mainfile(filepath=os.path.join(HER, "apning.blend"))
    bruk_gpu()
    sc = bpy.context.scene
    with open(os.path.join(ROT, "src", "lib", "apning.json"), encoding="utf-8") as fh:
        frys_t = json.load(fh)["frys"]
    sc.frame_set(F(frys_t))
    sc.render.use_motion_blur = False
    sc.cycles.samples = 160
    sc.render.filepath = os.path.join(FILM, "apning-frys.png")
    bpy.ops.render.render(write_still=True)
    dg = bpy.context.evaluated_depsgraph_get()
    cam = sc.camera.evaluated_get(dg)

    def punkt(navn, hoyde=0.0):
        o = sc.objects[navn].evaluated_get(dg)
        p = o.matrix_world.translation + Vector((0, 0, hoyde))
        v = world_to_camera_view(sc, cam, p)
        return [round(v.x, 4), round(1 - v.y, 4)]

    data = {"bilde": "film/apning-frys.png", "punkter": {"servitor": punkt("Servitør", 0.5), "bar": punkt("Disk", 0.5), "gjester": punkt("Gjest 5-0", 0.45)}}
    with open(os.path.join(ROT, "src", "lib", "frys.json"), "w", encoding="utf-8") as fh:
        json.dump(data, fh, indent=2)
    print("frys", data)


steg = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "bygg"
if steg == "bygg":
    bygg()
elif steg in ("test", "render"):
    bpy.ops.wm.open_mainfile(filepath=os.path.join(HER, "apning.blend"))
    test() if steg == "test" else render()
elif steg == "film":
    film()
elif steg == "frys":
    frys()
