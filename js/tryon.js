let global_media_height = 480, global_media_width = 640, init_global_height = 480, hideCategoryKey = 0;;

let btnnames = ["Earring", "Necklaces", "Pendants", "Mangalsutras", "PendantSets", "NecklaceSets"],
  catenum = [10, 6, 6, 4, 0, 0],
  added_favorite = [],
  buy_list = [];
let settab = 1, w = window.innerWidth, h = window.innerHeight, zoommain, favlistnum = 1;
let globselectedlist = {
  "Earring": null,
  "Necklaces": null,
  "Pendants": null,
  "Mangalsutras": null,
  "PendantSets": null,
  "NecklaceSets": null
};

function init() {
  for (let i = 0; i < btnnames.length; i++) {
    document.getElementById("btn" + parseInt(i + 1)).addEventListener("click", function () {
      setColorbtn(i + 1);
    });
  }
  setColorbtn(settab);
  createloadmorebtn();

  if (w > 640) {
    zoommain = (w * 0.92) / 963 * 100;
    let margintop = ((h - 487 * zoommain / 100) / 2) * (100 / zoommain) + "px";
    document.getElementById("camera_div").style.marginTop = margintop;
  } else {
    zoommain = (w * 0.96) / 642 * 100;
    let camH = h * 0.96 / zoommain * 100;
    document.getElementById("camera_div").style.width = "642px";
    document.getElementById("camera_div").style.height = camH + "px";
    document.getElementById("category").style.top = camH - 301 + "px";
    document.getElementById("maincamera").style.height = camH - 301 + "px";
    document.getElementById("camera_div").style.marginTop = "2%";
    document.getElementById("camera_div").style.marginLeft = "2%";
    document.getElementById("favorite").style.height = camH - 301 + "px";
    document.getElementById("favourities").style.height = camH - 341 + "px";
    global_media_height = init_global_height = camH - 301;
  }
  document.getElementById("camera_div").style.zoom = zoommain + "%";

  stopStreaming();
  startStreaming(global_media_width, global_media_height);
}

function createdivfortabbtn(divname, containdiv, index) {
  let btndiv = document.createElement("div");
  btndiv.id = "btn" + index;
  btndiv.style.padding = "13px";
  btndiv.style.cursor = "pointer";
  btndiv.style.textAlign = "center";
  btndiv.style.marginTop = "5px";
  btndiv.style.marginLeft = "15px";
  btndiv.style.marginBottom = "10px";
  btndiv.style.width = btndiv.style.height = "fit-content";
  btndiv.style.borderRadius = "5px";
  btndiv.style.fontSize = "14px";
  let container = document.getElementById(containdiv);
  container.appendChild(btndiv);

  let span = document.createElement("span");
  span.innerHTML = divname;
  let btncontainer = document.getElementById(btndiv.id);
  btncontainer.appendChild(span);
}

function createloadmorebtn() {
  let loadmore = document.createElement("div");
  loadmore.id = "loadmorediv";
  document.getElementById("category").appendChild(loadmore);
  loadmore.classList.add("loadmore");

  let loadmoreimg = document.createElement("img");
  loadmoreimg.id = "loadmoreimg";
  loadmoreimg.style.width = "100%";
  loadmoreimg.style.height = "100%";
  loadmoreimg.src = (window.innerWidth > 640) ? 'img/arrow/loaddown.png' : 'img/arrow/menu2.png';
  document.getElementById(loadmore.id).appendChild(loadmoreimg);

  document.getElementById(loadmore.id).addEventListener("click", function () {
    if (window.innerWidth > 640) {
      scrolldown();
    } else {
      initialCategories();
      loadmore.classList.add("hide");
    }
  });

  let loadup = document.createElement("div");
  loadup.id = "loadupdiv";
  document.getElementById("category").appendChild(loadup);
  loadup.classList.add("loadup");

  let loadupimg = document.createElement("img");
  loadupimg.id = "loadupimg";
  loadupimg.style.width = "100%";
  loadupimg.style.height = "100%";
  loadupimg.src = (window.innerWidth > 640) ? 'img/arrow/loadup.png' : 'img/arrow/menu2.png';
  document.getElementById(loadup.id).appendChild(loadupimg);

  document.getElementById(loadup.id).addEventListener("click", function () {
    if (window.innerWidth > 640) {
      scrollup();
    } else {
      loadmoreCategories();
    }
  });

}

