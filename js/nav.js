"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $submitStory.hide();
  $userProfile.hide();
}

$body.on("click", "#nav-home", navAllStories);

/** Show submit form on click on "submit" */

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  putStoriesOnPage();
  $submitStory.show();
  $userProfile.hide();
}

$navSubmit.on("click", navSubmitClick);

/** Show favorited stories on click on "favorites" */

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt);
  const allStoriesList = $allStoriesList.children();
  $allStoriesList.show();
  allStoriesList.show();
  for(let li of allStoriesList) {
    if(!$(li).children('input').attr('checked')) {
      $(li).hide();
    }
  }
  $submitStory.hide();
  $userProfile.hide();
}

$navFavorites.on("click", navFavoritesClick);



/** Show user stories on click on "my stories" */

function navMyStoriesClick(evt) {
  console.debug("navMyStoriesClick", evt);
  putStoriesOnPage();
  const allStoriesList = $allStoriesList.children();
  for(let li of allStoriesList) {
    if($(li).children('.story-user').text() != `posted by ${currentUser.username}`) {
      $(li).hide();
    }
  }
  $submitStory.hide();
  $userProfile.hide();
}

$navMyStories.on("click", navMyStoriesClick);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.text('(logout)').addClass('ms-1').show();
  $navUserProfile.text(`${currentUser.username}`).removeClass('ms-0').show();
}

$navUserProfile.on('click', function() {
  $allStoriesList.hide();
  $userProfile.show();
});