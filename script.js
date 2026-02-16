// ===== 视频列表配置 =====
const videoList = [
    { name: "骐骥驰骋 势不可挡！2026年总台春晚主题、主标识发布!", file: "34631912179-1-192.mp4", desc: "春晚预告片(发布者：SMGYH)", duration: "0:05" },
    { name: "It's Mario Time!", file: "first.mp4", desc: "尝尝SM64是什么味道的awa(发布者：SMGYH)", duration: "0:05" },
    { name: "小天才的恶行", file: "小天才的恶行.mp4", desc: "小天才的恶行(发布者：SMGYH)", duration: "1:36"},
    { name: "兽圈宝藏合集", file: "兽圈视频游戏小说宝藏合集furup内容推荐模块.mp4", desc: "兽圈视频/游戏/小说宝藏合集🦊FurUp内容推荐模块(发布者：SMGYH)", duration: "2:03"},
    { name: "2分钟教你发低质视频，并爆火起号！", file: "35462709482-1-192.mp4", desc: "2分钟教你发低质视频，并爆火起号！(发布者：SMGYH)", duration: "2分钟"},
    { name: "少年不知苹果好，错把小天才当成宝", file: "35055993973-1-192.mp4", desc: "少年  不  知  苹果好，  错  把小天才  当成  宝(发布者：SMGYH)", duration: "1:53"},
    { name: "搞笑野猪佩奇", file: "34907885429-1-192.mp4", desc: "搞笑野猪佩奇1，但是鱿鱼游戏(发布者：SMGYH)", duration: "1:03"}, 
    { name: "你敢保证这是成龙配的音？", file: "你敢保证这是成龙配的音？.mp4", desc: "你敢保证这是成龙配的音？(发布者：SMGYH)", duration: "3:23" },
    { name: "如何加入兽圈，怎么加入兽圈（很简单的）", file: "991553251-1-208.mp4", desc: "如何加入兽圈，怎么加入兽圈（很简单的）(发布者：SMGYH)", duration: "3:23"},
];

// ===== DOM元素引用 =====
const videoPlayer = document.getElementById('mainVideoPlayer');
const videoTitle = document.getElementById('videoTitle');
const videoDescription = document.getElementById('videoDescription');
const videoPlaylist = document.getElementById('videoPlaylist');

// ===== 核心功能函数 =====

function initializePlaylist() {
    videoPlaylist.innerHTML = '';

    videoList.forEach((video, index) => {
        const listItem = document.createElement('li');
        listItem.dataset.index = index;

        listItem.innerHTML = `
            <i class="fas fa-play-circle"></i>
            <div>
                <div class="video-name">${video.name}</div>
                <div>${video.desc}</div>
                <span class="video-duration"><i class="fas fa-clock"></i> ${video.duration}</span>
            </div>
        `;

        listItem.addEventListener('click', () => playVideo(index));
        videoPlaylist.appendChild(listItem);
    });

    if (videoList.length > 0) {
        playVideo(0);
    }
}

function playVideo(index) {
    const video = videoList[index];
    const videoPath = `./videos/${video.file}`;

    videoPlayer.src = videoPath;
    videoTitle.textContent = video.name;
    videoDescription.textContent = video.desc;

    const allItems = document.querySelectorAll('#videoPlaylist li');
    allItems.forEach(item => item.classList.remove('active'));
    allItems[index].classList.add('active');

    videoPlayer.load();
    const playPromise = videoPlayer.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => {
            console.log('自动播放被浏览器阻止，等待用户手动播放。');
        });
    }
}

function initSubmissionLink() {
    const submissionLink = document.querySelector('.github-submit-btn');
    if (submissionLink) {
        console.log('投稿链接已初始化');
    }
}

function initCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ===== 新增：新年倒计时（农历春节） =====
// 定义2026-2030年春节日期（公历）
const springFestivals = [
    { year: 2026, month: 2, day: 17 }, // 2026年春节
    { year: 2027, month: 2, day: 6 },  // 2027年春节
    { year: 2028, month: 1, day: 26 }, // 2028年春节
    { year: 2029, month: 2, day: 13 }, // 2029年春节
    { year: 2030, month: 2, day: 3 }   // 2030年春节
];

function getNextSpringFestival() {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // 查找从当前年份开始的第一个未来的春节
    for (let i = 0; i < springFestivals.length; i++) {
        const sf = springFestivals[i];
        if (sf.year < currentYear) continue;
        
        // 构建目标日期（当地时间的0点）
        const targetDate = new Date(sf.year, sf.month - 1, sf.day, 0, 0, 0);
        if (targetDate > now) {
            return targetDate;
        }
    }
    // 如果超出2030年，简单返回2030年春节（可扩展）
    return new Date(2030, 1, 3, 0, 0, 0);
}

function updateCountdown() {
    const targetDate = getNextSpringFestival();
    const now = new Date();
    const diff = targetDate - now; // 毫秒

    if (diff <= 0) {
        // 如果已过时，重新计算（例如刚刚过了一秒）
        location.reload(); // 简单刷新页面重新获取
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (86400000)) / (3600000));
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    document.getElementById('countdownDays').textContent = days.toString().padStart(2, '0');
    document.getElementById('countdownHours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('countdownMinutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('countdownSeconds').textContent = seconds.toString().padStart(2, '0');
}

// ===== 播放器事件监听 =====

videoPlayer.addEventListener('play', function() {
    console.log(`视频开始播放: ${videoTitle.textContent}`);
});

videoPlayer.addEventListener('ended', function() {
    const currentIndex = parseInt(document.querySelector('#videoPlaylist li.active')?.dataset.index || 0);
    const nextIndex = (currentIndex + 1) % videoList.length;
    console.log('当前视频播放完毕。你可以点击列表中的下一个视频继续。');
});

// ===== 页面加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化...');
    
    initializePlaylist();
    initSubmissionLink();
    initCurrentYear();

    // 启动倒计时
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    console.log('初始化完成！');
});
