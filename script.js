const DB = {
    STATIONS: [
        { id: "049", txt: "山本" },
        { id: "050", txt: "片倉台" },
        { id: "051", txt: "下田公園" },
        { id: "052", txt: "めぐろ台" },
        { id: "053", txt: "椚田町" },
        { id: "054", txt: "浅川" },
        { id: "055", txt: "氷川" },
        { id: "056", txt: "調戸" },
        { id: "057", txt: "西布" },
        { id: "058", txt: "北山" },
        { id: "059", txt: "駅々石打" },
        { id: "060", txt: "稲嶺ニュー" },
        { id: "061", txt: "稲嶺" },
        { id: "062", txt: "三沢" },
        { id: "063", txt: "新稲尾" },
    ],
    TRAIN_INFO: [
        { id: "041", txt: "本日も名桜..." },
        { id: "043", txt: "各駅停車" },
        { id: "044", txt: "急行" },
        { id: "045", txt: "快速" },
        { id: "046", txt: "準特急" },
        { id: "047", txt: "区間快速" },
        { id: "048", txt: "特急" },
        { id: "042", txt: "ゆきです" },


    ],
    HI: [
        { name: "山本", line: "名桜線", next: "003", soon: "004", canBeTerm: true, terminalNext: "003", terminalSoon: "004", not: false },
        { name: "片倉台", line: "名桜線", next: "005", soon: "006", canBeTerm: false, not: false },
        { name: "下田公園", line: "名桜線", next: "007", soon: "008", canBeTerm: true, terminalNext: "009", terminalSoon: "010", not: false },
        { name: "めぐろ台", line: "名桜線", next: "011", soon: "012", canBeTerm: false, not: false },
        { name: "椚田町", line: "名桜線", next: "013", soon: "014", canBeTerm: false, not: false },
        { name: "浅川", line: "名桜線", next: "015", soon: "016", canBeTerm: true, not: false },
        { name: "氷川", line: "名桜線", next: "017", soon: "018", canBeTerm: true, terminalNext: "019", terminalSoon: "020", not: false },
        { name: "調戸", line: "名桜線", next: "021", soon: "022", canBeTerm: true, not: false },
        { name: "西布", line: "名桜線", next: "023", soon: "024", canBeTerm: false, not: false },
        { name: "北山", line: "名桜線", next: "025", soon: "026", canBeTerm: false, not: false },
        { name: "駅々石打", line: "名桜線", next: "027", soon: "028", canBeTerm: true, terminalNext: "029", terminalSoon: "030", not: false },
        { name: "稲嶺ニューワールド", line: "名桜線", next: "031", soon: "032", canBetrerm: false, not: false },
        { name: "稲嶺", line: "名桜線", next: "033", soon: "034", canBeTerm: true, terminalNext: "035", terminalSoon: "036", not: false },
        { name: "三沢", line: "名桜線", next: "037", soon: "038", canBeTerm: false, not: false },
        { name: "新稲尾", line: "名桜線", next: "039", soon: "040", canBeTerm: true, terminalNext: "039", terminalSoon: "040", not: false },
    ],
    EF: [
        { id: "001", txt: "出口左" },
        { id: "002", txt: "出口右" },
    ]
};

// --- 設定管理 (Core Logic) ---
const SETTINGS_KEY = 'krab_settings_v2.0';
const DEFAULT_SETTINGS = {
    theme: 'auto',
    volume: 100,
    speed: 100,
    skipWarning: false,
    history: [],
    fullscreen: false,
    reduceAnim: false,
    pushToUnmute: false,
    unmuteKey: 'm',
    micDeviceId: '',
    micVolume: 100,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
};
let settings = { ...DEFAULT_SETTINGS };

function loadSettings() {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
        try {
            settings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        } catch (e) {
            console.error("Settings load error:", e);
        }
    }
    applySettings();
}

