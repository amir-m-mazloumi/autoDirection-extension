
from PIL import Image, ImageDraw
import os

os.makedirs("icons", exist_ok=True)

SCALE = 4
SIZE = 128 * SCALE

image = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
draw = ImageDraw.Draw(image)

# Background
draw.rounded_rectangle(
    (4*SCALE, 4*SCALE, 124*SCALE, 124*SCALE),
    radius=28*SCALE,
    fill="#172554"
)

# Letter A
draw.polygon(
    [
        (64*SCALE, 24*SCALE),
        (35*SCALE, 94*SCALE),
        (49*SCALE, 94*SCALE),
        (64*SCALE, 57*SCALE),
        (79*SCALE, 94*SCALE),
        (94*SCALE, 94*SCALE)
    ],
    fill="#FFFFFF"
)

# A horizontal bar
draw.rounded_rectangle(
    (49*SCALE, 73*SCALE, 79*SCALE, 81*SCALE),
    radius=3*SCALE,
    fill="#38BDF8"
)

# RTL arrow
draw.line(
    (99*SCALE, 48*SCALE, 80*SCALE, 48*SCALE),
    fill="#38BDF8",
    width=5*SCALE
)

draw.line(
    [
        (88*SCALE, 40*SCALE),
        (80*SCALE, 48*SCALE),
        (88*SCALE, 56*SCALE)
    ],
    fill="#38BDF8",
    width=5*SCALE
)

# Generate Chrome icons
for size in [16, 32, 48, 128]:

    icon = image.resize(
        (size, size),
        Image.Resampling.LANCZOS
    )

    icon.save(f"icons/icon{size}.png")

print("Icons generated successfully!")
