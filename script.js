// ===== 视频列表配置 =====
// 请根据你videos文件夹中的实际视频文件进行修改！
// name: 视频显示名称
// file: 视频文件名（必须位于videos/文件夹内）
// desc: 视频描述
// duration: 视频时长
const videoList = [
    { name: "It's Mario Time!", file: "ｆｉｒｓｔ.mp4", desc: "尝尝SM64是什么味道的awa(发布者：SMGYH)", duration: "0:5" },
    { name: "小天才的恶行", file: "小天才的恶行.mp4", desc: "小天才的恶行(发布者：SMGYH)", duration: "1:36"},
    
];

// ===== DOM元素引用 =====
const videoPlayer = document.getElementById('mainVideoPlayer');
const videoTitle = document.getElementById('videoTitle');
const videoDescription = document.getElementById('videoDescription');
const videoPlaylist = document.getElementById('videoPlaylist');

// ===== 核心功能函数 =====

/**
 * 初始化视频播放列表
 */
function initializePlaylist() {
    videoPlaylist.innerHTML = ''; // 清空占位符

    videoList.forEach((video, index) => {
        const listItem = document.createElement('li');
        listItem.dataset.index = index; // 存储索引

        listItem.innerHTML = `
            <i class="fas fa-play-circle"></i>
            <div>
                <div class="video-name">${video.name}</div>
                <div>${video.desc}</div>
                <span class="video-duration"><i class="fas fa-clock"></i> ${video.duration}</span>
            </div>
        `;

        // 点击列表项播放视频
        listItem.addEventListener('click', () => playVideo(index));

        videoPlaylist.appendChild(listItem);
    });

    // 默认播放第一个视频
    if (videoList.length > 0) {
        playVideo(0);
    }
}

/**
 * 播放指定索引的视频
 * @param {number} index - 视频在列表中的索引
 */
function playVideo(index) {
    const video = videoList[index];
    const videoPath = `./videos/${video.file}`; // 视频文件路径

    // 更新播放器源
    videoPlayer.src = videoPath;

    // 更新视频信息
    videoTitle.textContent = video.name;
    videoDescription.textContent = video.desc;

    // 更新列表激活状态
    const allItems = document.querySelectorAll('#videoPlaylist li');
    allItems.forEach(item => item.classList.remove('active'));
    allItems[index].classList.add('active');

    // 加载视频源
    videoPlayer.load();

    // 尝试自动播放（注意浏览器策略可能阻止此行为）
    const playPromise = videoPlayer.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => {
            // 自动播放失败是正常情况
            console.log('自动播放被浏览器阻止，等待用户手动播放。');
        });
    }
}

/**
 * 初始化投稿链接（如果需要动态生成链接）
 */
function initSubmissionLink() {
    // 如果需要动态生成GitHub Issues链接，可以在这里处理
    // 例如根据当前仓库信息动态生成链接
    const submissionLink = document.querySelector('.github-submit-btn');
    if (submissionLink) {
        // 这里可以动态设置href，比如从当前页面URL提取仓库信息
        // 目前使用静态链接，所以不需要修改
        console.log('投稿链接已初始化');
    }
}

/**
 * 初始化当前年份显示
 */
function initCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ===== 播放器事件监听 =====

// 视频开始播放时
videoPlayer.addEventListener('play', function() {
    console.log(`视频开始播放: ${videoTitle.textContent}`);
});

// 视频播放结束时
videoPlayer.addEventListener('ended', function() {
    const currentIndex = parseInt(document.querySelector('#videoPlaylist li.active')?.dataset.index || 0);
    const nextIndex = (currentIndex + 1) % videoList.length;
    console.log('当前视频播放完毕。你可以点击列表中的下一个视频继续。');
    
    // 可选：自动播放下一个视频（取消注释即可启用）
    // playVideo(nextIndex);
});

// ===== 页面加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化...');
    
    // 初始化视频播放列表
    initializePlaylist();
    
    // 初始化投稿链接
    initSubmissionLink();
    
    // 初始化当前年份
    initCurrentYear();
    
    console.log('初始化完成！');
});

// ===== 工具函数 =====

/**
 * 获取视频文件名（不带扩展名）
 * @param {string} filename - 完整的文件名
 * @returns {string} 不带扩展名的文件名
 */
function getFileNameWithoutExtension(filename) {
    return filename.replace(/\.[^/.]+$/, "");
}