function loadmoreCategories() {
  if(hideCategoryKey) return;
  let cate = document.getElementById("category"),
    cates = document.getElementById("categories"),
    parentdiv = document.getElementById("camera_div"),
    menu = document.getElementById("menu");
  cate.style.height = parseInt(parentdiv.style.height) - 300 + "px";
  cates.style.height = parseInt(parentdiv.style.height) - 400 + "px";
  cate.style.top = parseInt(parentdiv.style.height) - parseInt(cate.style.height) + "px";
  menu.classList.add("hide");
  menu.classList.remove("show");
  cates.classList.remove("categories");
  cates.classList.add("flex-categories");

  hide("loadupdiv");
  show("loadmorediv");
}

function initialCategories() {
  if(hideCategoryKey) return;
  let cate = document.getElementById("category"),
    cates = document.getElementById("categories"),
    parentdiv = document.getElementById("camera_div"),
    menu = document.getElementById("menu");
  cate.style.height = "301px";
  cates.style.height = "201px";
  cate.style.top = parseInt(parentdiv.style.height) - parseInt(cate.style.height) + "px";
  menu.classList.remove("hide");
  menu.classList.add("show");
  cates.classList.add("categories");
  cates.classList.remove("flex-categories");

  hide("loadmorediv");
  show("loadupdiv");
}


function toggleCategory() {
  if(window.innerWidth > 640 || parseInt(document.getElementById("categories").style.height) > 201) {
    return;
  }
  console.log((hideCategoryKey==0) ? "hideCategory" : "showCategory");

  (hideCategoryKey==0) ? document.getElementById("categories").style.display = "none" : 
                         document.getElementById("categories").style.display = "flex";
  
  let cntCategoryTop = document.getElementById("category").style.top,
      mainCameraHeight = document.getElementById("maincamera").style.height,
      favoriteHeight = document.getElementById("favorite").style.height,
      favouritiesHeight = document.getElementById("favourities").style.height;

  (hideCategoryKey==0) ? document.getElementById("category").style.top = parseInt(cntCategoryTop) + 200 + "px" :
                         document.getElementById("category").style.top = parseInt(cntCategoryTop) - 200 + "px";
  (hideCategoryKey==0) ? document.getElementById("category").style.height = "100px" :
                         document.getElementById("category").style.height = "301px";
  (hideCategoryKey==0) ? document.getElementById("maincamera").style.height = parseInt(mainCameraHeight) + 201 + "px" :
                         document.getElementById("maincamera").style.height = parseInt(mainCameraHeight) - 201 + "px";
  (hideCategoryKey==0) ? document.getElementById("favorite").style.height = parseInt(favoriteHeight) + 201 + "px" :
                         document.getElementById("favorite").style.height = parseInt(favoriteHeight) - 201 + "px";
  (hideCategoryKey==0) ? document.getElementById("favourities").style.height = parseInt(favouritiesHeight) + 201 + "px" :
                         document.getElementById("favourities").style.height = parseInt(favouritiesHeight) - 201 + "px";
  (hideCategoryKey==0) ? global_media_height += 201 : global_media_height -= 201;

  (hideCategoryKey==0) ? hideCategoryKey = 1 : hideCategoryKey = 0;  
}

let enablescrolldown, enablescrollup, enablescrollright, enablescrollleft;

function scrolldown() {
  if (window.innerWidth > 640) {
    let scrollHeight = document.getElementById("categories").scrollHeight,
      scrollTop = document.getElementById("categories").scrollTop,
      clientHeight = document.getElementById("categories").clientHeight,
      top = scrollTop + 300;

    document.getElementById("categories").scroll({
      top: top,
      left: 0,
      behavior: 'smooth'
    });

    enablescrollup = (top > 0);
    enablescrolldown = scrollHeight - top - clientHeight > 10;

    console.log(scrollHeight - top - clientHeight, enablescrolldown, enablescrollup);
  } else {
    let scrollWidth = document.getElementById("categories").scrollWidth,
      scrollLeft = document.getElementById("categories").scrollLeft,
      clientWidth = document.getElementById("categories").clientWidth,
      left = scrollLeft + 500;

    document.getElementById("categories").scroll({
      top: 0,
      left: left,
      behavior: 'smooth'
    });

    enablescrollleft = (left > 0);
    enablescrollright = scrollWidth - left - clientWidth > 10;

    console.log(scrollWidth - left - clientWidth, enablescrollleft, enablescrollright);
  }
}

