let global_media_height = 480, global_media_width = 640, init_global_height = 480, hideCategoryKey = 0, borderRadius = 35;

let btnnames = ["Earring", "Necklaces", "Pendants", "Mangalsutras", "PendantSets", "NecklaceSets"],
  catenum = [10, 6, 6, 4, 0, 0],
  added_favorite = [],
  buy_list = [];
let settab = 1, w = window.innerWidth, h = window.innerHeight, zoommain, favlistnum = 1, expandKey = 0;
let globselectedlist = {
  "Earring": null,
  "Necklaces": null,
  "Pendants": null,
  "Mangalsutras": null,
  "PendantSets": null,
  "NecklaceSets": null
};
let globalPixelRatio = window.devicePixelRatio;
let cntBrowser = checkBrowser();
let initRatioForPopupSize = 0.85, smallWords = document.getElementById("small_words");

let isMobileDevice = {
  Android: function() {
      return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
      return navigator.userAgent.match(/IEMobile/i);
  },
  any: function() {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};

if(isMobileDevice.iOS()) {
  document.getElementById("favlisttitle").style.fontSize = "15px";     
  if(w < h) {
    smallWords.style.marginLeft = "105px";
    smallWords.style.fontSize = "9px";    
  } else {
    smallWords.style.marginLeft = "6px";
    smallWords.style.fontSize = "6px";
    document.getElementById("category_title").classList.add("iPhoneCategoryTitle");
  }
}

function init() {
  $("#camera_div").modal('show');
  for (let i = 0; i < btnnames.length; i++) {
    document.getElementById("btn" + parseInt(i + 1)).addEventListener("click", function () {
      setColorbtn(i + 1);
    });
  }
  setColorbtn(settab);
  createloadmorebtn();  

  if (w > 640) {
    let zoomRate = 1, zoommain = (w * initRatioForPopupSize) / 963 * 100;
    if(zoommain * 487 / 100 > h) {
      zoommain = (h * initRatioForPopupSize) / 487 * 100;
    }
    if(cntBrowser == "firefox") {
      let marginleft = ((w - 963) / 2) + "px";
      document.getElementById("camera_div").style.marginLeft = marginleft;
      let margintop = ((h - 487) / 2) + "px";
      document.getElementById("camera_div").style.marginTop = margintop;
      document.getElementById("camera_div").style.transform = `scale(${(zoommain*zoomRate/100)})`;
    } else {
      let marginleft = ((w - 963 * zoommain * zoomRate / 100) / 2) * (100 / zoommain / zoomRate) + "px";
      document.getElementById("camera_div").style.marginLeft = marginleft;    
      let margintop = ((h - 487 * zoommain * zoomRate / 100) / 2) * (100 / zoommain / zoomRate) + "px";
      document.getElementById("camera_div").style.marginTop = margintop;
      document.getElementById("camera_div").style.zoom = zoommain * zoomRate + "%";
    }
    document.getElementById("camera_div").style.width = "963px";
    document.getElementById("camera_div").style.height = "487px";

    // borderRadius
    document.getElementById("tab").classList.remove("borderRadius");
    document.getElementById("category").classList.remove("borderRadius");

    // Capture position change
    document.getElementById("pentagon").style.bottom = "11px";
    document.getElementById("menu").style.bottom = "16px";

    // flipCamera Icon
    document.getElementById("flipCamera").style.bottom = "5px";

    show("loadmorediv");
    show("loadupdiv");
    show("small_words");
  } else {
    zoommain = (w * 0.96) / 642 * 100;
    let camH = h * 0.96 / zoommain * 100;
    document.getElementById("camera_div").style.width = "642px";
    document.getElementById("camera_div").style.height = camH + "px";
    document.getElementById("category").style.top = camH - 301 + "px";
    document.getElementById("maincamera").style.height = camH - 101 + borderRadius + "px";
    document.getElementById("category_title").innerHTML = "Categories <a style='color:blue'>(-)</a>";

    // borderRadius
    document.getElementById("tab").classList.add("borderRadius");
    document.getElementById("category").classList.add("borderRadius");

    // Capture position change
    document.getElementById("pentagon").style.bottom = "250px";
    document.getElementById("menu").style.bottom = "250px";

    if(cntBrowser == "firefox") {
      document.getElementById("camera_div").style.marginTop = (h - camH) / 2 + "px";
      document.getElementById("camera_div").style.marginLeft = (w - 642) / 2 + "px";
      document.getElementById("camera_div").style.transform = `scale(${(zoommain/100)})`;
    } else {
      document.getElementById("camera_div").style.marginTop = "2%";
      document.getElementById("camera_div").style.marginLeft = "2%";
      document.getElementById("camera_div").style.zoom = zoommain + "%";
    }

    document.getElementById("favorite").style.height = camH - 301 + "px";
    document.getElementById("favourities").style.height = camH - 341 + "px";
    global_media_height = init_global_height = camH - 101 + borderRadius;

    // flipCamera Icon
    document.getElementById("flipCamera").style.bottom = "240px";

    show("small_words");
  }  

  if(is_mobile()) {
    document.getElementById("menu").style.width = "60px";
    document.getElementById("menu").style.height = "60px";
    show("flipCamera");
  }

  stopStreaming();
  startStreaming(1);
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
      // initialCategories();
      SwipeAnimate(parseInt(document.getElementById("camera_div").style.height) - 300, 301, 500, "expand-to-init");
      document.getElementById("category_title").innerHTML = "Categories <a style='color:blue'>(-)</a>";
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
      // loadmoreCategories();
      if(hideCategoryKey) return;
      SwipeAnimate(301, parseInt(document.getElementById("camera_div").style.height) - 300, 500, "init-to-expand");
      document.getElementById("category_title").innerHTML = "Categories";
    }
  });

}

