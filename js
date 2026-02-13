// Thay thế URL này bằng URL web app của bạn từ Google Apps Script
const APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';

// Load ảnh khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    loadPhotos();
    startCountdown();
    createFloatingHearts();
});

// Load ảnh từ Google Sheets
async function loadPhotos() {
    try {
        const response = await fetch(APPS_SCRIPT_URL);
        const photos = await response.json();
        displayPhotos(photos);
    } catch (error) {
        console.error('Lỗi khi load ảnh:', error);
        document.getElementById('gallery').innerHTML = 
            '<div class="loading">Có lỗi xảy ra. Nhưng tình yêu anh dành cho em vẫn luôn ở đây! ❤️</div>';
    }
}

// Hiển thị ảnh lên gallery
function displayPhotos(photos) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';
    
    photos.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="${photo.url}" alt="Kỷ niệm ${index + 1}" loading="lazy">
            <div class="overlay">
                <p>${photo.description || 'Khoảnh khắc đẹp'}</p>
                <small>${photo.date || ''}</small>
            </div>
        `;
        
        item.addEventListener('click', () => showPhotoDetail(photo));
        gallery.appendChild(item);
    });
}

// Hiển thị chi tiết ảnh trong modal
function showPhotoDetail(photo) {
    const modal = document.getElementById('photoModal');
    const modalImg = document.getElementById('modalImage');
    const modalDesc = document.getElementById('modalDescription');
    const modalDate = document.getElementById('modalDate');
    const modalLocation = document.getElementById('modalLocation');
    
    modal.style.display = 'block';
    modalImg.src = photo.url;
    modalDesc.textContent = photo.description || 'Kỷ niệm đẹp';
    modalDate.textContent = photo.date || 'Không rõ ngày';
    modalLocation.textContent = photo.location || 'Không rõ địa điểm';
}

// Countdown đến Valentine
function startCountdown() {
    function updateCountdown() {
        const now = new Date();
        const currentYear = now.getFullYear();
        let valentine = new Date(currentYear, 1, 14); // Tháng 2 (0-based: 1 = February)
        
        if (now > valentine) {
            valentine = new Date(currentYear + 1, 1, 14);
        }
        
        const diff = valentine - now;
        
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

// Tạo hiệu ứng trái tim bay
function createFloatingHearts() {
    const heartsContainer = document.querySelector('.floating-hearts');
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.position = 'absolute';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        heart.style.animation = `float ${Math.random() * 3 + 4}s linear`;
        heart.style.opacity = Math.random() * 0.5 + 0.5;
        
        heartsContainer.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 7000);
    }, 300);
}

// Modal close button
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('photoModal').style.display = 'none';
});

// Click outside modal to close
window.addEventListener('click', function(event) {
    const modal = document.getElementById('photoModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
