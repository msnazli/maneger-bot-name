#!/bin/bash
# نصب وابستگی‌های فرانت‌اند و بیلد
cd frontend
npm install
npm run build
cd ..
# نصب وابستگی‌های بک‌اند
cd backend
pip install -r requirements.txt
