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
            
            // クラスを切り替えてCSSでアニメーションさせる
            answer.classList.toggle('open');
            
            // + - のアイコン切り替えなどをしたい場合はここに追記
        });
    });

    // お問い合わせフォーム送信時の動作（デモ）
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // 実際の送信を防ぐ
            
            alert('お問い合わせありがとうございます。\n（※これはデモサイトのため実際には送信されません）');
            
            // フォームをリセット
            contactForm.reset();
        });
    }
});