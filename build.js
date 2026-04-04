const fs = require('fs');
const path = require('path');

const langs = ['ja', 'en-US', 'en-GB', 'da', 'ko', 'zh-CN', 'zh-TW'];
const files = ['index.html', 'support.html', 'privacy.html'];

langs.forEach(lang => {
    // フォルダが存在しなければ作成
    if (!fs.existsSync(lang)) {
        fs.mkdirSync(lang);
    }

    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf-8');
        
        // HTMLの言語タグをそれぞれの言語に書き換え
        content = content.replace(/<html lang="ja">/gi, `<html lang="${lang}">`);
        
        // ★ここを追加: index.html へのリンクを ./ に書き換えてURLをスッキリさせる
        content = content.replace(/href="index\.html"/g, 'href="./"');
        
        fs.writeFileSync(path.join(lang, file), content);
    });
    console.log(`- /${lang}/ ディレクトリを作成・更新しました`);
});

console.log('すべての言語ディレクトリのビルドが完了しました！');