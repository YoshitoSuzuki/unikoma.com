const fs = require('fs');
const path = require('path');

const langs = ['ja', 'en-US', 'en-GB', 'da', 'ko', 'zh-CN', 'zh-TW'];

// ルートのテンプレート → 各言語ディレクトリ内の出力先
const pages = [
    { src: 'index.html', out: 'index.html' },
    { src: 'support/index.html', out: path.join('support', 'index.html') },
    { src: 'privacy/index.html', out: path.join('privacy', 'index.html') },
];

// 旧URL（ファイル名付き）からの転送ページ。GitHub Pages は 301 を返せないので
// canonical + meta refresh + JS で新URLへ送る
const movedPages = [
    { from: 'support.html', to: 'support/' },
    { from: 'privacy.html', to: 'privacy/' },
];

function redirectStub(lang, dest) {
    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<meta name="robots" content="noindex">
<title>Moved</title>
<link rel="canonical" href="https://unikoma.com${dest}">
<meta http-equiv="refresh" content="0; url=${dest}">
<script>location.replace("${dest}" + location.search + location.hash);</script>
</head>
<body><p>This page has moved to <a href="${dest}">${dest}</a>.</p></body>
</html>
`;
}

langs.forEach(lang => {
    pages.forEach(page => {
        let content = fs.readFileSync(page.src, 'utf-8');

        // HTMLの言語タグをそれぞれの言語に書き換え
        content = content.replace(/<html lang="ja">/gi, `<html lang="${lang}">`);

        // ナビゲーションのリンクを、その言語ディレクトリ配下のルート相対パスにする
        content = content.replace(/href="\/"/g, `href="/${lang}/"`);
        content = content.replace(/href="\/support\/"/g, `href="/${lang}/support/"`);
        content = content.replace(/href="\/privacy\/"/g, `href="/${lang}/privacy/"`);

        const outPath = path.join(lang, page.out);
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, content);
    });

    movedPages.forEach(moved => {
        fs.writeFileSync(path.join(lang, moved.from), redirectStub(lang, `/${lang}/${moved.to}`));
    });

    console.log(`- /${lang}/ ディレクトリを作成・更新しました`);
});

console.log('すべての言語ディレクトリのビルドが完了しました！');
