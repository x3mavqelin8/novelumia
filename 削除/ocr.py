import os
import sys

# ログ抑制
os.environ["GLOG_minloglevel"] = "2"
os.environ["DISABLE_AUTO_LOGGING_CONFIG"] = "1"

from paddleocr import PaddleOCR


# OCRモデル作成（1回だけ）
ocr = PaddleOCR(
    lang="en"
)


def read_image(image_path):

    result = ocr.predict(image_path)

    import pprint
    pprint.pprint(result, stream=sys.stderr)

    texts = result[0]["rec_texts"]
    print("OCR TEXTS:", texts, file=sys.stderr)

    if texts:
        text = texts[0]

        # よくある誤認識修正
        text = (
            text.replace("O", "0")
                .replace("o", "0")
                .replace("I", "1")
                .replace("l", "1")
                .replace("S", "5")
        )

        # 数字だけ取得
        text = "".join(
            c for c in text
            if c.isdigit()
        )

        # Power 5000対策
        if text == "0005":
            text = "5000"

        return text

    return ""

def read_card_numbers(image_path):

    result = ocr.predict(image_path)

    return result[0]["rec_texts"]

# 引数チェック
if len(sys.argv) < 2:
    print("")
    sys.exit()


results = []

mode = "number"

if len(sys.argv) >= 3 and sys.argv[1] == "--cardnumbers":
    mode = "cardnumbers"
    image_paths = sys.argv[2:]
else:
    image_paths = sys.argv[1:]

results = []

for image_path in image_paths:
    if mode == "cardnumbers":
        results.extend(read_card_numbers(image_path))
    else:
        results.append(read_image(image_path))

print("|".join(results))