function scrollup() {
  if (window.innerWidth > 640) {
    let scrollHeight = document.getElementById("categories").scrollHeight,
      scrollTop = document.getElementById("categories").scrollTop,
      clientHeight = document.getElementById("categories").clientHeight,
      top = scrollTop - 300;

    document.getElementById("categories").scroll({
      top: top,
      left: 0,
      behavior: 'smooth'
    });

    enablescrollup = (top > 10);
    enablescrolldown = scrollHeight - top - clientHeight > 10;

    console.log(scrollHeight - top - clientHeight, enablescrolldown, enablescrollup);
  } else {
    let scrollWidth = document.getElementById("categories").scrollWidth,
      scrollLeft = document.getElementById("categories").scrollLeft,
      clientWidth = document.getElementById("categories").clientWidth,
      left = scrollLeft - 500;

    document.getElementById("categories").scroll({
      top: 0,
      left: left,
      behavior: 'smooth'
    });

    enablescrollleft = (left > 0);
    enablescrollright = scrollWidth - left - clientWidth > 10;

    console.log(scrollWidth - left - clientWidth, enablescrollleft, enablescrollright);
  }
}

(function () {
  function scrollHorizontally(e) {
    e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    document.getElementById('tabbtn').scrollLeft -= (delta * 40); // Multiplied by 40
    e.preventDefault();
  }

  if (document.getElementById('tabbtn').addEventListener) {
    document.getElementById('tabbtn').addEventListener("mousewheel", scrollHorizontally, false);
    document.getElementById('tabbtn').addEventListener("DOMMouseScroll", scrollHorizontally, false);
  } else {
    document.getElementById('tabbtn').attachEvent("onmousewheel", scrollHorizontally);
  }
})();

(function () {
  function scrollHorizontally(e) {
    if (window.innerWidth > 640) {
      return;
    }
    e = window.event || e;
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    document.getElementById('categories').scrollLeft -= (delta * 40);
    e.preventDefault();
  }

  if (document.getElementById('categories').addEventListener) {
    document.getElementById('categories').addEventListener("mousewheel", scrollHorizontally, false);
    // Firefox
    document.getElementById('categories').addEventListener("DOMMouseScroll", scrollHorizontally, false);
  } else {
    // IE 6/7/8
    document.getElementById('categories').attachEvent("onmousewheel", scrollHorizontally);
  }
})();

