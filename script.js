// script.js - Album Tình Yêu Valentine
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyQuei36VGfTcqeb-VMQgPbbqmY1kqpk82GYi0noRUJI703C3sYF_TpsLN1PLrUytw/exec';

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Trang đã load thành công');
    loadPhotos();
    startCountdown();
    createFloatingHearts();
    
    // Modal close events
    setupModal();
});

// ==================== LOAD ẢNH ====================
async function loadPhotos() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '<div class="loading">Đang tải những kỷ niệm ngọt ngào... ❤️</div>';
    
    try {
        console.log('🔄 Đang fetch từ:', APPS_SCRIPT_URL);
        
        // Thêm timestamp để tránh cache
        const response = await fetch(APPS_SCRIPT_URL + '?t=' + Date.now());
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const photos = await response.json();
        console.log('📸 Dữ liệu nhận được:', photos);
        
        // Kiểm tra dữ liệu
        if (!photos || photos.length === 0) {
            gallery.innerHTML = '<div class="loading">Chưa có ảnh nào. Em thêm ảnh vào Google Sheet nhé! ❤️</div>';
            return;
        }
        
        // Hiển thị ảnh
        displayPhotos(photos);
        
    } catch (error) {
        console.error('❌ Lỗi:', error);
        gallery.innerHTML = `
            <div class="loading">
                <p>❤️</p>
                <p>Không thể tải ảnh</p>
                <p style="font-size: 14px; margin-top: 10px;">${error.message}</p>
                <button onclick="loadPhotos()" class="retry-btn">Thử lại</button>
            </div>
        `;
    }
}

// ==================== HIỂN THỊ ẢNH ====================
function displayPhotos(photos) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    
    photos.forEach((photo, index) => {
        const item = createGalleryItem(photo, index);
        gallery.appendChild(item);
    });
}

function createGalleryItem(photo, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    
    // Xử lý URL ảnh
    let imageUrl = photo.url;
    if (imageUrl.includes('drive.google.com')) {
        const fileId = extractGoogleDriveId(imageUrl);
        if (fileId) {
            imageUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
        }
    }
    
    // Tạo phần tử ảnh
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = photo.description;
    img.loading = 'lazy';
    
    // Xử lý lỗi load ảnh
    img.onerror = function() {
        console.log('⚠️ Không load được ảnh:', imageUrl);
        this.src = 'https://via.placeholder.com/300x300?text=❤️+Anh+yêu+em';
    };
    
    // Tạo overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `
        <p>${photo.description}</p>
        <small>${photo.date}</small>
    `;
    
    item.appendChild(img);
    item.appendChild(overlay);
    
    // Thêm sự kiện click
    item.addEventListener('click', () => showPhotoDetail(photo));
    
    return item;
}

// ==================== HIỂN THỊ CHI TIẾT ====================
function showPhotoDetail(photo) {
    const modal = document.getElementById('photoModal');
    const modalImg = document.getElementById('modalImage');
    
    // Xử lý URL ảnh cho modal
    let imageUrl = photo.url;
    if (imageUrl.includes('drive.google.com')) {
        const fileId = extractGoogleDriveId(imageUrl);
        if (fileId) {
            imageUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1500`;
        }
    }
    
    modalImg.src = imageUrl;
    document.getElementById('modalDescription').textContent = photo.description;
    document.getElementById('modalDate').textContent = photo.date;
    document.getElementById('modalLocation').textContent = photo.location;
    
    modal.style.display = 'block';
    
    // Xử lý lỗi ảnh trong modal
    modalImg.onerror = function() {
        this.src = 'https://via.placeholder.com/800x600?text=❤️';
    };
}

// ==================== HÀM TIỆN ÍCH ====================
function extractGoogleDriveId(url) {
    if (!url) return null;
    
    const patterns = [
        /\/d\/([^\/]+)/,
        /id=([^&]+)/,
        /[-\w]{25,}/
    ];
    
    for (let pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return match[1] || match[0];
        }
    }
    return null;
}

// ==================== COUNTDOWN ====================
function startCountdown() {
    function updateCountdown() {
        const now = new Date();
        const valentine = new Date(2026, 1, 14); // 14/02/2026
        
        const diff = valentine - now;
        
        if (diff <= 0) {
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '0';
            document.getElementById('minutes').textContent = '0';
            document.getElementById('seconds').textContent = '0';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ==================== HIỆU ỨNG TRÁI TIM ====================
function createFloatingHearts() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}%;
            bottom: -50px;
            font-size: ${Math.random() * 30 + 10}px;
            animation: float ${Math.random() * 3 + 4}s linear infinite;
            opacity: ${Math.random() * 0.5 + 0.3};
            pointer-events: none;
            z-index: 999;
        `;
        document.body.appendChild(heart);
        
        setTimeout(() => heart.remove(), 7000);
    }, 400);
}

// ==================== MODAL SETUP ====================
function setupModal() {
    // Đóng modal khi click vào nút close
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            document.getElementById('photoModal').style.display = 'none';
        });
    }
    
    // Đóng modal khi click bên ngoài
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('photoModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Đóng modal khi nhấn ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            document.getElementById('photoModal').style.display = 'none';
        }
    });
}

// ==================== THÊM NÚT RETRY ====================
// Thêm style cho nút retry
const style = document.createElement('style');
style.textContent = `
    .retry-btn {
        background: #ff4d6d;
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 50px;
        font-size: 1.1em;
        margin-top: 20px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
    }
    .retry-btn:hover {
        transform: scale(1.05);
        background: #ff3355;
        box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    }
`;
document.head.appendChild(style);
