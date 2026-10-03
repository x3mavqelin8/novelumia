import os
import sys
import json

sys.stdin.reconfigure(encoding="utf-8")
sys.stdout.reconfigure(encoding="utf-8")

os.environ["GLOG_minloglevel"] = "2"
os.environ["DISABLE_AUTO_LOGGING_CONFIG"] = "1"

os.environ["FLAGS_logtostderr"] = "0"
os.environ["FLAGS_minloglevel"] = "3"

import contextlib
import io

import re

from PIL import Image, ImageOps

from paddleocr import PaddleOCR

ocr = PaddleOCR(
    lang="en",
    use_doc_orientation_classify=False
)

def read_image(image_path):

    with contextlib.redirect_stdout(io.StringIO()):
         result = ocr.predict(image_path)

    texts = result[0]["rec_texts"]

    if texts:
        text = texts[0]

        text = (
            text.replace("O", "0")
                .replace("o", "0")
                .replace("I", "1")
                .replace("l", "1")
                .replace("S", "5")
        )

        text = "".join(
            c for c in text
            if c.isdigit()
        )

        if text == "0005":
            text = "5000"

        return text

    return ""

def read_card_numbers(image_path):

    image = Image.open(image_path)

    image = ImageOps.expand(
        image,
        border=100,
        fill="white"
    )

    # 長辺2000pxを超える画像は縮小
    max_side = max(image.width, image.height)

    if max_side > 2000:

        scale = 2000 / max_side

        image = image.resize(
            (
                int(image.width * scale),
                int(image.height * scale)
            ),
            Image.Resampling.LANCZOS
        )

    else:

        # 小さい画像だけ1.5倍
        image = image.resize(
            (
                image.width * 3 // 2,
                image.height * 3 // 2
            ),
            Image.Resampling.LANCZOS
        )

    temp_path = image_path + "_margin.png"

    image.save(temp_path)

    with contextlib.redirect_stdout(io.StringIO()):
        result = ocr.predict(temp_path)

    if os.path.exists(temp_path):
        print("削除対象:", temp_path, file=sys.stderr)
        os.remove(temp_path)

    texts = result[0]["rec_texts"]
    print(result, file=sys.stderr)

    card_numbers = []

    for text in texts:

        matches = re.findall(
            r"SDV\d{1,3}-[A-Z]*\d+",
            text.upper()
        )

        card_numbers.extend(matches)

    return card_numbers

for line in sys.stdin:

    try:
        data = json.loads(line)

        image_path = data["image"]

        mode = data.get("mode", "number")

        if mode == "cardnumbers":
            result = read_card_numbers(image_path)
        else:
            result = read_image(image_path)

        print(
            json.dumps({
                "result": result
            }),
            flush=True
        )

    except Exception as e:

        print(
            json.dumps({
                "error": str(e)
            }),
            flush=True
        )