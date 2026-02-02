// بيانات كاملة للتنويع
const scenarios = [
    { text: "🕯️ الغابة – صمت الطبيعة: أصوات رياح خفيفة… أوراق تتحرك… عُثر على الجثة قبل شروق الشمس. الهواء نقي… أكثر من اللازم. لا توجد آثار أقدام واضحة، وكأن الأرض نفسها حاولت إخفاء ما حدث.", tone: "توتر" },
    { text: "🏥 مستشفى مهجور – ذاكرة الألم: صوت مصباح متقطع… صدى خطوات بعيدة… هذا المكان كان يعالج الناس يومًا ما. الجدران ما زالت تحفظ الصراخ، والأرضية تعرف طريق الدم.", tone: "رعب" },
    { text: "🏨 فندق قديم – خلف الأبواب المغلقة: صوت مفتاح… باب يُغلق… صمت ثقيل… الغرفة كانت مرتّبة. السرير لم يُمس. ولكن الموت كان هنا.", tone: "غموض نفسي" },
    { text: "⚓ الميناء – جريمة بلا شهود: أمواج خفيفة… صرير حبال… الماء يمحو الكثير من الأشياء. لكن الرائحة كانت أوضح من الصوت.", tone: "توتر" },
    { text: "🏚️ منزل مهجور – الماضي يعود: صوت أرضية خشبية… باب يئن… هذا المنزل مهجور منذ سنوات. لكن الليلة… لم يكن فارغًا.", tone: "رعب" },
    { text: "🧠 سيناريو نفسي خاص: لا موسيقى… لا أصوات… الجثة لا تحمل إصابات واضحة. لكن الطبيب الشرعي متأكد: هذا لم يكن موتًا طبيعيًا.", tone: "غموض نفسي", rare: true }
];

const weapons = ["سكين", "مسدس", "سم", "حبل", "مطرقة", "سيف", "سمكة سامة"];
const evidences = ["بصمة", "شعرة", "ورقة", "مفتاح", "ساعة", "قفاز", "سيجارة"];
const locations = ["الغابة", "مستشفى مهجور", "فندق قديم", "ميناء", "منزل مهجور"];
const bloodTypes = ["O+", "A-", "B+", "AB-", "O-", "A+"];
const randomHints = ["ليس كل دليل وُجد… يعني شيئًا", "أحدكم كذب قبل أن تبدأ اللعبة", "القاتل لم يكن متوترًا"];

const hintsData = {
    "سكين": ["نزيف حاد", "جروح طعن متكررة", "أداة سهلة الحمل", "آثار دم متناثرة"],
    "مسدس": ["لا يوجد صوت إطلاق", "رصاصة واحدة", "كاتم صوت محتمل", "حرق على الجلد"],
    "سم": ["لا آثار عنف", "رغوة على الفم", "رائحة كيميائية", "تشنجات عضلية"],
    "حبل": ["علامات خنق", "آثار حبل على العنق", "كدمات على الرقبة", "لا دماء"],
    "مطرقة": ["كسور في الجمجمة", "آثار ضرب متكررة", "دماء على الأداة", "صوت مكتوم"],
    "سيف": ["جروح قطع عميقة", "آثار حديدية", "دماء كثيرة", "أداة تاريخية"],
    "سمكة سامة": ["سم طبيعي", "آثار عضة", "تورم في الجسم", "رائحة بحرية"]
};

const puzzles = [
    "🧩 لغز تناقض زمني: وقت الوفاة بين 1:00 و 2:00. أحد اللاعبين يدّعي أنه كان وحده، بينما هاتفه سجّل حركة بعد 1:30.",
    "🧩 لغز دليل غير مباشر: الأداة مسدس، لكن لا صوت إطلاق. المكان مغلق. الحل: كاتم صوت.",
    "🧩 لغز فصيلة الدم: فصيلة الدم المكتشفة: O-. لاعب واحد فقط يعرف أن دمه O-. القاتل حاول التضليل."
];

let players = [], difficulty = "medium", killer, forensic, roles = {}, selectedWeapon, selectedEvidence, selectedLocation, bloodType, timerInterval, votes = {}, scores = {};

// دالة لخلط القوائم عشوائيًا
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// دالة للزر في index.html (هذه الدالة التي كانت مفقودة!)
function startGame() {
    console.log("زر ابدأ اللعبة تم النقر عليه!");
    window.location.href = 'players.html';
}

// أصوات بسيطة
function playSound(sound) {
    const audio = new Audio(sound + '.mp3');
    audio.play();
}

// التنقل
document.getElementById('add-player')?.addEventListener('click', () => {
    const list = document.getElementById('players-list');
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `اسم اللاعب ${list.children.length + 1}`;
    input.className = 'player-input';
    list.appendChild(input);
});

document.getElementById('confirm-players')?.addEventListener('click', () => {
    players = Array.from(document.querySelectorAll('.player-input')).map(input => input.value).filter(name => name);
    difficulty = document.getElementById('difficulty').value;
    if (players.length < 6) {
        alert('يجب إدخال 6 لاعبين على الأقل');
        return;
    }
    // توزيع عشوائي
    roles = {};
    players.forEach(player => {
        roles[player] = {
            weapons: shuffle(weapons).slice(0, 3),
            evidences: shuffle(evidences).slice(0, 3)
        };
    });
    killer = players[Math.floor(Math.random() * players.length)];
    forensic = players[Math.floor(Math.random() * players.length)];
    while (forensic === killer) forensic = players[Math.floor(Math.random() * players.length)];
    bloodType = bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
    window.location.href = 'game.html';
});