function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function applySettings() {
    // テーマ適用
    const applyTheme = (t) => {
        let actual = t;
        if (t === 'auto') {
            actual = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', actual);
        // UI更新
        document.querySelectorAll('.theme-opt').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.value === t);
        });
    };
    applyTheme(settings.theme);

    // 音量適用
    player.volume = settings.volume / 100;
    const volRange = document.getElementById('volume-range');
    const volVal = document.getElementById('volume-val');
    if (volRange) {
        volRange.value = settings.volume;
        updateSliderFill(volRange);
    }
    if (volVal) volVal.innerText = settings.volume + '%';

    // 速度適用
    player.playbackRate = settings.speed / 100;
    const speedRange = document.getElementById('speed-range');
    const speedVal = document.getElementById('speed-val');
    if (speedRange) {
        speedRange.value = settings.speed;
        updateSliderFill(speedRange);
    }
    if (speedVal) speedVal.innerText = (settings.speed / 100).toFixed(1) + 'x';

    // 警告スキップ
    const skipWarningCheck = document.getElementById('skip-warning-check');
    if (skipWarningCheck) skipWarningCheck.checked = settings.skipWarning;

    // フルスクリーン (UIのみ)
    const fsCheck = document.getElementById('fullscreen-check');
    if (fsCheck) fsCheck.checked = settings.fullscreen;

    // アニメーションを減らす
    const raCheck = document.getElementById('reduce-anim-check');
    if (raCheck) {
        raCheck.checked = settings.reduceAnim;
        document.body.classList.toggle('reduce-animations', settings.reduceAnim);
    }

    // プッシュ・トゥ・アンミュート
    const ptuCheck = document.getElementById('push-unmute-check');
    if (ptuCheck) ptuCheck.checked = settings.pushToUnmute;
    const ptuKeyInput = document.getElementById('unmute-key-input');
    if (ptuKeyInput) {
        ptuKeyInput.value = settings.unmuteKey;
        ptuKeyInput.title = `現在のキー: ${settings.unmuteKey.toUpperCase()} (クリックして変更)`;
    }
    const ptuBtn = document.getElementById('ptu-btn');
    if (ptuBtn) {
        ptuBtn.classList.remove('is-active');
        ptuBtn.classList.toggle('muted', settings.pushToUnmute);
    }

    // マイク詳細設定の同期
    const micVolRange = document.getElementById('mic-volume-range');
    const micVolVal = document.getElementById('mic-volume-val');
    if (micVolRange) {
        micVolRange.value = settings.micVolume;
        updateSliderFill(micVolRange);
    }
    if (micVolVal) micVolVal.innerText = settings.micVolume + '%';

    const echoCheck = document.getElementById('echo-cancel-check');
    if (echoCheck) echoCheck.checked = settings.echoCancellation;
    const noiseCheck = document.getElementById('noise-suppress-check');
    if (noiseCheck) noiseCheck.checked = settings.noiseSuppression;
    const agcCheck = document.getElementById('auto-gain-check');
    if (agcCheck) agcCheck.checked = settings.autoGainControl;

    updateHistoryUI();
}

function updateSliderFill(el) {
    const min = el.min || 0;
    const max = el.max || 100;
    const val = el.value;
    const percent = (val - min) / (max - min) * 100;
    el.style.background = `linear-gradient(to right, var(--accent-primary) 0%, var(--accent-primary) ${percent}%, var(--slider-track) ${percent}%, var(--slider-track) 100%)`;
}

function updateHistoryUI() {
    const container = document.getElementById('broadcast-history');
    if (!container) return;
    if (settings.history.length === 0) {
        container.innerHTML = '<div class="history-placeholder">履歴はありません</div>';
        return;
    }
    container.innerHTML = settings.history.map(item => `
        <div class="info-item">
            <span class="info-label">${item.txt}</span>
            <span class="info-value">${item.time}</span>
        </div>
    `).join('');
}

function addHistory(txt) {
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0') + ":" + now.getSeconds().toString().padStart(2, '0');
    settings.history.unshift({ txt, time });
    if (settings.history.length > 5) settings.history.pop();
    saveSettings();
    updateHistoryUI();
}

// --- 再生ロジック ---
let buildQueue = [];
let hiDisplayOrder = 1; // 1: 昇順, -1: 降順
let currentLineTab = "名桜線"; // 単一路線固定
let isPlaying = false;
const player = new Audio();

// --- マイク入力 (PTT) ロジック ---
let micStream = null;
let micContext = null;
let micGainNode = null;

async function initMic() {
    if (micContext) {
        if (micContext.state === 'suspended') await micContext.resume();
        return;
    }
    try {
        const constraints = {
            audio: {
                deviceId: settings.micDeviceId ? { exact: settings.micDeviceId } : undefined,
                echoCancellation: settings.echoCancellation,
                noiseSuppression: settings.noiseSuppression,
                autoGainControl: settings.autoGainControl
            }
        };
        micStream = await navigator.mediaDevices.getUserMedia(constraints);
        micContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = micContext.createMediaStreamSource(micStream);
        micGainNode = micContext.createGain();
        micGainNode.gain.value = 0; // 初期状態はミュート
        source.connect(micGainNode);
        micGainNode.connect(micContext.destination);
        // デバイスリストを更新（ラベル取得のため）
        updateMicDevices();
    } catch (e) {
        console.error("マイク取得エラー:", e);
    }
}

