document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       1. ALBUM 資料
       ========================= */
    const albums = {
        hotel: [
            "image/room1.jpg",
            "image/room2.jpg",
            "image/room3.jpg",
            "image/room4.jpg",
            "image/room5.jpg",
            "image/room6.jpg"
        ],
        dinner1230: [
            "image/1230_dinner_000.jpg",
            "image/1230_dinner_001.jpg",
            "image/1230_dinner_002.jpg",
            "image/1230_dinner_003.jpg",
            "image/1230_dinner_000.jpg",
            "image/1230_dinner_001.jpg",
            "image/1230_dinner_002.jpg",
            "image/1230_dinner_003.jpg"
        ]
    };

    /* =========================
       2. Lightbox (燈箱)
       ========================= */
    let currentAlbum = [];
    let currentIndex = 0;
    // 燈箱滑動所需變數
    let startX = 0;
    const swipeThreshold = 50; // 滑動門檻：移動超過 50 像素才算有效切換

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-image");
    const closeBtn = document.querySelector(".lightbox-close");
    const prevBtn = document.querySelector(".lightbox-prev");
    const nextBtn = document.querySelector(".lightbox-next");
    
    // ⭐ Lightbox 獨立的關閉函數 (供 Esc 鍵、X 按鈕、點擊背景使用)
    function closeLightbox() {
        lightbox.style.display = "none";
        lightbox.classList.remove("zoom");
    }

    function openLightbox(albumName, index) {
        currentAlbum = albums[albumName];
        currentIndex = index;
        lightboxImg.src = currentAlbum[currentIndex];
        lightbox.style.display = "flex";
    }

    function showPrev() {
        // 往前切換，使用取餘運算實現循環
        currentIndex = (currentIndex - 1 + currentAlbum.length) % currentAlbum.length;
        lightboxImg.src = currentAlbum[currentIndex];
    }

    function showNext() {
        // 往後切換，使用取餘運算實現循環
        currentIndex = (currentIndex + 1) % currentAlbum.length;
        lightboxImg.src = currentAlbum[currentIndex];
    }
    
    // ⭐ Lightbox 滑動處理函數
    function handleSwipe(start, end) {
        const diff = start - end; // 正數代表向左滑，負數代表向右滑
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // 向左滑動 (L -> R) -> 下一張
                showNext();
            } else {
                // 向右滑動 (R -> L) -> 上一張
                showPrev();
            }
        }
    }

    // Lightbox 按鈕事件監聽
    prevBtn.onclick = (e) => { e.stopPropagation(); showPrev(); };
    nextBtn.onclick = (e) => { e.stopPropagation(); showNext(); };
    closeBtn.onclick = closeLightbox; // 使用獨立的關閉函數

    // Lightbox 點擊圖片放大/縮小
    lightboxImg.onclick = (e) => {
        e.stopPropagation();
        lightbox.classList.toggle("zoom");
    };
    
    // Lightbox 點擊背景關閉
    lightbox.onclick = closeLightbox; // 使用獨立的關閉函數
    
    // Lightbox 滑動/拖曳事件監聽
    lightboxImg.addEventListener('mousedown', (e) => {
        startX = e.clientX;
    });
    lightboxImg.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX; 
    });
    
    lightboxImg.addEventListener('mouseup', (e) => {
        const endX = e.clientX;
        handleSwipe(startX, endX);
    });
    lightboxImg.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX; 
        handleSwipe(startX, endX);
    });

    /* =========================
       3. Carousel (輪播 - 已包含移動距離修正)
       ========================= */
    document.querySelectorAll(".carousel").forEach(carousel => {
        const albumName = carousel.dataset.album;
        const track = carousel.querySelector(".carousel-track");
        const items = carousel.querySelectorAll(".carousel-item");

        const btnPrev = carousel.querySelector(".carousel-prev");
        const btnNext = carousel.querySelector(".carousel-next");

        // 輪播的 currentIndex 需在每個輪播獨立計算
        let currentIndex = 0; 

        // 判斷當前可視的圖片數量 (RWD 響應式)
        function getVisibleCount() {
            return window.innerWidth <= 768 ? 3 : 4;
        }

        function updateCarousel() {
            const visible = getVisibleCount();
            const maxIndex = items.length - visible;
            
            // 確保 currentIndex 不會超出最大可視索引
            currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
            
            const firstItem = track.querySelector(".carousel-item");
            if (!firstItem) return;
            
            const itemWidth = firstItem.getBoundingClientRect().width;
            const gap = 8;
            
            // ⭐ 核心修正：移動距離 = 當前索引 * (單張圖片寬度 + 間隙)
            const movePx = currentIndex * (itemWidth + gap);
            
            track.style.transform = `translateX(-${movePx}px)`;
        }
        
        // 左右切換按鈕事件
        btnPrev.addEventListener("click", e => {
            e.stopPropagation();
        
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        btnNext.addEventListener("click", e => {
            e.stopPropagation();
        
            const visible = getVisibleCount(); 
            const maxIndex = items.length - visible;
        
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        });

        // 點圖片開燈箱
        items.forEach(item => {
            item.addEventListener("click", e => {
                e.stopPropagation();
                openLightbox(albumName, Number(item.dataset.index));
            });
        });

        // 畫面調整大小時重新計算
        window.addEventListener("resize", updateCarousel);
        
        // 初始化第一個輪播，確保載入時位置正確
        updateCarousel(); 
    });


    /* =========================
       4. 手機漢堡選單
       ========================= */
    const menuToggle = document.querySelector(".menu-toggle");
    const mobileMenu = document.getElementById("mobileMenu");

    menuToggle.onclick = () => mobileMenu.classList.add("open");

    mobileMenu.onclick = (e) => {
        if (e.target === mobileMenu) {
            mobileMenu.classList.remove("open");
        }
    };

    mobileMenu.querySelectorAll("a").forEach(link => {
        link.onclick = () => mobileMenu.classList.remove("open");
    });
    
    // ⭐ 最終修正：將 Esc 鍵監聽放在 DOMContentLoaded 內部，解決作用域問題
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });

}); // DOMContentLoaded 結束