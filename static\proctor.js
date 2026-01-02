// تهيئة التطبيق
async function initializeApp() {
    console.log('🚀 Initializing Proctoring System...');
    
    // إعداد الواجهة
    updateStatus(cameraStatus, 'warning', 'Starting...');
    updateStatus(faceStatus, 'warning', 'Waiting...');
    updateStatus(lightStatus, 'warning', 'Checking...');
    updateStatus(audioStatus, 'active', 'Muted');
    
    // بدء الكاميرا
    await startCamera();
    
    // إعداد مؤقت الامتحان
    setupExamTimer();
    
    // رسالة ترحيب
    setTimeout(() => {
        console.log('✅ Proctoring System Ready');
    }, 2000);
}

// بدء التطبيق عند تحميل الصفحة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// تنظيف عند إغلاق الصفحة
window.addEventListener('beforeunload', () => {
    console.log('🛑 Cleaning up...');
    
    // إيقاف الكاميرا
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
    
    // مسح المؤقتات
    if (alertTimeout) clearTimeout(alertTimeout);
});

// تصدير الدوال للاختبار (إذا لزم الأمر)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showAlert,
        hideAlert,
        checkLighting,
        startCamera
    };
}
