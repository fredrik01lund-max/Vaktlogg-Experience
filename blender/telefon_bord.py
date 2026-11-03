"""Prøv selv – telefonen på brettet før vakten (erstatter den svevende telefonen i pastellstudioet).

Regi (7 s), etter art director-gjennomgangen 4.11:
  N1 0–1,7 s   Lavt over baren like før vakten (15:58). Ettermiddagssola faller inn fra vinduet til venstre. Telefonen
               ligger på servitørens brett ved siden av kaffekoppen og vaktlista, med svart skjerm. Barlysene bak er
               myke lysflekker (grunn dybdeskarphet).
  N2 1,6–2,2 s Skjermen våkner – appen står klar: «Hei Emma, Start vakt». Den lyser litt opp brettet rundt.
  N3 1,7–6,0 s Kameraet løfter seg i en bue og legger seg rett over telefonen. Skjermen står midt i bildet hele veien
               og lander nøyaktig der den ekte prototypen ligger i presentasjonen (src/lib/telefon.json).
  N4 6,0–7,0 s Hvile. Presentasjonen toner den ekte prototypen inn over skjermen.

Historien stemmer med appen: det er før vakten (skjermen sier «Start vakt», vaktlista sier 16:00–23:30).
Samme verden som åpningsfilmen: restauranten, brettet, papiret fra skriveren. Ingen svevende former.
Telefonmodellen gjenbrukes fra telefon_reveal.py, materialer og lys fra studio.py.

Merk: 1 enhet = 10 cm, men Blender regner 1 enhet = 1 m – derfor er f-tallene her en tidel av de «ekte».

Kjør:
  blender --background --factory-startup --python blender/telefon_bord.py -- bygg
  blender --background --factory-startup --python blender/telefon_bord.py -- test gpu [sekunder …]
  blender --background --factory-startup --python blender/telefon_bord.py -- render gpu
  blender --background --factory-startup --python blender/telefon_bord.py -- film     # -> public/film/telefon.mp4
"""

import json
import math
import os
import sys

import bpy
from mathutils import Euler, Matrix, Vector

HER = os.path.dirname(os.path.abspath(__file__))
ROT = os.path.dirname(HER)
sys.path.insert(0, HER)
_argv = sys.argv
sys.argv = [sys.argv[0], "--", "ingenting"]
import telefon_reveal as tr  # noqa: E402

sys.argv = _argv
import studio as st  # noqa: E402

FPS = 30
LENGDE = 7.0
STILLE_FRA = 6.0
BEVEGELSE_FRA = 1.7
FRAMES = os.path.join(HER, "frames_telefon")
FILM = os.path.join(ROT, "public", "film")
SKJERMBILDE = os.path.join(HER, "skjerm-sensor.png")
LINSE = 50.0  # mm, vertikal sensor 24 mm
SKJERM_ANDEL = 0.86  # skjermens høyde som andel av bildehøyden i siste bilde (presentasjonen bruker den)
TEL_ROT = math.radians(13)  # telefonen ligger litt skjevt på brettet – kameraet tar den igjen i buen
FONT = r"C:\Windows\Fonts\courbd.ttf"  # bongskriverens bokstaver


def F(t):
    return int(round(t * FPS)) + 1


def nokkel(ting, egenskap, verdier, interp=None):
    st.nokler(ting, egenskap, verdier, fps=FPS, interpolasjon=interp)


def smooth(x):
    x = max(0.0, min(1.0, x))
    return x * x * x * (x * (x * 6 - 15) + 10)


def ease_ut(x):
    x = max(0.0, min(1.0, x))
    return 1 - (1 - x) ** 3


