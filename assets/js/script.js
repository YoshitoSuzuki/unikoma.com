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
       多言語対応（ローカライズ）の処理（URL連動型）
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

    // URLのパスから現在の言語を取得
    const pathParts = window.location.pathname.split('/');
    const possibleLang = pathParts[1]; // URLの第1階層（例: /ja/ の "ja"）
    const urlLang = SUPPORTED_LANGS.includes(possibleLang) ? possibleLang : null;

    // 言語ディレクトリにいない場合、適切な言語のURLへリダイレクト
    if (!urlLang) {
        const targetLang = localStorage.getItem('unikoma_lang') || getBrowserLang();
        
        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            // ルートアクセス時はそのまま /ja/ 等へ
            window.location.replace(`/${targetLang}/`);
        } else {
            // /support.html など別ページへの直接アクセスの場合は /ja/support.html へ
            pathParts.splice(1, 0, targetLang);
            window.location.replace(pathParts.join('/'));
        }
        return; // リダイレクト処理を行うため、これ以降のコードは実行させない
    }

    // URLから取得した現在の言語をローカルストレージに保存
    const currentLang = urlLang;
    localStorage.setItem('unikoma_lang', currentLang);

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

    // 翻訳を適用
    applyTranslations(currentLang);

    // ドロップダウンの設定とイベント
    const langSelect = document.getElementById('lang-select');
    if (langSelect) {
        // セレクトボックスの初期値を現在のURLの言語に合わせる
        langSelect.value = currentLang;
        
        langSelect.addEventListener('change', (e) => {
            const newLang = e.target.value;
            localStorage.setItem('unikoma_lang', newLang);
            
            // 現在のURLの言語部分（/ja/など）を新しい言語（/da/など）に書き換えて遷移
            const newPathParts = window.location.pathname.split('/');
            newPathParts[1] = newLang; 
            window.location.href = newPathParts.join('/');
        });
    }
});