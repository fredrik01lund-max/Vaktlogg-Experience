"""Ideate – «Alt vi pakket inn»: ideene fra innsikten blir til én prototype.

Ekte skjermbilder av funksjonene i Vaktlogg svever som kort rundt telefonen (samme telefon og pastellstudio som
i prototype-avsløringen). Ett og ett flyr de inn i skjermen – stadig raskere – og telefonen viser funksjonen idet
den lander, med en pastellring i fargen til funksjonen (samme betydning som i appen). Til slutt er alt pakket inn.

Kortene lages av scratchpad-skriptet xp-kort.mjs (skjermbilder fra prototypen) og ligger i blender/kort/.

Kjør:
  blender --background --factory-startup --python blender/pakket_ideer.py -- bygg
  blender --background --factory-startup --python blender/pakket_ideer.py -- test gpu
  blender --background --factory-startup --python blender/pakket_ideer.py -- render gpu
  blender --background --factory-startup --python blender/pakket_ideer.py -- film      # -> public/film/pakket.mp4
"""

import bpy
import json
import math
import os
import shutil
import sys

HER = os.path.dirname(os.path.abspath(__file__))
ROT = os.path.dirname(HER)
sys.path.insert(0, HER)
# Gjenbruk telefonen og studioet fra prototype-avsløringen (uten å kjøre det skriptets eget steg)
_argv = sys.argv
sys.argv = [sys.argv[0], "--", "ingenting"]
import telefon_reveal as tr  # noqa: E402

sys.argv = _argv

FRAMES = os.path.join(HER, "frames_pakket")
FILM = os.path.join(ROT, "public", "film")
KORT = os.path.join(HER, "kort")
FPS = 30
LENGDE = 16.0
SLUTT = int(LENGDE * FPS)


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


def bildeflate(navn, fil, bredde, emisjon=1.0):
    """Kort: et plan i XZ (vender mot −Y) med bildet og gjennomsiktige hjørner."""
    img = bpy.data.images.load(fil)
    w, h = img.size
    hoyde = bredde * h / w
    bpy.ops.mesh.primitive_plane_add(size=1)
    o = bpy.context.active_object
    o.name = navn
    o.rotation_euler = (math.radians(90), 0, 0)
    o.scale = (bredde, hoyde, 1)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    m = bpy.data.materials.new(navn)
    try:
        m.use_nodes = True
    except Exception:
        pass
    nt = m.node_tree
    p = nt.nodes.get("Principled BSDF")
    t = nt.nodes.new("ShaderNodeTexImage")
    t.image = img
    t.interpolation = "Cubic"
    # Selvlysende som en skjerm: bildet vises med sine egne farger, uansett lys
    p.inputs["Base Color"].default_value = (0, 0, 0, 1)
    nt.links.new(t.outputs["Color"], p.inputs["Emission Color"])
    nt.links.new(t.outputs["Alpha"], p.inputs["Alpha"])
    p.inputs["Emission Strength"].default_value = emisjon
    p.inputs["Roughness"].default_value = 0.25
    p.inputs["Specular IOR Level"].default_value = 0.2
    o.data.materials.append(m)
    return o, hoyde


def skjermmontasje(filer):
    """Telefonskjermen: viser ett av bildene om gangen (blandinger med nøkler). Returnerer (materiale, blandere)."""
    m = bpy.data.materials.new("Skjermmontasje")
    try:
        m.use_nodes = True
    except Exception:
        pass
    nt = m.node_tree
    p = nt.nodes.get("Principled BSDF")
    p.inputs["Base Color"].default_value = (0, 0, 0, 1)
    p.inputs["Roughness"].default_value = 0.04
    p.inputs["Specular IOR Level"].default_value = 0.15
    p.inputs["Emission Strength"].default_value = 1.0
    tex = []
    for f in filer:
        t = nt.nodes.new("ShaderNodeTexImage")
        t.image = bpy.data.images.load(f)
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
    nt.links.new(forrige, p.inputs["Emission Color"])
    return m, blandere


