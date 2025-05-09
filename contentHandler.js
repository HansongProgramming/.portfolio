document.addEventListener('DOMContentLoaded', function () {
    const Artimages = [
        'images/art.png', 'images/art2.png'
    ];

    const ProjectImages =[
        'images/Minimatools.gif',
        'images/CyberSavvy AF.gif',
        'images/AiBou.gif',
        'images/Notes.gif',
        'images/onehanki.gif',
        'images/AiCore.gif'];

    const Artyears = [2022, 2023];

    const Projyears = [
        2022,
        2023,
        2023,
        2023,
        2023,
        2024,
        2025
      ];
      
    const Arttitles = [
        'Artist', 
        'Designer'
    ];
    const Projtitles = [
        'Developer',
        'Lead Developer',
        'Lead Developer',
        'Developer',
        'Developer',
        'Lead Developer'
      ];
    
    const ProjectName = [
        'Minimatools | Personal Project',
        'CyberSavvy | Dontogan NSTP',
        'AiBou | Techno100',
        'Progress Tracker | Personal Project',
        'Split Keyboard | Personal Project',
        'AiCore | Capstone'
      ];
    const ArtName = ['Illustration | Personal Project', 'Logo Design | Client Work'];
  
    const ArtContainer = document.getElementById('art');
    const ProjectContainer = document.getElementById('programming');

    Artimages.forEach((img, index) => {
      const year = Artyears[index];
      const title = Arttitles[index];
      const postType = ArtName[index] || '';
  
      const postHTML = `
        <div class="post">
          <img src="https://raw.githubusercontent.com/HansongProgramming/Portfolio/main/Portfolio/images/pfp.png" alt="">
          <span>
            <h2>${title} (${year})</h2>
            <h3>${postType}</h3>
          </span>
        </div>
        <img src="${img}" alt="" class="thumbnail" onclick="openLightbox(this.src)">
        <div class="lightbox" id="lightbox" onclick="closeLightbox()">
          <img src="${img}" alt="" id="lightbox-img">
        </div>
        <div class="likes">
          <div><img src="https://img.icons8.com/?size=100&id=lFyaayFdhpED&format=png&color=000000" alt="like"><span>Like</span></div>
          <div><img src="https://img.icons8.com/?size=100&id=61f1pL4hEqO1&format=png&color=000000" alt="comment"><span>Comment</span></div>
          <div><img src="https://img.icons8.com/?size=100&id=90284&format=png&color=000000" alt="share"><span>Share</span></div>
        </div>
        <hr><br><br><br><br><br>
      `;
  
      ArtContainer.insertAdjacentHTML('beforeend', postHTML);
    });

    ProjectImages.forEach((img, index) => {
        const year = Projyears[index];
        const title = Projtitles[index];
        const postType = ProjectName[index] || '';
    
        const postHTML = `
          <div class="post">
            <img src="https://raw.githubusercontent.com/HansongProgramming/Portfolio/main/Portfolio/images/pfp.png" alt="">
            <span>
              <h2>${title} (${year})</h2>
              <h3>${postType}</h3>
            </span>
          </div>
          <img src="${img}" alt="" class="thumbnail" onclick="openLightbox(this.src)">
          <div class="lightbox" id="lightbox" onclick="closeLightbox()">
            <img src="${img}" alt="" id="lightbox-img">
          </div>
          <div class="likes">
            <div><img src="https://img.icons8.com/?size=100&id=lFyaayFdhpED&format=png&color=000000" alt="like"><span>Like</span></div>
            <div><img src="https://img.icons8.com/?size=100&id=61f1pL4hEqO1&format=png&color=000000" alt="comment"><span>Comment</span></div>
            <div><img src="https://img.icons8.com/?size=100&id=90284&format=png&color=000000" alt="share"><span>Share</span></div>
          </div>
          <hr><br><br><br><br><br>
        `;
    
        ProjectContainer.insertAdjacentHTML('beforeend', postHTML);
      });
  });


  document.addEventListener("DOMContentLoaded", () => {
    const bgm = document.getElementById("bgm");
    const muteBtn = document.getElementById("mute-btn");
    bgm.volume = 0.5;

    let isMuted = false;
  
    muteBtn.addEventListener("click", () => {
      isMuted = !isMuted;
      bgm.muted = isMuted;
      muteBtn.textContent = isMuted ? "Unmute" : "Mute";
    });
  
    document.body.addEventListener('click', () => {
      if (bgm.paused) {
        bgm.play().catch(err => {
          console.warn("Autoplay blocked until user interaction", err);
        });
      }
    }, { once: true });
  });
  
  

function openLightbox(src) {
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox').classList.add('active');
  }

  function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
  }