async function updateMicDevices() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        const select = document.getElementById('mic-device-select');
        if (!select) return;

        select.innerHTML = '<option value="">規定のデバイス</option>';
        audioInputs.forEach(device => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `マイク ${select.length}`;
            if (device.deviceId === settings.micDeviceId) option.selected = true;
            select.appendChild(option);
        });
    } catch (e) {
        console.error("デバイスリスト取得エラー:", e);
    }
}

async function switchMic(deviceId) {
    settings.micDeviceId = deviceId;
    saveSettings();
    
    if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
        micStream = null;
    }
    micContext = null; // initMicで再生成させる
    
    if (document.body.classList.contains('is-unmuted')) {
        await initMic();
        if (micGainNode) micGainNode.gain.value = settings.micVolume / 100;
    }
}

async function restartMic() {
    if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
        micStream = null;
        micContext = null;
        if (document.body.classList.contains('is-unmuted')) {
            await initMic();
            if (micGainNode) micGainNode.gain.value = settings.micVolume / 100;
        }
    }
}

let completedStations = new Set();
let currentStatus = {
    index: -1,   // station original index
    type: null   // 'next' or 'soon'
};

function playQueue(ids, onComplete) {
    if (isPlaying) { player.pause(); player.currentTime = 0; }
    isPlaying = true;

    // 手動放送（BuilderやEF）による割り込みの場合、案内状態をリセット
    // 案内IDでない場合（idsの長さが1より大きい、またはids[0]がDB.HIに含まれない）
    const isGuidance = ids.length === 1 && DB.HI.some(h => h.next == ids[0] || h.soon == ids[0] || h.terminalNext == ids[0] || h.terminalSoon == ids[0]);
    if (!isGuidance) {
        currentStatus = { index: -1, type: null };
        refreshActiveHI();
    }

    // 履歴追加ロジック
    const firstId = ids[0];
    let historyTxt = "不明な放送";
    const st = DB.STATIONS.find(s => s.id == firstId);
    const ti = DB.TRAIN_INFO.find(t => t.id == firstId);
    const ef = DB.EF.find(e => e.id == firstId);
    // 駅案内の場合はIDがnext, soonなど
    const hi = DB.HI.find(h => h.next == firstId || h.soon == firstId || h.terminalNext == firstId || h.terminalSoon == firstId);

    if (st) historyTxt = `単発: ${st.txt}`;
    else if (ti) historyTxt = `案内: ${ti.txt}`;
    else if (ef) historyTxt = `選択: ${ef.txt}`;
    else if (hi) historyTxt = `${hi.name} 案内放送`;
    else if (ids.length > 1) historyTxt = "Builder カスタム構成";

    addHistory(historyTxt);

    let i = 0;
    const next = () => {
        if (i < ids.length && isPlaying) {
            const track = String(ids[i]).padStart(3, '0');
            player.src = `audio/${track}.wav`;

            // 再生開始前に最新設定を適用
            player.volume = settings.volume / 100;
            player.playbackRate = settings.speed / 100;

            player.play().catch(e => {
                console.error("再生エラー:", track, e);
                i++; next();
            });
            player.onended = () => { i++; next(); };
        } else {
            isPlaying = false;
            if (onComplete) onComplete();
        }
    };
    next();
}

function stopBroadcast() {
    isPlaying = false;
    player.pause();
    player.currentTime = 0;
    document.body.classList.remove('is-unmuted');
}

async function setUnmute(active) {
    const ptuBtn = document.getElementById('ptu-btn');
    
    // マイクの初期化（初回のみ）
    if (active && settings.pushToUnmute && !micContext) {
        await initMic();
    }

    if (!settings.pushToUnmute) {
        if (micGainNode) micGainNode.gain.value = 0; // 常にマイクはオフ
        document.body.classList.remove('is-unmuted');
        if (ptuBtn) {
            ptuBtn.classList.remove('muted', 'is-active');
        }
        return;
    }

    // マイクのゲインのみを切り替え（放送のplayer.mutedには触らない）
    if (micGainNode) {
        const targetVol = active ? (settings.micVolume / 100) : 0;
        micGainNode.gain.setTargetAtTime(targetVol, micContext.currentTime, 0.05);
    }
    
    document.body.classList.toggle('is-unmuted', active);
    if (ptuBtn) {
        ptuBtn.classList.toggle('is-active', active);
        ptuBtn.classList.toggle('muted', !active);
    }
}

