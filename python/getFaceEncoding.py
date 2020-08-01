from face_recognition import load_image_file, face_encodings
import sys
from json import dumps, loads

while True:
    stdin = sys.stdin.readline().replace("\n", "")
    if not stdin:
        continue
    
    data = loads(stdin)
    # TODO: replace filename with url.
    if data['id'] and data['filename']:
        image = load_image_file(f'uploads/{data["filename"]}')
        encoding = face_encodings(image)

        if len(encoding) > 1:
            print(dumps({'id': data['id'], "success": False,
                         "message": "More than one face"}), flush=True)
        elif len(encoding) == 1:
            lst = encoding[0].tolist()
            print(dumps({'id': data['id'], "success": True,
                         "encoding": lst, "message": "Face encoding successful"}), flush=True)
        else:
            print(
                dumps({'id': data['id'], "success": False, "message": "Unable to detect face"}), flush=True)
    stdin = None