function createdivforcategory(divname, containdiv, index) {
  let catediv = document.createElement('div');
  catediv.id = "category" + index;
  document.getElementById(containdiv).appendChild(catediv);
  document.getElementById(catediv.id).classList.add("category_div");

  let titlediv = document.createElement('div');
  titlediv.id = "title" + index;
  titlediv.innerHTML = divname + " " + index;
  document.getElementById(catediv.id).appendChild(titlediv);
  document.getElementById(titlediv.id).classList.add("cattitle_div");

  let imgdiv = document.createElement('div'), imgsrc;
  imgdiv.id = catediv.id + "_image";
  switch (settab) {
    case 1:
      imgsrc = 'img/earrings/earring' + index + '.png';
      imgdiv.innerHTML = "<img src=" + imgsrc + " style='height: 70%;'>";
      break;
    case 2:
      imgsrc = 'img/necklaces/necklace' + index + '.png';
      imgdiv.innerHTML = "<img src=" + imgsrc + " style='height: 80%;'>";
      break;
    case 3:
      imgsrc = 'img/pendants/pendant' + index + '.png';
      imgdiv.innerHTML = "<img src=" + imgsrc + " style='height: 80%;'>";
      break;
    case 4:
      imgsrc = 'img/mangalsutras/mangalsutras' + index + '.png';
      imgdiv.innerHTML = "<img src=" + imgsrc + " style='height: 80%;'>";
      break;
  }
  document.getElementById(catediv.id).appendChild(imgdiv);
  document.getElementById(imgdiv.id).classList.add("catimg_div");

  let viewdetailmodal = `<div class="modal fade" id="viewdetail_${btnnames[settab - 1]}_${index}" role="dialog">
        <div class="modal-dialog"> 
            <div class="modal-content">
                <div class="modal-header">
                    <!--<button type="button" class="close" data-dismiss="modal">&times;</button>-->
                    <h4 class="modal-title" id="viewdetailtitle_${btnnames[settab - 1]}_${index}">View Detail</h4>
                </div>
                <div class="modal-body" id="viewdetailbody_${btnnames[settab - 1]}_${index}">
                    <p id="viewdetailtext_${btnnames[settab - 1]}_${index}" class="hide_qr">About this item.</p>
                </div>
            </div>                  
        </div>
    </div>`
  document.getElementById(catediv.id).innerHTML += viewdetailmodal;

  document.getElementById("viewdetailtitle_" + btnnames[settab - 1] + "_" + index).innerHTML = btnnames[settab - 1] + " " + index;
  document.getElementById("viewdetailtext_" + btnnames[settab - 1] + "_" + index).innerHTML = '<b>Description:</b> Write about "<b>' + btnnames[settab - 1] + index + '"</b> here.';
  document.getElementById("viewdetailbody_" + btnnames[settab - 1] + "_" + index).innerHTML += "<img src=" + imgsrc + " style='height: 200px;'>";

  // Add Button Here
  let addfavdiv = document.createElement("div");
  addfavdiv.id = "addfavbtn" + index;
  let heartsvg = `<svg class="heart" viewBox="0 0 32 29.6">
                        <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
                        c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/>
                    </svg>`;
  document.getElementById(catediv.id).appendChild(addfavdiv);
  document.getElementById(addfavdiv.id).innerHTML = heartsvg;
  document.getElementById(addfavdiv.id).classList.add("cataddfavbtn_div");

  document.getElementById(addfavdiv.id).addEventListener("click", function () {
    for (let i = 0; i < added_favorite.length; i++) {
      if (added_favorite[i].type == btnnames[settab - 1] && added_favorite[i].index == index) {
        return;
      }
    }
    let value = {"type": btnnames[settab - 1], "index": index};
    added_favorite.push(value);
    console.log("added", value, added_favorite);
    createfavlist(imgsrc, divname + index, settab, index);
  });

  // View Detail Button
  let viewbtndiv = document.createElement("div");
  viewbtndiv.id = "viewbtndiv" + index;
  viewbtndiv.setAttribute("data-toggle", "modal");
  viewbtndiv.setAttribute("data-target", "#viewdetail_" + btnnames[settab - 1] + "_" + index);
  document.getElementById(catediv.id).appendChild(viewbtndiv);
  document.getElementById(viewbtndiv.id).classList.add("viewbtndiv");
  let span1 = document.createElement("span");
  span1.innerHTML = "View";
  document.getElementById(viewbtndiv.id).appendChild(span1);

  document.getElementById(viewbtndiv.id).addEventListener("click", function () {
    console.log("View:", btnnames[settab - 1], index);
  });

  // Buy Now Button
  let buybtndiv = document.createElement("div");
  buybtndiv.id = "buybtndiv" + index;
  document.getElementById(catediv.id).appendChild(buybtndiv);
  document.getElementById(buybtndiv.id).classList.add("buybtndiv");
  let span2 = document.createElement("span");
  span2.innerHTML = "Buy Now";
  document.getElementById(buybtndiv.id).appendChild(span2);

  document.getElementById(buybtndiv.id).addEventListener("click", function () {
    buy_list.push({"type": btnnames[settab - 1], "index": index});
    console.log("buy:", {"type": btnnames[settab - 1], "index": index});
  });

  document.getElementById(imgdiv.id).addEventListener("click", function () {
    globselectedlist[btnnames[settab - 1]] = imgsrc;
    console.log("Newly globselectedlist", globselectedlist);
    selectedCategory(catediv.id);
    document.getElementById(catediv.id).scrollIntoView();
  });
}

function selectedCategory(id) {
  let catnum = catenum[settab - 1];
  for (let i = 1; i <= catnum; i++) {
    if (id == "category" + i) {
      document.getElementById(id).classList.add("selectedCategory");
    } else {
      document.getElementById("category" + i).classList.remove("selectedCategory");
    }
  }
}

