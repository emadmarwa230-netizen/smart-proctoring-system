from flask import Flask, render_template, request, jsonify
from datetime import datetime

app = Flask(name)

# تخزين التنبيهات في الذاكرة (سيتم مسحها عند إعادة التشغيل)
alerts = []

@app.route("/")
def home():
    """الصفحة الرئيسية للطالب"""
    return render_template("index.html")

@app.route("/alert", methods=["POST"])
def receive_alert():
    """استقبال تنبيهات من المتصفح"""
    try:
        data = request.get_json()
        if data:
            # إضافة الوقت الحالي
            alert_data = {
                "student": data.get("student", "Unknown"),
                "alert": data.get("alert", "No message"),
                "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            }
            alerts.append(alert_data)
            
            # طباعة للتنقيح (ستظهر في logs)
            print(f"📢 New Alert: {alert_data}")
            
            # الاحتفاظ فقط بـ 50 تنبيهاً آخر لتجنب امتلاء الذاكرة
            if len(alerts) > 50:
                alerts.pop(0)
                
            return jsonify({
                "status": "success",
                "message": "Alert received",
                "total_alerts": len(alerts)
            })
        else:
            return jsonify({"status": "error", "message": "No data received"}), 400
            
    except Exception as e:
        print(f"❌ Error in /alert: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route("/teacher")
def teacher_dashboard():
    """لوحة تحكم المدرس لرؤية جميع التنبيهات"""
    return render_template("teacher.html")

@app.route("/api/alerts")
def get_alerts():
    """API لإرجاع جميع التنبيهات (للوحة المدرس)"""
    return jsonify({
        "status": "success",
        "total_alerts": len(alerts),
        "alerts": alerts
    })

@app.route("/api/clear", methods=["POST"])
def clear_alerts():
    """مسح جميع التنبيهات"""
    global alerts
    alerts = []
    return jsonify({"status": "success", "message": "All alerts cleared"})

@app.route("/health")
def health_check():
    """للتحقق من أن التطبيق يعمل"""
    return jsonify({
        "status": "healthy",
        "time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "alerts_count": len(alerts)
    })

if name == "main":
    app.run(host="0.0.0.0", port=5000, debug=False)
