`user strict`;
const userNameInput = document.getElementById(`user-name`);
const assessmentButton = document.getElementById(`assessment`);
const resultDivided = document.getElementById(`result-area`);
const tweetDivided = document.getElementById(`tweet-area`);

/**
 * 指定したHTML 要素の子要素をすべて削除する関数
 * (目にも留まらぬ速さでボタンを押した時に表示をいったん全部消して表示してる)
 * @param {HTMLElement} element HTMLの要素
 */
function removeAllChildren(element) {
    // 子要素がある限り削除
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// ボタンが押された時の処理
// assessmentButton.onclick = function() {
assessmentButton.onclick = () => {
    const userName = userNameInput.value;
    // 名前が空の時は処理を終了する
    if (userName.length === 0) {
        // 直ちに関数の処理を終了するガード句
        return;
    }
    console.log(userName);

    // TODO 診断結果表示エリアの作成
    // 診断ボタンが押されたら一度、div 要素の 子要素全て削除する (子要素がある限り削除)
    // while (resultDivided.firstChild) {
    //     resultDivided.removeChild(resultDivided.firstChild);
    // }
    // 前回の診断結果(<h3> , <p>) を消す
    removeAllChildren(resultDivided);

    // <h3>タグを作る
    const header = document.createElement(`h3`);
    // <h3>タグの中身に 「診断結果」 を入れる
    header.innerText = `診断結果`;
    // <div>タグの中に <h3>タグを子要素として追加
    resultDivided.appendChild(header);

    // <p>タグを作る
    const paragraph = document.createElement(`p`);
    // 診断結果取得
    const result = assessment(userName);
    // 診断結果の文字列を <p>タグ内の文字列として入れる
    paragraph.innerText = result;
    // <div>タグの中に <p>タグを子要素として追加
    resultDivided.appendChild(paragraph);

    // TODO ツイートエリアの作成
    // 前回の診断結果(<a> , <script>) を消す
    removeAllChildren(tweetDivided);

    // <a>タグを作る
    const anchor = document.createElement(`a`);
    // <a>タグの　href属性に TwitterのURIを作る
    const hrefValue = "https://twitter.com/intent/tweet?button_hashtag="
        // URIエンコードした「あなたのいいところ」という文字列を結合
        + encodeURIComponent(`あなたのいいところ`)
        + `&ref_src=twsrc%5Etfw`;

    // <a>タグの属性を作る
    anchor.setAttribute(`href`, hrefValue);
    anchor.className = `twitter-hashtag-button`;
    anchor.setAttribute(`data-text`, result);
    // <a>タグの内のテキストを作る
    anchor.innerText = `Tweet #あなたのいいところ`;
    // <div>タグの中に <a>タグを子要素として追加
    tweetDivided.appendChild(anchor);

    // <script>タグを作る 
    // srcのURLが読み込まれた時点で自動的に「twttr.widgets.load();」の処理が走っていると考えられる.
    // だからjsファイルで<script>タグを作る場合は、「twttr.widgets.load();」を書く必要がない
    const script = document.createElement(`script`);
    // <script>タグの src 属性を作る
    script.setAttribute(`src`, "https://platform.twitter.com/widgets.js");
    script.setAttribute(`charset`, `utf-8`);
    tweetDivided.appendChild(script);

    // twitter用の <a> タグを見つけたらボタンに変換する処理 
    // (この処理を書く場合は、HTMLの方に twitter社が用意した<script> タグを貼り付ける。
    // 先にHTMLが読み込まれるから、そこに書くことで <script> タグを以下の処理が実行される前に読み込ませられる)
    // twttr.widgets.load();
};

// Enterキーを押しても、ボタンを押した時の処理が実行される処理
userNameInput.onkeydown = (event) => {
    if (event.key === `Enter`) {
        assessmentButton.onclick();
    }
};

const answers = [
    `{userName}のいいところは声です。{userName}の特徴的な声は皆を惹きつけ、心に残ります。`,
    `{userName}のいいところはまなざしです。{userName}に見つめられた人は、気になって仕方がないでしょう。`,
    `{userName}のいいところは情熱です。{userName}の情熱に周りの人は感化されます。`,
    `{userName}のいいところは厳しさです。{userName}の厳しさがものごとをいつも成功に導きます。`,
    `{userName}のいいところは知識です。博識な{userName}を多くの人が頼りにしています。`,
    `{userName}のいいところはユニークさです。{userName}だけのその特徴が皆を楽しくさせます。`,
    `{userName}のいいところは用心深さです。{userName}の洞察に、多くの人が助けられます。`,
    `{userName}のいいところは見た目です。内側から溢れ出る{userName}の良さに皆が気を惹かれます。`,
    `{userName}のいいところは決断力です。{userName}がする決断にいつも助けられる人がいます。`,
    `{userName}のいいところは思いやりです。{userName}に気をかけてもらった多くの人が感謝しています。`,
    `{userName}のいいところは感受性です。{userName}が感じたことに皆が共感し、わかりあうことができます。`,
    `{userName}のいいところは節度です。強引すぎない{userName}の考えに皆が感謝しています。`,
    `{userName}のいいところは好奇心です。新しいことに向かっていく{userName}の心構えが多くの人に魅力的に映ります。`,
    `{userName}のいいところは気配りです。{userName}の配慮が多くの人を救っています。`,
    `{userName}のいいところはその全てです。ありのままの{userName}自身がいいところなのです。`,
    `{userName}のいいところは自制心です。やばいと思ったときにしっかりと衝動を抑えられる{userName}が皆から評価されています。`,
    `{userName}のいいところは優しさです。あなたの優しい雰囲気や立ち振る舞いに多くの人が癒やされています。`

];

/*
 *名前の文字列を渡すと診断結果を返す関数
 * @param {string} userName - ユーザーの名前
 * @return {string} - 診断結果
 * {userName} - 置き換え文字　()で囲ってもいいし記号は何でも良い
*/
function assessment(userName) {
    // 入力した userName の全文字のコード番号を取得してそれを足し合わせる
    let sumOfCharCode = 0;
    for (let i = 0; i < userName.length; i++) {
        sumOfCharCode += userName.charCodeAt(i);
    }

    // 一定のルール： 入力した名前 (userName) の文字コードの合計値 (sumOfCharCode) を診断結果の配列 (answers 配列) の数で割った時、
    // その余りは 0~15 の範囲におさまる。 その余りの値が answers 配列の添字に該当する

    // 文字のコード番号の合計を回答の数で割って添字の数値を求める
    const index = sumOfCharCode % answers.length;
    // answers配列から添え字に該当する診断結果の内容をresult変数に代入
    let result = answers[index];
    // TODO {userName} をユーザーの名前に置き換える
    result = result.replace(/\{userName\}/g, userName);
    return result;
}

// 「//」 ←　正規表現だよっていう印 (検索して、ヒットした文字列を何かしら処理を行うのに使う文法)
// 正規表現中では、「{ }}」 が特別な意味(「{} の直前の文字」を{}中の数字分繰り返すという意味)を持つので、
// 文字として 「{ }」 を対象とする場合は
// 「\{」 「\}」 のように 「バックスラッシュ」でエスケープする必要がある。
// 「{」、「 }」 それぞれの前に 「\」 をつけることで、「{」、「 }」　はただの文字列として認識される。
// g をつけておかないと、最初のひとつしかヒットしない。「/g」 をつけることで全部ヒットさせる。
// 「^」 はハットと読む。行頭を意味する。「^hello」の場合、行頭がhelloから始まってる文字列にヒットする。

// console.log(assessment(`太郎`));
// console.log(assessment(`めあ`));
// console.log(assessment(`太郎`));

// テストコード
// assessment 関数が正しく動いているか

console.assert(
    assessment(`太郎`) === `太郎のいいところは決断力です。太郎がする決断にいつも助けられる人がいます。`,
    '診断結果の文言の特定の部分を名前に置き換える処理が正しくありません。'
    );

// console.assert(
//     assessment(`太郎`) === `太郎のいいところは気配りです。太郎の配慮が多くの人を救っています。`,
//     `診断結果の文言が正しくありません。`
// );

console.assert(
        assessment(`太郎`) === assessment(`太郎`),
        `入力が同じ名前なら、同じ診断結果を出力する処理が正しくありません`
);