// --- UI Factory ---
function createActionButton({ text, className = '', onClick, title = '' }) {
    const button = document.createElement('button');
    button.type = 'button';
    button.innerText = text;
    if (className) button.className = className;
    if (title) button.title = title;
    if (typeof onClick === 'function') button.onclick = onClick;
    return button;
}

function createToggleSwitch({
    id,
    checked = false,
    checkmarkClass = 'stop-sw',
    onChange
}) {
    const label = document.createElement('label');
    label.className = 'custom-chk';

    const input = document.createElement('input');
    input.type = 'checkbox';
    if (id) input.id = id;
    input.checked = checked;
    if (typeof onChange === 'function') {
        input.addEventListener('change', () => onChange(input.checked, input));
    }

    const checkmark = document.createElement('span');
    checkmark.className = `checkmark ${checkmarkClass}`;

    label.append(input, checkmark);
    return label;
}

// --- Builder Logic ---
function updateBuilderDisplay() {
    const disp = document.getElementById('builderDisplay');
    if (!disp) return;
    disp.innerHTML = "";
    if (buildQueue.length === 0) {
        disp.innerText = "構成待ち...";
        disp.classList.add('is-empty');
        return;
    }
    disp.classList.remove('is-empty');
    buildQueue.forEach((item, index) => {
        const part = document.createElement('div');
        part.className = "build-segment";
        part.draggable = true;
        part.dataset.index = index;

        part.ondragstart = (e) => { e.dataTransfer.setData('text/plain', index); part.classList.add('dragging'); };
        part.ondragend = () => part.classList.remove('dragging');
        part.ondragover = (e) => { e.preventDefault(); part.classList.add('drag-over'); };
        part.ondragleave = () => part.classList.remove('drag-over');
        part.ondrop = (e) => {
            e.preventDefault(); part.classList.remove('drag-over');
            const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
            const toIdx = index;
            if (fromIdx !== toIdx) {
                const movedItem = buildQueue.splice(fromIdx, 1)[0];
                buildQueue.splice(toIdx, 0, movedItem);
                updateBuilderDisplay();
            }
        };

        const label = document.createElement('span');
        label.className = "segment-label";
        label.innerText = item.txt;

        const DBtn = createActionButton({
            text: "×",
            className: "segment-del",
            onClick: (e) => {
                e.stopPropagation();
                buildQueue.splice(index, 1);
                updateBuilderDisplay();
            }
        });

        part.append(label, DBtn);
        disp.appendChild(part);
    });
}

// --- Station Control ---
function updateTerminalSwitches() {
    let selectedIdx = DB.HI.findIndex(st => st.term);
    DB.HI.forEach((st, i) => {
        const sw = document.getElementById(`hi-term-${i}`);
        if (sw && st.canBeTerm) sw.disabled = (selectedIdx !== -1 && selectedIdx !== i);
    });
    refreshActiveHI();
}

function toggleAllStops(value) {
    DB.HI.forEach((st, i) => {
        st.stop = value; // データモデルを更新
        const sw = document.getElementById(`hi-stop-${i}`);
        if (sw) sw.checked = value;
    });
    refreshActiveHI();
}

function markPreviousStationsAsCompleted(currentIndex) {
    const stations = DB.HI.map((st, i) => ({ ...st, originalIndex: i }));
    if (hiDisplayOrder === -1) stations.reverse();

    for (const st of stations) {
        if (st.originalIndex === currentIndex) break;
        completedStations.add(st.originalIndex);
    }
}

