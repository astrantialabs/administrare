### SETUP SERVER

```bash
cd scripts
```

```bash
pip install -r requirements.txt
```

### RUN SERVER

```bash
cd scripts
```

```bash
uvicorn app:app --reload --port 3001  --host 0.0.0.0 --ssl-keyfile /etc/ssl/certs/PYTHON.key --ssl-keyfile-password mirae --ssl-certfile /etc/ssl/certs/PYTHON.crt
```