function loadmoreCategories() {
  if(hideCategoryKey) return;
  expandKey = 1;
  let cate = document.getElementById("category"),
    cates = document.getElementById("categories"),
    parentdiv = document.getElementById("camera_div");
  cate.style.height = parseInt(parentdiv.style.height) - 300 + "px";
  cate.style.zIndex = 10;
  cates.style.height = parseInt(parentdiv.style.height) - 400 + "px";
  cate.style.top = parseInt(parentdiv.style.height) - parseInt(cate.style.height) + "px";
  cates.classList.add("flex-categories");
  
  if(isMobileDevice.iOS()) {      
    smallWords.style.marginLeft = "145px";
  } else {
    smallWords.style.marginLeft = "280px";
  }

  cates.onwheel = categoriesScrollWheeling;

  hide("loadupdiv");
  show("loadmorediv");
}

function initialCategories() {
  if(hideCategoryKey) return;
  expandKey = 0;
  let cate = document.getElementById("category"),
    cates = document.getElementById("categories"),
    parentdiv = document.getElementById("camera_div");
  cate.style.height = "301px";
  cates.style.height = "201px";
  cate.style.top = parseInt(parentdiv.style.height) - parseInt(cate.style.height) + "px";
  cates.classList.remove("flex-categories");
  // document.getElementById("maincamera").style.height = parseInt(parentdiv.style.height) - 301 + borderRadius + "px";
  document.getElementById("favorite").style.height = parseInt(parentdiv.style.height) - 301 + "px";
  document.getElementById("favourities").style.height = parseInt(parentdiv.style.height) - 341 + "px";

  if(isMobileDevice.iOS()) {      
    smallWords.style.marginLeft = "105px";
  } else {
    smallWords.style.marginLeft = "250px";
  }

  hide("loadmorediv");
  show("loadupdiv");
}


