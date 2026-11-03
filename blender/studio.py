"""Felles håndverk for alle filmene: materialer, lys, avfasing, render- og filminnstillinger.

Målet er at de fire filmene ser ut som de hører sammen – samme lys, samme overflater og samme farger som
prototypen – og at ingenting ser ut som en standardprimitiv: kanter er avfaset, overflater har små variasjoner,
og lyset kommer fra et sted.

Brukes slik i et filmskript:
    import studio as st
    sc = st.ny_scene(fps=30, sekunder=12)
    tre = st.tre("Bordplate")
    ...
    st.kvalitet(sc, samples=192)
    st.film(sc, rammer_mappe, "public/film/navn.mp4")
"""

import math
import os
import shutil
import sys

import bpy

# ── Palett: prototypens farger (samme som presentasjonen) ─────────────────────────────────────────
PALETT = {
    "papir": "#F3F6F2",  # prototypens bakgrunn
    "blekk": "#17231F",  # tekst
    "fersken": "#FFD9B3",
    "fersken_sterk": "#F5B46E",  # salg
    "rosa": "#F9CADB",
    "rosa_sterk": "#F08FB0",  # aktivitet / sporet
    "mint": "#BFE9D3",
    "mint_sterk": "#7CC9A1",  # gjester / laget
    "gul": "#FBE6A2",
    "gul_sterk": "#F0CC5C",  # anerkjennelse
    "eik": "#C9A27A",
    "valnott": "#6E4B33",
    "lin": "#EFE7DA",
    "keramikk": "#F4EFE6",
    "kobber": "#B87333",
}


def srgb(h, a=1.0):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c) + (a,)


def farge(navn_eller_hex):
    return srgb(PALETT.get(navn_eller_hex, navn_eller_hex))


# ── Scene og rendering ────────────────────────────────────────────────────────────────────────────
def ny_scene(fps=30, sekunder=10.0, bredde=1920, hoyde=1080):
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    for samling in (bpy.data.meshes, bpy.data.materials, bpy.data.lights, bpy.data.cameras, bpy.data.curves, bpy.data.images):
        for b in list(samling):
            if b.users == 0:
                samling.remove(b)
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.render.resolution_x, sc.render.resolution_y = bredde, hoyde
    sc.render.resolution_percentage = 100
    sc.render.fps = fps
    sc.frame_start, sc.frame_end = 1, int(round(sekunder * fps))
    # Standard: fargene i bildet blir de samme som i prototypen og presentasjonen
    sc.view_settings.view_transform = "Standard"
    sc.view_settings.look = "None"
    sc.view_settings.exposure = 0.0
    sc.render.dither_intensity = 1.0  # litt støy mot striper i myke overganger
    if not sc.world:
        sc.world = bpy.data.worlds.new("Verden")
    try:
        sc.world.use_nodes = True
    except Exception:
        pass
    return sc


def kvalitet(sc, samples=192, bevegelse=True, lukker=0.45, filmisk_dybde=True):
    """Endelig kvalitet: mange samples, støyfjerning, bevegelsesuskarphet og nok lysbrudd for glass og metall."""
    c = sc.cycles
    c.samples = samples
    c.use_adaptive_sampling = True
    c.adaptive_threshold = 0.006
    c.use_denoising = True
    try:
        c.denoiser = "OPTIX" if "gpu" in sys.argv else "OPENIMAGEDENOISE"
    except Exception:
        pass
    c.max_bounces = 10
    c.diffuse_bounces = 4
    c.glossy_bounces = 6
    c.transmission_bounces = 10
    c.transparent_max_bounces = 16
    c.caustics_reflective = False
    c.caustics_refractive = False
    c.blur_glossy = 0.6
    sc.render.use_motion_blur = bevegelse
    sc.render.motion_blur_shutter = lukker
    sc.render.film_transparent = False
    sc.render.use_persistent_data = True
    if hasattr(sc.render, "compositor_device"):
        try:
            sc.render.compositor_device = "GPU"
        except Exception:
            pass


