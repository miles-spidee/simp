import urllib.request
try:
    response = urllib.request.urlopen("http://localhost:8000/api/v1/check-joshua")
    print(response.read().decode())
except Exception as e:
    print(e)