def telefon(sk_mat, z):
    """Telefonen fra telefon_reveal, liggende med skjermen opp, toppen litt skjevt (TEL_ROT)."""
    tel = bpy.data.objects.new("Telefon", None)
    bpy.context.scene.collection.objects.link(tel)
    ramme = st.metall("Ramme", "#E8E1DA", ruhet=0.3, borstet=False)
    glass = tr.mat("Frontglass", (0, 0, 0, 1), ruhet=0.03)
    bak = tr.mat("Bakglass", tr.srgb("#F6C2D6"), ruhet=0.5, coat=0.6)
    k = tr.kropp()
    k.data.materials.append(ramme)
    k.parent = tel
    f = tr.rundet_flate("Front", tr.TW - 0.018, tr.TH - 0.018, tr.HJORNE - 0.008, tr.FRONT_Y - 0.0004)
    f.data.materials.append(glass)
    f.parent = tel
    s = tr.rundet_flate("Skjerm", tr.SW, tr.SH, tr.SKJERM_HJORNE, tr.FRONT_Y - 0.0008)
    s.data.materials.append(sk_mat)
    s.parent = tel
    b = tr.rundet_flate("Bakside", tr.TW - 0.018, tr.TH - 0.018, tr.HJORNE - 0.008, tr.FRONT_Y - 0.0004)
    b.rotation_euler = (0, 0, math.pi)
    b.data.materials.append(bak)
    b.parent = tel
    for navn, x, zz, h in (("Av/på", tr.TW / 2 + 0.004, 0.26, 0.11), ("Volum opp", -tr.TW / 2 - 0.004, 0.30, 0.07), ("Volum ned", -tr.TW / 2 - 0.004, 0.14, 0.07)):
        tr.knapp(navn, x, zz, h, ramme, tel)
    tel.rotation_euler = (math.radians(-90), 0, TEL_ROT)
    tel.location = (0, 0, z + tr.TD / 2)
    return tel


def skjerm_materiale():
    m = bpy.data.materials.new("Skjerm")
    m.use_nodes = True
    nt = m.node_tree
    p = nt.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value = (0, 0, 0, 1)
    p.inputs["Roughness"].default_value = 0.04
    p.inputs["Specular IOR Level"].default_value = 0.5
    t = nt.nodes.new("ShaderNodeTexImage")
    t.image = bpy.data.images.load(SKJERMBILDE)
    t.interpolation = "Cubic"
    nt.links.new(t.outputs["Color"], p.inputs["Emission Color"])
    p.inputs["Emission Strength"].default_value = 0.0
    return m, p


def gummi():
    """Sklisikkert gummibelegg på brettet: nesten svart, fin struktur, svak glans – roligst mot pastellskjermen."""
    m, nt, p = st._ny_mat("Gummi")
    p.inputs["Base Color"].default_value = st.srgb("#1E1C1B")
    p.inputs["Roughness"].default_value = 0.62
    tc = nt.nodes.new("ShaderNodeTexCoord")
    v = nt.nodes.new("ShaderNodeTexVoronoi")
    v.inputs["Scale"].default_value = 24.0
    v.inputs["Randomness"].default_value = 0.0
    nt.links.new(tc.outputs["Object"], v.inputs["Vector"])
    knott = nt.nodes.new("ShaderNodeMapRange")
    knott.inputs["From Min"].default_value = 0.22
    knott.inputs["From Max"].default_value = 0.3
    knott.inputs["To Min"].default_value = 1.0
    knott.inputs["To Max"].default_value = 0.0
    nt.links.new(v.outputs["Distance"], knott.inputs["Value"])
    b = nt.nodes.new("ShaderNodeBump")
    b.inputs["Strength"].default_value = 0.8
    b.inputs["Distance"].default_value = 0.004
    nt.links.new(knott.outputs["Result"], b.inputs["Height"])
    # knottene er blankslitt på toppen
    r = nt.nodes.new("ShaderNodeMapRange")
    r.inputs["To Min"].default_value = 0.66
    r.inputs["To Max"].default_value = 0.45
    nt.links.new(knott.outputs["Result"], r.inputs["Value"])
    nt.links.new(r.outputs["Result"], p.inputs["Roughness"])
    nt.links.new(b.outputs["Normal"], p.inputs["Normal"])
    return m


