/* global $ */

const FRIEND_LIST = ['emerald33chang'];
const FRIENDS = (function() {
  const m = {};
  FRIEND_LIST.forEach(id => {
    m[id] = true;
  });
  return m;
})();

function now() {
  return +new Date();
}

// requestInterval
// ref: https://github.com/nk-components/request-interval
const requestInterval = (function() {
  function interval(delay, fn) {
    var start = Date.now();
    var data = {};
    data.id = requestAnimationFrame(loop);

    return data;

    function loop() {
      data.id = requestAnimationFrame(loop);

      if (Date.now() - start >= delay) {
        fn();
        start = Date.now();
      }
    }
  }

  function clearInterval(data) {
    cancelAnimationFrame(data.id);
  }

  const self = interval;
  self.clear = clearInterval;
  return self;
})();

function _getOnlineFriends() {
  let content = null;

  // 2018 react
  content = $('.online-friends')[0];

  return content || null;
}

function getOnlineFriendsAsync(timeout) {
  const delay = 100;
  const startedAt = now();
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const content = _getOnlineFriends();

      if (content) {
        clearInterval(interval);
        resolve({ content });
      }

      const timePassed = now() - startedAt;
      if (timePassed > timeout) {
        clearInterval(interval);
        reject();
      }
    }, delay);
  });
}

function main() {
  let $onlineFriendsContent;
  let rafing = false;
  const observer = new MutationObserver(onMutation);

  getOnlineFriendsAsync(10000).then(({ content }) => {
    $onlineFriendsContent = $(content);
    observer.observe(content, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    });
  });

  function onMutation(mutations) {
    if (rafing) {
      return;
    }

    rafing = true;

    requestAnimationFrame(_onMutation);
  }

  function _onMutation() {
    $onlineFriendsContent.find('.side-nav-card__link').each((i, elm) => {
      const $elm = $(elm);
      const id = $elm.data('aName').replace('online-friend-', '');
      if (FRIENDS[id]) {
        // use twitch's hide class
        $elm.closest('.side-nav-card').removeClass('tw-flex').addClass('tw-hide');
      }
    });

    rafing = false;
  }
}

main();
