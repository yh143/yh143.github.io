// 配置：视频列表
// 请根据你videos文件夹中的实际视频文件进行修改！
// name: 视频显示名称
// file: 视频文件名（必须位于videos/文件夹内）
// desc: 视频描述（可选）
const videoList = [
    { name: "SM64小视频", file: "ｆｉｒｓｔ.wmv", desc: "SM64", duration: "0:23" },
    { name: "编程教学：JavaScript 基础", file: "js-tutorial.mp4", desc: "学习JavaScript变量和函数", duration: "12:45" },
    { name: "吉他弹奏：经典歌曲", file: "guitar-cover.mp4", desc: "翻弹经典英文歌曲", duration: "3:56" },
    { name: "快速早餐食谱", file: "breakfast-recipe.mp4", desc: "十分钟完成的健康早餐", duration: "7:12" },
    { name: "城市延时摄影", file: "city-timelapse.mp4", desc: "都市从日落到华灯初上", duration: "2:18" },
    { name: "健身入门训练", file: "workout-beginner.mp4", desc: "适合新手的全身训练", duration: "15:30" }
];

// 页面元素
const videoPlayer = document.getElementById('mainVideoPlayer');
const videoTitle = document.getElementById('videoTitle');
const videoDescription = document.getElementById('videoDescription');
const videoPlaylist = document.getElementById('videoPlaylist');

// 初始化：生成视频列表
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

// 播放指定索引的视频
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

    // 尝试播放（用户交互后大多数浏览器才允许自动播放）
    videoPlayer.load(); // 重新加载视频源

    // 添加一个提示，告知用户可以点击播放按钮
    if (index > 0) { // 不是第一个视频时给出提示
        videoDescription.textContent += ' (点击播放器上的按钮开始播放)';
    }

    // 可选：尝试自动播放（注意浏览器策略可能阻止此行为）
    const playPromise = videoPlayer.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => {
            // 自动播放失败是正常情况，忽略错误
            console.log('自动播放被浏览器阻止，等待用户手动播放。');
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initializePlaylist);

// 为播放器添加一些交互反馈
videoPlayer.addEventListener('play', function() {
    console.log(`视频开始播放: ${videoTitle.textContent}`);
});

videoPlayer.addEventListener('ended', function() {
    const currentIndex = parseInt(document.querySelector('#videoPlaylist li.active').dataset.index);
    const nextIndex = (currentIndex + 1) % videoList.length;
    // 可选：自动播放下一个视频
    // playVideo(nextIndex);
    console.log('当前视频播放完毕。你可以点击列表中的下一个视频继续。');
});
// === 配置区域 ===
// 请修改为你的信息！
const GITHUB_USERNAME = 'yh143'; // 例如：octocat
const GITHUB_REPO = 'yh143.github.io';     // 例如：my-video-site
const GITHUB_TOKEN = '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';
// === 配置结束 ===

// 获取表单元素
const videoSubmitForm = document.getElementById('videoSubmitForm');
const formMessage = document.getElementById('formMessage');

// 表单提交处理
videoSubmitForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // 阻止表单默认刷新行为

    const url = document.getElementById('videoUrl').value;
    const name = document.getElementById('submitterName').value || '匿名用户';
    const desc = document.getElementById('videoDescription').value || '无描述';

    // 禁用按钮，防止重复提交
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = '提交中...';
    formMessage.textContent = '';
    formMessage.style.color = '#3498db';

    // 准备提交的数据
    const issueTitle = `新视频投稿：${name}`;
    const issueBody = `**视频链接：**\n${url}\n\n**投稿人：**\n${name}\n\n**描述：**\n${desc}\n\n---\n*此条目由网站表单自动创建*`;

    try {
        // 调用GitHub API创建Issue
        const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/issues`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: issueTitle,
                body: issueBody
            })
        });

        if (response.ok) {
            const data = await response.json();
            formMessage.textContent = '✅ 投稿成功！感谢分享。';
            formMessage.style.color = '#2ecc71';
            videoSubmitForm.reset(); // 清空表单
            // 可选：在控制台输出新Issue的链接，方便你查看
            console.log(`投稿已创建: ${data.html_url}`);
        } else {
            throw new Error(`GitHub API 返回错误: ${response.status}`);
        }
    } catch (error) {
        console.error('提交失败:', error);
        formMessage.textContent = '❌ 提交失败，请稍后重试或检查控制台。';
        formMessage.style.color = '#e74c3c';
    } finally {
        // 重新启用按钮
        submitBtn.disabled = false;
        submitBtn.textContent = '提交链接';
    }
});
