#!/bin/sh
echo "Administrare: installation wizard"
echo ""
echo "Installing python dependencies."
cd scripts

process_id=$!
pip install fastapi python-dotenv python-docx pymongo pymongo[srv] openpyxl datetime uvicorn &
wait $process_id

echo ""
echo "Python dependencies installed."
