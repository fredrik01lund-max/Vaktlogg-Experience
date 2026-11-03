"""Test/iterasjon – «Frem og tilbake»: vi hoppet mellom innsikt og prototype hele veien.

To lange pastellbaner gjennom rommet: innsikt (mint) og prototype (fersken). En lysende rosa kule – samme spor som
servitøren la igjen i åpningen – spretter fra bane til bane mens kameraet følger med fremover i tid. Hvert nedslag
løfter opp et lite symbol for det som skjedde (snakkeboble, øye, skisse, telefon, Sir Domeo-klokka …), og sporet
blir et sikksakkmønster. Til slutt løfter kameraet seg og viser hele mønsteret ovenfra.

Hendelsene (tekstene legges på i presentasjonen, i takt med filmen) står i HENDELSER og skrives til src/lib/hopping.json.

Kjør:
  blender --background --factory-startup --python blender/hopping.py -- bygg
  blender --background --factory-startup --python blender/hopping.py -- test gpu
  blender --background --factory-startup --python blender/hopping.py -- render gpu
  blender --background --factory-startup --python blender/hopping.py -- film      # -> public/film/hopping.mp4
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
_argv = sys.argv
sys.argv = [sys.argv[0], "--", "ingenting"]
import telefon_reveal as tr  # noqa: E402

sys.argv = _argv

FRAMES = os.path.join(HER, "frames_hopping")
FILM = os.path.join(ROT, "public", "film")
FPS = 30
LENGDE = 20.0
SLUTT = int(LENGDE * FPS)

# (bane, symbol, tekst) – dokumentert i prosjektbeskrivelsen (Dok. A §2–§8)
HENDELSER = [
    ("innsikt", "boble", "Intervjuer og samtaler: fra sykefravær til motivasjon"),
    ("prototype", "lyspære", "Første idé: «Strava for jobben»"),
    ("innsikt", "oye", "Observasjon: kassarapporten etter vakten"),
    ("prototype", "merke", "Skritt + salg = Vaktlogg"),
    ("innsikt", "boble", "Tidlig prototype vist til servitører"),
    ("prototype", "telefon", "Digital prototype på nett (22.–27.10)"),
    ("innsikt", "folk", "Testere prøver uten oss til stede"),
    ("prototype", "klokke", "Sir Domeo – guiden (28.–29.10)"),
    ("innsikt", "bord", "Ønske: oversikt over egne gjester"),
    ("prototype", "brev", "Tilbakemelding rett fra appen (30.10)"),
    ("innsikt", "boble", "Nye innspill …"),
]
BANE_Y = {"innsikt": 1.1, "prototype": -1.1}
FARGE = {"innsikt": "#BFE9D3", "prototype": "#FFD9B3"}
STERK = {"innsikt": "#7CC9A1", "prototype": "#F5B46E"}
DX = 2.2  # avstand mellom nedslagene langs tidsaksen
Z0 = 0.4  # kulas sentrum når den ligger på en bane (platen er 0,2 høy, kula 0,2 i radius)


def F(t):
    return int(round(t * FPS)) + 1


def nokkel(ting, egenskap, verdier):
    for t, v in verdier:
        if isinstance(ting, bpy.types.NodeSocket):
            ting.default_value = v
            ting.keyframe_insert("default_value", frame=F(t))
        else:
            setattr(ting, egenskap, v)
            ting.keyframe_insert(egenskap, frame=F(t))


def mat(navn, farge, ruhet=0.45, emisjon=None, styrke=0.0, coat=0.0):
    m = tr.mat(navn, tr.srgb(farge), ruhet=ruhet, coat=coat)
    if emisjon:
        p = m.node_tree.nodes.get("Principled BSDF")
        p.inputs["Emission Color"].default_value = tr.srgb(emisjon)
        p.inputs["Emission Strength"].default_value = styrke
    return m


def lag(navn, parent, bygg_fn):
    o = bpy.data.objects.new(navn, None)
    bpy.context.scene.collection.objects.link(o)
    o.parent = parent
    for d in bygg_fn():
        d.parent = o
    return o


def prim(kind, **kw):
    getattr(bpy.ops.mesh, f"primitive_{kind}_add")(**kw)
    o = bpy.context.active_object
    if kind in ("uv_sphere", "torus", "cylinder", "cone"):
        bpy.ops.object.shade_smooth()
    return o


def avrund(o, w=0.04, seg=4):
    b = o.modifiers.new("Rund", "BEVEL")
    b.width = w
    b.segments = seg
    return o


def symbol(art, m, m2):
    """Små pastellsymboler (ca. 0,6 høye), bygd av enkle former."""
    deler = []

    def legg(o, materiale):
        o.data.materials.append(materiale)
        deler.append(o)
        return o

    if art == "boble":
        b = legg(avrund(prim("cube", size=1, location=(0, 0, 0.42)), 0.12, 6), m)
        b.scale = (0.62, 0.16, 0.42)
        legg(prim("cone", radius1=0.1, radius2=0.0, depth=0.18, location=(-0.16, 0, 0.14), rotation=(math.radians(180), 0, math.radians(20))), m)
        for i in range(3):
            legg(prim("uv_sphere", radius=0.045, location=(-0.14 + i * 0.14, -0.09, 0.42)), m2)
    elif art == "oye":
        o = legg(prim("uv_sphere", radius=0.3, location=(0, 0, 0.4)), m)
        o.scale = (1.0, 0.45, 0.62)
        legg(prim("uv_sphere", radius=0.12, location=(0, -0.11, 0.4)), m2)
    elif art == "lyspære":
        legg(prim("uv_sphere", radius=0.24, location=(0, 0, 0.5)), m)
        legg(prim("cylinder", radius=0.11, depth=0.16, location=(0, 0, 0.2)), m2)
    elif art == "merke":
        r = legg(prim("torus", major_radius=0.25, minor_radius=0.05, location=(0, 0, 0.42), rotation=(math.radians(90), 0, 0)), m)
        _ = r
        for s in (-1, 1):
            v = legg(prim("cylinder", radius=0.04, depth=0.24, location=(s * 0.05, -0.02, 0.42), rotation=(math.radians(90), math.radians(s * 25), 0)), m2)
            v.rotation_euler = (0, math.radians(-s * 25), 0)
    elif art == "telefon":
        t = legg(avrund(prim("cube", size=1, location=(0, 0, 0.42)), 0.05), m2)
        t.scale = (0.3, 0.06, 0.6)
        s = legg(avrund(prim("cube", size=1, location=(0, -0.032, 0.42)), 0.03), m)
        s.scale = (0.25, 0.01, 0.52)
    elif art == "folk":
        for i, x in enumerate((-0.2, 0.0, 0.2)):
            legg(prim("cylinder", radius=0.08, depth=0.26, location=(x, 0, 0.18 + (i == 1) * 0.04)), m)
            legg(prim("uv_sphere", radius=0.07, location=(x, 0, 0.4 + (i == 1) * 0.04)), m2)
    elif art == "klokke":
        # Sir Domeo: sølvklokke med knott på et fat
        legg(prim("cylinder", radius=0.3, depth=0.03, location=(0, 0, 0.12)), m2)
        k = legg(prim("uv_sphere", radius=0.26, location=(0, 0, 0.13)), m2)
        k.scale = (1, 1, 0.85)
        legg(prim("uv_sphere", radius=0.045, location=(0, 0, 0.37)), m)
    elif art == "bord":
        legg(prim("cylinder", radius=0.28, depth=0.05, location=(0, 0, 0.3)), m)
        legg(prim("cylinder", radius=0.04, depth=0.28, location=(0, 0, 0.14)), m2)
        legg(prim("cylinder", radius=0.07, depth=0.015, location=(0.1, 0, 0.335)), m2)
    elif art == "brev":
        b = legg(avrund(prim("cube", size=1, location=(0, 0, 0.36)), 0.03), m)
        b.scale = (0.56, 0.08, 0.38)
        h = legg(prim("uv_sphere", radius=0.07, location=(0, -0.06, 0.36)), m2)
        h.scale = (1, 0.5, 1)
    return deler


def bygg():
    sc = tr.tom_scene()
    sc.cycles.samples = 64
    sc.render.fps = FPS
    sc.frame_start, sc.frame_end = 1, SLUTT
    sc.render.use_motion_blur = True
    sc.render.motion_blur_shutter = 0.4
    # Standard-visning (som telefonfilmen): pastellfargene blir de samme som i appen og presentasjonen
    sc.view_settings.view_transform = "Standard"
    sc.view_settings.look = "None"
    bg = sc.world.node_tree.nodes.get("Background")
    bg.inputs["Color"].default_value = tr.srgb("#FFF3EA")
    bg.inputs["Strength"].default_value = 0.35

    n = len(HENDELSER)
    lengde_x = (n + 1) * DX

    # Gulv i lys fersken (demoens bakgrunn), og de to banene som tykke, avrundede plater
    gulv = prim("plane", size=1, location=(lengde_x / 2 - DX, 0, 0))
    gulv.scale = (lengde_x + 60, 60, 1)
    gulv.data.materials.append(mat("Gulv", "#FFE6D8", ruhet=0.75))
    x0, x1 = -4.2, n * DX
    for bane, y in BANE_Y.items():
        b = avrund(prim("cube", size=1, location=((x0 + x1) / 2, y, 0.1)), 0.08, 6)
        b.scale = (x1 - x0, 1.5, 0.2)
        b.data.materials.append(mat(f"Bane {bane}", FARGE[bane], ruhet=0.45, coat=0.25))
        # Navnet på banen, liggende på platen der den begynner
        tc = bpy.data.curves.new(f"Navn {bane}", "FONT")
        tc.body = "INNSIKT" if bane == "innsikt" else "PROTOTYPE"
        tc.size = 0.42
        tc.extrude = 0.012
        tc.align_x = "LEFT"
        tc.align_y = "CENTER"
        tc.space_character = 1.15
        to = bpy.data.objects.new(f"Navn {bane}", tc)
        sc.collection.objects.link(to)
        to.location = (x0 + 0.35, y, 0.205)
        to.data.materials.append(mat(f"Navn {bane}", STERK[bane], ruhet=0.4))

    # Kula som spretter fra bane til bane, og sporet den legger igjen
    m_kule = mat("Kule", "#F08FB0", ruhet=0.25, emisjon="#F08FB0", styrke=0.9)
    kule = prim("uv_sphere", radius=0.2, location=(0, 0, 0))
    kule.data.materials.append(m_kule)
    lys_k = bpy.data.lights.new("Kulelys", "POINT")
    lys_k.color = tr.srgb("#F7A8C6")[:3]
    lys_k.energy = 45
    lys_k.shadow_soft_size = 0.2
    lo = bpy.data.objects.new("Kulelys", lys_k)
    sc.collection.objects.link(lo)
    lo.parent = kule

    # Nedslagene og tidene: rolig først, så stadig raskere (som i åpningen)
    start, slutt = 1.2, 15.2
    vekter = [1.0 - 0.45 * i / (n - 1) for i in range(n)]
    sk = (slutt - start) / sum(vekter)
    tider, t = [], start
    for v in vekter:
        tider.append(t)
        t += v * sk
    punkter = []
    for i, (bane, art, tekst) in enumerate(HENDELSER):
        punkter.append(Vector((i * DX, BANE_Y[bane], Z0)))

    # Sporet: en kurve gjennom buene mellom nedslagene, som vokser i takt med kula
    cu = bpy.data.curves.new("Spor", "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = 0.06
    cu.bevel_resolution = 4
    cu.bevel_factor_mapping_end = "SPLINE"
    sp = cu.splines.new("POLY")
    bue = []
    start_p = Vector((-DX, 0, Z0 + 0.9))
    alle = [start_p] + punkter
    for i in range(1, len(alle)):
        a, b = alle[i - 1], alle[i]
        for j in range(1, 13):
            u = j / 12
            p = a.lerp(b, u)
            p.z = a.z + (b.z - a.z) * u + math.sin(u * math.pi) * 1.5
            bue.append(p)
    sp.points.add(len(bue))
    sp.points[0].co = (*start_p, 1)
    for i, p in enumerate(bue):
        sp.points[i + 1].co = (*p, 1)
    m_spor = mat("Spor", "#F08FB0", ruhet=0.35, emisjon="#F08FB0", styrke=0.55)
    cu.materials.append(m_spor)
    spor = bpy.data.objects.new("Spor", cu)
    sc.collection.objects.link(spor)

    # Kula følger buene (lineært mellom punktene på buen, så hastigheten blir jevn i hver bue)
    pref = bpy.context.preferences.edit
    pref.keyframe_new_interpolation_type = "LINEAR"
    alle_t = [start - 0.6] + tider
    totalt = len(bue) + 1
    for i in range(1, len(alle)):
        t0, t1 = alle_t[i - 1], alle_t[i]
        for j in range(0, 13):
            u = j / 12
            idx = (i - 1) * 12 + j  # punktnummer i sporet
            tt = t0 + (t1 - t0) * u
            p = alle[i - 1] if j == 0 else bue[(i - 1) * 12 + j - 1]
            kule.location = p
            kule.keyframe_insert("location", frame=F(tt))
            cu.bevel_factor_end = idx / (totalt - 1)
            cu.keyframe_insert("bevel_factor_end", frame=F(tt))
    pref.keyframe_new_interpolation_type = "BEZIER"
    # Etter siste nedslag: kula blir liggende og pulserer
    kule.keyframe_insert("location", frame=F(LENGDE))

    # Symbolene spretter opp der kula lander, med en ring i banens sterke farge
    for i, (bane, art, tekst) in enumerate(HENDELSER):
        m = mat(f"Symbol {i}", "#FFFFFF", ruhet=0.35, coat=0.3)
        m2 = mat(f"Symbol {i} b", STERK[bane] if art != "klokke" else "#D9DADF", ruhet=0.3, coat=0.4)
        if art == "klokke":
            m2.node_tree.nodes.get("Principled BSDF").inputs["Metallic"].default_value = 0.9
        holder = bpy.data.objects.new(f"Hendelse {i}", None)
        sc.collection.objects.link(holder)
        holder.location = (punkter[i].x + 0.55, BANE_Y[bane] + (0.3 if bane == "innsikt" else -0.3), 0.2)
        for d in symbol(art, m, m2):
            d.parent = holder
        holder.scale = (0, 0, 0)
        holder.keyframe_insert("scale", frame=1)
        for tt, s in ((tider[i] - 0.02, 0.0), (tider[i] + 0.18, 1.9), (tider[i] + 0.36, 1.55)):
            holder.scale = (s, s, s)
            holder.keyframe_insert("scale", frame=F(tt))
        nokkel(holder, "rotation_euler", [(tider[i], (0, 0, math.radians(-25))), (LENGDE, (0, 0, math.radians(15)))])
        ring = prim("torus", major_radius=0.35, minor_radius=0.035, location=(punkter[i].x, BANE_Y[bane], 0.22))
        rm = mat(f"Ring {i}", STERK[bane], emisjon=STERK[bane], styrke=0.8)
        ring.data.materials.append(rm)
        ring.scale = (0, 0, 0)
        ring.keyframe_insert("scale", frame=1)
        for tt, s in ((tider[i] - 0.01, 0.0), (tider[i] + 0.02, 0.6), (tider[i] + 0.7, 2.2)):
            ring.scale = (s, s, s)
            ring.keyframe_insert("scale", frame=F(tt))
        nokkel(rm.node_tree.nodes.get("Principled BSDF").inputs["Alpha"], None, [(tider[i], 1.0), (tider[i] + 0.65, 0.0)])

    # Lys: mykt, høyt sollys med lange, myke skygger mot høyre (tiden går den veien)
    sol_d = bpy.data.lights.new("Sol", "SUN")
    sol_d.energy = 2.3
    sol_d.angle = math.radians(14)
    sol_d.color = tr.srgb("#FFF4EC")[:3]
    sol = bpy.data.objects.new("Sol", sol_d)
    sc.collection.objects.link(sol)
    sol.rotation_euler = Vector((0.45, 0.35, -0.82)).normalized().to_track_quat("-Z", "Y").to_euler()

    # Kamera: følger kula ovenfra og skrått fra siden, og løfter seg til slutt over hele mønsteret
    cd = bpy.data.cameras.new("Kamera")
    cd.lens = 35
    cd.sensor_fit = "VERTICAL"
    cd.sensor_height = 24
    cd.dof.use_dof = True
    cd.dof.aperture_fstop = 4.0
    cam = bpy.data.objects.new("Kamera", cd)
    sc.collection.objects.link(cam)
    sc.camera = cam
    mal = bpy.data.objects.new("Mål", None)
    sc.collection.objects.link(mal)
    cd.dof.focus_object = mal
    tt_ = cam.constraints.new("TRACK_TO")
    tt_.target = mal
    tt_.track_axis = "TRACK_NEGATIVE_Z"
    tt_.up_axis = "UP_Y"
    # Følger kula: én nøkkel per nedslag, med kula litt foran midten av bildet (den er på vei videre)
    folg = [(0.0, -DX + 0.6)] + [(tider[i], punkter[i].x + 0.7) for i in range(n)] + [(tider[-1] + 0.5, punkter[-1].x + 0.4)]
    cx = (x0 + x1) / 2
    nokkel(cam, "location", [(t, (x - 0.8, -6.6, 4.9)) for t, x in folg] + [(18.2, (cx, -2.6, 25.0)), (LENGDE, (cx, -2.4, 25.4))])
    nokkel(mal, "location", [(t, (x, -0.15, 0.35)) for t, x in folg] + [(18.2, (cx, 0.0, 0.0)), (LENGDE, (cx, 0.0, 0.0))])
    nokkel(cd.dof, "aperture_fstop", [(0, 2.8), (tider[-1], 3.2), (17.4, 32.0)])

    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HER, "hopping.blend"))
    meta = {"fps": FPS, "varighet": LENGDE, "hendelser": [{"bane": b, "tekst": t, "tid": round(tider[i], 2)} for i, (b, _, t) in enumerate(HENDELSER)]}
    for sti in (os.path.join(FILM, "hopping.json"), os.path.join(ROT, "src", "lib", "hopping.json")):
        with open(sti, "w", encoding="utf-8") as fh:
            json.dump(meta, fh, indent=2, ensure_ascii=False)
    print("bygget", n, "hendelser")


def test():
    tr.bruk_gpu()
    sc = bpy.context.scene
    sc.render.resolution_percentage = 50
    sc.cycles.samples = 24
    ut = os.path.join(HER, "test_hopping")
    os.makedirs(ut, exist_ok=True)
    for t in (0.5, 2.5, 5.0, 8.0, 11.0, 14.0, 16.5, 19.5):
        sc.frame_set(F(t))
        sc.render.filepath = os.path.join(ut, f"t{t:04.1f}.png")
        bpy.ops.render.render(write_still=True)


def render():
    tr.bruk_gpu()
    sc = bpy.context.scene
    os.makedirs(FRAMES, exist_ok=True)
    sc.render.filepath = os.path.join(FRAMES, "####")
    sc.render.image_settings.file_format = "PNG"
    sc.render.use_overwrite = False
    sc.render.use_placeholder = True
    bpy.ops.render.render(animation=True)


def film():
    sc = bpy.context.scene
    sc.render.resolution_x, sc.render.resolution_y = tr.BREDDE, tr.HOYDE
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
    sc.render.filepath = os.path.join(FILM, "hopping_")
    bpy.ops.render.render(animation=True)
    laget = [f for f in os.listdir(FILM) if f.startswith("hopping_") and f.endswith(".mp4")]
    if laget:
        mal = os.path.join(FILM, "hopping.mp4")
        if os.path.exists(mal):
            os.remove(mal)
        os.replace(os.path.join(FILM, laget[0]), mal)
    shutil.copy(os.path.join(FRAMES, filer[-1]), os.path.join(FILM, "hopping-slutt.png"))
    print("film ferdig", laget)


steg = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "bygg"
if steg == "bygg":
    bygg()
elif steg in ("test", "render"):
    bpy.ops.wm.open_mainfile(filepath=os.path.join(HER, "hopping.blend"))
    test() if steg == "test" else render()
elif steg == "film":
    film()
