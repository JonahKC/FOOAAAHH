import os
import requests

filelist = []

BASE_URL='https://beta.fooaaahh.jcwyt.com/'

for root, dirs, files in os.walk("."):
  if root.startswith('./.'):
    continue
  for file in files:
      filelist.append(os.path.join(root,file))

filelist = list(map(lambda x: x.replace('\\', '/').replace('./', BASE_URL, 1), filelist))

for file in filelist:
  try:
    response = requests.get(file)
  except:
    print("FAILURE: " + file)
    filelist.pop(filelist.index(file))
    continue
  if response.status_code != 200:
    print("FAILURE: " + file)
    filelist.pop(filelist.index(file))
  else:
    print("SUCCESS: " + file)

filelist = list(map(lambda x: x.replace(BASE_URL, '/', 1), filelist))

print(filelist)