def provekvalitet(sc, prosent=50, samples=32):
    sc.render.resolution_percentage = prosent
    sc.cycles.samples = samples
    sc.cycles.use_denoising = True


def bruk_gpu():
    """OptiX på grafikkortet når «gpu» står på kommandolinjen."""
    if "gpu" not in sys.argv:
        return False
    prefs = bpy.context.preferences.addons["cycles"].preferences
    for typ in ("OPTIX", "CUDA"):
        try:
            prefs.compute_device_type = typ
            prefs.get_devices()
            enheter = [d for d in prefs.devices if d.type == typ]
            if enheter:
                for d in prefs.devices:
                    d.use = d.type == typ
                bpy.context.scene.cycles.device = "GPU"
                print("GPU:", typ, [d.name for d in enheter])
                return True
        except Exception as e:
            print("GPU-feil", typ, e)
    return False


# ── Materialer ────────────────────────────────────────────────────────────────────────────────────
def _ny_mat(navn):
    m = bpy.data.materials.new(navn)
    try:
        m.use_nodes = True
    except Exception:
        pass
    nt = m.node_tree
    p = nt.nodes.get("Principled BSDF")
    return m, nt, p


def _variasjon(nt, skala=4.0, detalj=6.0, styrke=0.08):
    """Lav-frekvent variasjon (0..1 rundt 0,5) til å bryte opp helt jevne flater."""
    tc = nt.nodes.new("ShaderNodeTexCoord")
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = skala
    n.inputs["Detail"].default_value = detalj
    nt.links.new(tc.outputs["Object"], n.inputs["Vector"])
    mr = nt.nodes.new("ShaderNodeMapRange")
    mr.inputs["To Min"].default_value = 1 - styrke
    mr.inputs["To Max"].default_value = 1 + styrke
    nt.links.new(n.outputs["Fac"], mr.inputs["Value"])
    return mr.outputs["Result"], n


def matt(navn, hex_farge, ruhet=0.55, variasjon=0.06, coat=0.0, sheen=0.0):
    """Malt eller pulverlakkert flate med svak variasjon i ruhet – aldri helt plastaktig."""
    m, nt, p = _ny_mat(navn)
    p.inputs["Base Color"].default_value = farge(hex_farge)
    var, _ = _variasjon(nt, skala=3.0, styrke=variasjon * 2)
    mul = nt.nodes.new("ShaderNodeMath")
    mul.operation = "MULTIPLY"
    mul.inputs[1].default_value = ruhet
    nt.links.new(var, mul.inputs[0])
    nt.links.new(mul.outputs[0], p.inputs["Roughness"])
    if coat:
        p.inputs["Coat Weight"].default_value = coat
        p.inputs["Coat Roughness"].default_value = 0.12
    if sheen:
        p.inputs["Sheen Weight"].default_value = sheen
    return m


def tre(navn, lys="#C9A27A", mork="#9A6F4B", skala=1.0, ruhet=0.5, lakk=0.08):
    """Eik/ask: lange årer langs objektets X (strukket mønster), lyse og mørke partier, svak relieff og tynn lakk."""
    m, nt, p = _ny_mat(navn)
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    # Strekk mønsteret kraftig langs X, så årene blir lange linjer langs bordet
    mp.inputs["Scale"].default_value = (0.12 * skala, 1.0 * skala, 1.0 * skala)
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
    stoy = nt.nodes.new("ShaderNodeTexNoise")
    stoy.inputs["Scale"].default_value = 3.0
    stoy.inputs["Detail"].default_value = 6.0
    stoy.inputs["Distortion"].default_value = 0.4
    nt.links.new(mp.outputs["Vector"], stoy.inputs["Vector"])
    bolge = nt.nodes.new("ShaderNodeTexWave")
    bolge.wave_type = "BANDS"
    bolge.bands_direction = "Y"
    bolge.inputs["Scale"].default_value = 5.0
    bolge.inputs["Distortion"].default_value = 10.0
    bolge.inputs["Detail"].default_value = 3.0
    bolge.inputs["Detail Scale"].default_value = 1.6
    nt.links.new(mp.outputs["Vector"], bolge.inputs["Vector"])
    bland = nt.nodes.new("ShaderNodeMix")
    bland.data_type = "FLOAT"
    bland.inputs["Factor"].default_value = 0.5
    nt.links.new(bolge.outputs["Fac"], bland.inputs[2])
    nt.links.new(stoy.outputs["Fac"], bland.inputs[3])
    rampe = nt.nodes.new("ShaderNodeValToRGB")
    rampe.color_ramp.elements[0].position = 0.3
    rampe.color_ramp.elements[0].color = srgb(mork)
    rampe.color_ramp.elements[1].position = 0.72
    rampe.color_ramp.elements[1].color = srgb(lys)
    nt.links.new(bland.outputs[0], rampe.inputs["Fac"])
    nt.links.new(rampe.outputs["Color"], p.inputs["Base Color"])
    p.inputs["Roughness"].default_value = ruhet
    if lakk:
        p.inputs["Coat Weight"].default_value = lakk
        p.inputs["Coat Roughness"].default_value = 0.18
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.08
    bump.inputs["Distance"].default_value = 0.002
    nt.links.new(bland.outputs[0], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], p.inputs["Normal"])
    return m


