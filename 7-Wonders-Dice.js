// 7wonders-dice.js
const readline = require('readline');

// ダイスの種類と面の定義
const DICE_TYPES = {
    GREY:  { name: '灰色 (資源)', faces: ['木材', '石材', '粘土', 'パピルス', 'ガラス', 'ワイルド'] },
    RED:   { name: '赤色 (軍事)', faces: ['盾1', '盾1', '盾2', '剣1', '剣1', 'ワイルド'] },
    BLUE:  { name: '青色 (勝利点)', faces: ['2点', '3点', '3点', '4点', '5点', 'ワイルド'] },
    YELLOW:{ name: '黄色 (商業)', faces: ['1コイン', '2コイン', '2コイン', '貿易', '貿易', 'ワイルド'] },
    GREEN: { name: '緑色 (科学)', faces: ['羅針盤', '歯車', '日時計', '羅針盤', '歯車', 'ワイルド'] }
};

// プレイヤーの初期ボード
let playerBoard = {
    wonderProgress: 0, // 七不思議の建設段階 (最大5)
    militaryPower: 0,  // 軍事力
    victoryPoints: 0,  // 勝利点
    coins: 0,          // コイン
    scienceTokens: [], // 獲得した科学アイコン
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// ダイスをランダムに振る関数
function rollDice(count = 3) {
    const keys = Object.keys(DICE_TYPES);
    const rolled = [];
    for (let i = 0; i < count; i++) {
        const randomTypeKey = keys[Math.floor(Math.random() * keys.length)];
        const diceType = DICE_TYPES[randomTypeKey];
        const randomFace = diceType.faces[Math.floor(Math.random() * diceType.faces.length)];
        rolled.push({ color: diceType.name, effect: randomFace });
    }
    return rolled;
}

// プレイヤーボードの状態を表示
function displayStatus() {
    console.log('\n======================================');
    console.log('【あなたの都市の状態】');
    console.log(`七不思議建設段階: ${playerBoard.wonderProgress} / 5`);
    console.log(`軍事力: ${playerBoard.militaryPower}⚔️`);
    console.log(`所持コイン: ${playerBoard.coins}💰`);
    console.log(`獲得科学トークン: [${playerBoard.scienceTokens.join(', ')}]`);
    console.log(`現在の純粋な建物勝利点: ${playerBoard.victoryPoints}点`);
    console.log('======================================\n');
}

// 選択されたダイスの効果を適用
function applyEffect(dice) {
    console.log(`\n▶️ 「${dice.color} : ${dice.effect}」を選択しました。`);
    
    // 簡易的な効果処理ロジック
    if (dice.effect.includes('点')) {
        const pts = parseInt(dice.effect);
        playerBoard.victoryPoints += pts;
    } else if (dice.effect.includes('コイン')) {
        const coins = parseInt(dice.effect);
        playerBoard.coins += coins;
    } else if (dice.effect.includes('盾') || dice.effect.includes('剣')) {
        playerBoard.militaryPower += 1;
    } else if (['羅針盤', '歯車', '日時計'].includes(dice.effect)) {
        playerBoard.scienceTokens.push(dice.effect);
    } else if (dice.color.includes('灰色') || dice.effect === 'ワイルド') {
        // 資源を使って七不思議を進める（簡易処理：資源ダイスが出たら1段階進む）
        if (playerBoard.wonderProgress < 5) {
            playerBoard.wonderProgress += 1;
            console.log('🏗️ 七不思議の建設が1段階進みました！');
        }
    }
}

// ゲームのメインループ
function gameTurn(turnNumber) {
    if (turnNumber > 5 || playerBoard.wonderProgress >= 5) {
        console.log('\n🎉 ゲーム終了！最終結果を確認します。');
        displayStatus();
        const totalScore = playerBoard.victoryPoints + playerBoard.wonderProgress * 3 + Math.floor(playerBoard.coins / 3);
        console.log(`総合勝利点: ${totalScore}点`);
        rl.close();
        return;
    }

    console.log(`\n--- ターン ${turnNumber} ---`);
    displayStatus();

    const pool = rollDice(3);
    console.log('【ダイスプール（場に振られたダイス）】');
    pool.forEach((dice, index) => {
        console.log(`${index + 1}: [${dice.color}] -> ${dice.effect}`);
    });

    rl.question('\nどのダイスを選びますか？ (1-3の番号を入力): ', (answer) => {
        const choice = parseInt(answer) - 1;
        if (choice >= 0 && choice < pool.length) {
            applyEffect(pool[choice]);
            gameTurn(turnNumber + 1);
        } else {
            console.log('❌ 無効な番号です。もう一度入力してください。');
            gameTurn(turnNumber);
        }
    });
}

// ゲーム開始
console.log('🎲 世界の七不思議: ダイスゲーム（Node.jsモック版）を開始します！');
gameTurn(1);
