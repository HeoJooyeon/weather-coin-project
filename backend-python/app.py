from flask import Flask, request, jsonify
import subprocess
import os
from datetime import datetime

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DAILY_DIR = os.path.join(BASE_DIR, 'daily_jobs')
HOURLY_DIR = os.path.join(BASE_DIR, 'hourly_jobs')
LOG_DIR = os.path.join(BASE_DIR, 'logs')
DAILY_LOG_DIR = os.path.join(LOG_DIR, 'daily')
HOURLY_LOG_DIR = os.path.join(LOG_DIR, 'hourly')

# 로그 디렉토리 생성
os.makedirs(DAILY_LOG_DIR, exist_ok=True)
os.makedirs(HOURLY_LOG_DIR, exist_ok=True)

def run_python_file(filepath, job_type='general'):
    filename = os.path.basename(filepath)
    log_folder = DAILY_LOG_DIR if job_type == 'daily' else HOURLY_LOG_DIR
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    log_path = os.path.join(log_folder, f"{filename}_{timestamp}.log")

    try:
        result = subprocess.run(['python', filepath], capture_output=True, text=True, check=True)
        output = result.stdout
        status = 'success'
    except subprocess.CalledProcessError as e:
        output = e.stderr
        status = 'error'

    # 로그 저장
    with open(log_path, 'w', encoding='utf-8') as f:
        f.write(f"Status: {status}\n")
        f.write(f"File: {filename}\n")
        f.write(f"Time: {timestamp}\n\n")
        f.write(output)

    print(f"[{status.upper()}] Ran: {filepath}")
    return {'status': status, 'output': output}

# 서버 시작 시 일괄 실행
def run_all_on_startup():
    print("[INFO] Running all daily and hourly jobs at server startup...")
    for filename in os.listdir(DAILY_DIR):
        if filename.endswith('.py'):
            run_python_file(os.path.join(DAILY_DIR, filename), job_type='daily')
    for filename in os.listdir(HOURLY_DIR):
        if filename.endswith('.py'):
            run_python_file(os.path.join(HOURLY_DIR, filename), job_type='hourly')

@app.route('/run/daily', methods=['POST'])
def run_daily():
    filename = request.json.get('file')
    filepath = os.path.join(DAILY_DIR, filename)
    if not os.path.isfile(filepath):
        return jsonify({'error': 'File not found'}), 404
    return jsonify(run_python_file(filepath, job_type='daily'))

@app.route('/run/hourly', methods=['POST'])
def run_hourly():
    filename = request.json.get('file')
    filepath = os.path.join(HOURLY_DIR, filename)
    if not os.path.isfile(filepath):
        return jsonify({'error': 'File not found'}), 404
    return jsonify(run_python_file(filepath, job_type='hourly'))

if __name__ == '__main__':
    run_all_on_startup()
    print("[INFO] Flask server starting on port 6000...")
    app.run(host='0.0.0.0', port=6000, debug=True, use_reloader=False)