def lin(navn, hex_farge="#EFE7DA", skala=180.0):
    """Linstoff: fin vev (to bølger på kryss), mykt sheen og litt subsurface – duker og servietter."""
    m, nt, p = _ny_mat(navn)
    p.inputs["Base Color"].default_value = farge(hex_farge)
    p.inputs["Roughness"].default_value = 0.85
    p.inputs["Sheen Weight"].default_value = 0.6
    p.inputs["Sheen Roughness"].default_value = 0.4
    p.inputs["Subsurface Weight"].default_value = 0.08
    tc = nt.nodes.new("ShaderNodeTexCoord")
    v = []
    for retning in ("X", "Y"):
        b = nt.nodes.new("ShaderNodeTexWave")
        b.wave_type = "BANDS"
        b.bands_direction = retning
        b.inputs["Scale"].default_value = skala
        b.inputs["Distortion"].default_value = 0.6
        nt.links.new(tc.outputs["Object"], b.inputs["Vector"])
        v.append(b)
    sum_ = nt.nodes.new("ShaderNodeMath")
    sum_.operation = "MULTIPLY"
    nt.links.new(v[0].outputs["Fac"], sum_.inputs[0])
    nt.links.new(v[1].outputs["Fac"], sum_.inputs[1])
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.12
    bump.inputs["Distance"].default_value = 0.0006
    nt.links.new(sum_.outputs[0], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], p.inputs["Normal"])
    return m


def keramikk(navn, hex_farge="#F4EFE6", glans=0.08):
    """Glasert keramikk: blank glasur over en varm, svakt gjennomskinnelig masse."""
    m, nt, p = _ny_mat(navn)
    p.inputs["Base Color"].default_value = farge(hex_farge)
    p.inputs["Roughness"].default_value = 0.35
    p.inputs["Subsurface Weight"].default_value = 0.15
    p.inputs["Subsurface Radius"].default_value = (0.6, 0.45, 0.35)
    p.inputs["Coat Weight"].default_value = 1.0
    p.inputs["Coat Roughness"].default_value = glans
    var, _ = _variasjon(nt, skala=8.0, styrke=0.03)
    hsv = nt.nodes.new("ShaderNodeHueSaturation")
    hsv.inputs["Color"].default_value = farge(hex_farge)
    nt.links.new(var, hsv.inputs["Value"])
    nt.links.new(hsv.outputs["Color"], p.inputs["Base Color"])
    return m