function createfavlist(imagesrc, favname, setindex, index) {
  let favdiv = document.createElement('div');
  favdiv.id = "favlist" + favlistnum;
  favdiv.style.width = "273px";
  favdiv.style.height = "130px";
  favdiv.style.borderRadius = "10px";
  favdiv.style.marginLeft = "20px";
  favdiv.style.cursor = "pointer";
  favdiv.style.marginTop = "15px";
  favdiv.style.backgroundColor = "white";
  favdiv.style.border = "1px solid rgba(0,0,0,0.1)";

  let container = document.getElementById("favourities");
  container.appendChild(favdiv);

  let titlediv = document.createElement('div');
  titlediv.style.width = "100%";
  titlediv.style.height = "15px";
  titlediv.style.marginLeft = "15px";
  titlediv.style.marginTop = "10px";
  titlediv.style.fontSize = "12px";
  titlediv.innerHTML = favname;
  titlediv.style.textAlign = "left";
  document.getElementById(favdiv.id).appendChild(titlediv);

  let imgdiv = document.createElement('div');
  imgdiv.style.width = "100%";
  imgdiv.style.height = "115px";
  imgdiv.style.marginTop = "10px";
  imgdiv.innerHTML = "<img src=" + imagesrc + " style='height: 70%;'>";
  imgdiv.style.textAlign = "center";
  document.getElementById(favdiv.id).appendChild(imgdiv);

  let removefavdiv = document.createElement("div");
  removefavdiv.id = "removefavbtn" + favlistnum;
  removefavdiv.style.padding = "3px";
  removefavdiv.style.cursor = "pointer";
  removefavdiv.style.textAlign = "center";
  removefavdiv.style.marginTop = "-145px";
  removefavdiv.style.marginLeft = "220px";
  removefavdiv.style.width = removefavdiv.style.height = "fit-content";
  removefavdiv.style.borderRadius = "5px";
  removefavdiv.style.fontSize = "10px";
  removefavdiv.style.color = "white";
  removefavdiv.style.backgroundColor = "red";
  document.getElementById(favdiv.id).appendChild(removefavdiv);

  let span = document.createElement("span");
  span.innerHTML = "Remove";
  document.getElementById(removefavdiv.id).appendChild(span);

  document.getElementById(removefavdiv.id).addEventListener("click", function () {
    document.getElementById(favdiv.id).remove();
    let value = {"type": btnnames[setindex - 1], "index": index};
    added_favorite = added_favorite.filter(function (item) {
      if (item.type == value.type && item.index == value.index) {
        console.log("remove item", value);
      } else {
        return item;
      }
    });
    console.log(added_favorite);
  });

  favlistnum++;
}

function setColorbtn(index) {
  settab = index;
  for (let i = 1; i <= btnnames.length; i++) {
    if (i == index) {
      document.getElementById("btn" + i).classList.add("active");
    } else {
      document.getElementById("btn" + i).classList.remove("active");
    }
  }
  document.getElementById("btn" + index).scrollIntoView(window.innerWidth > 640 ? {inline: "center"} : '');
  document.getElementById("categories").innerHTML = "";
  for (let j = 1; j <= catenum[settab - 1]; j++) {
    createdivforcategory(btnnames[settab - 1], "categories", j);
  }
}

function is_mobile() {
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    return true;
   }
  return false;
}

