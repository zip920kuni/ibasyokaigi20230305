window.addEventListener('DOMContentLoaded', () => {
  hamburgerMenu();
  smoothEasingScroll();
  backToTop();
  headerObserver();
  fadeIn();
  fadeInRelaxed();
  fadeInPanelist();
});


// ハンバーガーメニュー制御
function hamburgerMenu() {
  const hamburger = document.getElementById('js-hamburger'); // ハンバーガメニューボタン
  const area = document.getElementById('js-globalNavigation'); // ハンバーガーメニュー全体
  const mask = document.getElementById('js-globalNavigationMask'); // ハンバーガーメニュー背景
  const navigation = document.getElementById('js-globalNavigationMaskInner'); // ハンバーガーメニュー内ナビゲーション
  const links = document.getElementsByClassName('js-menuListItemLink'); //ハンバーガーメニュー内リンク
  const focusTrap = document.getElementById('js-focusTrap'); // フォーカストラップ用

  // ハンバーガーメニュー開閉制御
  hamburger.addEventListener('click', (eHam) => {
    eHam.currentTarget.classList.toggle('is-active');
    area.classList.toggle('is-active');
    mask.classList.toggle('is-active');
    navigation.classList.toggle('is-active');
  });

  // Escキー押下でハンバーガーメニューを閉じた後、再度フォーカスを当てる
  document.addEventListener('keydown', (eKey) => {
    if (eKey.key === 'Escape') {
      navigation.classList.remove('is-active');
      mask.classList.remove('is-active');
      area.classList.remove('is-active');
      hamburger.classList.remove('is-active');
      hamburger.focus();
    }
  });

  // メニュー外クリックでハンバーガーメニューを閉じる
  mask.addEventListener('click', (eOut) => {
    if (!eOut.target.closest('#js-globalNavigationMaskInner')) {
      navigation.classList.remove('is-active');
      mask.classList.remove('is-active');
      area.classList.remove('is-active');
      hamburger.classList.toggle('is-active');
    }
  });

  // ページ内スクロール選択後、ハンバーガーメニューを閉じる
  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click',() => {
      navigation.classList.remove('is-active');
      mask.classList.remove('is-active');
      area.classList.remove('is-active');
      hamburger.classList.remove('is-active');
    });
  }

  // ハンバーガーメニューをキーボードで操作時、メニュー内キーループ
  focusTrap.addEventListener('focus', () => {
    hamburger.focus();
  });
}


// スムーススクロール制御
function smoothEasingScroll() {
  // スムーススクロール用変数定義
  const header = document.querySelector('header').offsetHeight; // ヘッダーの高さ
  const urlHash = location.hash; // URLの#以降の部分を取得
  const duration = 1200; // スムーススクロールの時間
  const easing = 'easeOutExpo'; //使用するイージング
  // リンクからscrollIgnoreクラスを除外して取得
  const smoothScrolls = document.querySelectorAll('[href^="#"]:not(.scrollIgnore)');

  // 取得したリンクにクリックイベント
  for (let i = 0; i < smoothScrolls.length; i++) {
    smoothScrolls[i].addEventListener('click', (eEase) => {
      eEase.preventDefault();

      const href = smoothScrolls[i].getAttribute('href');
      const targetElm = document.getElementById(href.replace('#',''));

      if (!targetElm) return;
      const targetPos = targetElm.getBoundingClientRect().top;
      const scrollFrom = document.scrollingElement.scrollTop;
      let startTime = Date.now();

      function loop() {
        let currentTime = Date.now() - startTime;
        if (currentTime < duration) {
          scrollTo(0, easingFuncs[easing](currentTime, scrollFrom , targetPos, duration) - header);
          window.requestAnimationFrame(loop);
        } else {
          scrollTo(0, targetPos + scrollFrom - header);
        }
      }
      window.requestAnimationFrame(loop);
    });
  }

  //別ページから遷移して来た場合
  if (urlHash) {
    setTimeout( () =>{
      window.scrollTo({top: 0},0);
    })
    setTimeout( () => {
      const targetElm = document.getElementById(urlHash.replace('#',''));
      if (!targetElm) return;
      const targetPos = targetElm.getBoundingClientRect().top;
      const scrollFrom = document.scrollingElement.scrollTop;
      let startTime = Date.now();

      function loop() {
        let currentTime = Date.now() - startTime;
        if (currentTime < duration) {
          scrollTo(0, easingFuncs[easing](currentTime, scrollFrom , targetPos, duration) - header);
          window.requestAnimationFrame(loop);
        } else {
          scrollTo(0, targetPos + scrollFrom - header);
        }
      }
      window.requestAnimationFrame(loop);
    }, 100);
  }

  // イージング関数設定
  const easingFuncs = {
    easeOutExpo: (t, b, c, d) => {
      return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
    },
  };
}


