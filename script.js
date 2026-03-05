document.addEventListener('DOMContentLoaded', () => {
    
    // ハンバーガーメニューの開閉
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            if (mobileNav.style.display === 'block') {
                mobileNav.style.display = 'none';
            } else {
                mobileNav.style.display = 'block';
            }
        });
    }

    // FAQのアコーディオン（開閉）
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            answer.classList.toggle('open');
        });
    });

    // お問い合わせフォーム送信時の動作（デモ）
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('お問い合わせありがとうございます。\n（※これはデモサイトのため実際には送信されません）');
            contactForm.reset();
        });
    }

    /* =========================================
       多言語対応（ローカライズ）の処理
       ========================================= */

    // デフォルト言語と対応言語のリスト
    const DEFAULT_LANG = 'ja'; 
    const SUPPORTED_LANGS = ['ja', 'en-US', 'en-GB', 'da', 'ko', 'zh-CN', 'zh-TW'];

    // 閲覧者のブラウザ言語を取得・判定する
    function getBrowserLang() {
        const browserLang = navigator.language; 
        
        // 完全一致をチェック
        if (SUPPORTED_LANGS.includes(browserLang)) return browserLang;
        
        // 前方一致をチェック
        const baseLang = browserLang.split('-')[0];
        const match = SUPPORTED_LANGS.find(lang => lang.startsWith(baseLang));
        
        return match || DEFAULT_LANG;
    }

    // 画面のテキストを翻訳データに置き換える
    function applyTranslations(lang) {
        if (typeof translations === 'undefined') return;

        const data = translations[lang] || translations[DEFAULT_LANG];
        
        // data-i18n属性を持つすべての要素を書き換え
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (data[key]) {
                // titleタグの場合はdocument.titleを使用、それ以外はinnerHTML
                if (el.tagName === 'TITLE') {
                    document.title = data[key];
                } else {
                    el.innerHTML = data[key];
                }
            }
        });

        // <html>タグのlang属性も更新
        document.documentElement.lang = lang;
    }

    // 言語を切り替えてブラウザに保存する
    function switchLanguage(lang) {
        applyTranslations(lang);
        localStorage.setItem('unikoma_lang', lang); 
        
        // セレクトボックスの表示も合わせる
        const selectBox = document.getElementById('lang-select');
        if (selectBox) selectBox.value = lang;
    }

    // ページ読み込み時の初期化処理
    const savedLang = localStorage.getItem('unikoma_lang');
    const initialLang = savedLang || getBrowserLang();
    
    switchLanguage(initialLang);

    // ドロップダウンが変更された時のイベント
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            switchLanguage(e.target.value);
        });
    }
});