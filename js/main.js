"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $("body");

const $submitStory = $('#submit-story');
const $submitForm = $('#submit-form');
const $submitStoryBtn = $('#submit-story-btn');
const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");

let $favoriteStories;

const $userProfile = $("#user-profile");
const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");

const $navHome = $("#nav-home");
const $navSupport = $('.nav-support');
const $navSubmit = $("#nav-submit");
const $navFavorites = $("#nav-favorites");
const $navMyStories = $('#nav-myStories');
const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");


/** To make it easier for individual components to show just themselves, this
 * is a useful function that hides pretty much everything on the page. After
 * calling this, individual components can re-show just what they want.
 */

function hidePageComponents() {
  const components = [
    $allStoriesList,
    $loginForm,
    $signupForm,
  ];
  components.forEach(c => c.hide());
}

/** Overall function to kick off the app. */

async function start() {
  console.debug("start");

  // "Remember logged-in user" and log in, if credentials in localStorage
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  // if we got a logged-in user
  if (currentUser) {
    const response = await axios({
      url: `${BASE_URL}/users/${currentUser.username}`,
      method: "GET",
      params: { token: currentUser.loginToken },
    });
    currentUser.favorites = response.data.user.favorites;
    updateUIOnUserLogin();
  }
}

// Once the DOM is entirely loaded, begin the app

console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
$(start);