def metall(navn, hex_farge="#D9DADF", ruhet=0.22, borstet=True):
    """Børstet stål/sølv/kobber: anisotropisk refleks og fine striper."""
    m, nt, p = _ny_mat(navn)
    p.inputs["Base Color"].default_value = farge(hex_farge)
    p.inputs["Metallic"].default_value = 1.0
    p.inputs["Roughness"].default_value = ruhet
    if borstet:
        try:
            p.inputs["Anisotropic"].default_value = 0.6
        except Exception:
            pass
        tc = nt.nodes.new("ShaderNodeTexCoord")
        mp = nt.nodes.new("ShaderNodeMapping")
        mp.inputs["Scale"].default_value = (1.0, 220.0, 1.0)
        nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
        n = nt.nodes.new("ShaderNodeTexNoise")
        n.inputs["Scale"].default_value = 3.0
        nt.links.new(mp.outputs["Vector"], n.inputs["Vector"])
        mr = nt.nodes.new("ShaderNodeMapRange")
        mr.inputs["To Min"].default_value = ruhet * 0.7
        mr.inputs["To Max"].default_value = ruhet * 1.4
        nt.links.new(n.outputs["Fac"], mr.inputs["Value"])
        nt.links.new(mr.outputs["Result"], p.inputs["Roughness"])
    return m


def glass(navn, hex_farge="#FFFFFF", ruhet=0.02, ior=1.48):
    m, nt, p = _ny_mat(navn)
    p.inputs["Base Color"].default_value = farge(hex_farge)
    p.inputs["Roughness"].default_value = ruhet
    p.inputs["Transmission Weight"].default_value = 1.0
    p.inputs["IOR"].default_value = ior
    return m


def papir(navn, hex_farge="#FBF8F1", tekstur=None, emisjon=0.0):
    """Bong/kort: matt papir med fibre, eventuelt med et bilde (tekstur) trykt på."""
    m, nt, p = _ny_mat(navn)
    p.inputs["Roughness"].default_value = 0.9
    p.inputs["Subsurface Weight"].default_value = 0.1
    p.inputs["Sheen Weight"].default_value = 0.2
    if tekstur:
        t = nt.nodes.new("ShaderNodeTexImage")
        t.image = bpy.data.images.load(tekstur, check_existing=True)
        t.interpolation = "Cubic"
        nt.links.new(t.outputs["Color"], p.inputs["Base Color"])
        if emisjon:
            nt.links.new(t.outputs["Color"], p.inputs["Emission Color"])
            p.inputs["Emission Strength"].default_value = emisjon
    else:
        p.inputs["Base Color"].default_value = farge(hex_farge)
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = 260.0
    n.inputs["Detail"].default_value = 4.0
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.06
    nt.links.new(n.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], p.inputs["Normal"])
    return m


def lysende(navn, hex_farge, styrke=4.0, base=None):
    """Lysende stripe/spor: farget emisjon med en lysere kjerne – leses som lys, ikke som plast."""
    m, nt, p = _ny_mat(navn)
    p.inputs["Base Color"].default_value = farge(base or hex_farge)
    p.inputs["Emission Color"].default_value = farge(hex_farge)
    p.inputs["Emission Strength"].default_value = styrke
    p.inputs["Roughness"].default_value = 0.3
    return m


# ── Geometri ──────────────────────────────────────────────────────────────────────────────────────
def avfas(o, bredde=0.01, segmenter=4, vinkel=40):
    """Avfaset kant (vektet etter vinkel), så lyset får en kant å gripe – det skiller modell fra primitiv."""
    b = o.modifiers.new("Avfasing", "BEVEL")
    b.width = bredde
    b.segments = segmenter
    b.limit_method = "ANGLE"
    b.angle_limit = math.radians(vinkel)
    b.harden_normals = True
    try:
        o.data.shade_smooth()
    except Exception:
        pass
    return o


def kloss(navn, storrelse, plass=(0, 0, 0), materiale=None, avfasing=0.01, foreldre=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=plass)
    o = bpy.context.active_object
    o.name = navn
    o.scale = storrelse
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if avfasing:
        avfas(o, avfasing)
    if materiale:
        o.data.materials.append(materiale)
    if foreldre:
        o.parent = foreldre
    return o


