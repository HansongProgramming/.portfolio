document.addEventListener('DOMContentLoaded', function () {
    const images = ['images/art1.png', 'images/art2.png'];
    const years = [2022, 2023];
    const titles = ['Artist', 'Designer'];
    const postTypes = ['Illustration | Personal Project', 'Logo Design | Client Work'];
  
    const container = document.getElementById('posts-container');
  
    images.forEach((img, index) => {
      const year = years[index];
      const title = titles[index];
      const postType = postTypes[index] || '';
  
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
  
      container.insertAdjacentHTML('beforeend', postHTML);
    });
  });
  

function openLightbox(src) {
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox').classList.add('active');
  }

  function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
  }