function refreshActiveHI() {
    const list = document.getElementById('active-station-list');
    if (!list) return;
    list.innerHTML = "";

    const stations = DB.HI.map((st, i) => ({ ...st, originalIndex: i }));
    if (hiDisplayOrder === -1) stations.reverse();

    const nextTargetIndex = stations.find(st => !completedStations.has(st.originalIndex))?.originalIndex;

    stations.forEach((st) => {
        const i = st.originalIndex;

        // not: true の駅は完全に表示しない
        if (st.not) return;

        const isStopInput = document.getElementById(`hi-stop-${i}`);
        const isTermInput = document.getElementById(`hi-term-${i}`);
        // 状態モデルから取得（入力要素がない場合はデータモデルの状態を使用する。後述のrenderStationMasterで同期させる）
        const isStop = isStopInput ? isStopInput.checked : (st.stop !== undefined ? st.stop : false);
        const isTerm = isTermInput ? isTermInput.checked : (st.term !== undefined ? st.term : false);

        const isActive = currentStatus.index === i;
        const isCompleted = completedStations.has(i);
        // 表示条件を厳密化: 停車設定でない駅は、案内中（isActive）でない限り絶対に表示しない
        if (!isStop && !isActive) return;

        const row = document.createElement('div');
        row.className = "station-row";
        if (!isStop) row.classList.add('is-passing');
        if (isTerm) row.classList.add('is-terminal');
        if (isCompleted) row.classList.add('is-completed');
        if (isActive) {
            row.classList.add('is-active');
            if (currentStatus.type === 'soon') row.classList.add('status-soon');
        }

        let statusBadge = "";
        if (isActive) {
            statusBadge = `<span class="status-badge">${currentStatus.type === 'next' ? '次は' : (isStop ? 'まもなく' : '通過中')}</span>`;
        } else if (isCompleted) {
            statusBadge = `<span class="pass-label">通過済み</span>`;
        }

        const lineSymbol = 'M';
        row.innerHTML = `
            <div class="st-name-area">
                ${statusBadge}
                <div class="st-line-label line-m">${lineSymbol}</div>
                <div class="st-name-main">
                    ${st.name}${isTerm ? '<span class="term-label">終点</span>' : ''}
                </div>
            </div>
        `;

        const btnGroup = document.createElement('div');
        btnGroup.className = "st-btn-group";

        const nBtn = createActionButton({
            text: "Next",
            className: "btn-next",
            onClick: () => {
                markPreviousStationsAsCompleted(i); // この駅より前を完了にする
                completedStations.delete(i);
                currentStatus = { index: i, type: 'next' };
                const track = (isTerm && st.terminalNext) ? st.terminalNext : st.next;
                playQueue([track]);
                refreshActiveHI();
            }
        });

        const sBtn = createActionButton({
            text: "Soon",
            className: "btn-soon",
            onClick: () => {
                markPreviousStationsAsCompleted(i); // この駅より前を完了にする
                completedStations.delete(i);
                currentStatus = { index: i, type: 'soon' };
                let queue = [];
                if (isTerm) {
                    queue.push((st.terminalSoon) ? st.terminalSoon : st.soon, "070", "071");
                } else {
                    queue.push(st.soon);
                }
                refreshActiveHI();
                playQueue(queue); // 自動完了のコールバックを削除
            }
        });
        btnGroup.append(nBtn, sBtn);
        row.appendChild(btnGroup);
        list.appendChild(row);
    });
}

function resetProgress() {
    completedStations.clear();
    currentStatus = { index: -1, type: null };
    refreshActiveHI();
}

