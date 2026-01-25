// 配置：视频列表
// 请根据你videos文件夹中的实际视频文件进行修改！
// name: 视频显示名称
// file: 视频文件名（必须位于videos/文件夹内）
// desc: 视频描述（可选）
const videoList = [
    { name: "SM64小视频", file: "ｆｉｒｓｔ.mp4", desc: "SM64", duration: "0:23" },
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
// ===== 视频投稿功能 =====
// 注意：这里将textarea的id改为videoDescriptionForm，避免与播放器描述冲突

// === 配置区域 ===
// 使用前必须修改以下三个变量！
const GITHUB_USERNAME = 'yh143'; 
const GITHUB_REPO = 'yh143.github.io';  
const GITHUB_TOKEN = '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'; 
// === 配置结束 ===

// 初始化投稿表单功能
function initSubmissionForm() {
    const videoSubmitForm = document.getElementById('videoSubmitForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!videoSubmitForm) return; // 如果没有表单元素，则退出
    
    // 显示消息函数
    function showMessage(text, type = 'info') {
        formMessage.textContent = text;
        formMessage.className = `message-${type}`;
        
        // 自动隐藏成功消息
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
    
    // 验证URL格式
    function isValidUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'https:';
        } catch {
            return false;
        }
    }
    
    // 处理表单提交
    videoSubmitForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // 获取表单数据
        const url = document.getElementById('videoUrl').value.trim();
        const name = document.getElementById('submitterName').value.trim() || '匿名用户';
        const desc = document.getElementById('videoDescriptionForm').value.trim() || '无描述';
        
        // 验证URL
        if (!isValidUrl(url)) {
            showMessage('❌ 请输入有效的HTTPS视频链接！', 'error');
            document.getElementById('videoUrl').focus();
            return;
        }
        
        // 更新按钮状态
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
        showMessage('正在提交到GitHub，请稍候...', 'info');
        
        // 准备Issue数据
        const issueTitle = `[视频投稿] 来自 ${name}`;
        const issueBody = `## 视频链接\n${url}\n\n## 投稿人\n${name}\n\n## 描述\n${desc}\n\n---\n*提交时间：${new Date().toLocaleString()}*`;
        
        try {
            // 调用GitHub API创建Issue
            const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/issues`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: issueTitle,
                    body: issueBody,
                    labels: ['video-submission']
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('投稿成功，Issue链接:', data.html_url);
                
                // 显示成功消息
                showMessage('✅ 投稿成功！我们已收到你的推荐。感谢分享！', 'success');
                
                // 清空表单
                videoSubmitForm.reset();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }
        } catch (error) {
            console.error('提交失败:', error);
            let errorMsg = '提交失败，请稍后重试。';
            
            if (error.message.includes('401')) {
                errorMsg = '认证失败，请检查Token配置。';
            } else if (error.message.includes('404')) {
                errorMsg = '仓库未找到，请检查用户名和仓库名。';
            } else if (error.message.includes('network')) {
                errorMsg = '网络错误，请检查连接后重试。';
            }
            
            showMessage(`❌ ${errorMsg}`, 'error');
        } finally {
            // 恢复按钮状态
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> 提交链接';
        }
    });
    
    // 实时URL验证
    document.getElementById('videoUrl').addEventListener('input', function() {
        const url = this.value.trim();
        if (url && !isValidUrl(url)) {
            this.style.borderColor = '#e74c3c';
        } else {
            this.style.borderColor = '#ddd';
        }
    });
}

// 页面加载完成后初始化投稿表单
document.addEventListener('DOMContentLoaded', function() {
    // 你的现有初始化代码...
    initializePlaylist(); // 假设这是你原有的初始化函数
    
    // 新增：初始化投稿表单
    initSubmissionForm();
});