// في game.html
if (window.location.pathname.includes('game.html')) {
    // عرض السيناريو
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    document.getElementById('scenario-text').innerHTML = `<p>${scenario.text}</p>`;
    document.getElementById('random-hint').innerHTML = `<p>تلميح عشوائي: ${randomHints[Math.floor(Math.random() * randomHints.length)]}</p>`;
    playSound('heartbeat');

    document.getElementById('next-to-roles').addEventListener('click', () => {
        document.getElementById('scenario-screen').classList.add('hidden');
        // شاشة القاتل (ملء القوائم دائمًا بالخيارات الكاملة للاختبار)
        document.getElementById('killer-screen').classList.remove('hidden');
        const weaponSelect = document.getElementById('weapon-select');
        const evidenceSelect = document.getElementById('evidence-select');
        const locationSelect = document.getElementById('location-select');
        
        // ملء القوائم دائمًا (أولاً الخيارات الكاملة، ثم تخصيص إذا كان القاتل)
        weapons.forEach(w => weaponSelect.innerHTML += `<option>${w}</option>`);  // ملء الأسلحة الكاملة
        evidences.forEach(e => evidenceSelect.innerHTML += `<option>${e}</option>`);  // ملء الأدلة الكاملة
        locations.forEach(l => locationSelect.innerHTML += `<option>${l}</option>`);  // ملء الأماكن
        
        // تخصيص إذا كان القاتل (اختياري للاختبار)
        if (confirm(`هل أنت ${killer} (القاتل)؟`)) {
            // يمكن إضافة تخصيص هنا (مثل ترتيب أسلحته أولاً)
        }
    });

    document.getElementById('confirm-killer')?.addEventListener('click', () => {
        selectedWeapon = document.getElementById('weapon-select').value;
        selectedEvidence = document.getElementById('evidence-select').value;
        selectedLocation = document.getElementById('location-select').value;
        document.getElementById('killer-screen').classList.add('hidden');
        // شاشة الطبيب الشرعي
        if (confirm(`هل أنت ${forensic} (الطبيب الشرعي)؟`)) {
            document.getElementById('forensic-screen').classList.remove('hidden');
            let hints = hintsData[selectedWeapon] || [];
            hints = hints.concat(["نسبة أكسجين مرتفعة", "ألياف نباتية على الملابس", "فصيلة الدم: " + bloodType]); // إضافة تلميحات المكان والدم
            if (difficulty === "easy") hints = hints.slice(0, 2); // أقل تلميحات في سهل
            if (difficulty === "hard") hints = hints.slice(0, 1); // أقل في صعب
            document.getElementById('hints').innerHTML = hints.map(h => `<p>${h}</p>`).join('');
        }
    });

    document.getElementById('next-to-investigation')?.addEventListener('click', () => {
        document.getElementById('forensic-screen').classList.add('hidden');
        document.getElementById('investigation-screen').classList.remove('hidden');
        document.getElementById('puzzle-hint').innerHTML = `<p>${puzzles[Math.floor(Math.random() * puzzles.length)]}</p>`;
        startTimer();
    });

    function startTimer() {
        let time = 600; // 10 دقائق
        timerInterval = setInterval(() => {
            time--;
            document.getElementById('timer').innerText = `الوقت المتبقي: ${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`;
            if (time <= 0) {
                clearInterval(timerInterval);
                document.getElementById('investigation-screen').classList.add('hidden');
                document.getElementById('voting-screen').classList.remove('hidden');
            }
        }, 1000);
    }

    document.getElementById('end-investigation')?.addEventListener('click', () => {
        clearInterval(timerInterval);
        document.getElementById('investigation-screen').classList.add('hidden');
        document.getElementById('voting-screen').classList.remove('hidden');
    });

    document.getElementById('submit-votes')?.addEventListener('click', () => {
        // جمع التصويت (بسيط: افترض إدخال أسماء)
        votes = {};
        players.forEach(player => {
            const vote = prompt(`ما رأيك في ${player}? (أدخل اسم المشتبه به)`);
            if (vote) votes[vote] = (votes[vote] || 0) + 1;
        });
        // حساب الفائزين
        const maxVotes = Math.max(...Object.values(votes));
        const suspectedKiller = Object.keys(votes).find(k => votes[k] === maxVotes);
        scores[killer] = suspectedKiller === killer ? 10 : 0; // القاتل يفوز إذا لم يُكشف
        scores[forensic] = suspectedKiller === killer ? 10 : 0; // الطبيب يفوز إذا كشف
        players.forEach(p => {
            if (p !== killer && p !== forensic) scores[p] = (votes[p] || 0) > 0 ? 5 : 0; // نقاط للتصويت الصحيح
        });
        document.getElementById('voting-screen').classList.add('hidden');
        document.getElementById('results-screen').classList.remove('hidden');
        document.getElementById('results').innerHTML = `
            <p>القاتل الحقيقي: ${killer}</p>
            <p>الأداة: ${selectedWeapon}</p>
            <p>الدليل: ${selectedEvidence}</p>
            <p>المكان: ${selectedLocation}</p>
            <p>الفائزون: ${Object.keys(scores).filter(p => scores[p] > 0).join(', ')}</p>
        `;
    });

    document.getElementById('new-game')?.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}