def vaktliste(plass, rot_z):
    """Vaktlista fra skriveren: termopapir som krøller seg i den ene enden, Courier-tekst."""
    bredde, lengde = 0.62, 1.35
    bpy.ops.mesh.primitive_plane_add(size=1, location=plass)
    o = bpy.context.active_object
    o.name = "Vaktliste"
    o.scale = (bredde, lengde, 1)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    sub = o.modifiers.new("Del", "SUBSURF")
    sub.subdivision_type = "SIMPLE"
    sub.levels = 5
    sub.render_levels = 5
    kroll = o.modifiers.new("Krøll", "SIMPLE_DEFORM")
    kroll.deform_method = "BEND"
    kroll.deform_axis = "X"
    kroll.angle = math.radians(38)
    kroll.limits = (0.0, 0.3)  # bare den nederste enden løfter seg
    tykk = o.modifiers.new("Tykkelse", "SOLIDIFY")
    tykk.thickness = 0.0015
    pm = st.papir("Termopapir", "#F7F6F2")
    pp = pm.node_tree.nodes.get("Principled BSDF")
    pp.inputs["Roughness"].default_value = 0.45
    pp.inputs["Sheen Weight"].default_value = 0.0
    o.data.materials.append(pm)
    o.rotation_euler = (0, 0, rot_z)
    font = bpy.data.fonts.load(FONT, check_existing=True)
    blekk = st.matt("Skriverblekk", "#2B2622", ruhet=0.75)
    linjer = [("BRASSERIE FJORDGATA", 0.058), ("VAKTLISTE  FRE 16.10", 0.058), ("--------------------", 0.058), ("EMMA      16:00-23:30", 0.058), ("SEKSJON 2  BORD 11-17", 0.058)]
    for i, (tekst, storrelse) in enumerate(linjer):
        tc = bpy.data.curves.new(f"Vaktliste linje {i}", "FONT")
        tc.body = tekst
        tc.font = font
        tc.size = storrelse
        tc.align_x = "LEFT"
        to = bpy.data.objects.new(f"Vaktliste linje {i}", tc)
        bpy.context.scene.collection.objects.link(to)
        to.parent = o
        to.location = (-bredde / 2 + 0.05, lengde / 2 - 0.13 - i * 0.1, 0.0025)
        to.data.materials.append(blekk)
    return o


