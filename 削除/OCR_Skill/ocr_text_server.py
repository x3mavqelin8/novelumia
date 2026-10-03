import sys
import json
import os

os.environ["GLOG_minloglevel"] = "2"
os.environ["FLAGS_use_onednn"] = "0"

sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

from paddleocr import PaddleOCR

ocr = PaddleOCR(lang="japan", use_doc_orientation_classify=False)

from PIL import Image, ImageEnhance, ImageOps


def read_image(image_path):

    if "specialMove" in image_path:

        img = Image.open(image_path)

        img = img.resize((img.width * 4, img.height * 4))

        from PIL import ImageEnhance

        img = ImageEnhance.Contrast(img).enhance(2)

        temp_path = "OCR_Skill/temp_specialMove.webp"

        img.save(temp_path)

        image_path = temp_path

    if "specialMove" in image_path:
        result = ocr.ocr(image_path, det=False)
    else:
        result = ocr.ocr(image_path)

    print(result, file=sys.stderr)

    texts = []

    if not result or not result[0]:
        return ""

    for line in result[0]:

        if isinstance(line, tuple):
            texts.append(line[0])

        else:
            texts.append(line[1][0])

    return " ".join(texts)


for line in sys.stdin:

    try:

        data = json.loads(line)

        # 複数画像対応
        if "images" in data:

            results = {}

            for name, path in data["images"].items():

                try:
                    results[name] = read_image(path)

                except Exception as e:
                    results[name] = f"ERROR: {str(e)}"

            print(json.dumps({"results": results}, ensure_ascii=True), flush=True)

        # 旧形式も対応（必殺技テスト用）
        elif "image" in data:

            result = read_image(data["image"])

            print("送信:", result, file=sys.stderr)

            print(json.dumps({"result": result}, ensure_ascii=True), flush=True)

    except Exception as e:

        print(json.dumps({"error": str(e)}, ensure_ascii=True), flush=True)