def bygg():
    sc = tr.tom_scene()
    sc.cycles.samples = 64
    sc.render.fps = FPS
    sc.frame_start, sc.frame_end = 1, SLUTT
    sc.render.use_motion_blur = True
    sc.render.motion_blur_shutter = 0.4
    bg = sc.world.node_tree.nodes.get("Background")
    bg.inputs["Color"].default_value = tr.srgb("#FFF3EA")
    bg.inputs["Strength"].default_value = 0.45

    kort = json.load(open(os.path.join(KORT, "kort.json"), encoding="utf-8"))

    # ── Telefonen (samme som i avsløringen) ──
    tel = bpy.data.objects.new("Telefon", None)
    sc.collection.objects.link(tel)
    ramme = tr.mat("Ramme", tr.srgb("#E8E1DA"), metall=1.0, ruhet=0.28)
    glass = tr.mat("Frontglass", (0, 0, 0, 1), ruhet=0.03)
    k = tr.kropp()
    k.data.materials.append(ramme)
    k.parent = tel
    f = tr.rundet_flate("Front", tr.TW - 0.018, tr.TH - 0.018, tr.HJORNE - 0.008, tr.FRONT_Y - 0.0004)
    f.data.materials.append(glass)
    f.parent = tel
    filer = [os.path.join(HER, "skjerm.png")] + [os.path.join(KORT, "hel", f"{k_['id']}.png") for k_ in kort]
    sk_mat, blandere = skjermmontasje(filer)
    s = tr.rundet_flate("Skjerm", tr.SW, tr.SH, tr.SKJERM_HJORNE, tr.FRONT_Y - 0.0008)
    s.data.materials.append(sk_mat)
    s.parent = tel
    tr.knapp("Av/på", tr.TW / 2 + 0.004, 0.26, 0.11, ramme, tel)
    tr.knapp("Volum opp", -tr.TW / 2 - 0.004, 0.30, 0.07, ramme, tel)
    tr.knapp("Volum ned", -tr.TW / 2 - 0.004, 0.14, 0.07, ramme, tel)

    # Bakteppet i pastell
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 7.0, 0.4), rotation=(math.pi / 2, 0, 0))
    gp = bpy.context.active_object
    gp.scale = (40, 26, 1)
    gp.data.materials.append(tr.bakteppe_materiale())

    # ── Kortene: i en bue rundt telefonen, flyr inn ett og ett – stadig raskere ──
    n = len(kort)
    start, slutt = 2.2, 11.4
    # Tidspunktene: avstanden krymper fra 1,15 s til 0,5 s
    vekter = [1.15 - 0.65 * i / (n - 1) for i in range(n)]
    skala = (slutt - start) / sum(vekter)
    tider = []
    t = start
    for v in vekter:
        tider.append(t)
        t += v * skala
    for i, k_ in enumerate(kort):
        a = math.pi * (0.5 + (i + 0.5) / n * 2.0)  # rundt hele telefonen
        x = math.cos(a) * 2.55
        z = math.sin(a) * 1.45 + 0.05
        y = -0.35 + ((i * 37) % 5 - 2) * 0.28
        kort_o, h = bildeflate(f"Kort {k_['id']}", os.path.join(KORT, f"kort-{k_['id']}.png"), 0.56)
        holder = bpy.data.objects.new(f"Holder {k_['id']}", None)
        sc.collection.objects.link(holder)
        kort_o.parent = holder
        inn = 0.15 + i * 0.09
        ankomst = tider[i]
        avgang = ankomst - 0.55
        vri = math.radians(((i * 53) % 21) - 10)
        # Svever på plass, så flyr inn i skjermen (litt bue, krymper og retter seg opp)
        nokkel(holder, "location", [(inn, (x * 1.15, y + 0.6, z * 1.15)), (inn + 0.6, (x, y, z)), (avgang, (x * 0.97, y - 0.05, z * 0.97)), (avgang + 0.3, (x * 0.4, -0.9, z * 0.4 + 0.12)), (ankomst, (0, tr.FRONT_Y - 0.05, 0))])
        nokkel(holder, "rotation_euler", [(inn, (0, vri * 1.5, vri)), (avgang, (0, vri, vri * 0.5)), (ankomst, (0, 0, 0))])
        holder.scale = (0, 0, 0)
        holder.keyframe_insert("scale", frame=1)
        for tt, sk in ((inn, 0.0), (inn + 0.35, 1.08), (inn + 0.5, 1.0), (avgang + 0.2, 1.0), (ankomst - 0.04, 0.45), (ankomst + 0.02, 0.0)):
            holder.scale = (sk, sk, sk)
            holder.keyframe_insert("scale", frame=F(tt))
        # Skjermen viser funksjonen idet kortet lander
        nokkel(blandere[i], None, [(ankomst - 0.08, 0.0), (ankomst, 1.0)])  # minst to bilder mellom nøklene
        # En pastellring i funksjonens farge pulserer ut fra telefonen
        bpy.ops.mesh.primitive_torus_add(major_radius=0.62, minor_radius=0.025, major_segments=96, minor_segments=12, location=(0, tr.FRONT_Y - 0.06, 0), rotation=(math.pi / 2, 0, 0))
        ring = bpy.context.active_object
        ring.name = f"Puls {k_['id']}"
        rm = tr.mat(f"Puls {k_['id']}", tr.srgb(k_["farge"]), ruhet=0.4)
        rp = rm.node_tree.nodes.get("Principled BSDF")
        rp.inputs["Emission Color"].default_value = tr.srgb(k_["farge"])
        ring.data.materials.append(rm)
        ring.scale = (0, 0, 0)
        ring.keyframe_insert("scale", frame=1)
        for tt, sk in ((ankomst - 0.01, 0.0), (ankomst + 0.02, 0.8), (ankomst + 0.6, 2.6)):
            ring.scale = (sk, sk, sk)
            ring.keyframe_insert("scale", frame=F(tt))
        nokkel(rp.inputs["Emission Strength"], None, [(ankomst, 0.0), (ankomst + 0.05, 3.0), (ankomst + 0.6, 0.0)])
        nokkel(rp.inputs["Alpha"], None, [(ankomst, 1.0), (ankomst + 0.55, 0.0)])
    # Telefonen «svelger» hvert kort
    nokkel(tel, "scale", [(0, (1, 1, 1))] + [x for tt in tider for x in ((tt - 0.02, (1, 1, 1)), (tt + 0.06, (1.035, 1.035, 1.035)), (tt + 0.22, (1, 1, 1)))])
    # Til slutt: alt er pakket inn – skjermen hviler på vakten som pågår (kortet «Vakten live»)
    live = [i for i, k_ in enumerate(kort) if k_["id"] == "live"][0]
    for i in range(live + 1, n):
        nokkel(blandere[i], None, [(slutt + 0.4, 1.0), (slutt + 0.5, 0.0)])

    # Når alt er pakket inn: de fire pastellringene (fargene på appens fire bokser) glir inn rundt telefonen
    for i, (farge, plass, rr, vri) in enumerate((
        ("#F4A6C2", (-1.45, -0.9, 0.62), 0.36, (70, 20, 10)),
        ("#FFC48E", (1.5, 0.6, -0.5), 0.46, (60, -30, 40)),
        ("#F7D774", (1.05, -1.2, 0.95), 0.26, (20, 60, 0)),
        ("#9EDDBE", (-1.6, 0.9, -0.85), 0.42, (80, 10, -30)),
    )):
        bpy.ops.mesh.primitive_torus_add(major_radius=rr, minor_radius=rr * 0.24, major_segments=96, minor_segments=32, rotation=tuple(math.radians(a) for a in vri))
        ro = bpy.context.active_object
        bpy.ops.object.shade_smooth()
        ro.data.materials.append(tr.mat(f"Ring {i}", tr.srgb(farge), ruhet=0.38, coat=0.35))
        x, y, z = plass
        inn = slutt + 0.3 + i * 0.18
        nokkel(ro, "location", [(inn, (x * 2.6, y - 2.0, z * 2.6)), (inn + 1.2, (x, y, z)), (LENGDE, (x * 1.05, y, z * 1.05 + 0.08))])
        nokkel(ro, "rotation_euler", [(inn, tuple(math.radians(a) for a in vri)), (LENGDE, tuple(math.radians(a + 40 + 15 * i) for a in vri))])

    # Lys
    hoved = tr.lys("Hovedlys", (-4.5, -5.5, 4.0), tr.srgb("#FFF1E4"), 1000, (4.0, 4.0), tel)
    _ = hoved
    tr.lys("Fyllys", (5.0, -6.0, -1.0), tr.srgb("#FDE3EC"), 450, (5.0, 5.0), tel)
    tr.lys("Kantlys venstre", (-3.2, 2.6, 0.8), tr.srgb("#FFC48E"), 800, (0.35, 5.0), tel)
    tr.lys("Kantlys høyre", (3.2, 2.6, 0.2), tr.srgb("#F4A6C2"), 800, (0.35, 5.0), tel)

    # Kamera: rolig bevegelse rundt telefonen, litt nærmere mot slutten
    cd = bpy.data.cameras.new("Kamera")
    cd.lens = 50
    cd.sensor_fit = "VERTICAL"
    cd.sensor_height = 24
    cd.dof.use_dof = True
    cd.dof.aperture_fstop = 3.5
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
    nokkel(cam, "location", [(0, (-1.3, -7.9, 0.8)), (8.0, (0.3, -7.6, 0.45)), (12.0, (0.7, -6.2, 0.3)), (LENGDE, (0.9, -5.6, 0.25))])
    nokkel(mal, "location", [(0, (0, 0, 0.0)), (LENGDE, (0, 0, 0.0))])

    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HER, "pakket.blend"))
    meta = {"fps": FPS, "varighet": LENGDE, "kort": [{"id": k_["id"], "navn": k_["navn"], "farge": k_["farge"], "tid": round(tider[i], 2)} for i, k_ in enumerate(kort)]}
    for sti in (os.path.join(FILM, "pakket.json"), os.path.join(ROT, "src", "lib", "pakket.json")):
        with open(sti, "w", encoding="utf-8") as fh:
            json.dump(meta, fh, indent=2, ensure_ascii=False)
    print("bygget", len(kort), "kort")


def test():
    tr.bruk_gpu()
    sc = bpy.context.scene
    sc.render.resolution_percentage = 50
    sc.cycles.samples = 24
    ut = os.path.join(HER, "test_pakket")
    os.makedirs(ut, exist_ok=True)
    for t in (0.6, 1.8, 3.0, 5.5, 8.0, 10.5, 12.0, 15.5):
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
    sc.render.filepath = os.path.join(FILM, "pakket_")
    bpy.ops.render.render(animation=True)
    laget = [f for f in os.listdir(FILM) if f.startswith("pakket_") and f.endswith(".mp4")]
    if laget:
        mal = os.path.join(FILM, "pakket.mp4")
        if os.path.exists(mal):
            os.remove(mal)
        os.replace(os.path.join(FILM, laget[0]), mal)
    shutil.copy(os.path.join(FRAMES, filer[-1]), os.path.join(FILM, "pakket-slutt.png"))
    print("film ferdig", laget)


steg = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "bygg"
if steg == "bygg":
    bygg()
elif steg in ("test", "render"):
    bpy.ops.wm.open_mainfile(filepath=os.path.join(HER, "pakket.blend"))
    test() if steg == "test" else render()
elif steg == "film":
    film()