def bygg():
    sc = st.ny_scene(fps=FPS, sekunder=LENGDE)
    st.himmel(sc, "#1E1612", 0.06)
    w = sc.world.node_tree
    bg = w.nodes["Background"]
    lp = w.nodes.new("ShaderNodeLightPath")
    tc = w.nodes.new("ShaderNodeTexCoord")
    sep = w.nodes.new("ShaderNodeSeparateXYZ")
    rampe = w.nodes.new("ShaderNodeValToRGB")
    hor = w.nodes.new("ShaderNodeBackground")
    mx = w.nodes.new("ShaderNodeMixShader")
    rampe.color_ramp.elements[0].color = st.farge("#B8B0A6")
    rampe.color_ramp.elements[1].position = 0.45
    rampe.color_ramp.elements[1].color = (0, 0, 0, 1)
    hor.inputs["Strength"].default_value = 0.6
    for a, b in ((tc.outputs["Generated"], sep.inputs[0]), (sep.outputs["Z"], rampe.inputs[0]), (rampe.outputs["Color"], hor.inputs["Color"]),
                 (lp.outputs["Is Glossy Ray"], mx.inputs[0]), (bg.outputs[0], mx.inputs[1]), (hor.outputs[0], mx.inputs[2]),
                 (mx.outputs[0], w.nodes["World Output"].inputs["Surface"])):
        w.links.new(a, b)
    BAR_Z = 0.0

    # Bardisken (mørk eik) og brettet: sklisikkert gummi i en kant av børstet stål
    st.kloss("Bardisk", (40, 28, 0.4), (0, 0, BAR_Z - 0.2), st.tre("Bardisk", lys="#8C6A4C", mork="#4A3424", skala=1.6), avfasing=0.03)
    # Et vanlig rundt serveringsbrett, 38 cm. Plassert så kanten går i en bevisst bue over øvre venstre hjørne i sluttbildet
    # (fra cirka 25 % inn på overkanten til 65 % ned på venstre kant), ikke som en tilfeldig flik i hjørnet.
    R = 1.9
    brett_x, brett_y = 0.59, -0.64
    kant_profil = [(R - 0.04, 0.0), (R + 0.1, 0.0), (R + 0.14, 0.05), (R + 0.14, 0.09), (R + 0.1, 0.1), (R + 0.03, 0.07), (R - 0.02, 0.05)]
    st.dreid("Brettkant", kant_profil, st.metall("Brettkant", "#C9CCD2", ruhet=0.3), (brett_x, brett_y, BAR_Z))
    st.sylinder("Gummi", R, 0.05, (brett_x, brett_y, BAR_Z + 0.025), gummi(), avfasing=0.004, hjorner=128)
    topp = BAR_Z + 0.05

    sk_mat, sk_bsdf = skjerm_materiale()
    tel = telefon(sk_mat, topp)
    skjerm_z = tel.location.z + tr.TD / 2 + 0.002
    C = Vector((0.0, 0.0, skjerm_z))

    vaktliste((1.28, -0.22, topp + 0.002), math.radians(53))

    # Kaffe før vakten: espressokopp på skål – bak telefonen i starten, utenfor sluttbildet
    kopp_x, kopp_y = 2.2, 1.59  # på bardisken ved siden av brettet, utenfor sluttbildet
    st.dreid("Skål", [(0.0, 0.0), (0.5, 0.0), (0.62, 0.04), (0.66, 0.07), (0.62, 0.075), (0.48, 0.03), (0.0, 0.03)], st.keramikk("Skål", "#F4EFE6"), (kopp_x, kopp_y, topp))
    st.dreid("Kopp", [(0.0, 0.0), (0.22, 0.0), (0.27, 0.05), (0.3, 0.42), (0.31, 0.45), (0.28, 0.45), (0.26, 0.07), (0.0, 0.06)], st.keramikk("Kopp", "#F4EFE6"), (kopp_x, kopp_y, topp + 0.03))
    st.sylinder("Kaffe", 0.272, 0.01, (kopp_x, kopp_y, topp + 0.4), st.matt("Kaffe", "#A8703F", ruhet=0.3, variasjon=0.2), avfasing=0.0)
    bpy.ops.mesh.primitive_torus_add(major_radius=0.1, minor_radius=0.028, major_segments=48, minor_segments=16, location=(kopp_x + 0.36, kopp_y, topp + 0.3), rotation=(math.radians(90), 0, 0))
    hank = bpy.context.active_object
    hank.name = "Hank"
    hank.scale = (0.8, 1.25, 0.7)
    bpy.ops.object.shade_smooth()
    hank.data.materials.append(st.keramikk("Hank", "#F4EFE6"))

    # Barlysene bak: varme lyspunkter langt bak, som blir store, myke lysflekker
    barlys = (
        (-5.2, 15.5, 1.5, 0.2, "#FFC27A", 5.0), (-2.4, 11.0, 0.9, 0.12, "#FFD9A8", 3.0), (-0.6, 17.0, 2.3, 0.24, "#FFB46B", 6.0),
        (1.6, 12.5, 1.2, 0.16, "#FFE0B8", 4.0), (3.4, 16.0, 1.9, 0.22, "#FFC890", 6.5), (5.4, 10.5, 0.8, 0.1, "#FFD2A0", 2.5),
        (7.8, 14.0, 1.4, 0.2, "#FFB870", 5.0), (-3.8, 18.5, 0.6, 0.3, "#E8A060", 2.0),
    )
    for i, (x, y, z, r, f, styrke) in enumerate(barlys):
        o = st.sylinder(f"Barlys {i}", r, r, (x, y, z), st.lysende(f"Barlys {i}", f, styrke * 0.3), avfasing=0.0, hjorner=24)
        o.visible_shadow = False

    # Lys: ettermiddagssol gjennom vinduet til venstre (et stort, lavt områdelys gir naturlig lysfall over brettet)
    mal = bpy.data.objects.new("Mål", None)
    sc.collection.objects.link(mal)
    mal.location = C
    st.omraadelys("Vindu", (-9.0, 1.5, 2.6), mal, 300, (4.0, 3.0), "#EEF1F4")
    sol_d = bpy.data.lights.new("Sol", "SUN")
    sol_d.energy = 7.0
    sol_d.angle = math.radians(0.53)
    sol_d.color = st.farge("#FFB877")[:3]
    sol = bpy.data.objects.new("Sol", sol_d)
    sc.collection.objects.link(sol)
    retning = Vector((-1.0, 0.45, 0.30)).normalized()  # mot sola: cirka 15° over horisonten (oktober, kl. 16), fra venstre og litt bakfra
    sol.rotation_euler = retning.to_track_quat("Z", "Y").to_euler()
    # Vinduskarmen sola skinner gjennom (utenfor bildet, kaster bare skygge): ramme med sprosser
    karm = st.matt("Karm", "#2A2420")
    vindu = bpy.data.objects.new("Vindu", None)
    sc.collection.objects.link(vindu)
    # veggen rundt vinduet (stor nok til å stenge all sol utenfor ruta), karmen og sprossene
    for navn, sx, sz, px, pz in (("Vegg venstre", 30.0, 40.0, -18.1, 0.0), ("Vegg høyre", 30.0, 40.0, 18.1, 0.0), ("Brystning", 6.4, 20.0, 0.0, -11.5),
                                  ("Overvegg", 6.4, 20.0, 0.0, 12.9), ("Sprosse", 0.18, 9.0, 0.0, 0.0), ("Losholt", 6.4, 0.2, 0.0, 0.9)):
        o = st.kloss(navn, (sx, 0.2, sz), (px, 0, pz), karm, avfasing=0.0, foreldre=vindu)
        o.visible_camera = False
        o.visible_glossy = False
    vindu.rotation_euler = retning.to_track_quat("Y", "Z").to_euler()
    # telefonen midt i den venstre ruta, så sprossenes skygger faller over brettet og ikke over telefonen
    vindu.location = C + retning * 9.0 + vindu.rotation_euler.to_matrix().col[0] * 1.3 + vindu.rotation_euler.to_matrix().col[2] * 0.4
    st.omraadelys("Fyll", (6.0, -7.0, 5.0), mal, 120, (4.0, 4.0), "#D6E0F0")
    # Bakveggen i dagslys med høye vinduer (ikke rett bak telefonen, så den svarte skjermen har kontrast før den våkner)
    st.kloss("Bakvegg", (60, 0.2, 14), (0, 20, 5), st.matt("Bakvegg", "#5A4A3E", ruhet=0.8), avfasing=0)
    dag = st.lysende("Dagslys", "#E4ECF2", 2.5)
    for x in (-5.0, -0.5, 8.0, 12.5):
        st.kloss(f"Vindu bak {x}", (3.2, 0.05, 5.0), (x, 19.85, 3.6), dag, avfasing=0)
        st.kloss(f"Sprosse bak {x}", (0.15, 0.08, 5.0), (x, 19.8, 3.6), karm, avfasing=0)
    # Noe for glasset å speile: et svakt lyst plan utenfor bildet, bare synlig i refleksjoner
    bpy.ops.mesh.primitive_plane_add(size=1, location=(-3.0, -3.5, 6.0))
    speil = bpy.context.active_object
    speil.name = "Refleksplan"
    speil.scale = (8, 4, 1)
    speil.rotation_euler = (math.radians(35), 0, math.radians(-20))
    speil.data.materials.append(st.lysende("Refleks", "#FFF3E6", 0.35))
    speil.visible_camera = False
    speil.visible_diffuse = False
    speil.visible_shadow = False

    # Skjermen våkner og lyser litt opp rundt seg
    glod_d = bpy.data.lights.new("Skjermlys", "POINT")
    glod_d.shadow_soft_size = 0.15
    glod_d.color = st.farge("#FFE3D3")[:3]
    glod = bpy.data.objects.new("Skjermlys", glod_d)
    sc.collection.objects.link(glod)
    glod.location = (0, 0, skjerm_z + 0.18)
    glod.visible_glossy = False
    glod.visible_transmission = False
    nokkel(glod_d, "energy", [(1.6, 0.0), (2.2, 11.0), (STILLE_FRA, 7.0), (LENGDE, 7.0)])
    nokkel(sk_bsdf.inputs["Emission Strength"], None, [(1.6, 0.0), (1.8, 0.35), (2.2, 1.0)])
    # Refleks i glasset mens kameraet beveger seg; ingen i hvilen – skjermen skal være nøyaktig som prototypen
    nokkel(sk_bsdf.inputs["Specular IOR Level"], None, [(0.0, 0.5), (4.5, 0.5), (5.8, 0.0)])

    # Kamera: én parameter s(t) styrer elevasjon, avstand og vinkel, så skjermen står midt i bildet hele veien
    cam = st.kamera(sc, linse=LINSE, blender=0.2, sensor=24.0)
    cam.data.sensor_fit = "VERTICAL"
    cam.data.sensor_height = 24.0
    fokus = bpy.data.objects.new("Fokus", None)
    sc.collection.objects.link(fokus)
    fokus.location = C
    cam.data.dof.focus_object = fokus
    vfov = 2 * math.atan(12 / LINSE)
    d_slutt = (tr.SH / SKJERM_ANDEL / 2) / math.tan(vfov / 2)
    d_start = 3.8
    u = Vector((-math.sin(TEL_ROT), math.cos(TEL_ROT), 0))  # telefonens «opp» (toppen)
    forrige = None
    for f in range(1, int(LENGDE * FPS) + 2):
        t = (f - 1) / FPS
        s = (t - BEVEGELSE_FRA) / (STILLE_FRA - BEVEGELSE_FRA)
        e = math.radians(7.5 + (90 - 7.5) * smooth(s))
        d = d_start - 0.12 * min(1.0, t / BEVEGELSE_FRA) + (d_slutt - d_start + 0.12) * smooth(min(1.0, max(0.0, s) * 1.25))  # svak dolly inn i N1, så lander avstanden før vinkelen
        a = math.radians(-22) * (1 - smooth(s))
        bak = (-u).copy()
        bak.rotate(Matrix.Rotation(a, 3, "Z"))
        pos = C + d * (math.cos(e) * bak + math.sin(e) * Vector((0, 0, 1)))
        fram = (C - pos).normalized()
        opp = math.sin(e) * u + math.cos(e) * Vector((0, 0, 1))  # verdens «opp» i starten, telefonens topp ovenfra
        y = (opp - fram * opp.dot(fram)).normalized()
        z = -fram
        x = y.cross(z)
        rot = Matrix((x, y, z)).transposed().to_euler("XYZ", forrige) if forrige else Matrix((x, y, z)).transposed().to_euler("XYZ")
        forrige = rot
        cam.location = pos
        cam.rotation_euler = rot
        cam.keyframe_insert("location", frame=f)
        cam.keyframe_insert("rotation_euler", frame=f)
    for fc in st._fkurver(cam.animation_data.action):
        for kp in fc.keyframe_points:
            kp.interpolation = "LINEAR"
    nokkel(cam.data.dof, "aperture_fstop", [(0.0, 0.2), (1.6, 0.2), (2.4, 0.35), (3.6, 0.6), (STILLE_FRA, 0.6), (LENGDE, 0.6)])
    cam.data.dof.aperture_blades = 0

    st.kvalitet(sc, samples=160, lukker=0.4)
    sc.frame_start, sc.frame_end = 1, int(LENGDE * FPS)
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HER, "telefon_bord.blend"))

    meta = {
        "fps": FPS,
        "bilder": int(LENGDE * FPS),
        "varighet": LENGDE,
        "bredde": 1920,
        "hoyde": 1080,
        "skjermAndel": SKJERM_ANDEL,
        "skjermForhold": tr.SW / tr.SH,
        "skjermHjorne": tr.SKJERM_HJORNE / tr.SH,
        "stilleFra": STILLE_FRA,
    }
    for sti in (os.path.join(FILM, "telefon.json"), os.path.join(ROT, "src", "lib", "telefon.json")):
        with open(sti, "w", encoding="utf-8") as fh:
            json.dump(meta, fh, indent=2)
    print("bygget", meta)


def test():
    st.bruk_gpu()
    sc = bpy.context.scene
    st.provekvalitet(sc, prosent=50, samples=48)
    ut = os.path.join(HER, "test_telefon")
    os.makedirs(ut, exist_ok=True)
    i = sys.argv.index("--")
    tider = [float(a) for a in sys.argv[i + 3:]] if len(sys.argv) > i + 3 else [0.3, 1.5, 2.3, 3.6, 4.8, 6.5]
    for t in tider:
        sc.frame_set(F(t))
        sc.render.filepath = os.path.join(ut, f"t{t:04.1f}.png")
        bpy.ops.render.render(write_still=True)


steg = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "bygg"
if steg == "bygg":
    bygg()
elif steg in ("test", "render"):
    bpy.ops.wm.open_mainfile(filepath=os.path.join(HER, "telefon_bord.blend"))
    if steg == "test":
        test()
    else:
        st.bruk_gpu()
        st.render_bilder(bpy.context.scene, FRAMES)
elif steg == "film":
    st.film(bpy.context.scene, FRAMES, os.path.join(FILM, "telefon.mp4"), fps=FPS)
