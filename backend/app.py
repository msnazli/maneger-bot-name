from flask import Flask, request, jsonify, send_from_directory
from telegram import Bot
import hmac
import hashlib
import json
import os

app = Flask(__name__, static_folder='/workspaces/maneger-bot-name/frontend/build', static_url_path='')

# تنظیمات CORS (برای ارتباط فرانت‌اند و بک‌اند)
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PATCH,DELETE'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

# تنظیمات اولیه
TELEGRAM_BOT_TOKEN = "YOUR_BOT_TOKEN"  # توکن ربات تلگرام خودتون رو جایگزین کنید
bot = Bot(token=TELEGRAM_BOT_TOKEN)

# دیتابیس ساده (به‌صورت موقت با دیکشنری)
db = {
    "users": [{"id": 1, "name": "کاربر ۱"}, {"id": 2, "name": "کاربر ۲"}],
    "features": ["هیجانی", "طبیعی", "احساسی", "فنی"],
    "languages": ["فارسی", "انگلیسی"],
    "api_keys": {"openai": "", "google": ""},
    "logs": ["کاربر جدید وارد شد", "نام جدید تولید شد"],
    "stats": {"users": 1200, "searches": 4500, "revenue": 15000000}
}

# تأیید ورود تلگرام
@app.route('/auth/telegram', methods=['POST'])
def telegram_auth():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid data"}), 400

    # بررسی امضای تلگرام
    received_hash = data.pop('hash', None)
    data_check_string = "\n".join([f"{k}={v}" for k, v in sorted(data.items())])
    secret_key = hashlib.sha256(TELEGRAM_BOT_TOKEN.encode()).digest()
    computed_hash = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

    if computed_hash != received_hash:
        return jsonify({"error": "Invalid hash"}), 401

    user_id = data.get('id')
    # فرض می‌کنیم فقط کاربران خاص مدیر هستن
    admin_ids = [123456789]  # آیدی مدیر رو جایگزین کنید
    if user_id not in admin_ids:
        return jsonify({"error": "Unauthorized"}), 403

    return jsonify({"message": "Authenticated", "user": data})

# دریافت آمار
@app.route('/stats', methods=['GET'])
def get_stats():
    return jsonify(db["stats"])

# مدیریت APIها
@app.route('/api_keys', methods=['GET', 'POST'])
def manage_api_keys():
    if request.method == 'GET':
        return jsonify(db["api_keys"])
    elif request.method == 'POST':
        data = request.get_json()
        db["api_keys"].update(data)
        db["logs"].append(f"API به‌روزرسانی شد: {list(data.keys())[0]}")
        return jsonify({"message": "API keys updated"})

# مدیریت ویژگی‌ها
@app.route('/features', methods=['GET', 'POST', 'DELETE'])
def manage_features():
    if request.method == 'GET':
        return jsonify(db["features"])
    elif request.method == 'POST':
        data = request.get_json()
        feature = data.get("feature")
        if feature and feature not in db["features"]:
            db["features"].append(feature)
            db["logs"].append(f"ویژگی جدید اضافه شد: {feature}")
        return jsonify({"message": "Feature added"})
    elif request.method == 'DELETE':
        data = request.get_json()
        feature = data.get("feature")
        if feature in db["features"]:
            db["features"].remove(feature)
            db["logs"].append(f"ویژگی حذف شد: {feature}")
        return jsonify({"message": "Feature removed"})

# مدیریت زبان‌ها
@app.route('/languages', methods=['GET', 'POST', 'DELETE'])
def manage_languages():
    if request.method == 'GET':
        return jsonify(db["languages"])
    elif request.method == 'POST':
        data = request.get_json()
        language = data.get("language")
        translations = data.get("translations")
        if language and translations:
            db["languages"].append(language)
            db["logs"].append(f"زبان جدید اضافه شد: {language}")
        return jsonify({"message": "Language added"})
    elif request.method == 'DELETE':
        data = request.get_json()
        language = data.get("language")
        if language in db["languages"]:
            db["languages"].remove(language)
            db["logs"].append(f"زبان حذف شد: {language}")
        return jsonify({"message": "Language removed"})

# مدیریت کاربران
@app.route('/users', methods=['GET'])
def get_users():
    return jsonify(db["users"])

# لاگ‌ها
@app.route('/logs', methods=['GET'])
def get_logs():
    return jsonify(db["logs"])

# API routes
@app.route('/api/test')
def test():
    return {'message': 'API is working!'}

# سرو کردن فایل‌های فرانت‌اند
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    file_path = os.path.join(app.static_folder, path)
    print(f"Requested path: {path}")
    print(f"File path: {file_path}")
    print(f"Exists (file): {os.path.isfile(file_path)}")
    if path and os.path.isfile(file_path):
        return send_from_directory(app.static_folder, path)
    index_path = os.path.join(app.static_folder, 'index.html')
    print(f"Serving index.html from: {index_path}")
    print(f"Index exists: {os.path.exists(index_path)}")
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    print(f"Static folder: {app.static_folder}")
    port = int(os.environ.get('PORT', 3000))
    app.run(host='0.0.0.0', port=port)

print("Checking path:", os.path.join(app.static_folder, 'index.html'))