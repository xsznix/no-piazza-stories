'use strict';

let updating = false;
function updateBadge() {
  if (updating) return;
  updating = true;

  // Count notifications and hide the Piazza Stories dropdown item
  const items = getClassDropdownItems();
  let trueNotifCount = 0;
  let storiesFound = false;
  items.forEach(item => {
    if (getLabel(item) === 'Piazza Stories') {
      item.style.display = 'none';
      storiesFound = true;
    } else {
      trueNotifCount += getNotifCount(item);
    }
  });

  // Set global notification count
  const globalNotifs = getGlobalNotifCountEl();
  if (globalNotifs) {
    globalNotifs.innerText = trueNotifCount;
    const notifWrapper = getGlobalNotifWrapperEl();
    if (trueNotifCount === 0) {
      notifWrapper.style.display = 'none';
    } else {
      notifWrapper.style.display = 'block';
    }
  }

  updating = false;
  return storiesFound;
}

function getGlobalNotifCountEl() {
  return document.getElementById('global_notifications_indicator');
}

function getGlobalNotifWrapperEl() {
  return document.getElementById('global_notifications_indicator_wrapper');
}

function getClassDropdownItems() {
  return [].slice.call(document.getElementsByClassName('classDropdownItem'));
}

function getLabel(dropdownItem) {
  const el = dropdownItem.querySelector('.course_number');
  if (el) {
    return el.innerText;
  } else {
    return '';
  }
}

function getNotifCount(dropdownItem) {
  const count = dropdownItem.querySelector('.global_notifications');
  if (count) {
    return +count.innerText;
  } else {
    return 0;
  }
}

function updateBadgeUntilStoriesFound() {
  const timeout = setInterval(() => {
    if (updateBadge())
      clearInterval(timeout);
  }, 100);
}

updateBadgeUntilStoriesFound();
document.querySelector('.dropdown.class_list')
  .addEventListener('DOMSubtreeModified', updateBadge);
document.querySelector('#my_classes')
  .addEventListener('DOMSubtreeModified', updateBadge);
