import shutil
import json
from pprint import pprint

with open('Hide Posts/manifest.json') as data_file:
    data = json.load(data_file)

pprint(data)
release_version = data["version"]
destination="Release/Release "+release_version+".zip"       

shutil.make_archive(destination, "zip", "Hide Posts")