def sylinder(navn, radius, hoyde, plass=(0, 0, 0), materiale=None, avfasing=0.006, hjorner=64, foreldre=None):
    bpy.ops.mesh.primitive_cylinder_add(radius=radius, depth=hoyde, vertices=hjorner, location=plass)
    o = bpy.context.active_object
    o.name = navn
    if avfasing:
        avfas(o, avfasing, vinkel=60)
    else:
        bpy.ops.object.shade_smooth()
    if materiale:
        o.data.materials.append(materiale)
    if foreldre:
        o.parent = foreldre
    return o


def dreid(navn, profil, materiale=None, plass=(0, 0, 0), steg=96, foreldre=None):
    """Dreid form (tallerken, kopp, glass, klokke) fra en profil [(radius, høyde), ...] – som på en dreiebenk."""
    me = bpy.data.meshes.new(navn)
    verts, faces = [], []
    n = len(profil)
    for i in range(steg):
        a = 2 * math.pi * i / steg
        for r, z in profil:
            verts.append((r * math.cos(a), r * math.sin(a), z))
    for i in range(steg):
        j = (i + 1) % steg
        for k in range(n - 1):
            faces.append((i * n + k, j * n + k, j * n + k + 1, i * n + k + 1))
    me.from_pydata(verts, [], faces)
    me.update()
    o = bpy.data.objects.new(navn, me)
    bpy.context.scene.collection.objects.link(o)
    o.location = plass
    for p in me.polygons:
        p.use_smooth = True
    s = o.modifiers.new("Glatt", "SUBSURF")
    s.levels = 1
    s.render_levels = 2
    if materiale:
        me.materials.append(materiale)
    if foreldre:
        o.parent = foreldre
    return o


# ── Lys ───────────────────────────────────────────────────────────────────────────────────────────
def omraadelys(navn, plass, mal, styrke, storrelse=(2.0, 2.0), hex_farge="#FFF4EA", form="RECTANGLE"):
    lys = bpy.data.lights.new(navn, "AREA")
    lys.shape = form
    lys.size, lys.size_y = storrelse
    lys.color = farge(hex_farge)[:3]
    lys.energy = styrke
    o = bpy.data.objects.new(navn, lys)
    bpy.context.scene.collection.objects.link(o)
    o.location = plass
    c = o.constraints.new("TRACK_TO")
    c.target = mal
    c.track_axis = "TRACK_NEGATIVE_Z"
    c.up_axis = "UP_Y"
    return o


def studiolys(mal, avstand=6.0, styrke=1.0, varme="#FFF1E2", kant="#F7B6CF"):
    """Tre-punkts studiolys: stort, mykt nøkkellys fra venstre over, svakt fyllys, og et farget kantlys bak.
    Returnerer (nøkkel, fyll, kant)."""
    nokkel = omraadelys("Nøkkellys", (-0.8 * avstand, -0.9 * avstand, 0.9 * avstand), mal, 900 * styrke * (avstand / 6) ** 2, (avstand * 0.7, avstand * 0.7), varme)
    fyll = omraadelys("Fyllys", (0.9 * avstand, -0.6 * avstand, 0.3 * avstand), mal, 220 * styrke * (avstand / 6) ** 2, (avstand, avstand), "#F4F1FF")
    kantlys = omraadelys("Kantlys", (0.3 * avstand, 1.1 * avstand, 0.6 * avstand), mal, 700 * styrke * (avstand / 6) ** 2, (avstand * 0.15, avstand * 0.8), kant)
    return nokkel, fyll, kantlys


def himmel(sc, hex_farge="#FFF3EA", styrke=0.35):
    bg = sc.world.node_tree.nodes.get("Background")
    bg.inputs["Color"].default_value = farge(hex_farge)
    bg.inputs["Strength"].default_value = styrke


# ── Kamera ────────────────────────────────────────────────────────────────────────────────────────
def kamera(sc, linse=50, mal=None, blender=2.8, sensor=36.0):
    cd = bpy.data.cameras.new("Kamera")
    cd.lens = linse
    cd.sensor_fit = "HORIZONTAL"
    cd.sensor_width = sensor
    cd.dof.use_dof = True
    cd.dof.aperture_fstop = blender
    cd.dof.aperture_blades = 7
    cd.dof.aperture_rotation = math.radians(12)
    cam = bpy.data.objects.new("Kamera", cd)
    sc.collection.objects.link(cam)
    sc.camera = cam
    if mal:
        c = cam.constraints.new("TRACK_TO")
        c.target = mal
        c.track_axis = "TRACK_NEGATIVE_Z"
        c.up_axis = "UP_Y"
        cd.dof.focus_object = mal
    return cam


