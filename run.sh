npm run dev && cd api && python app.py & FLASK_PID=$!

sleep 1

cd ..
kill $FLASK_PID