// 監視点が画面外になったときトップへ戻るボタン表示
function backToTop() {
  const observationPoint = document.getElementById('js-observationPoint'); // 監視点
  const pageTop = document.getElementById('js-backToTop'); // トップへ戻るボタン

  const observer = new IntersectionObserver(doIntersect);

  function doIntersect(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          pageTop.classList.remove('is-active');
          pageTop.classList.add('is-hide');
        }, 1);
      } else {
        setTimeout(() => {
          pageTop.classList.remove('is-hide');
          pageTop.classList.add('is-active');
        }, 1);
      }
    });
  }

  observer.observe(observationPoint);
}


// 監視点が画面外になったときヘッダー表示
function headerObserver() {
  const headerObservationPoint = document.getElementById('js-headerObservationPoint'); // 監視点
  const header = document.getElementById('js-header'); // ヘッダー

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: [0, 1],
  };

  const observer = new IntersectionObserver(doIntersect, options);

  function doIntersect(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          header.classList.remove('is-color');
          header.classList.add('is-transparent');
        }, 1);
      } else {
        setTimeout(() => {
          header.classList.remove('is-transparent');
          header.classList.add('is-color');
        }, 1);
      }
    });
  }

  observer.observe(headerObservationPoint);
}


// フェードインの制御
function fadeIn() {
  const FadeIns = document.querySelectorAll('.js-fadeIn'); // js-fadeInを指定した要素に適用

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: .5,
  };

  const observer = new IntersectionObserver(doIntersect, options);

  FadeIns.forEach((e) => {
    observer.observe(e);
  });

  function doIntersect(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.remove('Is-Out');
          entry.target.classList.add('Is-In');
          observer.unobserve(entry.target);
        }, 1);
      } else {
        setTimeout(() => {
          entry.target.classList.remove('Is-In');
          entry.target.classList.add('Is-Out');
        }, 1);
      }
    });
  }
}


// プログラム一覧のフェードイン制御
function fadeInRelaxed() {
  const FadeIns = document.querySelectorAll('.js-fadeInRelaxed'); // js-fadeInRelaxedを指定した要素に適用

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: .2,
  };

  const observer = new IntersectionObserver(doIntersect, options);

  FadeIns.forEach((e) => {
    observer.observe(e);
  });

  function doIntersect(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.remove('Is-Out');
          entry.target.classList.add('Is-In');
          observer.unobserve(entry.target);
        }, 1);
      } else {
        setTimeout(() => {
          entry.target.classList.remove('Is-In');
          entry.target.classList.add('Is-Out');
        }, 1);
      }
    });
  }
}


// パネリスト一覧のフェードイン制御
function fadeInPanelist() {
  const FadeIns = document.querySelectorAll('.js-fadeInPanelist'); // js-fadeInPanelistを指定した要素に適用
  const urlHash = location.hash; // URLの#以降の部分を取得

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: .3,
  };

  const observer = new IntersectionObserver(doIntersect, options);

  FadeIns.forEach((e) => {
    observer.observe(e);
  });

  function doIntersect(entries, observer) {
    entries.forEach((entry) => {
      if (urlHash) {
        return;
      }
      else {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.remove('Is-Out');
            entry.target.classList.add('Is-In');
            observer.unobserve(entry.target);
          }, 1);
        } else {
          setTimeout(() => {
            entry.target.classList.remove('Is-In');
            entry.target.classList.add('Is-Out');
          }, 1);
        }
      }
    });
  }
}