// --- Main Init ---
document.addEventListener('DOMContentLoaded', () => {
    // 全駅データの初期化
    DB.HI.forEach(st => {
        if (st.stop === undefined) st.stop = false;
        if (st.term === undefined) st.term = false;
    });

    loadSettings();

    // 警告モーダルの表示をグローバル関数として定義
    window.showStartupWarning = function () {
        const modal = document.getElementById('warningModal');
        if (modal && !settings.skipWarning) {
            modal.classList.add('active');
            document.getElementById('modalConfirmBtn').onclick = () => modal.classList.remove('active');
        }
    };

    // 設定表の描画関数
    function renderStationMaster() {
        const hiBody = document.getElementById('station-master-body');
        if (!hiBody) return;
        hiBody.innerHTML = "";

        DB.HI.forEach((st, i) => {
            const row = document.createElement('tr');
            row.className = "station-row-item";

            const nameCell = document.createElement('td');
            nameCell.style.fontWeight = 'bold';
            nameCell.innerText = st.name;

            if (st.not) {
                const disabledCell = document.createElement('td');
                disabledCell.colSpan = 2;
                disabledCell.style.textAlign = 'center';
                disabledCell.style.verticalAlign = 'middle';
                disabledCell.style.padding = '10px 8px';
                disabledCell.innerHTML = '<div style="width: 100%; height: 26px; background: rgba(255, 255, 255, 0.05); border-radius: 13px; display: flex; align-items: center; justify-content: center; color: rgba(255, 255, 255, 0.4); font-size: 11px; font-weight: 800;">—</div>';
                row.append(nameCell, disabledCell);
            } else {
                const stopCell = document.createElement('td');
                const stopToggle = createToggleSwitch({
                    id: `hi-stop-${i}`,
                    checked: st.stop,
                    checkmarkClass: 'stop-sw',
                    onChange: (checked) => {
                        DB.HI[i].stop = checked;
                        refreshActiveHI();
                    }
                });
                stopCell.appendChild(stopToggle);

                const termCell = document.createElement('td');
                if (st.canBeTerm) {
                    const termToggle = createToggleSwitch({
                        id: `hi-term-${i}`,
                        checked: st.term,
                        checkmarkClass: 'term-sw',
                        onChange: (checked) => {
                            DB.HI[i].term = checked;
                            updateTerminalSwitches();
                        }
                    });
                    termCell.appendChild(termToggle);
                } else {
                    const termDisabled = document.createElement('span');
                    termDisabled.className = 'term-disabled-text';
                    termDisabled.innerText = '—';
                    termCell.appendChild(termDisabled);
                }

                row.append(nameCell, stopCell, termCell);
            }
            hiBody.appendChild(row);
        });
    }

    // 初期表示
    renderStationMaster();

    // Builderパーツ
    const createBtn = (id, data) => {
        const container = document.getElementById(id);
        if (container) {
            data.forEach(item => {
                const b = createActionButton({
                    text: item.txt,
                    onClick: () => {
                        buildQueue.push(item);
                        updateBuilderDisplay();
                    }
                });
                container.appendChild(b);
            });
        }
    };
    createBtn('builder-stations', DB.STATIONS);
    createBtn('builder-train-info', DB.TRAIN_INFO);

    // 選択放送
    const efList = document.getElementById('ef-immediate-list');
    if (efList) {
        DB.EF.forEach(item => {
            const b = createActionButton({
                text: item.txt,
                onClick: () => playQueue([item.id])
            });
            efList.appendChild(b);
        });
    }

    // Builder controls
    document.getElementById('playBtn').onclick = () => buildQueue.length && playQueue(buildQueue.map(i => i.id));
    document.getElementById('clearBtn').onclick = () => { buildQueue = []; updateBuilderDisplay(); };
    document.getElementById('stopBtn').onclick = () => stopBroadcast();

    // Sort logic
    const sortBtn = document.getElementById('sortOrderBtn');
    if (sortBtn) {
        sortBtn.onclick = () => {
            hiDisplayOrder *= -1;
            sortBtn.innerText = hiDisplayOrder === 1 ? '⇅ 昇順' : '⇅ 降順';
            refreshActiveHI();
        };
    }

    // Resize logic (Mouse & Touch)
    const handle = document.getElementById('resizeHandle');
    const builderCard = document.getElementById('builderCard');
    if (handle && builderCard) {
        let isResizing = false;

        const startResize = (e) => {
            isResizing = true;
            document.body.style.cursor = 'row-resize';
            e.preventDefault();
        };

        const doResize = (e) => {
            if (!isResizing) return;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const mainRect = document.querySelector('.main-sections').getBoundingClientRect();
            // ハンドルが常に中央に来るように、最初はCSSのflex: 1に任せる
            // 操作が始まったら、現在のマウス位置に基づいて高さを固定する
            let newHeight = Math.max(80, Math.min(mainRect.height - 100, clientY - mainRect.top));
            builderCard.style.height = newHeight + 'px';
            builderCard.style.flex = 'none';
        };

        const stopResize = () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = '';
            }
        };

        handle.addEventListener('mousedown', startResize);
        handle.addEventListener('touchstart', startResize, { passive: false });

        document.addEventListener('mousemove', doResize);
        document.addEventListener('touchmove', doResize, { passive: false });

        document.addEventListener('mouseup', stopResize);
        document.addEventListener('touchend', stopResize);
    }

    // UI Toggle
    const uiToggleBtn = document.getElementById('ui-toggle-btn');
    if (uiToggleBtn) {
        uiToggleBtn.onclick = () => {
            document.body.classList.toggle('ui-hidden');
            uiToggleBtn.classList.toggle('hidden-mode');
            uiToggleBtn.innerHTML = document.body.classList.contains('ui-hidden')
                ? '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'
                : '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
        };
    }

    // --- Settings UI control ---
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settingsModal');
    const settingsCloseBtn = document.getElementById('settingsCloseBtn');

    if (settingsBtn) settingsBtn.onclick = () => settingsModal.classList.add('active');
    if (settingsCloseBtn) settingsCloseBtn.onclick = () => settingsModal.classList.remove('active');

    // モーダル外側クリックで閉じる
    if (settingsModal) {
        settingsModal.onclick = (e) => {
            if (e.target === settingsModal) {
                settingsModal.classList.remove('active');
            }
        };
    }

    // Settings sidebar navigation
    const navItems = document.querySelectorAll('.settings-nav-item');
    const categories = document.querySelectorAll('.settings-category');

    navItems.forEach(navItem => {
        navItem.addEventListener('click', () => {
            const targetCategory = navItem.dataset.category;

            // Update active nav item
            navItems.forEach(item => item.classList.remove('active'));
            navItem.classList.add('active');

            // Update Toolbar Title
            const titleEl = document.getElementById('settings-current-title');
            const navText = navItem.querySelector('span').innerText;
            if (titleEl) titleEl.innerText = navText;

            // Update active category
            categories.forEach(category => {
                if (category.dataset.category === targetCategory) {
                    category.classList.add('active');
                } else {
                    category.classList.remove('active');
                }
            });

            // Mobile Navigation Logic
            const container = document.querySelector('.settings-container');
            const backBtn = document.querySelector('.nav-btn.back');
            if (window.innerWidth <= 768) {
                container.classList.add('show-content');
                if (backBtn) {
                    backBtn.disabled = false;

                    // Add click listener if not already added (simple check)
                    if (!backBtn.dataset.hasListener) {
                        backBtn.addEventListener('click', () => {
                            container.classList.remove('show-content');
                            backBtn.disabled = true;
                        });
                        backBtn.dataset.hasListener = 'true';
                    }
                }
            }
        });
    });

    // Theme opts
    const themeCards = document.querySelectorAll('.theme-card');
    themeCards.forEach(card => {
        card.onclick = () => {
            settings.theme = card.dataset.value;
            saveSettings();
            applySettings();

            // Update UI
            themeCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        };
    });

    // Initial Active State
    const currentThemeCard = document.querySelector(`.theme-card[data-value="${settings.theme}"]`);
    if (currentThemeCard) {
        currentThemeCard.classList.add('active');
    }

    // Mediamatch listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (settings.theme === 'auto') applySettings();
    });

    // Volume
    const volRange = document.getElementById('volume-range');
    if (volRange) {
        volRange.oninput = () => {
            settings.volume = parseInt(volRange.value);
            updateSliderFill(volRange);
            saveSettings();
            applySettings();
        };
    }

    // Speed
    const speedRange = document.getElementById('speed-range');
    if (speedRange) {
        speedRange.oninput = () => {
            settings.speed = parseInt(speedRange.value);
            updateSliderFill(speedRange);
            saveSettings();
            applySettings();
        };
    }

    // Skip warning
    const skipCheck = document.getElementById('skip-warning-check');
    if (skipCheck) {
        skipCheck.onchange = () => {
            settings.skipWarning = skipCheck.checked;
            saveSettings();
        };
    }

    // Fullscreen toggle
    const fsCheck = document.getElementById('fullscreen-check');
    if (fsCheck) {
        fsCheck.onchange = () => {
            settings.fullscreen = fsCheck.checked;
            if (settings.fullscreen) {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => {
                        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
                    });
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
            saveSettings();
        };
    }

    // Reduce animations toggle
    const raCheck = document.getElementById('reduce-anim-check');
    if (raCheck) {
        raCheck.onchange = () => {
            settings.reduceAnim = raCheck.checked;
            document.body.classList.toggle('reduce-animations', settings.reduceAnim);
            saveSettings();
        };
    }

    // Reset
    const resetBtn = document.getElementById('reset-settings-btn');
    if (resetBtn) {
        resetBtn.onclick = () => {
            if (confirm('すべての設定を初期状態に戻しますか?')) {
                localStorage.removeItem(SETTINGS_KEY);
                location.reload();
            }
        };
    }

    // Clear History
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    if (clearHistoryBtn) {
        clearHistoryBtn.onclick = () => {
            if (settings.history.length > 0 && confirm('すべての放送履歴を削除しますか?')) {
                settings.history = [];
                saveSettings();
                updateHistoryUI();
            }
        };
    }

    // --- PTU Logic & Event Listeners ---
    const ptuBtnEl = document.getElementById('ptu-btn');
    if (ptuBtnEl) {
        const startUnmute = (e) => { e.preventDefault(); setUnmute(true); };
        const endUnmute = () => setUnmute(false);

        ptuBtnEl.addEventListener('mousedown', startUnmute);
        ptuBtnEl.addEventListener('touchstart', startUnmute, { passive: false });
        window.addEventListener('mouseup', endUnmute);
        window.addEventListener('touchend', endUnmute);
    }

    // Key Listeners
    window.addEventListener('keydown', (e) => {
        if (e.repeat) return;
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
        if (e.key.toLowerCase() === settings.unmuteKey.toLowerCase()) {
            setUnmute(true);
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.key.toLowerCase() === settings.unmuteKey.toLowerCase()) {
            setUnmute(false);
        }
    });

    // PTU Settings Listeners
    const ptuCheckEl = document.getElementById('push-unmute-check');
    if (ptuCheckEl) {
        ptuCheckEl.onchange = () => {
            settings.pushToUnmute = ptuCheckEl.checked;
            saveSettings();
            applySettings();
        };
    }

    const ptuKeyInputEl = document.getElementById('unmute-key-input');
    if (ptuKeyInputEl) {
        ptuKeyInputEl.onclick = () => {
            ptuKeyInputEl.value = "";
            ptuKeyInputEl.placeholder = "...";
            const keyHandler = (e) => {
                e.preventDefault();
                settings.unmuteKey = e.key.toLowerCase();
                saveSettings();
                applySettings();
                window.removeEventListener('keydown', keyHandler, true);
            };
            window.addEventListener('keydown', keyHandler, true);
        };
    }

    const micSelect = document.getElementById('mic-device-select');
    if (micSelect) {
        micSelect.onchange = () => switchMic(micSelect.value);
    }

    // 初回のデバイスリスト取得試行
    updateMicDevices();
    // 権限許可後などのためにデバイス変更イベントを監視
    navigator.mediaDevices.ondevicechange = updateMicDevices;

    // マイク詳細設定のリスナー
    const micVolRange = document.getElementById('mic-volume-range');
    if (micVolRange) {
        micVolRange.oninput = () => {
            settings.micVolume = parseInt(micVolRange.value);
            const valEl = document.getElementById('mic-volume-val');
            if (valEl) valEl.innerText = settings.micVolume + '%';
            updateSliderFill(micVolRange);
            saveSettings();
            if (micGainNode && document.body.classList.contains('is-unmuted')) {
                micGainNode.gain.setTargetAtTime(settings.micVolume / 100, micContext.currentTime, 0.05);
            }
        };
    }

    const setupMicToggle = (id, key) => {
        const el = document.getElementById(id);
        if (el) {
            el.onchange = () => {
                settings[key] = el.checked;
                saveSettings();
                restartMic();
            };
        }
    };
    setupMicToggle('echo-cancel-check', 'echoCancellation');
    setupMicToggle('noise-suppress-check', 'noiseSuppression');
    setupMicToggle('auto-gain-check', 'autoGainControl');

    // Clock
    setInterval(() => {
        const clockEl = document.getElementById('clock');
        if (clockEl) clockEl.innerText = new Date().toLocaleTimeString('ja-JP', { hour12: false });
    }, 1000);

    // Initial render
    refreshActiveHI();
    updateBuilderDisplay();

    // LCD Font Scaling
    const lcdObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            const height = entry.contentRect.height;
            const disp = entry.target;
            // 構成待ち状態（is-empty）の時だけ大きくスケール
            if (disp.classList.contains('is-empty')) {
                disp.style.fontSize = '14px'; // Consistent size for empty state
            } else {
                disp.style.fontSize = ''; // Reset to CSS default for segments
            }
        }
    });
    const lcdMonitor = document.getElementById('builderDisplay');
    if (lcdMonitor) lcdObserver.observe(lcdMonitor);

    // 背景パララックス
    document.addEventListener('mousemove', (e) => {
        const bg = document.querySelector('.bg-image-layer');
        if (!bg) return;
        const x = (e.clientX / window.innerWidth - 0.5) * 20; // 20px range
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        bg.style.transform = `translate(${-x}px, ${-y}px)`;
    });
    // Mobile Warning Close
    const warningCloseBtn = document.getElementById('mobile-warning-close');
    const warningEl = document.getElementById('mobile-warning');

    if (warningCloseBtn && warningEl) {
        warningCloseBtn.addEventListener('click', () => {
            warningEl.style.opacity = '0';
            warningEl.style.transform = 'translateY(20px)';
            setTimeout(() => {
                warningEl.style.display = 'none';
            }, 300);
        });
    }
});