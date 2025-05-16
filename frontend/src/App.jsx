import React, { useState, useEffect } from 'react';
import './App.css';
import Chart from 'chart.js/auto';
import axios from 'axios';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [apiKeys, setApiKeys] = useState({ openai: '', google: '' });
  const [features, setFeatures] = useState(['هیجانی', 'طبیعی', 'احساسی', 'فنی']);
  const [languages, setLanguages] = useState(['فارسی', 'انگلیسی']);
  const [newFeature, setNewFeature] = useState('');
  const [newApiKey, setNewApiKey] = useState({ openai: '', google: '' });
  const [newLanguage, setNewLanguage] = useState('');
  const [translations, setTranslations] = useState({});
  const [users, setUsers] = useState(1200);
  const [searches, setSearches] = useState(4500);
  const [revenue, setRevenue] = useState(15000000);
  const [logs, setLogs] = useState(['کاربر جدید وارد شد', 'نام جدید تولید شد']);

  // تابع ورود با تلگرام

  window.handleTelegramLogin = (user) => {
  console.log('Telegram User:', user);
  if (user.id) {
    setIsAuthenticated(true);
    setLogs([...logs, `ورود مدیر: ${user.first_name}`]);
  }
};

useEffect(() => {
  // تعریف تابع به صورت global
  window.handleTelegramLogin = (user) => {
    console.log('Telegram User:', user);
    if (user.id) {
      setIsAuthenticated(true);
      setLogs((prevLogs) => [...prevLogs, `ورود مدیر: ${user.first_name}`]);
    }
  };

  // لود اسکریپت تلگرام
  const script = document.createElement('script');
  script.src = 'https://telegram.org/js/telegram-widget.js?22';
  script.async = true;
  script.setAttribute('data-telegram-login', 'YourBotName');
  script.setAttribute('data-size', 'large');
  script.setAttribute('data-onauth', 'handleTelegramLogin(user)');
  document.getElementById('telegram-login').appendChild(script);

  // دریافت آمار از بک‌اند
  axios.get('https://your-backend-url/stats')
    .then(response => {
      setUsers(response.data.users || 1200);
      setSearches(response.data.searches || 4500);
      setRevenue(response.data.revenue || 15000000);
    })
    .catch(error => console.error('Error fetching stats:', error));

  // نمودارهای رشد
  const ctxUser = document.getElementById('userGrowthChart')?.getContext('2d');
  const ctxRevenue = document.getElementById('revenueGrowthChart')?.getContext('2d');
  const ctxSearch = document.getElementById('searchGrowthChart')?.getContext('2d');

  if (ctxUser) {
    new Chart(ctxUser, {
      type: 'line',
      data: {
        labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد'],
        datasets: [{ label: 'کاربران', data: [500, 700, 900, 1000, 1200], borderColor: '#3B82F6' }]
      },
      options: { scales: { y: { beginAtZero: true } } }
    });
  }
  if (ctxRevenue) {
    new Chart(ctxRevenue, {
      type: 'line',
      data: {
        labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد'],
        datasets: [{ label: 'درآمد (تومان)', data: [5000000, 7000000, 10000000, 12000000, 15000000], borderColor: '#10B981' }]
      },
      options: { scales: { y: { beginAtZero: true } } }
    });
  }
  if (ctxSearch) {
    new Chart(ctxSearch, {
      type: 'line',
      data: {
        labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد'],
        datasets: [{ label: 'جستجوها', data: [1500, 2000, 3000, 4000, 4500], borderColor: '#F59E0B' }]
      },
      options: { scales: { y: { beginAtZero: true } } }
    });
  }

  return () => {
    document.getElementById('telegram-login')?.removeChild(script);
  };
}, []);

  // تابع اضافه کردن API
  const addApiKey = (type) => {
    const updatedApiKeys = { ...apiKeys, [type]: newApiKey[type] };
    setApiKeys(updatedApiKeys);
    setLogs([...logs, `API ${type} به‌روزرسانی شد`]);
    axios.post('https://your-backend-url/api_keys', { [type]: newApiKey[type] })
      .then(() => console.log('API Key Updated'))
      .catch(error => console.error('Error updating API key:', error));
  };

  // تابع اضافه کردن ویژگی
  const addFeature = () => {
    if (newFeature.trim()) {
      const updatedFeatures = [...features, newFeature.trim()];
      setFeatures(updatedFeatures);
      setNewFeature('');
      setLogs([...logs, `ویژگی جدید اضافه شد: ${newFeature}`]);
      axios.post('https://your-backend-url/features', { feature: newFeature.trim() })
        .then(() => console.log('Feature Added'))
        .catch(error => console.error('Error adding feature:', error));
    }
  };

  // تابع حذف ویژگی
  const removeFeature = (feature) => {
    const updatedFeatures = features.filter(f => f !== feature);
    setFeatures(updatedFeatures);
    setLogs([...logs, `ویژگی حذف شد: ${feature}`]);
    axios.delete('https://your-backend-url/features', { data: { feature } })
      .then(() => console.log('Feature Removed'))
      .catch(error => console.error('Error removing feature:', error));
  };

  // تابع اضافه کردن زبان
  const addLanguage = () => {
    if (newLanguage.trim() && Object.keys(translations).length > 0) {
      const updatedLanguages = [...languages, newLanguage];
      setLanguages(updatedLanguages);
      setLogs([...logs, `زبان جدید اضافه شد: ${newLanguage}`]);
      setNewLanguage('');
      setTranslations({});
      axios.post('https://your-backend-url/languages', { language: newLanguage, translations })
        .then(() => console.log('Language Added'))
        .catch(error => console.error('Error adding language:', error));
      setCurrentPage('languages');
    }
  };

  // تابع حذف زبان
  const removeLanguage = (lang) => {
    const updatedLanguages = languages.filter(l => l !== lang);
    setLanguages(updatedLanguages);
    setLogs([...logs, `زبان حذف شد: ${lang}`]);
    axios.delete('https://your-backend-url/languages', { data: { language: lang } })
      .then(() => console.log('Language Removed'))
      .catch(error => console.error('Error removing language:', error));
  };

  if (!isAuthenticated) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-secondary">
        <div className="text-center">
          <h1 className="display-4 mb-4">ورود به پنل مدیریت برندنیم</h1>
          <div id="telegram-login"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* نوار کناری */}
      <div className="sidebar">
        <h2 className="h4 fw-bold mb-5">پنل مدیریت</h2>
        <ul className="list-unstyled">
          <li className="mb-3">
            <button onClick={() => setCurrentPage('dashboard')} className="btn btn-outline-light w-100 text-end">
              پیشخوان
            </button>
          </li>
          <li className="mb-3">
            <button onClick={() => setCurrentPage('api')} className="btn btn-outline-light w-100 text-end">
              مدیریت API
            </button>
          </li>
          <li className="mb-3">
            <button onClick={() => setCurrentPage('features')} className="btn btn-outline-light w-100 text-end">
              مدیریت ویژگی‌ها
            </button>
          </li>
          <li className="mb-3">
            <button onClick={() => setCurrentPage('languages')} className="btn btn-outline-light w-100 text-end">
              مدیریت زبان‌ها
            </button>
          </li>
          <li className="mb-3">
            <button onClick={() => setCurrentPage('users')} className="btn btn-outline-light w-100 text-end">
              مدیریت کاربران
            </button>
          </li>
          <li className="mb-3">
            <button onClick={() => setCurrentPage('logs')} className="btn btn-outline-light w-100 text-end">
              لاگ فعالیت‌ها
            </button>
          </li>
          <li className="mb-3">
            <button onClick={() => setCurrentPage('settings')} className="btn btn-outline-light w-100 text-end">
              تنظیمات
            </button>
          </li>
          <li className="mb-3">
            <button onClick={() => setCurrentPage('support')} className="btn btn-outline-light w-100 text-end">
              پشتیبانی
            </button>
          </li>
        </ul>
      </div>

      {/* محتوای اصلی */}
      <div className="content">
        {currentPage === 'dashboard' && (
          <div>
            <h1 className="display-5 fw-bold mb-5">پیشخوان</h1>
            <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
              <div className="col">
                <div className="card p-4">
                  <h3 className="h5 fw-semibold">تعداد کاربران</h3>
                  <p className="fs-3">{users}</p>
                </div>
              </div>
              <div className="col">
                <div className="card p-4">
                  <h3 className="h5 fw-semibold">نام‌های جستجو شده</h3>
                  <p className="fs-3">{searches}</p>
                </div>
              </div>
              <div className="col">
                <div className="card p-4">
                  <h3 className="h5 fw-semibold">درآمد لحظه‌ای (تومان)</h3>
                  <p className="fs-3">{revenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="row row-cols-1 row-cols-md-2 g-4 mb-5">
              <div className="col">
                <div className="card p-4">
                  <h3 className="h5 fw-semibold mb-3">تقویم کاری</h3>
                  <input type="date" className="form-control" />
                </div>
              </div>
              <div className="col">
                <div className="card p-4">
                  <h3 className="h5 fw-semibold mb-3">اعلان‌ها</h3>
                  <ul className="list-unstyled">
                    <li className="mb-2">به‌روزرسانی جدید در دسترس است</li>
                    <li>کاربر جدید ثبت‌نام کرد</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="row row-cols-1 row-cols-md-3 g-4">
              <div className="col">
                <div className="card p-4">
                  <h3 className="h5 fw-semibold mb-3">رشد کاربران</h3>
                  <div className="chart-container">
                    <canvas id="userGrowthChart"></canvas>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card p-4">
                  <h3 className="h5 fw-semibold mb-3">رشد درآمد</h3>
                  <div className="chart-container">
                    <canvas id="revenueGrowthChart"></canvas>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card p-4">
                  <h3 className="h5 fw-semibold mb-3">رشد جستجوها</h3>
                  <div className="chart-container">
                    <canvas id="searchGrowthChart"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'api' && (
          <div>
            <h1 className="display-5 fw-bold mb-5">مدیریت API</h1>
            <div className="card p-5 mb-4">
              <h3 className="h5 fw-semibold mb-4">کلید API هوش مصنوعی</h3>
              <div className="mb-4">
                <label className="form-label">OpenAI API Key</label>
                <input
                  type="text"
                  value={newApiKey.openai}
                  onChange={(e) => setNewApiKey({ ...newApiKey, openai: e.target.value })}
                  className="form-control"
                  placeholder="کلید API را وارد کنید"
                />
                <button
                  onClick={() => addApiKey('openai')}
                  className="btn btn-primary mt-2"
                >
                  ذخیره
                </button>
                <p className="mt-2">وضعیت فعلی: {apiKeys.openai ? 'تنظیم شده' : 'تنظیم نشده'}</p>
              </div>
              <div>
                <label className="form-label">Google Cloud API Key</label>
                <input
                  type="text"
                  value={newApiKey.google}
                  onChange={(e) => setNewApiKey({ ...newApiKey, google: e.target.value })}
                  className="form-control"
                  placeholder="کلید API را وارد کنید"
                />
                <button
                  onClick={() => addApiKey('google')}
                  className="btn btn-primary mt-2"
                >
                  ذخیره
                </button>
                <p className="mt-2">وضعیت فعلی: {apiKeys.google ? 'تنظیم شده' : 'تنظیم نشده'}</p>
              </div>
            </div>
            <div className="card p-5">
              <h3 className="h5 fw-semibold mb-4">تست اتصال API</h3>
              <button className="btn btn-success me-2">
                تست OpenAI
              </button>
              <button className="btn btn-success">
                تست Google Cloud
              </button>
            </div>
          </div>
        )}

        {currentPage === 'features' && (
          <div>
            <h1 className="display-5 fw-bold mb-5">مدیریت ویژگی‌ها</h1>
            <div className="card p-5 mb-4">
              <h3 className="h5 fw-semibold mb-4">اضافه کردن ویژگی جدید</h3>
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="form-control mb-3"
                placeholder="ویژگی جدید را وارد کنید"
              />
              <button
                onClick={addFeature}
                className="btn btn-primary"
              >
                اضافه کردن
              </button>
            </div>
            <div className="card p-5">
              <h3 className="h5 fw-semibold mb-4">لیست ویژگی‌ها</h3>
              <ul className="list-group">
                {features.map((feature, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{feature}</span>
                    <button
                      onClick={() => removeFeature(feature)}
                      className="btn btn-danger btn-sm"
                    >
                      حذف
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {currentPage === 'languages' && (
          <div>
            <h1 className="display-5 fw-bold mb-5">مدیریت زبان‌ها</h1>
            <button
              onClick={() => setCurrentPage('add-language')}
              className="btn btn-primary mb-4"
            >
              اضافه کردن زبان جدید
            </button>
            <div className="card p-5">
              <h3 className="h5 fw-semibold mb-4">لیست زبان‌ها</h3>
              <ul className="list-group">
                {languages.map((lang, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    <span>{lang}</span>
                    <button
                      onClick={() => removeLanguage(lang)}
                      className="btn btn-danger btn-sm"
                    >
                      حذف
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {currentPage === 'add-language' && (
          <div>
            <h1 className="display-5 fw-bold mb-5">اضافه کردن زبان جدید</h1>
            <div className="card p-5">
              <div className="mb-4">
                <label className="form-label">نام زبان</label>
                <input
                  type="text"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="form-control"
                  placeholder="مثلاً عربی"
                />
              </div>
              <div className="mb-4">
                <label className="form-label">ترجمه متون ربات</label>
                <div className="mb-3">
                  <p>موضوع خود را وارد کنید</p>
                  <input
                    type="text"
                    onChange={(e) => setTranslations({ ...translations, industry: e.target.value })}
                    className="form-control"
                    placeholder="ترجمه به زبان مورد نظر"
                  />
                </div>
                <div className="mb-3">
                  <p>توضیحات</p>
                  <input
                    type="text"
                    onChange={(e) => setTranslations({ ...translations, description: e.target.value })}
                    className="form-control"
                    placeholder="ترجمه به زبان مورد نظر"
                  />
                </div>
                <div className="mb-3">
                  <p>کلمات کلیدی</p>
                  <input
                    type="text"
                    onChange={(e) => setTranslations({ ...translations, keywords: e.target.value })}
                    className="form-control"
                    placeholder="ترجمه به زبان مورد نظر"
                  />
                </div>
              </div>
              <button
                onClick={addLanguage}
                className="btn btn-primary"
              >
                اضافه کردن زبان
              </button>
            </div>
          </div>
        )}

        {currentPage === 'users' && (
          <div>
            <h1 className="display-5 fw-bold mb-5">مدیریت کاربران</h1>
            <div className="card p-5">
              <h3 className="h5 fw-semibold mb-4">لیست کاربران</h3>
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span>کاربر ۱</span>
                  <button className="btn btn-danger btn-sm">
                    بن کردن
                  </button>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span>کاربر ۲</span>
                  <button className="btn btn-danger btn-sm">
                    بن کردن
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}

        {currentPage === 'logs' && (
          <div>
            <h1 className="display-5 fw-bold mb-5">لاگ فعالیت‌ها</h1>
            <div className="card p-5">
              <ul className="list-group">
                {logs.map((log, index) => (
                  <li key={index} className="list-group-item">{log}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {currentPage === 'settings' && (
          <div>
            <h1 className="display-5 fw-bold mb-5">تنظیمات</h1>
            <div className="card p-5">
              <div className="mb-4">
                <label className="form-label">فعال کردن اعلان‌ها</label>
                <div className="form-check">
                  <input type="checkbox" className="form-check-input" id="notifications" />
                  <label className="form-check-label" htmlFor="notifications">ارسال اعلان به مدیران</label>
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label">محدودیت تولید نام</label>
                <input type="number" className="form-control" placeholder="مثلاً 10 در روز" />
              </div>
            </div>
          </div>
        )}

        {currentPage === 'support' && (
          <div>
            <h1 className="display-5 fw-bold mb-5">پشتیبانی</h1>
            <div className="card p-5">
              <div className="mb-4">
                <label className="form-label">ارسال تیکت</label>
                <textarea className="form-control" rows="4" placeholder="متن تیکت خود را بنویسید"></textarea>
              </div>
              <button className="btn btn-primary">
                ارسال تیکت
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