function SwipeToggle() {
  if(window.innerWidth > 640 || parseInt(document.getElementById("categories").style.height) > 300 || globalCapturedStatus) {
    return;
  }
  if(hideCategoryKey) {
    SwipeAnimate(101, 301, 500, "hide-to-init");
    document.getElementById("category_title").innerHTML = "Categories <a style='color:blue'>(-)</a>";
    document.getElementById("pentagon").style.bottom = "250px";
    document.getElementById("menu").style.bottom = "250px";
    document.getElementById("flipCamera").style.bottom = "240px";
  } else {
    SwipeAnimate(301, 101, 500, "init-to-hide");
    document.getElementById("category_title").innerHTML = "Categories <a style='color:blue'>(+)</a>";
    // Capture position change
    document.getElementById("pentagon").style.bottom = "50px";
    document.getElementById("menu").style.bottom = "50px";
    document.getElementById("flipCamera").style.bottom = "40px";
  }
  document.getElementById("camera_div").style.overflowY = "hidden";
}

function toggleCategory() {
  if(window.innerWidth > 640 || parseInt(document.getElementById("categories").style.height) > 201 || globalCapturedStatus) {
    return;
  }
  
  document.getElementById("categories").style.height = (hideCategoryKey==0) ? "2px" : "201px";
  document.getElementById("categories").style.display = "flex";
  
  let cntCategoryTop = document.getElementById("category").style.top,
      mainCameraHeight = document.getElementById("maincamera").style.height,
      favoriteHeight = document.getElementById("favorite").style.height,
      favouritiesHeight = document.getElementById("favourities").style.height;

  (hideCategoryKey==0) ? document.getElementById("category").style.top = parseInt(cntCategoryTop) + 200 + "px" :
                         document.getElementById("category").style.top = parseInt(cntCategoryTop) - 200 + "px";
  (hideCategoryKey==0) ? document.getElementById("category").style.height = "100px" :
                         document.getElementById("category").style.height = "301px";
  // (hideCategoryKey==0) ? document.getElementById("maincamera").style.height = parseInt(mainCameraHeight) + 201 + "px" :
  //                        document.getElementById("maincamera").style.height = parseInt(mainCameraHeight) - 201 + "px";
  (hideCategoryKey==0) ? document.getElementById("favorite").style.height = parseInt(favoriteHeight) + 201 + "px" :
                         document.getElementById("favorite").style.height = parseInt(favoriteHeight) - 201 + "px";
  (hideCategoryKey==0) ? document.getElementById("favourities").style.height = parseInt(favouritiesHeight) + 201 + "px" :
                         document.getElementById("favourities").style.height = parseInt(favouritiesHeight) - 201 + "px";
  // global_media_height = parseInt(document.getElementById("maincamera").style.height);

  (hideCategoryKey==0) ? hideCategoryKey = 1 : hideCategoryKey = 0;

  if(hideCategoryKey) {
    hide("loadmorediv");
    show("loadupdiv");
  } else {
    hide("loadmorediv");
    show("loadupdiv");
  }
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

function CloseCustomModal() {
  document.getElementById("viewdetail_modal").style.display = "none";
}

function createdivforcategory(divname, containdiv, index) {
  let catediv = document.createElement('div');
  catediv.id = "category" + index;
  document.getElementById(containdiv).appendChild(catediv);
  document.getElementById(catediv.id).classList.add("category_div");
  document.getElementById(catediv.id).classList.add("image");

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
  document.getElementById(imgdiv.id).classList.add("lazy-image");

  // Add Button Here
  let addfavdiv = document.createElement("div");
  addfavdiv.id = "addfavbtn" + index;
  let heartsvg = `<svg class="heart" viewBox="0 0 32 29.6" id="${btnnames[settab-1]}_addfavbtn_${index}">
                      <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
                      c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/>
                  </svg>`;
  document.getElementById(catediv.id).appendChild(addfavdiv);
  document.getElementById(addfavdiv.id).innerHTML = heartsvg;
  document.getElementById(addfavdiv.id).classList.add("cataddfavbtn_div");
  if(isMobileDevice.iOS()) {
    document.getElementById(addfavdiv.id).classList.add("iPhoneAddBtn");
  }

  document.getElementById(addfavdiv.id).addEventListener("click", function () {
    for (let i = 0; i < added_favorite.length; i++) {
      if (added_favorite[i].type == btnnames[settab - 1] && added_favorite[i].index == index) {
        return;
      }
    }
    let value = {"type": btnnames[settab - 1], "index": index};
    added_favorite.push(value);
    document.getElementById(btnnames[settab-1] + "_addfavbtn_" + index).classList.add("heart_added_favourite");
    console.log("added", value, added_favorite);
    createfavlist(imgsrc, divname + index, settab, index);
  });

  // View Detail Button
  let viewbtndiv = document.createElement("div");
  viewbtndiv.id = "viewbtndiv" + index;
  document.getElementById(catediv.id).appendChild(viewbtndiv);
  document.getElementById(viewbtndiv.id).classList.add("viewbtndiv");
  if(isMobileDevice.iOS()) {
    document.getElementById(viewbtndiv.id).classList.add("iPhoneViewBtn");
  }
  let span1 = document.createElement("span");
  span1.innerHTML = "View";
  document.getElementById(viewbtndiv.id).appendChild(span1);

  document.getElementById(viewbtndiv.id).addEventListener("click", function () {
    document.getElementById("viewdetail_modal").style.display = "block";
    document.getElementById("viewdetailtitle_modal").innerHTML = btnnames[settab - 1] + " " + index;
    document.getElementById("viewdetailtext_modal").innerHTML = '<b>Description:</b> Write about "<b>' + btnnames[settab - 1] + index + '"</b>.';
    document.getElementById("viewdetailimage_modal").src = imgsrc;
  });

  // Buy Now Button
  let buybtndiv = document.createElement("div");
  buybtndiv.id = "buybtndiv" + index;
  document.getElementById(catediv.id).appendChild(buybtndiv);
  document.getElementById(buybtndiv.id).classList.add("buybtndiv");
  if(isMobileDevice.iOS()) {
    document.getElementById(buybtndiv.id).classList.add("iPhoneBuyBtn");
  }
  let span2 = document.createElement("span");
  span2.innerHTML = "Buy Now";
  document.getElementById(buybtndiv.id).appendChild(span2);

  document.getElementById(buybtndiv.id).addEventListener("click", function () {
    buy_list.push({"type": btnnames[settab - 1], "index": index});
    console.log("buy:", {"type": btnnames[settab - 1], "index": index});
  });

  // img.div click event
  document.getElementById(imgdiv.id).addEventListener("click", function () {
    globselectedlist[btnnames[settab - 1]] = imgsrc;
    console.log("Newly globselectedlist", globselectedlist);
    selectedCategory(catediv.id);
    // document.getElementById(catediv.id).scrollIntoView();
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

  // Remove Fav Btn
  let removefavdiv = document.createElement("div");
  removefavdiv.id = "removefavbtn" + favlistnum;
  removefavdiv.style.marginLeft = isMobileDevice.iOS() ? "200px" : "220px";
  removefavdiv.classList.add("removebtndiv");
  document.getElementById(favdiv.id).appendChild(removefavdiv);

  let span = document.createElement("span");
  span.innerHTML = "Remove";
  document.getElementById(removefavdiv.id).appendChild(span);

  document.getElementById(removefavdiv.id).addEventListener("click", function () {    
    let value = {"type": btnnames[setindex - 1], "index": index};
    added_favorite = added_favorite.filter(function (item) {
      if (item.type == value.type && item.index == value.index) {
        console.log("remove item", value);
        if(settab == setindex) document.getElementById(item.type + "_addfavbtn_" + item.index).classList.remove("heart_added_favourite");
      } else {
        return item;
      }
    });
    document.getElementById(favdiv.id).remove();
    console.log(added_favorite);
  });

  // View Detail Fav Button
  let viewbtnfavdiv = document.createElement("div");
  viewbtnfavdiv.id = "viewbtnfavdiv" + favlistnum;  
  document.getElementById(favdiv.id).appendChild(viewbtnfavdiv);
  document.getElementById(viewbtnfavdiv.id).classList.add("viewbtnfavdiv");
  viewbtnfavdiv.style.marginLeft = isMobileDevice.iOS() ? "165px" : "185px";
  let span1 = document.createElement("span");
  span1.innerHTML = "View";
  document.getElementById(viewbtnfavdiv.id).appendChild(span1);

  document.getElementById(viewbtnfavdiv.id).addEventListener("click", function () {
    document.getElementById("viewdetail_modal").style.display = "block";
    document.getElementById("viewdetailtitle_modal").innerHTML = favname;
    document.getElementById("viewdetailtext_modal").innerHTML = '<b>Description:</b> Write about "<b>' + favname + '"</b>.';
    document.getElementById("viewdetailimage_modal").src = imagesrc;
  });

  // Buy Now Fav Button
  let buybtnfavdiv = document.createElement("div");
  buybtnfavdiv.id = "buybtnfavdiv" + favlistnum;
  document.getElementById(favdiv.id).appendChild(buybtnfavdiv);
  document.getElementById(buybtnfavdiv.id).classList.add("buybtnfavdiv");
  buybtnfavdiv.style.marginLeft = isMobileDevice.iOS() ? "180px" : "200px";
  let span2 = document.createElement("span");
  span2.innerHTML = "Buy Now";
  document.getElementById(buybtnfavdiv.id).appendChild(span2);

  document.getElementById(buybtnfavdiv.id).addEventListener("click", function () {
    buy_list.push({"type": btnnames[setindex - 1], "index": index});
    console.log("buy:", {"type": btnnames[setindex - 1], "index": index});
  });

  favlistnum++;
}

function setColorbtn(index) {
  settab = index;
  for (let i = 1; i <= btnnames.length; i++) {
    if (i == index) {
      document.getElementById("btn" + i).classList.add("active");
      document.getElementById("tab" + i).style.color = "red";
    } else {
      document.getElementById("btn" + i).classList.remove("active");
      document.getElementById("tab" + i).style.color = "dimgrey";
    }
  }
  document.getElementById("btn" + index).scrollIntoView(window.innerWidth > 640 ? {inline: "center"} : '');
  document.getElementById("categories").innerHTML = "";
  for (let j = 1; j <= catenum[settab - 1]; j++) {
    createdivforcategory(btnnames[settab - 1], "categories", j);
    document.getElementById(btnnames[settab - 1] + "_addfavbtn_" + j).classList.remove("heart_added_favourite");
    for (let k = 0; k < added_favorite.length; k++) {
      let item = added_favorite[k];
      if (item.type == btnnames[settab - 1] && item.index == j) {
        document.getElementById(item.type + "_addfavbtn_" + item.index).classList.add("heart_added_favourite");
      }
    }
  }
}

function is_mobile() {
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    return true;
   }
  return false;
}

function consoleTest(zoomRate, cntW, cntH, margintop, marginleft, cntZm) {
  console.log("zoomRate", zoomRate);
  console.log("cntW",cntW,"\ncntH",cntH);
  console.log("margin", marginleft, margintop);
  console.log("cntZm", cntZm);
}

$(window).resize(function () {
  let cntW = window.innerWidth,
    cntH = window.innerHeight;
  zoomRate = (is_mobile()) ? 1 : window.devicePixelRatio / globalPixelRatio;

  let imgsrc = (cntW > 640) ? 'img/arrow/loaddown.png' : 'img/arrow/menu2.png';
  document.getElementById("loadmorediv").innerHTML = "<img src=" + imgsrc + " style='width: 100%; height: 100%;'>";
  imgsrc = (cntW > 640) ? 'img/arrow/loadup.png' : 'img/arrow/menu2.png';
  document.getElementById("loadupdiv").innerHTML = "<img src=" + imgsrc + " style='width: 100%; height: 100%;'>";  

  if (cntW > 640) {
    let cntZm = (cntW * initRatioForPopupSize) / 963 * 100;
    if(cntZm * 487 / 100 > cntH) {
      cntZm = (cntH *initRatioForPopupSize) / 487 * 100;
    }
    initialCategories();
    show("loadmorediv");
    show("loadupdiv");    

    document.getElementById("camera_div").style.width = "963px";
    document.getElementById("camera_div").style.height = "487px";
    document.getElementById("category").style.top = "0px";
    document.getElementById("category").style.height = "480px";
    document.getElementById("categories").style.height = "380px";
    document.getElementById("maincamera").style.height = "480px";
    document.getElementById("favorite").style.height = "480px"
    document.getElementById("favourities").style.height = "438px";
    document.getElementById("category_title").innerHTML = "Categories";

    if(cntBrowser == "firefox") {
      let marginleft = ((cntW - 963) / 2) + "px";
      document.getElementById("camera_div").style.marginLeft = marginleft;
      let margintop = ((cntH - 487) / 2) + "px";
      document.getElementById("camera_div").style.marginTop = margintop;
      document.getElementById("camera_div").style.transform = `scale(${(cntZm*zoomRate/100)})`;
    } else {
      let margintop = ((cntH - 487 * cntZm * zoomRate / 100) / 2) * (100 / cntZm / zoomRate) + "px";
      document.getElementById("camera_div").style.marginTop = margintop;
      let marginleft = ((cntW - 963 * cntZm * zoomRate / 100) / 2) * (100 / cntZm / zoomRate) + "px";
      document.getElementById("camera_div").style.marginLeft = marginleft;
      document.getElementById("camera_div").style.zoom = cntZm * zoomRate + "%";
    }     

    document.getElementById("categories").style.display = "block";

    // borderRadius
    document.getElementById("tab").classList.remove("borderRadius");
    document.getElementById("category").classList.remove("borderRadius");

    // Capture position change
    document.getElementById("pentagon").style.bottom = "11px";
    document.getElementById("menu").style.bottom = "16px";

    // flipCamera Icon
    document.getElementById("flipCamera").style.bottom = "5px";

    global_media_height = 480;

    show("small_words");

    if(isMobileDevice.iOS()) {      
      smallWords.style.marginLeft = "6px";
      smallWords.style.fontSize = "6px";
      document.getElementById("category_title").classList.add("iPhoneCategoryTitle");
    } else {
      smallWords.style.marginLeft = "6px";
    }

    // consoleTest(zoomRate, cntW, cntH, margintop, marginleft, cntZm);
  } else {    
    let cntZm = (cntW * 0.96) / 642 * 100,
      camH = cntH * 0.96 / cntZm * 100;    

    document.getElementById("camera_div").style.width = "642px";
    document.getElementById("camera_div").style.height = camH + "px";
    document.getElementById("category").style.top = (hideCategoryKey==0) ? camH - 301 + "px" : camH - 101 + "px";
    document.getElementById("category").style.height = (hideCategoryKey==0) ? "301px" : "100px";
    
    document.getElementById("categories").style.height = (hideCategoryKey==0) ? "201px" : "2px";
    document.getElementById("categories").style.display = "flex";
    
    document.getElementById("maincamera").style.height = camH - 101 + borderRadius + "px";
    document.getElementById("favorite").style.height = (hideCategoryKey==0) ? camH - 301 + "px" : camH - 101 + "px";
    document.getElementById("favourities").style.height = (hideCategoryKey==0) ? camH - 341 + "px" : camH - 141 + "px";
    document.getElementById("category_title").innerHTML = (hideCategoryKey==0) ? "Categories <a style='color:blue'>(-)</a>" : "Categories <a style='color:blue'>(+)</a>";

    // borderRadius
    document.getElementById("tab").classList.add("borderRadius");
    document.getElementById("category").classList.add("borderRadius");

    if(parseInt(document.getElementById("category").style.height) > 300) {
      hide("loadmorediv");
      show("loadupdiv");
      document.getElementById("pentagon").style.bottom = "250px";
      document.getElementById("menu").style.bottom = "250px";
      document.getElementById("flipCamera").style.bottom = "240px";
    } 
    if(parseInt(document.getElementById("category").style.height) < 300) {
      hide("loadmorediv");
      show("loadupdiv");
      document.getElementById("pentagon").style.bottom = "50px";
      document.getElementById("menu").style.bottom = "50px";
      document.getElementById("flipCamera").style.bottom = "40px";
    }

    if(cntBrowser == "firefox") {
      let marginleft = ((cntW - 642) / 2) + "px";
      document.getElementById("camera_div").style.marginLeft = marginleft;
      let margintop = ((cntH - camH) / 2) + "px";
      document.getElementById("camera_div").style.marginTop = margintop;
      document.getElementById("camera_div").style.transform = `scale(${(cntZm*zoomRate/100)})`;
    } else {
      let margintop = ((cntH - camH * cntZm * zoomRate / 100) / 2) * (100 / cntZm / zoomRate) + "px";
      document.getElementById("camera_div").style.marginTop = margintop;
      let marginleft = ((cntW - 642 * cntZm * zoomRate / 100) / 2) * (100 / cntZm / zoomRate) + "px";
      document.getElementById("camera_div").style.marginLeft = marginleft;
      document.getElementById("camera_div").style.zoom = cntZm * zoomRate + "%";
    }

    global_media_height = camH - 101 + borderRadius;

    show("small_words");

    if(isMobileDevice.iOS()) {      
      smallWords.style.marginLeft = "105px";
      smallWords.style.fontSize = "9px";
      document.getElementById("category_title").classList.remove("iPhoneCategoryTitle");
    } else {
      smallWords.style.marginLeft = "250px";
    }
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
  document.getElementById("flipCamera").style.left = "22px";
}

function showfavorite() {
  show("favorite");
  document.getElementById("flipCamera").style.left = "335px";
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
    if((i == 2 || window.innerWidth > 640 || expandKey) && (i != 1)) {
      const y = e.pageY - slider.offsetTop;
      const walkY = (y - startY) * 2;
      slider.scrollTop = scrollTop - walkY;
    }
  });
}

function categoriesScrollWheeling(e) {
  e.preventDefault();

  const slider = document.getElementById("categories");
  slider.scrollTop += e.deltaY / Math.abs(e.deltaY) * 100;
  slider.scrollLeft += e.deltaY / Math.abs(e.deltaY) * 100;
}

for (let i = 0; i < 3; i++) {
  let slider = document.getElementById(sliders[i]), isTouch = false, startX, scrollLeft, startY, scrollTop;
  slider.addEventListener('touchstart', (e) => {
    // console.log("touch start", e.changedTouches[0].pageX);
    isTouch = true;
    slider.classList.add('active');
    startX = e.changedTouches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;

    startY = e.changedTouches[0].pageY - slider.offsetTop;
    scrollTop = slider.scrollTop;
  });
  slider.addEventListener('touchcancel', () => {
    // console.log("touch cancel");
    isTouch = false;
    slider.classList.remove('active');
  });
  slider.addEventListener('touchmove', (e) => {
    // console.log("touch move");
    if (!isTouch) return;
    e.preventDefault();
    const x = e.changedTouches[0].pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;

    if((i == 2 || window.innerWidth > 640 || expandKey) && (i != 1)) {
      const y = e.changedTouches[0].pageY - slider.offsetTop;
      const walkY = (y - startY) * 2;
      slider.scrollTop = scrollTop - walkY;
    }    
  });
}

function checkBrowser() {
  // Opera
  let isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
  if(isOpera) return "opera";

  // Firefox
  let isFirefox = typeof InstallTrigger !== 'undefined';
  if(isFirefox) return "firefox";

  // Safari
  let isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
  if(isSafari) return "safari";

  // Internet Explorer
  let isIE = /*@cc_on!@*/false || !!document.documentMode;
  if(isIE) return "IE";

  // Edge 20+
  let isEdge = !isIE && !!window.StyleMedia;
  if(isEdge) return "Edge";

  // Chrome
  let isChrome = navigator.userAgent.indexOf("Chrome") > -1;
  if(isChrome) return "chrome";

  // Edge (based on chromium) detection
  let isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);
  if(isEdgeChromium) return "EdgeChromium";

  // Blink engine detection
  let isBlink = (isChrome || isOpera) && !!window.CSS;
  if(isBlink) return "blink";

  return "noneBrowser";
}

init();