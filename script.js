// script.js
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyQuei36VGfTcqeb-VMQgPbbqmY1kqpk82GYi0noRUJI703C3sYF_TpsLN1PLrUytw/exec'; // THAY URL MỚI VÀO ĐÂY

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Trang đã load');
    loadPhotos();
    startCountdown();
    createFloatingHearts();
    setupModal();
});

async function loadPhotos() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '<div class="loading">Đang tải kỷ niệm... ❤️</div>';
    
    try {
        // Thử fetch với mode 'no-cors' và timestamp
        const response = await fetch(APPS_SCRIPT_URL + '?t=' + Date.now(), {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const photos = await response.json();
        console.log('📸 Dữ liệu:', photos);
        
        if (photos.error) {
            throw new Error(photos.error);
        }
        
        if (!photos || photos.length === 0) {
            gallery.innerHTML = '<div class="loading">Chưa có ảnh nào! ❤️</div>';
            return;
        }
        
        displayPhotos(photos);
        
    } catch (error) {
        console.error('❌ Lỗi:', error);
        
        // Thử fetch qua proxy nếu bị CORS
        tryProxy();
    }
}

// Hàm thử fetch qua proxy
async function tryProxy() {
    const gallery = document.getElementById('gallery');
    
    try {
        // Dùng proxy để bypass CORS
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const response = await fetch(proxyUrl + APPS_SCRIPT_URL + '?t=' + Date.now());
        const photos = await response.json();
        
        if (photos && photos.length > 0) {
            displayPhotos(photos);
        } else {
            gallery.innerHTML = '<div class="loading">Không có ảnh nào</div>';
        }
        
    } catch (proxyError) {
        gallery.innerHTML = `
            <div class="loading">
                <p>❤️</p>
                <p>Không thể kết nối đến Google Sheets</p>
                <p style="font-size: 14px;">Vui lòng kiểm tra lại URL Apps Script</p>
                <button onclick="loadPhotos()" class="retry-btn">Thử lại</button>
            </div>
        `;
    }
}

function displayPhotos(photos) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    
    photos.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = photo.url;
        img.alt = photo.description;
        img.loading = 'lazy';
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/300x300?text=❤️';
        };
        
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.innerHTML = `
            <p>${photo.description}</p>
            <small>${photo.date}</small>
        `;
        
        item.appendChild(img);
        item.appendChild(overlay);
        item.onclick = () => showPhotoDetail(photo);
        
        gallery.appendChild(item);
    });
}

function showPhotoDetail(photo) {
    const modal = document.getElementById('photoModal');
    document.getElementById('modalImage').src = photo.url;
    document.getElementById('modalDescription').textContent = photo.description;
    document.getElementById('modalDate').textContent = photo.date;
    document.getElementById('modalLocation').textContent = photo.location;
    modal.style.display = 'block';
}

function startCountdown() {
    function update() {
        const diff = new Date(2026, 1, 14) - new Date();
        document.getElementById('days').textContent = Math.floor(diff / (1000*60*60*24));
        document.getElementById('hours').textContent = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
        document.getElementById('minutes').textContent = Math.floor((diff % (1000*60*60)) / (1000*60));
        document.getElementById('seconds').textContent = Math.floor((diff % (1000*60)) / 1000);
    }
    update();
    setInterval(update, 1000);
}

function createFloatingHearts() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}%;
            bottom: -50px;
            font-size: ${Math.random() * 20 + 10}px;
            animation: float ${Math.random() * 3 + 4}s linear infinite;
            opacity: ${Math.random() * 0.5 + 0.3};
            pointer-events: none;
            z-index: 999;
        `;
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 7000);
    }, 300);
}

function setupModal() {
    document.querySelector('.close').onclick = () => {
        document.getElementById('photoModal').style.display = 'none';
    };
    window.onclick = (e) => {
        if (e.target === document.getElementById('photoModal')) {
            document.getElementById('photoModal').style.display = 'none';
        }
    };
}
