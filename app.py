from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(name)

alerts = []

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/alert", methods=["POST"])
def receive_alert():
    data = request.json
    data["time"] = datetime.now().strftime("%H:%M:%S")
    alerts.append(data)
    return jsonify({"status": "received"})

@app.route("/teacher")
def teacher():
    return {
        "alerts": alerts
    }

if name == "main":
    app.run(host="0.0.0.0", port=5000)
