#!/bin/bash

npm run dev &
NPM_PID=$!

cd api
python app.py &
FLASK_PID=$!

sleep 3

echo "press enter to terminate all processes..."
read

kill $FLASK_PID
kill $NPM_PID

cd ..