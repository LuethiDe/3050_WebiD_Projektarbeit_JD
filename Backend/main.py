from fastapi import FastAPI

app = FastAPI()
#http://127.0.0.1:8000

@app.get('/hallo')
@app.get('/hallo/{name}')
def greet_user(name: str | None = None):
    if name is None:
        return 'hallo welt!'
    return f'hallo {name.upper()}!'