$(window).resize(function () {
  let cntW = window.innerWidth,
    cntH = window.innerHeight;
  zoomRate = (is_mobile()) ? 1 : window.devicePixelRatio;

  let imgsrc = (cntW > 640) ? 'img/arrow/loaddown.png' : 'img/arrow/menu2.png';
  document.getElementById("loadmorediv").innerHTML = "<img src=" + imgsrc + " style='width: 100%; height: 100%;'>";
  imgsrc = (cntW > 640) ? 'img/arrow/loadup.png' : 'img/arrow/menu2.png';
  document.getElementById("loadupdiv").innerHTML = "<img src=" + imgsrc + " style='width: 100%; height: 100%;'>";

  if (cntW > 640) {
    let cntZm = (cntW * 0.92) / 963 * 100;
    document.getElementById("camera_div").style.zoom = cntZm * zoomRate + "%";
    document.getElementById("camera_div").style.width = "963px";
    document.getElementById("camera_div").style.height = "487px"
    document.getElementById("category").style.top = "0px";
    document.getElementById("category").style.height = "480px";
    document.getElementById("categories").style.height = "380px";
    document.getElementById("maincamera").style.height = "480px";
    document.getElementById("favorite").style.height = "480px"
    document.getElementById("favourities").style.height = "438px";
    let margintop = ((cntH - 487 * cntZm * zoomRate / 100) / 2) * (100 / cntZm / zoomRate) + "px";
    document.getElementById("camera_div").style.marginTop = margintop;
    let marginleft = ((cntW - 963 * cntZm * zoomRate / 100) / 2) * (100 / cntZm / zoomRate) + "px";
    document.getElementById("camera_div").style.marginLeft = marginleft;
    document.getElementById("categories").style.display = "block";
    global_media_height = 480;
  } else {
    let cntZm = (cntW * 0.96) / 642 * 100,
      camH = cntH * 0.96 / cntZm * 100;
    document.getElementById("camera_div").style.zoom = cntZm * zoomRate + "%";
    document.getElementById("camera_div").style.width = "642px";
    document.getElementById("camera_div").style.height = camH + "px";
    document.getElementById("category").style.top = (hideCategoryKey==0) ? camH - 301 + "px" : camH - 101 + "px";
    document.getElementById("category").style.height = (hideCategoryKey==0) ? "301px" : "100px";
    document.getElementById("categories").style.height = "201px";
    document.getElementById("categories").style.display = (hideCategoryKey==0) ? "flex" : "none";
    document.getElementById("maincamera").style.height = (hideCategoryKey==0) ? camH - 301 + "px" : camH - 101 + "px";
    document.getElementById("favorite").style.height = (hideCategoryKey==0) ? camH - 301 + "px" : camH - 101 + "px";
    document.getElementById("favourities").style.height = (hideCategoryKey==0) ? camH - 341 + "px" : camH - 141 + "px";
    let margintop = ((cntH - camH * cntZm * zoomRate / 100) / 2) * (100 / cntZm / zoomRate) + "px";
    document.getElementById("camera_div").style.marginTop = margintop;
    let marginleft = ((cntW - 642 * cntZm * zoomRate / 100) / 2) * (100 / cntZm / zoomRate) + "px";
    document.getElementById("camera_div").style.marginLeft = marginleft;
    global_media_height = (hideCategoryKey==0) ? camH - 301 : camH - 101;
  }
});

function drawEarring(imagesrc, x, y) {
  let canvas = document.getElementById("overlay"), ctx = canvas.getContext('2d');
  let image = new Image();
  image.src = imagesrc;
  ctx.drawImage(image, x, y, 15, 30);
}

function hidefavorite() {
  hide("favorite");
}

function showfavorite() {
  show("favorite");
}

function showPentagon() {
  show("pentagon");
  hide("menu");
  captureSnapshot();
}

function hidePentagon() {
  hide("pentagon");
  show("menu");
  removeSnapshot();
}

let sliders = ["categories", "tabbtn", "favourities"];

for (let i = 0; i < 3; i++) {
  const slider = document.getElementById(sliders[i]);
  let isDown = false;
  let startX, startY;
  let scrollLeft, scrollTop;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    startY = e.pageY - slider.offsetTop;
    scrollTop = slider.scrollTop;
  });
  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('active');
  });
  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
  });
  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
    const y = e.pageY - slider.offsetTop;
    const walkY = (y - startY) * 2;
    slider.scrollTop = scrollTop - walkY;
  });
}

for (let i = 0; i < 3; i++) {
  let slider = document.getElementById(sliders[i]), isTouch = false, startX, scrollLeft, startY, scrollTop;
  slider.addEventListener('touchstart', (e) => {
    console.log("touch start", e.changedTouches[0].pageX);
    isTouch = true;
    slider.classList.add('active');
    startX = e.changedTouches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;

    startY = e.changedTouches[0].pageY - slider.offsetTop;
    scrollTop = slider.scrollTop;
  });
  slider.addEventListener('touchcancel', () => {
    console.log("touch cancel");
    isTouch = false;
    slider.classList.remove('active');
  });
  slider.addEventListener('touchmove', (e) => {
    console.log("touch move");
    if (!isTouch) return;
    e.preventDefault();
    const x = e.changedTouches[0].pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;

    const y = e.changedTouches[0].pageY - slider.offsetTop;
    const walkY = (y - startY) * 2;
    slider.scrollTop = scrollTop - walkY;
  });
}

init();