# ── Animasjon ─────────────────────────────────────────────────────────────────────────────────────
def nokler(ting, egenskap, verdier, fps=30, interpolasjon=None, lette=None):
    """verdier: [(sekunder, verdi), ...]. interpolasjon: 'BEZIER', 'LINEAR', 'BACK' (overshoot), 'ELASTIC' …
    lette: 'EASE_IN', 'EASE_OUT', 'EASE_IN_OUT'."""
    for t, v in verdier:
        f = int(round(t * fps)) + 1
        if isinstance(ting, bpy.types.NodeSocket):
            ting.default_value = v
            ting.keyframe_insert("default_value", frame=f)
        else:
            setattr(ting, egenskap, v)
            ting.keyframe_insert(egenskap, frame=f)
    if interpolasjon or lette:
        eier = ting.id_data if isinstance(ting, bpy.types.NodeSocket) else ting
        ad = getattr(eier, "animation_data", None)
        if ad and ad.action:
            for fc in _fkurver(ad.action):
                for kp in fc.keyframe_points:
                    if interpolasjon:
                        kp.interpolation = interpolasjon
                    if lette:
                        kp.easing = lette


def _fkurver(action):
    """Blender 4.4+ har lagdelte actions (layers/strips/channelbags); eldre har action.fcurves."""
    if hasattr(action, "fcurves") and action.fcurves:
        return list(action.fcurves)
    ut = []
    for lag in getattr(action, "layers", []):
        for strip in lag.strips:
            for cb in getattr(strip, "channelbags", []):
                ut.extend(cb.fcurves)
    return ut


# ── Rendering til bilder og film ──────────────────────────────────────────────────────────────────
def render_bilder(sc, mappe):
    os.makedirs(mappe, exist_ok=True)
    sc.render.filepath = os.path.join(mappe, "####")
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_depth = "8"
    sc.render.image_settings.compression = 15
    sc.render.use_overwrite = False
    sc.render.use_placeholder = True
    bpy.ops.render.render(animation=True)


def film(sc, mappe, mal_fil, fps=30, kvalitet="PERC_LOSSLESS"):
    """Setter bildene sammen til H.264 i Blenders sekvensredigerer. Standard visning (ingen dobbel fargetransform)
    og høy bitrate, så myke overganger og mørke partier ikke får striper."""
    filer = sorted(f for f in os.listdir(mappe) if f.endswith(".png"))
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    sc.render.resolution_percentage = 100
    sc.render.fps = fps
    se = sc.sequence_editor_create()
    stripes = se.strips if hasattr(se, "strips") else se.sequences
    for s in list(stripes):
        stripes.remove(s)
    st = stripes.new_image("Bilder", os.path.join(mappe, filer[0]), 1, 1)
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
    ff.constant_rate_factor = kvalitet
    ff.ffmpeg_preset = "BEST"
    ff.gopsize = 15
    ff.audio_codec = "NONE"
    ut_mappe = os.path.dirname(mal_fil)
    navn = os.path.splitext(os.path.basename(mal_fil))[0]
    sc.render.filepath = os.path.join(ut_mappe, navn + "_")
    bpy.ops.render.render(animation=True)
    laget = [f for f in os.listdir(ut_mappe) if f.startswith(navn + "_") and f.endswith(".mp4")]
    if laget:
        if os.path.exists(mal_fil):
            os.remove(mal_fil)
        os.replace(os.path.join(ut_mappe, laget[0]), mal_fil)
    shutil.copy(os.path.join(mappe, filer[-1]), os.path.join(ut_mappe, navn + "-slutt.png"))
    print("film ferdig", mal_fil, len(filer), "bilder")
