document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       1. ALBUM 資料
       ========================= */
    const albums = {
        hotel: [
            "image/room1.jpg",
            "image/room2.jpg",
            "image/room3.jpg"
        ],
        dinner1230: [
            "image/1230_dinner_000.jpg",
            "image/1230_dinner_001.jpg",
            "image/1230_dinner_002.jpg",
            "image/1230_dinner_003.jpg"
        ]
    };

    /* =========================
       2. Lightbox
       ========================= */
    let currentAlbum = [];
    let currentIndex = 0;

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-image");
    const closeBtn = document.querySelector(".lightbox-close");
    const prevBtn = document.querySelector(".lightbox-prev");
    const nextBtn = document.querySelector(".lightbox-next");

    function openLightbox(albumName, index) {
        currentAlbum = albums[albumName];
        currentIndex = index;
        lightboxImg.src = currentAlbum[currentIndex];
        lightbox.style.display = "flex";
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + currentAlbum.length) % currentAlbum.length;
        lightboxImg.src = currentAlbum[currentIndex];
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % currentAlbum.length;
        lightboxImg.src = currentAlbum[currentIndex];
    }

    prevBtn.onclick = (e) => { e.stopPropagation(); showPrev(); };
    nextBtn.onclick = (e) => { e.stopPropagation(); showNext(); };
    closeBtn.onclick = () => { lightbox.style.display = "none"; lightbox.classList.remove("zoom"); };

    lightboxImg.onclick = (e) => {
        e.stopPropagation();
        lightbox.classList.toggle("zoom");
    };
    lightbox.onclick = () => {
        lightbox.style.display = "none";
        lightbox.classList.remove("zoom");
    };

    /* =========================
   3. Carousel（修正版 – 保留你全部程式架構）
   ========================= */
    document.querySelectorAll(".carousel").forEach(carousel => {
        const albumName = carousel.dataset.album;
        const track = carousel.querySelector(".carousel-track");
        const items = carousel.querySelectorAll(".carousel-item");

        const btnPrev = carousel.querySelector(".carousel-prev");
        const btnNext = carousel.querySelector(".carousel-next");

        let position = 0;

        /** 🔥 重新計算單張寬度（含 gap），可因 RWD 自動更新 */
        function getItemWidth() {
            const style = window.getComputedStyle(items[0]);
            const width = items[0].getBoundingClientRect().width;
            const marginRight = parseFloat(style.marginRight);
            return width + marginRight;
        }

        /** 🔥 計算最大可滑動距離（動態偵測 track 寬度） */
        function getMaxScroll() {
            const fullWidth = items.length * getItemWidth();
            const visibleWidth = carousel.getBoundingClientRect().width;
            return Math.max(fullWidth - visibleWidth, 0);
        }

        /** 🔥 更新位移 */
        function updateCarousel() {
            const maxScroll = getMaxScroll();
            if (position > maxScroll) position = maxScroll;
            track.style.transform = `translateX(-${position}px)`;
        }

        /** ← 按鈕 */
        btnPrev.addEventListener("click", () => {
            position -= getItemWidth();
            if (position < 0) position = 0;
            updateCarousel();
        });

        /** → 按鈕 */
        btnNext.addEventListener("click", () => {
            position += getItemWidth();
            const maxScroll = getMaxScroll();
            if (position > maxScroll) position = maxScroll;
            updateCarousel();
        });

        /** 點圖片 → 開燈箱（保持原功能） */
        items.forEach(item => {
            item.addEventListener("click", () => {
                openLightbox(albumName, Number(item.dataset.index));
            });
        });

        /** 🔥 RWD：手機旋轉 or 更換寬度，要重新算 */
        window.addEventListener("resize", () => {
            updateCarousel();
        });

        // 初始位置校正
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

});
